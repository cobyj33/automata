import { factory } from "typescript"


export interface IDimension {
    readonly width: number,
    readonly height: number
}

type DimensionTuple = [number, number]

export class Dimension implements IDimension {
    readonly width: number
    readonly height: number

    constructor(width: number, height: number) {
        this.width = width
        this.height = height
    }

    aspectRatio() {
        return this.width / this.height
    }

    tuple(): DimensionTuple {
        return [this.width, this.height]
    }

    static fromTuple(tuple: DimensionTuple) {
        return new Dimension(tuple[0], tuple[1])
    }

    withWidth(width: number): Dimension {
        return new Dimension(width, this.height)
    }

    withHeight(height: number): Dimension {
        return new Dimension(this.width, height)
    }

    scale(factor: number): Dimension {
        return new Dimension(this.width * factor, this.height * factor)
    }

    expand(amount: number): Dimension {
        return new Dimension(this.width * + amount, this.height + amount)
    }


}