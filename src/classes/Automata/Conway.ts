import { Automata } from '../../interfaces/Automata';
import { gpu } from "../../globals"
import { IKernelFunctionThis, IKernelRunShortcut } from 'gpu.js';
import { Metadata } from "../../interfaces/Metadata"

export class Conway implements Automata { 
    constructor() {  }

    getMetadata(): Metadata { 
        return {
            name: "Conway",
            description: "The most famous Cellular Automata"
        }
    } 

    getKernel(): IKernelRunShortcut {
        return gpu.createKernel(getNextConwayGenerationFunction) 
    }
}


export function getNextConwayGenerationFunction(this: IKernelFunctionThis, matrix: number[][], width: number, height: number) {
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

