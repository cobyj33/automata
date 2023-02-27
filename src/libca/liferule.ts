
export type LifeRuleData = { birth: number[], survival: number[] }

export function isValidLifeString(lifeString: string, errorOutput?: (error: string) => any) {
    const error = getLifeStringError(lifeString);
    if (error.length > 0) {
        errorOutput?.(error)
        return false;
    }
    return true;
}

export function getLifeStringError(lifeString: string): string {
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

function getCanMakeLifeStringError(survivalNums: number[], birthNums: number[]): string {
    if (survivalNums.some(num => num < 0 || num > 8)) {
        return "Survival neighborhood rules must be between 0 and 8";
    }
    if (birthNums.some(num => num < 0 || num > 8)) {
        return "Birth neighborhood rules must be between 0 and 8";
    }
    if (survivalNums.length > 8) {
        return "Can only have 8 maximum survival rules";
    }
    if (birthNums.length > 8) {
        return "Can only have 8 maximum birth rules";
    }
    if (survivalNums.length !== new Set<number>(survivalNums).size) {
        return "Not all survival rules are unique";
    }
    if (birthNums.length !== new Set<number>(birthNums).size) {
        return "Not all birth rules are unique";
    }
    

    return "";
}

function canMakeLifeString(survivalNums: number[], birthNums: number[]): boolean {
    return getCanMakeLifeStringError(survivalNums, birthNums) === ""
}

export function createLifeString(birthNums: number[], survivalNums: number[]): string {
    if (!canMakeLifeString(survivalNums, birthNums)) {
        throw new Error(`Cannot make new life string from ${survivalNums} and ${birthNums}: ${getCanMakeLifeStringError(survivalNums, birthNums)}`);
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