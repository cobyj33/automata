import { Vector2 } from "../interfaces/Vector2";
import { getViewOffset, View } from "../interfaces/View";
import { Box, inBox } from "../interfaces/Box";
import { CellMatrix } from "../interfaces/CellMatrix";

export function getViewArea(canvas: HTMLCanvasElement, view: View): Box {
    return {
        row: view.row,
        col: view.col,
        width: Math.ceil(canvas.width / view.cellSize),
        height: Math.ceil(canvas.height / view.cellSize)
    } 
}

function createShader(gl: WebGL2RenderingContext, shaderType: number, shaderSource: string): WebGLShader | null {
    let shader = gl.createShader(shaderType);
    if (shader !== null && shader !== undefined) {
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);

        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!success) {
           console.log(gl.getShaderInfoLog(shader));
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
            console.log(gl.getProgramInfoLog(program));
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

const boardRenderShader = `
    attribute vec2 aPos;
    uniform vec2 offset;
    uniform vec1 cellSize;
    uniform vec2 matrixOffset;

    void main() {
        gl_PointSize = cellSize;
        gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
    }
`

const boardRenderFragmentShader = `
    precision mediump float;

    void main() {
        gl_FragColor = vec4(0, 0, 0, 1);
    }
`

export function renderBoardFromMatrix(gl: WebGL2RenderingContext, view: View, cellMatrix: CellMatrix) {
    const lastClearColor: Float32Array = gl.getParameter(gl.COLOR_CLEAR_VALUE);

  const startCoordinates: Vector2 = {
      row: (cellMatrix.row - view.row) * view.cellSize,
      col: (cellMatrix.col - view.col) * view.cellSize
  }

  const viewArea: Box = getViewArea(gl.canvas, view);
    

    // const VBO = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
    // gl.bufferData(gl.ARRAY_BUFFER, cellMatrix.matrix, gl.STATIC_DRAW);

    
    gl.enable(gl.SCISSOR_TEST);
    gl.clearColor(1, 1, 1, 1);
    for (let row = 0; row < cellMatrix.height; row++) {
      for (let col = 0; col < cellMatrix.width; col++) {
          if (inBox( { row: cellMatrix.row + row, col: cellMatrix.col + col }, viewArea ) && cellMatrix.matrix[row * cellMatrix.width + col] === 1) {
            gl.scissor(startCoordinates.col + (col * view.cellSize), gl.canvas.height - ( startCoordinates.row + ( (row + 1) * view.cellSize) ), view.cellSize, view.cellSize);
              gl.clear(gl.COLOR_BUFFER_BIT);
          }
      }
    }
    gl.disable(gl.SCISSOR_TEST);
    gl.clearColor(lastClearColor[0], lastClearColor[1], lastClearColor[2], lastClearColor[3]);
}


// export function renderGrid(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, view: View) {
//       context.save();
//       context.lineWidth = 1;
//       context.strokeStyle = 'black';
//       context.beginPath()
//       for (let y = -getViewOffset(view).row; y <= canvas.height; y += view.cellSize) {
//         context.moveTo(0, y);
//         context.lineTo(canvas.width, y);
//       }
      
//       for (let x = -getViewOffset(view).col; x <= canvas.width; x += view.cellSize) {
//         context.moveTo(x, 0);
//         context.lineTo(x, canvas.height);
//       }
  
//       context.stroke();
//       context.restore();
//     }

const gridVertexShader = `
    attribute vec2 aPos;
    uniform vec2 resolution;
    uniform vec2 offset;

    void main() {
    vec2 shifted = aPos - offset;
    vec2 normalized = shifted / resolution;
    vec2 doubled = normalized * 2.0;
    vec2 clip = doubled - 1.0;

    gl_Position = vec4(clip.x, -clip.y, 0, 1);
    }
`

const gridFragmentShader = `
    precision mediump float;

    void main() {
    gl_FragColor = vec4(0, 0, 0, 1);
    }
`




function getGridVertices(canvas: HTMLCanvasElement, view: View): Float32Array {
    const vertices: Float32Array = new Float32Array( Math.trunc( canvas.height / view.cellSize * 4  )  + Math.trunc( canvas.width / view.cellSize * 4 )  )
    let currentVertexIndex = 0;
      for (let y = 0; y <= canvas.height; y += view.cellSize) {
          vertices[currentVertexIndex] = 0;
          vertices[currentVertexIndex + 1] = y;
          vertices[currentVertexIndex + 2] = canvas.width;
          vertices[currentVertexIndex + 3] = y;
          currentVertexIndex += 4;
      }
      
      for (let x = 0; x <= canvas.width; x += view.cellSize) {
          vertices[currentVertexIndex] = x;
          vertices[currentVertexIndex + 1] = 0;
          vertices[currentVertexIndex + 2] = x;
          vertices[currentVertexIndex + 3] = canvas.height;
          currentVertexIndex += 4;
      }

    return vertices;
    
}

export const renderGrid = ( () => {
    let precompiledProgram: WebGLProgram | null = null;

    function getGridGraphicProgram(gl: WebGL2RenderingContext): WebGLProgram | null {
        const vertexShader = createShader(gl, gl.VERTEX_SHADER, gridVertexShader);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, gridFragmentShader);
        if (vertexShader == null || fragmentShader == null) {
            return null;
        }

        precompiledProgram = createProgram(gl, vertexShader, fragmentShader)
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return precompiledProgram;
    }

    return (gl: WebGL2RenderingContext, view: View): void => {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        const gridVertices: Float32Array = getGridVertices(gl.canvas, view);
        console.log("Grid Vertices: ", gridVertices);
        let vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, gridVertices, gl.STATIC_DRAW);
        
        let gridGraphicProgram: WebGLProgram | null = null;
        if (precompiledProgram !== null) {
            gl.validateProgram(precompiledProgram);
            if (gl.getProgramParameter(precompiledProgram, gl.VALIDATE_STATUS)) {
                gridGraphicProgram = precompiledProgram;
            } else {
                gridGraphicProgram = getGridGraphicProgram(gl)
            }
        } else {
            gridGraphicProgram = getGridGraphicProgram(gl);
        }

        if (gridGraphicProgram == null) {
            return;
        }

        const aPosLocation = gl.getAttribLocation(gridGraphicProgram, "aPos");
        const resolutionLocation = gl.getUniformLocation(gridGraphicProgram, "resolution");
        const offsetLocation = gl.getUniformLocation(gridGraphicProgram, "offset");
        console.log(aPosLocation, resolutionLocation);
        gl.useProgram(gridGraphicProgram);
        gl.enableVertexAttribArray(aPosLocation);
        gl.vertexAttribPointer(aPosLocation, 2, gl.FLOAT, false, 0, 0);
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
        gl.uniform2f(offsetLocation, getViewOffset(view).col, getViewOffset(view).row);
        

        gl.drawArrays(gl.LINES, 0, Math.trunc(gridVertices.length / 2));
    }
} )();


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


