import { IVector2 } from "common/Vector2";
import { View } from "common/View";
import { Box } from "common/Box";
import { CellMatrix } from "common/CellMatrix";

import gridVertexShader from "common/grid.vert?raw"
import gridFragmentShader from "common/grid.frag?raw"
import { compileProgramFromFiles, fetchTextFile } from "./webgl";
import { Dimension2D } from "common/Dimension";

export function getViewArea(canvas: HTMLCanvasElement | OffscreenCanvas, view: View): Box {
    return new Box(view.position, Dimension2D.fromData(canvas).scale(1/view.cellSize).ceil())
}

export function quadVertices() {
    return [ 
        -1, -1,
        1, -1,
        1, 1,
        -1, 1
    ]
}

export function quadIndices() {
    return [ 0, 1, 3, 1, 3, 2 ]
}

function createShader(gl: WebGL2RenderingContext, shaderType: number, shaderSource: string): WebGLShader {
    let shader = gl.createShader(shaderType);
    if (shader !== null && shader !== undefined) {
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);

        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!success) {
            gl.deleteShader(shader);
            throw new Error(gl.getShaderInfoLog(shader) || "");
        }
        
        return shader;
    }

    throw new Error("Could not create shader");
}

function createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
    const program = gl.createProgram();
    if (program !== null && program !== undefined) {
        let success: any;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!success) {
            gl.deleteProgram(program);
            throw new Error(gl.getProgramInfoLog(program) || "");
        }

        return program;
    }

    throw new Error("Could not create webgl program");
}

// export function renderBoard(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, view: View, board: IVector2[]) {
//     context.save();
//     context.fillStyle = 'white';
//     const viewArea: Box = getViewArea(canvas, view);
//     const shownCells = board.filter(cell => inBox(cell, viewArea));
//     context.beginPath();
//     for (let i = 0; i < shownCells.length; i++) {
//       context.rect( (shownCells[i].col - view.col) * view.cellSize, (shownCells[i].row - view.row) * view.cellSize, view.cellSize, view.cellSize);
//     }
//     context.fill();

//     context.restore();
//   }

export function renderBoard(gl: WebGL2RenderingContext, view: View, board: IVector2[], opacity: number = 1) {
    const viewArea: Box = getViewArea(gl.canvas, view);
    const shownCells = board.filter(cell => viewArea.pointInside(cell));
    const lastClearColor: Float32Array | null | undefined = gl.getParameter(gl.COLOR_CLEAR_VALUE);
    
    gl.enable(gl.SCISSOR_TEST);
    gl.clearColor(1, 1, 1, opacity);
    shownCells.forEach(cell => {
        gl.scissor( (cell.col - view.col) * view.cellSize, gl.canvas.height - (cell.row - view.row + 1) * view.cellSize, view.cellSize, view.cellSize); // +1 in y because scissor works from bottom left instead of top left
        gl.clear(gl.COLOR_BUFFER_BIT);
    })
    gl.disable(gl.SCISSOR_TEST);
    if (lastClearColor !== null && lastClearColor !== undefined) {
        gl.clearColor(lastClearColor[0], lastClearColor[1], lastClearColor[2], lastClearColor[3]);
    }
  }

  // export function renderBoardFromMatrix(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, view: View, cellMatrix: CellMatrix) {
  //   context.save();
  //   context.fillStyle = 'white';
  //     const startCoordinates: IVector2 = {
  //         row: (cellMatrix.row - view.row) * view.cellSize,
  //         col: (cellMatrix.col - view.col) * view.cellSize
  //     }
  //     const viewArea: Box = getViewArea(canvas, view);
      
  //   // const viewArea: Box = getViewArea(canvas, view);
  //   context.beginPath();
  //   for (let row = 0; row < cellMatrix.height; row++) {
  //     for (let col = 0; col < cellMatrix.width; col++) {
  //         if (inBox( { row: cellMatrix.row + row, col: cellMatrix.col + col }, viewArea ) && cellMatrix.matrix[row * cellMatrix.width + col] === 1) {
  //           context.rect(startCoordinates.col + (col * view.cellSize), startCoordinates.row + (row * view.cellSize), view.cellSize, view.cellSize);
  //         }
  //     }
  //   }
  //   context.fill();

  //   context.restore();
  // }

