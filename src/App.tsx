import { useState } from 'react';
import { Vector2 } from 'interfaces/Vector2';
import appStyles from 'App.module.css';
import { BoardType, GameBoard } from 'ui/components/GameBoard';

import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu"


function App() {
  const [board, setBoard] = useState<Vector2[]>([]);
  const [currentBoardType, setCurrentBoardType] = useState<BoardType>("BOUNDED");
  console.log(appStyles)

  return (
    <div className={appStyles["App"]}>
      <nav className={appStyles["menu-bar"]}>
        <Menu className={appStyles["menu"]} transition menuClassName={appStyles["menu-drop-down"]} menuButton={<MenuButton className={appStyles["menu-button"]}> File </MenuButton>}>
            <MenuItem  className={appStyles["menu-item"]}>New</MenuItem>
            <MenuItem className={appStyles["menu-item"]}>< input type="file" accept="image/*" onChange={e => {}}/> Open</MenuItem>
            <MenuItem className={appStyles["menu-item"]}>Save</MenuItem>
            <MenuItem className={appStyles["menu-item"]}>Save As</MenuItem>
            <MenuItem className={appStyles["menu-item"]} onClick={e => {}}>Export</MenuItem>
            <MenuItem className={appStyles["menu-item"]}>Import</MenuItem>
        </Menu>

        <Menu className={appStyles["menu"]} transition menuClassName={appStyles["menu-drop-down"]} menuButton={<MenuButton  className={appStyles["menu-button"]}> Edit </MenuButton>}>
          <MenuItem className={appStyles["menu-item"]}>Undo</MenuItem>
          <MenuItem className={appStyles["menu-item"]}>Redo</MenuItem>
        </Menu>

        <Menu className={appStyles["menu"]} transition menuClassName={appStyles["menu-drop-down"]} menuButton={<MenuButton  className={appStyles["menu-button"]}> View </MenuButton>}>
          <MenuItem className={appStyles["menu-item"]} > Theme </MenuItem>
          <MenuItem className={appStyles["menu-item"]}> Toggle Fullscreen </MenuItem>
        </Menu>
      </nav>

      {/* <div className={appStyles["menu-bar"]}>
        <div className={appStyles["menu-content-container"]}>
          <button className={appStyles["menu-button"]} onClick={() => setCurrentBoardType(BoardType.BOUNDED)}> LifeLike Board </button>
          <button className={appStyles["menu-button"]} onClick={() => setCurrentBoardType(BoardType.ELEMENTARY)}> Elementary Board </button>
        </div>
      </div> */}
 
      <GameBoard type={currentBoardType} boardData={[board, setBoard]} />

    </div> 
  );
}

export default App;
