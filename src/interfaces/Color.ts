export interface Color {
    readonly red: number;
    readonly green: number;
    readonly blue: number;
    readonly alpha: number;
}


export function colorToRGBString(color: Color): string {
    return `rgb(${color.red}, ${color.green}, ${color.blue})`;
}

export function darkenColor(color: Color, amount: number): Color {
    return {  red: Math.max(0, color.red - amount), green: Math.max(0, color.green - amount), blue: Math.max(0, color.blue - amount), alpha: color.alpha  }
}

export function lightenColor(color: Color, amount: number): Color {
    return {  red: Math.max(0, color.red + amount), green: Math.max(0, color.green + amount), blue: Math.max(0, color.blue + amount), alpha: color.alpha  }
}

export function colorToRGBAString(color: Color): string {
    return `rgb(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`;
}

export function areEqualColors(first: Color, second: Color): boolean {
    return first.red === second.red && first.green === second.green && first.blue === second.blue && first.alpha === second.alpha;
}

export function getRandomColor(): Color {
    return { red: Math.trunc(Math.random() * 255), blue: Math.trunc(Math.random() * 255), green: Math.trunc(Math.random() * 255), alpha: 255 };
}