const boardRenderVertexShader = `
    attribute vec2 aPos;
    uniform float cellSize;
    uniform vec2 resolution;

    void main() {
        gl_PointSize = cellSize;
        vec2 normalized = aPos / resolution;
        vec2 doubled = normalized * 2.0;
        vec2 clip = doubled - 1.0;

        gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
    }
`

const boardRenderFragmentShader = `
    precision mediump float;

    void main() {
        gl_FragColor = vec4(1, 1, 1, 1);
    }
    `


export function getBoardMatrixShaderProgram(gl: WebGL2RenderingContext): WebGLProgram | null {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, boardRenderVertexShader);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, boardRenderFragmentShader);

    if (vertexShader == null || fragmentShader == null) {
        return null;
    }

    const program = createProgram(gl, vertexShader, fragmentShader);
    return program;
} 

export function renderBoardFromMatrix(gl: WebGL2RenderingContext, view: View, cellMatrix: CellMatrix, inputtedMatrixRenderProgram: WebGLProgram | null = null) {

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    const lastClearColor: Float32Array = gl.getParameter(gl.COLOR_CLEAR_VALUE);
    const startCoordinates: IVector2 = cellMatrix.topleft.subtract(view.position).scale(view.cellSize)

    const viewArea: Box = getViewArea(gl.canvas, view);
    if (!viewArea.boxIntersect(cellMatrix.box)) {
        return;
    }

    const visibleCells: Box = viewArea.intersectingArea(cellMatrix.box).trunc();
    const searchedCellVertices = new Float32Array(cellMatrix.width * cellMatrix.height * 2);
    let numberOfVertices = 0;

    for (let row = visibleCells.top; row < visibleCells.bottom; row++) {
        for (let col = visibleCells.left; col < visibleCells.right; col++) {
            const currentPosition = cellMatrix.topleft.addcomp(row, col)
            if (viewArea.pointInside(currentPosition) && cellMatrix.at(row, col) === 1) {
                searchedCellVertices[numberOfVertices] = startCoordinates.col + col * view.cellSize + view.cellSize / 2;
                searchedCellVertices[numberOfVertices + 1] = startCoordinates.row + row * view.cellSize + view.cellSize / 2;
                numberOfVertices += 2;
            }
        }
    }

    const cellVertices = new Float32Array(searchedCellVertices.subarray(0, numberOfVertices));

    const VBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
    gl.bufferData(gl.ARRAY_BUFFER, cellVertices, gl.STATIC_DRAW);

    let matrixProgram: WebGLProgram | null = null; 
    if (inputtedMatrixRenderProgram !== null && inputtedMatrixRenderProgram !== undefined) {
        gl.validateProgram(inputtedMatrixRenderProgram);
        const validationSuccess = gl.getProgramParameter(inputtedMatrixRenderProgram, gl.VALIDATE_STATUS);
        if (validationSuccess) {
            matrixProgram = inputtedMatrixRenderProgram;
        } else {
            matrixProgram = getBoardMatrixShaderProgram(gl);
        }
    } else {
        matrixProgram = getBoardMatrixShaderProgram(gl);
    }

    if (matrixProgram === null || matrixProgram === undefined) {
        return;
    }

    gl.useProgram(matrixProgram);

    const aPosLocation = gl.getAttribLocation(matrixProgram, "aPos")
    const resolutionLocation = gl.getUniformLocation(matrixProgram, "resolution");
    const cellSizeLocation = gl.getUniformLocation(matrixProgram, "cellSize");
    gl.enableVertexAttribArray(aPosLocation);
    gl.vertexAttribPointer(aPosLocation, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform1f(cellSizeLocation, view.cellSize);

    gl.drawArrays(gl.POINTS, 0, Math.trunc(cellVertices.length / 2));
}






export function getGridShaderProgram(gl: WebGL2RenderingContext): WebGLProgram | null {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, gridVertexShader);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, gridFragmentShader);

    if (vertexShader !== null && vertexShader !== undefined && fragmentShader !== null && fragmentShader !== undefined) {
        const program = createProgram(gl, vertexShader, fragmentShader)
        return program;
    }
    return null;
}


