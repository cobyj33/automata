import { MutableRefObject, useRef, useState } from 'react'
import { Vector2 } from "../interfaces/Vector2"
import { View } from "../interfaces/View"
import { StatefulData } from '../interfaces/StatefulData';
import { BoardDrawing } from './BoardDrawing'

export const UnboundedGameBoard = ({ boardData }: { boardData: StatefulData<Vector2[]> }) => {
    const [view, setView] = useState<View>({
        row: 0,
        col: 0,
        cellSize: 10
    });
  const [board, setBoard] = boardData
  const isPointerDown: MutableRefObject<boolean> = useRef<boolean>(false);

  return (
    <div>
      <BoardDrawing view={view} board={board} />
    </div>
  )
}
