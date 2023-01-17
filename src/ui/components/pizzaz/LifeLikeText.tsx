export {}
// import {MutableRefObject, useEffect, RefObject, useRef} from "react";
// import { getNextLifeGeneration } from "functions/generationFunctions"
// import { CellMatrix } from "interfaces/CellMatrix";
// import { withCanvasAndContext2D } from "functions/drawing";

// const LifeLikeText = ({ children }: { children: string }) => {
//     const canvasRef: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);
//     const began: MutableRefObject<boolean> = useRef<boolean>(false);
    
//     useEffect(() => {
//         const canvas: HTMLCanvasElement | null = canvasRef.current;
//         withCanvasAndContext2D(canvasRef, (canvas, context) => {

//             if (began.current === false) {
//                 context.clearRect(0, 0, canvas.width, canvas.height);
//                  began.current = true;
//                 context.textAlign = "center";
//                 context.font = "monospace";
//                 context.strokeStyle = "white";
//                 context.strokeText(children, 0, 0);
//             } else {
//                 const imageData: ImageData = context.getImageData(0, 0, canvas.width, canvas.height);
//                 const matrixData: Uint8ClampedArray = new Uint8ClampedArray(imageData.width * imageData.height);
//                 for (let i = 0; i < matrixData.length; i++) {
//                     matrixData[i] = Math.trunc(imageData.data[i * 4]) / 255;
//                 }

//                 const cellMatrix: CellMatrix = { row: 0, col: 0, width: imageData.width, height: imageData.height, matrix: matrixData }
//                 const output: Uint8ClampedArray = getNextLifeGeneration(cellMatrix, "B3/S23");
//                 const outputImage: Uint8ClampedArray = new Uint8ClampedArray(imageData.width * imageData.height * 4);
//                 for (let i = 0; i < output.length; i++) {
//                     for (let j = 0; j < 4; j++) {
//                         outputImage[i * 4 + j] = output[i] * 255;
//                     }
//                 }
//                 const outputImageData: ImageData = new ImageData(outputImage, imageData.width, imageData.height);
//                 context.putImageData(outputImageData, 0, 0);
//             }

//         })


//     })
   
//     return <canvas ref={canvasRef}></canvas>
// }

// export default LifeLikeText;
