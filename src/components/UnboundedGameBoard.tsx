import React, { MutableRefObject, useRef, useState } from 'react'
import { Board } from '../classes/Data/Board';
import { Vector2 } from '../classes/Data/Vector2';
import { View } from '../classes/Data/View';
import { StatefulData } from '../interfaces/StatefulData';
import { BoardDrawing } from './BoardDrawing'

export const UnboundedGameBoard = ({ boardData }: { boardData: StatefulData<Vector2[]> }) => {
  const [view, setView] = useState<View>(new View(new Vector2(0, 0), 10));
  const [board, setBoard] = boardData
  const isPointerDown: MutableRefObject<boolean> = useRef<boolean>(false);

  return (
    <div>
      <BoardDrawing view={view} board={board} />
    </div>
  )
}
