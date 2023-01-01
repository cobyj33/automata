import { Vector2 } from 'interfaces/Vector2'
import { StatefulData } from 'interfaces/StatefulData'
import { LifeLikeEditor } from 'ui/components/LifeLikeEditor'
// import gameBoardStyles from "ui/components/styles/GameBoard.module.css"
import {ElementaryBoard} from 'ui/components/ElementaryBoard'

export type BoardType = "LIFELIKE" | "ELEMENTARY" // Unbounded will be added soon

export const GameBoard = ({ type, boardData }: { type: BoardType, boardData: StatefulData<Vector2[]> }) => {
  function typeToBoard(boardType: BoardType): JSX.Element {
    switch (boardType) {
      case "LIFELIKE": return <LifeLikeEditor boardData={boardData} />
      case "ELEMENTARY": return <ElementaryBoard />
    }
  }

  return typeToBoard(type)
}

export default GameBoard