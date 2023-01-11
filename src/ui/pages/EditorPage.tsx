import { useState } from 'react';
import { IVector2 } from 'interfaces/Vector2';
import editorPageStyles from 'ui/pages/styles/EditorPage.module.css';

import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu"
import { CellMatrix } from 'interfaces/CellMatrix';
import LifeLikeEditor from 'ui/components/LifeLikeEditor';
import ElementaryBoard from 'ui/components/ElementaryBoard';
import { Box } from 'interfaces/Box';

export type BoardType = "LIFELIKE" | "ELEMENTARY"

function EditorPage() {
  const [lifeLikeBoard, setLifeLikeBoard] = useState<IVector2[]>([])
  const [elementaryBoard, setElementaryBoard] = useState<number[]>(new Array<number>(1000).fill(0))

  function typeToBoard(boardType: BoardType): JSX.Element {
    switch (boardType) {
      case "LIFELIKE": return <LifeLikeEditor boardData={[lifeLikeBoard, setLifeLikeBoard]} />
      case "ELEMENTARY": return <ElementaryBoard boardData={[elementaryBoard, setElementaryBoard]} />
    }
  }

  const [currentBoard, setCurrentBoard] = useState<BoardType>("LIFELIKE");

  return (
    <div className={editorPageStyles["editor-page"]}>
      <nav className={editorPageStyles["menu-bar"]}>
        {/* <Menu className={editorPageStyles["menu"]} transition menuClassName={editorPageStyles["menu-drop-down"]} menuButton={<MenuButton className={editorPageStyles["menu-button"]}> File </MenuButton>}>
            <MenuItem  className={editorPageStyles["menu-item"]}>New</MenuItem>
            <MenuItem className={editorPageStyles["menu-item"]}>< input type="file" accept="image/*"/> Open</MenuItem>
            <MenuItem className={editorPageStyles["menu-item"]}>Save</MenuItem>
            <MenuItem className={editorPageStyles["menu-item"]}>Save As</MenuItem>
            <MenuItem className={editorPageStyles["menu-item"]}>Export</MenuItem>
            <MenuItem className={editorPageStyles["menu-item"]}>Import</MenuItem>
        </Menu> */}

        {/* <Menu className={editorPageStyles["menu"]} transition menuClassName={editorPageStyles["menu-drop-down"]} menuButton={<MenuButton  className={editorPageStyles["menu-button"]}> Edit </MenuButton>}>
          <MenuItem className={editorPageStyles["menu-item"]}>Undo</MenuItem>
          <MenuItem className={editorPageStyles["menu-item"]}>Redo</MenuItem>
        </Menu> */}

        {/* <Menu className={editorPageStyles["menu"]} transition menuClassName={editorPageStyles["menu-drop-down"]} menuButton={<MenuButton  className={editorPageStyles["menu-button"]}> View </MenuButton>}>
          <MenuItem className={editorPageStyles["menu-item"]} > Theme </MenuItem>
          <MenuItem className={editorPageStyles["menu-item"]}> Toggle Fullscreen </MenuItem>
        </Menu> */}

        <Menu className={editorPageStyles["menu"]} transition menuClassName={editorPageStyles["menu-drop-down"]} menuButton={<MenuButton  className={editorPageStyles["menu-button"]}> Select Editor </MenuButton>}>
          <MenuItem className={editorPageStyles["menu-item"]} onClick={() => setCurrentBoard("LIFELIKE")}>Bounded Life Like Editor</MenuItem>
          <MenuItem className={editorPageStyles["menu-item"]} onClick={() => setCurrentBoard("ELEMENTARY")}>Elementary Editor</MenuItem>
        </Menu>
      </nav>

      <div className={editorPageStyles["editor-area"]}>
        { typeToBoard(currentBoard) }
      </div>
 
    </div> 
  );
}


export default EditorPage