function getGridVertices(canvas: HTMLCanvasElement | OffscreenCanvas, view: View): Float32Array {
    const vertices: number[] = []
    let currentVertexIndex = 0;
    const offset = view.offset();
    for (let y = -view.cellSize - offset.row; y <= canvas.height + view.cellSize; y += view.cellSize) {
        vertices[currentVertexIndex] = -view.cellSize;
        vertices[currentVertexIndex + 1] = y;
        vertices[currentVertexIndex + 2] = canvas.width + view.cellSize;
        vertices[currentVertexIndex + 3] = y;
        currentVertexIndex += 4;
    }
      
    for (let x = -view.cellSize - offset.col; x <= canvas.width + view.cellSize; x += view.cellSize) {
        vertices[currentVertexIndex] = x;
        vertices[currentVertexIndex + 1] = -view.cellSize;
        vertices[currentVertexIndex + 2] = x;
        vertices[currentVertexIndex + 3] = canvas.height + view.cellSize;
        currentVertexIndex += 4;
    }

    return new Float32Array(vertices);
}

export function renderGrid(gl: WebGL2RenderingContext, view: View, gridProgram: WebGLProgram | null = null): void {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        const gridVertices: Float32Array = getGridVertices(gl.canvas, view);
        let vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, gridVertices, gl.STATIC_DRAW);
        
        let gridGraphicProgram: WebGLProgram | null = null;
        if (gridProgram !== null && gridProgram !== undefined) {
            gl.validateProgram(gridProgram);
            const validationSuccess = gl.getProgramParameter(gridProgram, gl.VALIDATE_STATUS);
            if (validationSuccess) {
                gridGraphicProgram = gridProgram;
            } else {
                gridGraphicProgram = getGridShaderProgram(gl);
            }

        } else {
            gridGraphicProgram = getGridShaderProgram(gl);
        }

        if (gridGraphicProgram === null || gridGraphicProgram === undefined) {
            return;
        }

        const aPosLocation = gl.getAttribLocation(gridGraphicProgram, "aPos");
        const resolutionLocation = gl.getUniformLocation(gridGraphicProgram, "resolution");
        const offsetLocation = gl.getUniformLocation(gridGraphicProgram, "offset");
        gl.useProgram(gridGraphicProgram);
        gl.enableVertexAttribArray(aPosLocation);
        gl.vertexAttribPointer(aPosLocation, 2, gl.FLOAT, false, 0, 0);
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
        gl.uniform2f(offsetLocation, view.offset().col, view.offset().row);
        
        const lineRenderCount = Math.floor(gridVertices.length / 2) % 2 === 0 ? Math.floor(gridVertices.length / 2) : Math.ceil(gridVertices.length / 2)
        gl.drawArrays(gl.LINES, 0, lineRenderCount);
}





// export function getGridShaderProgram(gl: WebGL2RenderingContext): WebGLProgram | null {
//     const vertexShader = createShader(gl, gl.VERTEX_SHADER, gridVertexShader);
//     const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, gridFragmentShader);

//     if (vertexShader !== null && vertexShader !== undefined && fragmentShader !== null && fragmentShader !== undefined) {
//         const program = createProgram(gl, vertexShader, fragmentShader)
//         return program;
//     }
//     return null;
// }

// export function renderGrid(gl: WebGL2RenderingContext, view: View, gridProgram: WebGLProgram | null = null): void {
//     gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);


//     const quadVertices: Float32Array = new Float32Array([
//         -1, -1,
//         1, -1,
//         1, 1,
//         -1, 1
//     ])

//     const quadIndices: Uint16Array = new Uint16Array([
//         0, 1, 3, 1, 3, 2
//     ])


//     let vertexBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

//     let elementBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer)
//     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, quadIndices, gl.STATIC_DRAW);
    
//     let gridGraphicProgram: WebGLProgram | null = null;

