import { IConstants, IKernelFunctionThis, IKernelRunShortcut } from "gpu.js"
import { gpu } from "../globals"
import { Vector2 } from '../interfaces/Vector2';
import { cellMatrixToVector2, partition } from "./conversions"
import { CellMatrix } from '../interfaces/CellMatrix';

type LifeStringData = { birth: number[], survival: number[] }
export function isValidLifeString(lifeString: string) {
    const sides = lifeString.split("/");
    if (sides.length !== 2) {
        return false;
    } else if (sides[0].charAt(0) !== "B" || sides[1].charAt(0) !== "S") {
       return false; 
    } else if (sides[0].substr(1).split('').some((char: string) => isNaN(Number.parseInt(char))) || sides[1].substr(1).split('').some((char: string) => isNaN(Number.parseInt(char)))) {
        return false;
    }


    return true;
}

export function createLifeString(survivalNums: number[], birthNums: number[]) {

}

export function parseLifeLikeString(lifeString: string): LifeStringData {
    let lifeData: LifeStringData = {birth: [], survival: []};
    if (!isValidLifeString(lifeString)) {
        return lifeData;
    } 

   const [ birth, survival ] = lifeString.split("/");
    
    for (let i = 1; i < birth.length; i++) {
        const num: number = Number.parseInt(birth.charAt(i));
        lifeData.birth.push(num);
    }


    for (let i = 1; i < survival.length; i++) {
        const num: number = Number.parseInt(survival.charAt(i));
        lifeData.survival.push(num);
    }

    return lifeData;
}

interface ILifeKernelConstants extends IConstants {
    birth: number[],
    birthCount: number,
    survival: number[],
    survivalCount: number
}

interface ILifeKernelThis extends IKernelFunctionThis {
    constants: ILifeKernelConstants
}

export function getLifeKernel(lifeString: string): IKernelRunShortcut {
    if (isValidLifeString(lifeString)) {
        const lifeData = parseLifeLikeString(lifeString);
      return gpu.createKernel(getNextLifeLikeGenerationFunction).setConstants( { ...lifeData, birthCount: lifeData.birth.length, survivalCount: lifeData.survival.length } );
    } else {
        throw new Error("CANNOT GET KERNEL FROM INVALID LIFE STRING: " + lifeString);
    }
}

export function getNextLifeLikeGenerationFunction(this: ILifeKernelThis, matrix: number[] | Float32Array, width: number, height: number) {
    let neighbors = 0;
    const currentRow = Math.trunc(this.thread.x / width);
    const currentCol = this.thread.x - (currentRow * width);

    for (let row = currentRow - 1; row <= currentRow + 1; row++) {
        for (let col = currentCol - 1; col <= currentCol + 1; col++) {
            if (row >= 0 && row < height && col >= 0 && col < width) {
                if (matrix[row * width + col] == 1 && !(row === currentRow && col === currentCol)) {
                    neighbors++;
                }
            }
        }
    }
    
    if (matrix[currentRow * width + currentCol] === 1) {
        for (let i = 0; i < this.constants.survivalCount; i++) {
            if (neighbors === this.constants.survival[i]) {
                return 1;
            }
        }
    } else if (matrix[currentRow * width + currentCol] === 0) {
        for (let i = 0; i < this.constants.birthCount; i++) {
            if (neighbors === this.constants.birth[i]) {
                return 1;
            }
        }
    }

    return 0;
}


interface IElementaryConstants extends IConstants {
    rule: number[];
}

interface IElementaryFunctionThis extends IKernelFunctionThis {
    constants: IElementaryConstants;
}

export function getElementaryKernel(rule: number) {
    if (rule < 0 || rule > 255) {
        throw new Error(`INVALID ELEMENTARY AUTOMATA RULE: RULE {${rule}} MUST BE 0 <= rule <= 255`);
    }

    const binaryRule: string = rule.toString(2).padStart(7, '0');
    const rules: number[] = new Array<number>(7).fill(0);
    for (let i = 0; i < 6; i++) {
        rules[i] = Number.parseInt(binaryRule.charAt(6 - i));
    }

    return gpu.createKernel(getNextElementaryGenerationKernelFunction).setConstants( { rule: rules } );
}

export function getNextElementaryGenerationKernelFunction(this: IElementaryFunctionThis, line: number[], width: number) {
    let value = 0;

    if (this.thread.x - 1 >= 0 && this.thread.x - 1 < width) {
        if (line[this.thread.x - 1] === 1) {
            value += 4;
        }
    } 
    
    if (line[this.thread.x] === 1) {
        value += 2;
    }

    if (this.thread.x + 1 >= 0 && this.thread.x + 1 < width) {
        if (line[this.thread.x + 1] === 1) {
            value += 1;
        }
    }

    return this.constants.rule[value];
}


async function getNextGeneration(board: Vector2[], lifeString: string): Promise<Vector2[]> {
    let newBoard: Vector2[] = []
    const renderingKernel = getLifeKernel(lifeString).setDynamicOutput(true).setDynamicArguments(true).setOutput([10]);

    const matrices: CellMatrix[] = partition(board);
    matrices.map(cellMatrix => ({
        ...cellMatrix,
        matrix: [...renderingKernel.setOutput([cellMatrix.width * cellMatrix.height])(cellMatrix.matrix, cellMatrix.width, cellMatrix.height) as number[]] 
    }))

    matrices.forEach(cellMatrix => {
       newBoard.push(...cellMatrixToVector2(cellMatrix)) 
    })

    return newBoard;
}
