import { ReactNode } from "react"
import boardUIStyles from "ui/components/styles/BoardUI.module.css"

export const BoardUI = ({top, left, center, right, bottom}: { top?: ReactNode, left?: ReactNode, center?: ReactNode, right?: ReactNode, bottom?: ReactNode }) => {
    return (
      <div className={boardUIStyles["board-ui"]}>

        <div className={boardUIStyles["top-bar"]}>
            {top ?? ""}
        </div>
      
        <div className="middle-area">
            <div className={boardUIStyles["left-bar"]}>
                {left ?? ""}
            </div>
            
            <div className="middle-separator">
                {center ?? ""}
            </div>

            <div className={boardUIStyles["right-bar"]}>
                {right ?? ""}
            </div>
        </div>

        <div className={boardUIStyles["bottom-bar"]}>
            {bottom ?? ""}
        </div>

      </div>
    )
}
