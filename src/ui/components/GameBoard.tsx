import { Vector2 } from 'interfaces/Vector2'
import { StatefulData } from 'interfaces/StatefulData'
import { BoundedGameBoard } from 'ui/components/BoundedGameBoard'
import { UnboundedGameBoard } from 'ui/components/UnboundedGameBoard'
import "ui/components/styles/gameboard.css"
import {ElementaryBoard} from 'ui/components/ElementaryBoard'

export type BoardType = "BOUNDED" | "UNBOUNDED" | "ELEMENTARY"

export const GameBoard = ({ type, boardData }: { type: BoardType, boardData: StatefulData<Vector2[]> }) => {
  function typeToBoard(boardType: BoardType): JSX.Element {
    switch (boardType) {
      case "BOUNDED": return <BoundedGameBoard boardData={boardData} />
      case "UNBOUNDED": return <UnboundedGameBoard boardData={boardData} />
      case "ELEMENTARY": return <ElementaryBoard />
    }
  }

  return typeToBoard(type)
}
