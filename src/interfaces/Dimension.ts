import { factory } from "typescript"


export interface IDimension2D {
    readonly width: number,
    readonly height: number
}

type Dimension2DTuple = [number, number]

export class Dimension2D implements IDimension2D {
    readonly width: number
    readonly height: number

    constructor(width: number, height: number) {
        this.width = width
        this.height = height
    }

    aspectRatio() {
        return this.width / this.height
    }

    tuple(): Dimension2DTuple {
        return [this.width, this.height]
    }

    static fromTuple(tuple: Dimension2DTuple) {
        return new Dimension2D(tuple[0], tuple[1])
    }

    withWidth(width: number): Dimension2D {
        return new Dimension2D(width, this.height)
    }

    withHeight(height: number): Dimension2D {
        return new Dimension2D(this.width, height)
    }

    scale(factor: number): Dimension2D {
        return new Dimension2D(this.width * factor, this.height * factor)
    }

    expand(amount: number): Dimension2D {
        return new Dimension2D(this.width * + amount, this.height + amount)
    }

    trunc(): Dimension2D {
        return new Dimension2D(Math.trunc(this.width), Math.trunc(this.height))
    }

    floor(): Dimension2D {
        return new Dimension2D(Math.floor(this.width), Math.floor(this.height))
    }

    ceil(): Dimension2D {
        return new Dimension2D(Math.ceil(this.width), Math.ceil(this.height))
    }

    round(): Dimension2D {
        return new Dimension2D(Math.round(this.width), Math.round(this.height))
    }


}