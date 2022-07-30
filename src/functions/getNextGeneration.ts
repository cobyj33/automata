import { GPU, IKernelFunctionThis, IKernelJSON, IKernelRunShortcut } from "gpu.js"
import { Vector2 } from "../classes/Data/Vector2";
import { gpu } from "../globals"

export function getNextGenerationKernelFunction(this: IKernelFunctionThis, matrix: number[][], width: number, height: number) {
    let neighbors = 0;
    for (let row = this.thread.y - 1; row <= this.thread.y + 1; row++) {
        for (let col = this.thread.x - 1; col <= this.thread.x + 1; col++) {
            if (row >= 0 && row < height && col >= 0 && col < width) {
                if (matrix[row][col] == 1 && !(row === this.thread.y && col === this.thread.x)) {
                    neighbors++;
                }
            }
        }
    }

    if (matrix[this.thread.y][this.thread.x] === 1 && (neighbors === 2 || neighbors === 3)) {
        return 1;
    } else if (matrix[this.thread.y][this.thread.x] === 0 && neighbors === 3) {
        return 1;
    } else {
        return 0;
    }
}

export const nextGenerationKernel: IKernelRunShortcut = gpu.createKernel(getNextGenerationKernelFunction).setDynamicOutput(true).setOutput([10, 10]);
// export const nextGenerationKernelJSON: IKernelJSON = nextGenerationKernel.toJSON();
export function getNextGeneration(cells: Vector2[]): Promise<Vector2[]> {
    return new Promise( (resolve, reject) => {
        
    })
}