//     if (gridProgram !== null && gridProgram !== undefined) {
//         gl.validateProgram(gridProgram);
//         const validationSuccess = gl.getProgramParameter(gridProgram, gl.VALIDATE_STATUS);
//         if (validationSuccess) {
//             gridGraphicProgram = gridProgram;
//         } else {
//             console.error(gl.getProgramInfoLog(gridProgram));
//             gridGraphicProgram = getGridShaderProgram(gl);
//         }

//     } else {
//         gridGraphicProgram = getGridShaderProgram(gl);
//     }

//     if (gridGraphicProgram === null || gridGraphicProgram === undefined) {
//         return;
//     }

//     const aPosLocation = gl.getAttribLocation(gridGraphicProgram, "aPos");
//     const gridPositionLocation = gl.getUniformLocation(gridGraphicProgram, "gridPosition");
//     const cellSizeLocation = gl.getUniformLocation(gridGraphicProgram, "cellSize")
//     const gridColorLocation = gl.getUniformLocation(gridGraphicProgram, "gridColor")
//     const gridLineWidthLocation = gl.getUniformLocation(gridGraphicProgram, "gridLineWidth")
//     gl.useProgram(gridGraphicProgram);
//     gl.enableVertexAttribArray(aPosLocation);
//     gl.vertexAttribPointer(aPosLocation, 2, gl.FLOAT, false, 0, 0);
//     gl.uniform2f(gridPositionLocation, view.col, view.row);
//     gl.uniform2f(cellSizeLocation, view.cellSize, view.cellSize)
//     gl.uniform1f(gridLineWidthLocation, 1)
//     gl.uniform4f(gridColorLocation, 0.0, 0.0, 0.0, 1)


//     gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
// }



// function pathHexagon(context: CanvasRenderingContext2D, x: number, y: number, diameter: number) {
//     const radius = diameter / 2;
//     const vertices = Array.from({length: 6},  (element ,index) => ( {
//         row: y + radius * (-Math.sin( index * Math.PI / 3 )),
//         col: x + radius * Math.cos( index * Math.PI / 3 )
//     }  ))

//     for (let i = 0; i < vertices.length - 1; i++) {
//         context.moveTo(vertices[i].col, vertices[i].row);
//         context.lineTo(vertices[i + 1].col, vertices[i + 1].row);
//     }
//     context.moveTo(vertices[vertices.length - 1].col, vertices[vertices.length - 1].row);
//     context.lineTo(x + radius, y);
// }


// const sqrt3 = Math.sqrt(3);
// function drawHexagonalGrid(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, view: View): void {
//     const hexagonDiameter = view.cellSize;
//     const hexagonRadius = hexagonDiameter / 2;
//     const sideLength = hexagonRadius * sqrt3 / 2;
//     const centerToSide = hexagonRadius * Math.sin(Math.PI / 3);
    
    
//     const viewOffset = getViewOffset(view);
//     let y = -viewOffset.row;
//     let x = -viewOffset.col;
//     context.beginPath();
//     for (let i = 0; y < canvas.height; i++) {
//         x = i % 2 === 0 ? -viewOffset.col : -( viewOffset.col + hexagonRadius + sideLength / 2 );
//         for (let j = 0; x < canvas.width; j++) {
//             pathHexagon(context, x, y, hexagonDiameter);
//             x += hexagonDiameter + sideLength;
//         }
//         y += centerToSide;
//     }
//     context.stroke();
// }

/**
 * A helper function to get the canvas and Canvas 2D context of a React RefObject
 * If there is no desired action on an error, it is probably best to use withCanvasAndContext2D, as this function requires error handling in case fetching the canvas and context fails
 * 
 * @param ref A React Ref Object to an HTML Canvas Element
 * @returns The HTML Canvas and the Canvas Rendering Context taken from the ref object
 * @throws Error when either the context cannot be gotten ("HTMLCanvasElement.getContext('2d') returns null or undefined"), or the value inside the ref to the canvas is null or undefined
 */
export function getCanvasAndContext2D(canvasRef: React.RefObject<HTMLCanvasElement>): { canvas: HTMLCanvasElement, context: CanvasRenderingContext2D } {
    const canvas: HTMLCanvasElement | null = canvasRef.current 
    if (canvas !== null && canvas !== undefined) {
        const context = canvas.getContext("2d");
        if (context !== null && context !== undefined) {
            return { canvas: canvas, context: context };
        }
        throw new Error(`Could not get Canvas context, context declared ${context}`)
    }
    throw new Error(`Could not get Canvas Context: Canvas found to be ${canvas}`)
}

