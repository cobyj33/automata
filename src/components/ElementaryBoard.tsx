import { useState } from "react";
import { Vector2 } from "../interfaces/Vector2"
import { View } from "../interfaces/View"
import { CellMatrix } from "../interfaces/CellMatrix"

export const ElementaryBoard = () => {
    const [view, setView] = useState<View>({
        row: 0,
        col: 0,
        cellSize: 50
    })

    const [cellMatrix, setCellMatrix] = useState<CellMatrix>({
        topLeft: {
            row: 0,
            col: 0,
        },
        matrix: [],
        width: 0,
        height: 0
    });
    



    return (
        <div className="elementary-board">
                    

        </div>
    )
}
