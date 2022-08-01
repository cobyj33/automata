import { Vector2 } from '../interfaces/Vector2'
import { StatefulData } from '../interfaces/StatefulData'
import { BoundedGameBoard } from './BoundedGameBoard'
import { UnboundedGameBoard } from './UnboundedGameBoard'
import "./styles/gameboard.scss"

export enum BoardType { BOUNDED, UNBOUNDED }

export const GameBoard = ({ type, boardData }: { type: BoardType, boardData: StatefulData<Vector2[]> }) => {
  function typeToBoard(boardType: BoardType): JSX.Element {
    switch (boardType) {
      case BoardType.BOUNDED: return <BoundedGameBoard boardData={boardData} />
      case BoardType.UNBOUNDED: return <UnboundedGameBoard boardData={boardData} />
    }
  }

  return typeToBoard(type)
}