/**
 * A helper function to get the canvas and Canvas 2D context of a React RefObject
 * Accepts a canvas reference and a callback which only runs if the canvas and context2D from the reference are non-null
 * Meant mostly to cut down on boilerplate of checking for a canvas and then a context, which can take around 5 or 6 lines of code to do absolutely nothing
 * Optionally, there is a function that can be passed in as a third argument if code needs to be run in case the canvas or context could not be found, but if there needs to be handling on a failure, getCanvasAndContext2D is recommended for a try-catch format
 * 
 * This is meant to replace getCanvasAndContext2D, as it throws errors which have to be handled, while in most cases when these "errors" are throne nothing is supposed to happen anyway
 * @param callbackfn A callback that takes in a canvas and context2D as parameters, and only runs if the canvas and context are non-null
 * @returns void
 */
export function withCanvasAndContext2D(canvasRef: React.RefObject<HTMLCanvasElement>, callbackfn: ({ canvas, context }: { canvas: HTMLCanvasElement, context: CanvasRenderingContext2D }) => void, onerror?: () => void) {
    const canvas: HTMLCanvasElement | null = canvasRef.current 
    if (canvas !== null && canvas !== undefined) {
        const context = canvas.getContext("2d");
        if (context !== null && context !== undefined) {
            callbackfn({ canvas: canvas, context: context })
            return
        }
    }
    onerror?.()
}

/**
 * A helper function to get the canvas and WebGL2 context of a React RefObject
 * If there is no desired action on an error, it is probably best to use withCanvasAndContextWebGL2, as this function requires error handling in case fetching the canvas and context fails
 * 
 * @param ref A React Ref Object to an HTML Canvas Element
 * @returns The HTML Canvas and the WebGL2 Context taken from the ref object
 * @throws Error when either the context cannot be gotten ("HTMLCanvasElement.getContext('webgl2') returns null or undefined"), or the value inside the ref to the canvas is null or undefined
 */
export function getCanvasAndContextWebGL2(canvasRef: React.RefObject<HTMLCanvasElement>): { canvas: HTMLCanvasElement, gl: WebGL2RenderingContext } {
    const canvas: HTMLCanvasElement | null = canvasRef.current 
    if (canvas !== null && canvas !== undefined) {
        const gl = canvas.getContext("webgl2");
        if (gl !== null && gl !== undefined) {
            return { canvas: canvas, gl: gl };
        }
        throw new Error(`Could not get WebGL2 context, context declared ${gl}`)
    }
    throw new Error(`Could not get Canvas Context: Canvas found to be ${canvas}`)
}

/**
 * A helper function to get the canvas and WebGL2 context of a React RefObject
 * Accepts a canvas reference and a callback which only runs if the canvas and webgl2 context from the reference are non-null
 * Meant mostly to cut down on boilerplate of checking for a canvas and then a context, which can take around 5 or 6 lines of code to do absolutely nothing
 * Optionally, there is a function that can be passed in as a third argument if code needs to be run in case the canvas or context could not be found
 * 
 * This is meant to replace getCanvasAndContext2D, as it throws errors which have to be handled, while in most cases when these "errors" are throne nothing is supposed to happen anyway
 * @param callbackfn A callback that takes in a canvas and context2D as parameters, and only runs if the canvas and context are non-null
 * @returns 
 */
export function withCanvasAndContextWebGL2(canvasRef: React.RefObject<HTMLCanvasElement>, callbackfn: ( { canvas, gl }: { canvas: HTMLCanvasElement, gl: WebGL2RenderingContext }) => void, onerror?: () => void) {
    const canvas: HTMLCanvasElement | null = canvasRef.current 
    if (canvas !== null && canvas !== undefined) {
        const gl = canvas.getContext("webgl2");
        if (gl !== null && gl !== undefined) {
            callbackfn({ canvas: canvas, gl: gl })
            return
        }
    }
    onerror?.()
}

