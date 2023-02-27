import { CellMatrix } from 'common/CellMatrix';
import { IVector2 } from 'common/Vector2';
import { isValidLifeString, LifeRuleData, parseLifeLikeString } from 'libca/liferule';

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

export function isValidElementaryRule(rule: number): boolean {
    return Number.isInteger(rule) && rule >= 0 && rule <= 255;
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

export function createElementaryGenerationMatrix(startingGeneration: Uint8ClampedArray, generations: number, rule: number): (0 | 1)[][] {
    const generationsDataU8: (0 | 1)[][] = new Array<Array<0 | 1>>(generations);
    let currentGeneration = new Uint8ClampedArray([...startingGeneration]);
    for (let i = 0; i < generations; i++) {
        generationsDataU8[i] = [...currentGeneration] as (0 | 1)[];
        currentGeneration = getNextElementaryGeneration(currentGeneration, rule)
    }

    return generationsDataU8
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


    return cells;
}