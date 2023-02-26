import { CellMatrix } from 'common/CellMatrix';
import { IVector2 } from 'common/Vector2';
import { FaLeaf } from 'react-icons/fa';

export type LifeRuleData = { birth: number[], survival: number[] }
export function isValidLifeString(lifeString: string, errorOutput?: (error: string) => any) {
    const error = getLifeStringErrors(lifeString);
    if (error.length > 0) {
        errorOutput?.(error)
        return false;
    }
    return true;
}

export function getLifeStringErrors(lifeString: string): string {
    const sides = lifeString.split("/");
    if (sides.length !== 2) {
        return "Error: Not able to split string into birth and survival counts, format must include a forward slash B<NUMS>/S<NUMS> "
    } else if (sides[0].charAt(0) !== "B" || sides[1].charAt(0) !== "S") {
       return "Error: B and S are backwards, please switch to B<NUMS>/S<NUMS> "
    } else if (sides[0].substring(1).split('').some((char: string) => isNaN(Number.parseInt(char))) || sides[1].substring(1).split('').some((char: string) => isNaN(Number.parseInt(char)))) {
       return "Error: Must include numbers after B and after /S B<NUMS>/S<NUMS> "
    } else if (new Set<string>(sides[0].substring(1).split('')).size !== sides[0].length - 1 || new Set<string>(sides[1].substring(1).split('')).size !== sides[1].length - 1) {
       return "Error: Replicate number on one side of B<NUMS>/S<NUMS> "
    }

    return "";
}

function canMakeLifeString(survivalNums: number[], birthNums: number[]): boolean {
    if (survivalNums.some(num => num < 0 || num > 8) || birthNums.some(num => num < 0 || num > 8)) {
        return false;
    }
    if (survivalNums.length > 8 || birthNums.length > 8) {
        return false;
    }
    if (survivalNums.length !== new Set<number>(survivalNums).size || birthNums.length !== new Set<number>(birthNums).size ) {
        return false;
    }
    

    return true;
}

export function createLifeString(birthNums: number[], survivalNums: number[]): string {
    if (!canMakeLifeString(survivalNums, birthNums)) {
        throw new Error(`Cannot make new life string from ${survivalNums} and ${birthNums}`);
    }
    
    return "B".concat( birthNums.join("")  ).concat('/S').concat( survivalNums.join("") );
}

