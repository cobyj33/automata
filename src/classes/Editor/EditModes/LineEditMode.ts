import { PointerEvent } from "react";
import { IVector2, filterVector2ListDuplicates, filterVector2ListMatches } from "interfaces/Vector2";
import { EditMode } from "classes/Editor/EditModes/EditMode";
import {getLine} from 'functions/shapes';
import {StatefulData} from "interfaces/StatefulData";
import { Box } from "interfaces/Box";
import { LineSegment } from "interfaces/LineSegment";
import { hover } from "@testing-library/user-event/dist/hover";

export interface LineData {
    boardData: StatefulData<IVector2[]>,
    boundsData: StatefulData<Box>,
    ghostTilePositions: StatefulData<IVector2[]>,
    getHoveredCell: (event: PointerEvent<Element>) => IVector2,
    isPointerDown: boolean,
    isRendering: boolean;
}

export class LineEditMode extends EditMode<LineData> {
    cursor() { return 'url("https://img.icons8.com/ios-glyphs/30/000000/pencil-tip.png"), crosshair' }
    line: LineSegment = LineSegment.from(0, 0, 0, 0)

    onPointerDown(event: PointerEvent<Element>) {
        const hoveredCell = this.data.currentHoveredCell
        this.line = new LineSegment(hoveredCell, hoveredCell) 
    }

    onPointerMove(event: PointerEvent<Element>) {
        if (this.data.isPointerDown && !this.data.isRendering) {
            const hoveredCell = this.data.currentHoveredCell;
            if (!(this.line.end.equals(hoveredCell))) {
                const toRemove = this.line.cells()
                this.line = this.line.withEnd(hoveredCell)
                const [, setGhostTilePositions] = this.data.ghostTilePositions;
                setGhostTilePositions(positions => filterVector2ListMatches(positions, toRemove).concat(this.line.cells()) )
            }
        }
    }

    onPointerUp(event: PointerEvent<Element>) {

        if (!this.data.isRendering) {
            const [, setBoard] = this.data.boardData;
            const [bounds] = this.data.boundsData;
            const newCells: IVector2[] = this.line.cells().filter(cell => bounds.pointInside(cell));
            
            setBoard(board =>  filterVector2ListDuplicates(board.concat(newCells)))
            const [, setGhostTilePositions] = this.data.ghostTilePositions;
            setGhostTilePositions( positions => filterVector2ListMatches(positions, this.line.cells()))
        }

        this.line = LineSegment.from(0, 0, 0, 0)
    }

}

export default LineEditMode
