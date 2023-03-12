import { useState } from 'react';
import { IVector2 } from 'jsutil';
import editorPageStyles from 'ui/pages/styles/EditorPage.module.css';

import LifeLikeEditor from 'ui/components/LifeLikeEditor';
import ElementaryBoard from 'ui/components/ElementaryBoard';
import ToggleButton from 'ui/components/reuse/ToggleButton';

export type BoardType = "LIFELIKE" | "ELEMENTARY"
const DEFAULT_ELEMENTARY_EDITOR_DATA_WIDTH = 1000;

function EditorPage(): JSX.Element {
    const [currentBoard, setCurrentBoard] = useState<BoardType>("LIFELIKE");
    const [lifeLikeBoard, setLifeLikeBoard] = useState<IVector2[]>([])
    const [elementaryBoard, setElementaryBoard] = useState<number[]>(new Array<number>(DEFAULT_ELEMENTARY_EDITOR_DATA_WIDTH).fill(0))

    function typeToBoard(boardType: BoardType): JSX.Element {
        switch (boardType) {
            case "LIFELIKE": return <LifeLikeEditor boardData={[lifeLikeBoard, setLifeLikeBoard]} />
            case "ELEMENTARY": return <ElementaryBoard boardData={[elementaryBoard, setElementaryBoard]} />
        }
    }


    return (
    <div className={editorPageStyles["editor-page"]}>
        <nav className={editorPageStyles["menu-bar"]}>
            <ToggleButton selected={currentBoard === "LIFELIKE"} onClick={() => setCurrentBoard("LIFELIKE")}> Life-Like Editor </ToggleButton>
            <ToggleButton selected={currentBoard === "ELEMENTARY"} onClick={() => setCurrentBoard("ELEMENTARY")}> Elementary Editor </ToggleButton>
        </nav>

        <div className={editorPageStyles["editor-area"]}>
            { typeToBoard(currentBoard) }
        </div>

    </div> 
    );
}


export default EditorPage
