import { useState } from 'react';
import { Vector2 } from './interfaces/Vector2';
import appStyles from './App.module.css';
import { BoardType, GameBoard } from './components/GameBoard';


function App() {
  const [board, setBoard] = useState<Vector2[]>([]);
  const [currentBoardType, setCurrentBoardType] = useState<BoardType>(BoardType.BOUNDED);
  console.log(appStyles)

  return (
    <div className={appStyles["App"]}>

      <div className={appStyles["menu-bar"]}>
        <div className={appStyles["menu-content-container"]}>
          <button className={appStyles["menu-button"]} onClick={() => setCurrentBoardType(BoardType.BOUNDED)}> LifeLike Board </button>
          <button className={appStyles["menu-button"]} onClick={() => setCurrentBoardType(BoardType.ELEMENTARY)}> Elementary Board </button>
        </div>
      </div>
 
      <GameBoard type={currentBoardType} boardData={[board, setBoard]} />

    </div> 
  );
}

export default App;
