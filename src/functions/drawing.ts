import { Vector2 } from "interfaces/Vector2";
import { getViewOffset, View } from "interfaces/View";
import { areBoxesIntersecting, Box, getIntersectingArea, inBox } from "interfaces/Box";
import { CellMatrix } from "interfaces/CellMatrix";

export function getViewArea(canvas: HTMLCanvasElement | OffscreenCanvas, view: View): Box {
    return {
        row: view.row,
        col: view.col,
        width: Math.ceil(canvas.width / view.cellSize),
        height: Math.ceil(canvas.height / view.cellSize)
    } 
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

function createShader(gl: WebGL2RenderingContext, shaderType: number, shaderSource: string): WebGLShader | null {
    let shader = gl.createShader(shaderType);
    if (shader !== null && shader !== undefined) {
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);

        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!success) {
           console.error(gl.getShaderInfoLog(shader));
           gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }

    console.error("Could not create shader");
    return null;
}

function createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
    const program = gl.createProgram();
    if (program !== null && program !== undefined) {
        let success: any;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!success) {
            console.error(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }

        return program;
    }

    console.error("Could not create webgl program");
    return null;
}

// export function renderBoard(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, view: View, board: Vector2[]) {
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

export function renderBoard(gl: WebGL2RenderingContext, view: View, board: Vector2[], opacity: number = 1) {
    const viewArea: Box = getViewArea(gl.canvas, view);
    const shownCells = board.filter(cell => inBox(cell, viewArea));
    const lastClearColor: Float32Array = gl.getParameter(gl.COLOR_CLEAR_VALUE);
    
    gl.enable(gl.SCISSOR_TEST);
    gl.clearColor(1, 1, 1, opacity);
    for (let i = 0; i < shownCells.length; i++) {
      gl.scissor( (shownCells[i].col - view.col) * view.cellSize, gl.canvas.height - (shownCells[i].row - view.row + 1) * view.cellSize, view.cellSize, view.cellSize); // +1 in y because scissor works from bottom left instead of top left
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
    gl.disable(gl.SCISSOR_TEST);
    gl.clearColor(lastClearColor[0], lastClearColor[1], lastClearColor[2], lastClearColor[3]);
  }

  // export function renderBoardFromMatrix(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, view: View, cellMatrix: CellMatrix) {
  //   context.save();
  //   context.fillStyle = 'white';
  //     const startCoordinates: Vector2 = {
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
    const lastClearColor: Float32Array = gl.getParameter(gl.COLOR_CLEAR_VALUE);

  const startCoordinates: Vector2 = {
      row: (cellMatrix.row - view.row) * view.cellSize,
      col: (cellMatrix.col - view.col) * view.cellSize
  }

  const viewArea: Box = getViewArea(gl.canvas, view);
    if (!areBoxesIntersecting(viewArea, cellMatrix)) {
        return;
    }

    let visibleCells: Box = getIntersectingArea(viewArea, cellMatrix);
    visibleCells = {
        row: Math.trunc(visibleCells.row),
        col: Math.trunc(visibleCells.col),
        width: Math.trunc(visibleCells.width),
        height: Math.trunc(visibleCells.height)
    }


    const searchedCellVertices = new Float32Array(cellMatrix.width * cellMatrix.height * 2);
    let numberOfVertices = 0;

    for (let row = visibleCells.row; row < visibleCells.row + visibleCells.height; row++) {
      for (let col = visibleCells.col; col < visibleCells.col + visibleCells.width; col++) {
          if (inBox( { row: cellMatrix.row + row, col: cellMatrix.col + col }, viewArea ) && cellMatrix.matrix[row * cellMatrix.width + col] === 1) {
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
            console.error(gl.getProgramInfoLog(inputtedMatrixRenderProgram));
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

const gridVertexShader = `
    attribute vec2 aPos;

    void main() {
        gl_Position = vec4(aPos, 0.0, 1.0);
    }
`

const gridFragmentShader = `
    precision mediump float;
    uniform vec2 offset;
    uniform vec4 gridColor;
    uniform vec2 cellSize;
    uniform float gridLineWidth;

    float modI(float a,float b) {
        float m = a - floor( (a + 0.5) / b ) * b;
        return floor( m + 0.5 );
    }

    bool closeTo(float num, float desired, float range) {
        return num >= (desired - range) && num <= (desired + range);
    }

    void main() {
        const float ACCURACY = 0.0001;
        
        if ( closeTo( modI((gl_FragCoord.x - offset.x), cellSize.x), 0.0, ACCURACY) || closeTo( modI((gl_FragCoord.y - offset.y), cellSize.y), 0.0, ACCURACY)  ) {
            gl_FragColor = gridColor;
        } else {
            gl_FragColor = vec4(0, 0, 0, 0);
        }
    }
`


export function getGridShaderProgram(gl: WebGL2RenderingContext): WebGLProgram | null {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, gridVertexShader);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, gridFragmentShader);

    if (vertexShader !== null && vertexShader !== undefined && fragmentShader !== null && fragmentShader !== undefined) {
        const program = createProgram(gl, vertexShader, fragmentShader)
        return program;
    }
    return null;
}

export function renderGrid(gl: WebGL2RenderingContext, view: View, gridProgram: WebGLProgram | null = null): void {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    const quadVertices: Float32Array = new Float32Array([
        -1, -1,
        1, -1,
        1, 1,
        -1, 1
    ])

    const quadIndices: Uint16Array = new Uint16Array([
        0, 1, 3, 1, 3, 2
    ])


    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

    let elementBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, quadIndices, gl.STATIC_DRAW);
    
    let gridGraphicProgram: WebGLProgram | null = null;

    if (gridProgram !== null && gridProgram !== undefined) {
        gl.validateProgram(gridProgram);
        const validationSuccess = gl.getProgramParameter(gridProgram, gl.VALIDATE_STATUS);
        if (validationSuccess) {
            gridGraphicProgram = gridProgram;
        } else {
            console.error(gl.getProgramInfoLog(gridProgram));
            gridGraphicProgram = getGridShaderProgram(gl);
        }

    } else {
        gridGraphicProgram = getGridShaderProgram(gl);
    }

    if (gridGraphicProgram === null || gridGraphicProgram === undefined) {
        return;
    }

    const aPosLocation = gl.getAttribLocation(gridGraphicProgram, "aPos");
    const offsetLocation = gl.getUniformLocation(gridGraphicProgram, "offset");
    const cellSizeLocation = gl.getUniformLocation(gridGraphicProgram, "cellSize")
    const gridColorLocation = gl.getUniformLocation(gridGraphicProgram, "gridColor")
    const gridLineWidthLocation = gl.getUniformLocation(gridGraphicProgram, "gridLineWidth")
    gl.useProgram(gridGraphicProgram);
    gl.enableVertexAttribArray(aPosLocation);
    gl.vertexAttribPointer(aPosLocation, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(offsetLocation, getViewOffset(view).col, getViewOffset(view).row);
    gl.uniform2f(cellSizeLocation, view.cellSize, view.cellSize)
    gl.uniform1f(gridLineWidthLocation, 1)
    gl.uniform4f(gridColorLocation, 0.0, 0.0, 0.0, 1)

    console.log(view, getViewOffset(view))

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
}



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
    
//     console.log(hexagonDiameter, hexagonRadius, sideLength, centerToSide);
    
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


