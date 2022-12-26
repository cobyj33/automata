import { ReactNode } from "react"
import "./styles/boardui.css"

export const BoardUI = ({top, left, center, right, bottom}: { top?: ReactNode, left?: ReactNode, center?: ReactNode, right?: ReactNode, bottom?: ReactNode }) => {
    return (
      <div className="board-ui">

        <div className="board-ui-bar top-bar">
            {top ?? ""}
        </div>
      
        <div className="middle-area">
            <div className="board-ui-bar left-bar">
                {left ?? ""}
            </div>
            
            <div className="middle-separator">
                {center ?? ""}
            </div>

            <div className="board-ui-bar right-bar">
                {right ?? ""}
            </div>
        </div>

        <div className="board-ui-bar bottom-bar">
            {bottom ?? ""}
        </div>

      </div>
    )
}