export function parseLifeLikeString(lifeString: string): LifeRuleData {
    let lifeData: LifeRuleData = {birth: [], survival: []};
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

export function getNextLifeLikeGenerationFunction(matrix: Uint8ClampedArray, index: number, lineSize: number, ruleData: LifeRuleData): number {
    let neighbors = 0;
    const height = Math.trunc(matrix.length / lineSize);
    const currentRow = Math.trunc(index / lineSize);
    const currentCol = index - (currentRow * lineSize);

    for (let row = currentRow - 1; row <= currentRow + 1; row++) {
        for (let col = currentCol - 1; col <= currentCol + 1; col++) {
            if (row >= 0 && row < height && col >= 0 && col < lineSize) {
                if (matrix[row * lineSize + col] == 1 && !(row === currentRow && col === currentCol)) {
                    neighbors++;
                }
            }
        }
    }
    
    if (matrix[currentRow * lineSize + currentCol] === 1) {
        return ruleData.survival.some(survivalValue => survivalValue === neighbors) ? 1 : 0;
    } else if (matrix[currentRow * lineSize + currentCol] === 0) {
        return ruleData.birth.some(birthValue => birthValue === neighbors) ? 1 : 0;
    }

    return 0;
}

export function getNextLifeGeneration(cellMatrix: CellMatrix, ruleString: string): Uint8ClampedArray  {
    const output: Uint8ClampedArray = new Uint8ClampedArray(cellMatrix.cellData.length);
    if (!isValidLifeString(ruleString)) {
        throw new Error("Cannot parse invalid life string: " + ruleString);
    }

    const ruleData = parseLifeLikeString(ruleString);
    for (let i = 0; i < output.length; i++) {
        output[i] = getNextLifeLikeGenerationFunction(cellMatrix.cellData, i, cellMatrix.width, ruleData);
    }

    return output;
}

export async function getNextLifeGenerationAsync(cellMatrix: CellMatrix, ruleString: string): Promise<Uint8ClampedArray>  {
    const output: Uint8ClampedArray = new Uint8ClampedArray(cellMatrix.cellData.length);
    if (!isValidLifeString(ruleString)) {
        throw new Error(`Cannot parse invalid life string: ${ruleString}`);
    }

    const ruleData = parseLifeLikeString(ruleString);
    for (let i = 0; i < output.length; i++) {
        await ( async () => output[i] = getNextLifeLikeGenerationFunction(cellMatrix.cellData, i, cellMatrix.width, ruleData) )();
    }

    return output;
}

// export function getLifeKernel(lifeString: string): IKernelRunShortcut {
//     if (isValidLifeString(lifeString)) {
//         const lifeData = parseLifeLikeString(lifeString);
//       return gpu.createKernel(getNextLifeLikeGenerationFunction).setConstants( { ...lifeData, birthCount: lifeData.birth.length, survivalCount: lifeData.survival.length } );
//     } else {
//         throw new Error("CANNOT GET KERNEL FROM INVALID LIFE STRING: " + lifeString);
//     }
// }


export function isValidElementaryRule(rule: number): boolean {
    return rule >= 0 && rule <= 255;
}

function getElementaryRules(rule: number): Uint8ClampedArray {
    if (!isValidElementaryRule(rule)) {
        throw new Error(`INVALID ELEMENTARY AUTOMATA RULE: RULE {${rule}} MUST BE 0 <= rule <= 255`);
    }

    const binaryRule: string = rule.toString(2).padStart(8, '0');
    const rules: Uint8ClampedArray = new Uint8ClampedArray(8);

    for (let i = 0; i < 8; i++) {
        rules[i] = Number.parseInt(binaryRule.charAt(7 - i));
    }

    return rules;
}

function getNextElementaryGenerationFunction(line: Uint8ClampedArray, index: number, rules: Uint8ClampedArray): number  {
    let value = 0;

    if (index - 1 >= 0 && index - 1 < line.length) {
        if (line[index - 1] === 1) {
            value += 4;
        }
    } 
    
    if (line[index] === 1) {
        value += 2;
    }

    if (index + 1 >= 0 && index + 1 < line.length) {
        if (line[index + 1] === 1) {
            value += 1;
        }
    }

    return rules[value];
}

export function getNextElementaryGeneration(currentGeneration: Uint8ClampedArray, numberRule: number): Uint8ClampedArray {
    const output: Uint8ClampedArray = new Uint8ClampedArray(currentGeneration.length);
    if (!isValidElementaryRule(numberRule)) {
        throw new Error(`CANNOT GET NEXT ELEMENTARY GENERATION WITH INVALID RULE: ", ${numberRule}`);
    }

    const rules: Uint8ClampedArray = getElementaryRules(numberRule);
    for (let i = 0; i < currentGeneration.length; i++) {
        output[i] = getNextElementaryGenerationFunction(currentGeneration, i, rules);
    }
    return output;
}

const patternTextFilterRegex = /[^*.\n\rOo]/g

export function isValidPatternText(text: string): boolean {
    const filteredText = text.replace(patternTextFilterRegex, "")
    if (filteredText.length === 0) {
        return false;
    }

    const lines = filteredText.split(/[\n\r]/g)
    if (lines.length === 0) {
        return false;
    }

    const requiredWidth = lines[0].length
    
    return lines.every(line => line.length === requiredWidth)
}

export function parsePatternText(text: string): IVector2[] {
    if (!isValidPatternText(text)) {
        throw new Error("Attemped to parse invalid pattern text: " + text)
    }

    let cells: IVector2[] = []
    const filteredText = text.replace(patternTextFilterRegex, "")
    const onValues = ["*", "O", "o"]
    const offValues = ["."] 

    const lines = filteredText.split(/[\n\r]/g)
    lines.forEach((line, row) => {
        line.split("").forEach((char, col) => {
                if (onValues.some(val => val === char)) {
                    cells.push({ row: row, col: col })
                }
            }
        )
    })
    let row = 0;
    let col = 0;


    return cells;
}

// export async function getNextElementaryGenerationAsync(currentGeneration: Uint8ClampedArray, numberRule: number): Promise<Uint8ClampedArray> {
//     const output: Uint8ClampedArray = new Uint8ClampedArray(currentGeneration.length);
//     if (!isValidElementaryRule(numberRule)) {
//         console.error("CANNOT GET NEXT ELEMENTARY GENERATION WITH INVALID RULE: ", numberRule);
//         for (let i = 0; i < output.length; i++) {
//             output[i] = currentGeneration[i];
//         }
//         return output;
//     }

//     const rules: Uint8ClampedArray = getElementaryRules(numberRule);
//     for (let i = 0; i < currentGeneration.length; i++) {
//         await ( async () => output[i] = getNextElementaryGenerationFunction(currentGeneration, i, rules))();
//     }

//     return output;
// }

// export function getElementaryKernel(rule: number) {

//     return gpu.createKernel(getNextElementaryGenerationKernelFunction).setConstants( { rule: rules } );
// }



// async function getNextGeneration(board: IVector2[], lifeString: string): Promise<IVector2[]> {
//     let newBoard: IVector2[] = []
//     const renderingKernel = getLifeKernel(lifeString).setDynamicOutput(true).setDynamicArguments(true).setOutput([10]);

//     const matrices: CellMatrix[] = partition(board);
//     matrices.map(cellMatrix => ({
//         ...cellMatrix,
//         matrix: [...renderingKernel.setOutput([cellMatrix.width * cellMatrix.height])(cellMatrix.matrix, cellMatrix.width, cellMatrix.height) as number[]] 
//     }))

//     matrices.forEach(cellMatrix => {
//        newBoard.push(...cellMatrixToVector2(cellMatrix)) 
//     })

//     return newBoard;
// }
