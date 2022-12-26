import { useState } from 'react';
import { Vector2 } from 'interfaces/Vector2';
import editorPageStyles from 'ui/pages/styles/EditorPage.module.css';
import { BoardType, GameBoard } from 'ui/components/GameBoard';

import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu"


function EditorPage() {
  const [board, setBoard] = useState<Vector2[]>([]);
  const [currentBoardType, setCurrentBoardType] = useState<BoardType>("BOUNDED");
  console.log(editorPageStyles)

  return (
    <div className={editorPageStyles["editor-page"]}>
      
      <nav className={editorPageStyles["menu-bar"]}>
        <Menu className={editorPageStyles["menu"]} transition menuClassName={editorPageStyles["menu-drop-down"]} menuButton={<MenuButton className={editorPageStyles["menu-button"]}> File </MenuButton>}>
            <MenuItem  className={editorPageStyles["menu-item"]}>New</MenuItem>
            <MenuItem className={editorPageStyles["menu-item"]}>< input type="file" accept="image/*" onChange={e => {}}/> Open</MenuItem>
            <MenuItem className={editorPageStyles["menu-item"]}>Save</MenuItem>
            <MenuItem className={editorPageStyles["menu-item"]}>Save As</MenuItem>
            <MenuItem className={editorPageStyles["menu-item"]} onClick={e => {}}>Export</MenuItem>
            <MenuItem className={editorPageStyles["menu-item"]}>Import</MenuItem>
        </Menu>

        <Menu className={editorPageStyles["menu"]} transition menuClassName={editorPageStyles["menu-drop-down"]} menuButton={<MenuButton  className={editorPageStyles["menu-button"]}> Edit </MenuButton>}>
          <MenuItem className={editorPageStyles["menu-item"]}>Undo</MenuItem>
          <MenuItem className={editorPageStyles["menu-item"]}>Redo</MenuItem>
          <SubMenu className={editorPageStyles["menu-item"]} menuClassName={editorPageStyles["menu-drop-down"]} label={"Select Editor"}>
            <MenuItem className={editorPageStyles["menu-item"]} onClick={() => setCurrentBoardType("BOUNDED")}>Bounded Life Like Editor</MenuItem>
            <MenuItem className={editorPageStyles["menu-item"]} onClick={() => setCurrentBoardType("ELEMENTARY")}>Elementary Editor</MenuItem>
          </SubMenu>
        </Menu>

        <Menu className={editorPageStyles["menu"]} transition menuClassName={editorPageStyles["menu-drop-down"]} menuButton={<MenuButton  className={editorPageStyles["menu-button"]}> View </MenuButton>}>
          <MenuItem className={editorPageStyles["menu-item"]} > Theme </MenuItem>
          <MenuItem className={editorPageStyles["menu-item"]}> Toggle Fullscreen </MenuItem>
        </Menu>
      </nav>

      <div className={editorPageStyles["editor-area"]}>
        <GameBoard type={currentBoardType} boardData={[board, setBoard]} />
      </div>
 
    </div> 
  );
}


export default EditorPage
