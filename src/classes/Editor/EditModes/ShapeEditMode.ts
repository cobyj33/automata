import { LifeLikeEditorData } from "interfaces/EditorData";
import { LineSegment } from "interfaces/LineSegment";
import { filterVector2ListDuplicates, filterVector2ListMatches, IVector2 } from "interfaces/Vector2";
import EditMode from "./EditMode";


type ShapeCreatorFunction = (corner1: IVector2, corner2: IVector2) => IVector2[]
export class ShapeEditMode {
    squareLocked: boolean = false
    line: LineSegment = LineSegment.from(0, 0, 0, 0)
    creator: ShapeCreatorFunction

    private getShape(): IVector2[] {
        return this.creator(this.line.start, this.line.end)
    }

    private reset() {
        this.line = LineSegment.from(0, 0, 0, 0)
        this.squareLocked = false
    }

    constructor(creator: ShapeCreatorFunction) {
        this.creator = creator
    }

    onPointerDown(event: React.PointerEvent<Element>, data: LifeLikeEditorData) {
        const hoveredCell = data.currentHoveredCell
        this.line = new LineSegment(hoveredCell, hoveredCell) 
    }

    onPointerMove(event: React.PointerEvent<Element>, data: LifeLikeEditorData) {
        if (data.isPointerDown && !data.isRendering) {
            const hoveredCell = data.currentHoveredCell;
            let end = hoveredCell
            if (this.squareLocked) {
                const sideLength: number = Math.min(Math.abs(hoveredCell.row - this.line.start.row), Math.abs(hoveredCell.col - this.line.start.col));
                end = {
                    row: this.line.start.row + ( hoveredCell.row < this.line.start.row ? -sideLength : sideLength ),
                    col: this.line.start.col + ( hoveredCell.col < this.line.start.col ? -sideLength : sideLength )       
                }
            }

            if (!(this.line.end.equals(hoveredCell))) {
                const toRemove = this.getShape()
                this.line = this.line.withEnd(end)
                const [, setGhostTilePositions] = data.ghostTilePositions;
                setGhostTilePositions(positions => filterVector2ListMatches(positions, toRemove).concat(this.getShape()) )
            }
        }
    }

    onPointerLeave(event: React.PointerEvent<Element>, data: LifeLikeEditorData) {
        
    }

    onPointerUp(event: React.PointerEvent<Element>, data: LifeLikeEditorData) {
        if (!data.isRendering) {
            const setBoard = data.boardData[1];
            const bounds = data.boundsData[0];
            const newCells: IVector2[] = this.getShape().filter(cell => bounds.pointInside(cell));
            
            setBoard(board =>  filterVector2ListDuplicates(board.concat(newCells)))
            const [, setGhostTilePositions] = data.ghostTilePositions;
            setGhostTilePositions( positions => filterVector2ListMatches(positions, this.getShape()) )
        }

        this.reset()
    }

    onKeyDown(event: React.KeyboardEvent<Element>, data: LifeLikeEditorData) {
        if (event.code === "ShiftLeft") {
            this.squareLocked = true;
        }
    }

    onKeyUp(event: React.KeyboardEvent<Element>, data: LifeLikeEditorData) {
        if (event.code === "ShiftLeft") {
            this.squareLocked = false;
        }
    }

}

export default ShapeEditMode