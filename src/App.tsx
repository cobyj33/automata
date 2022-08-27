import { useState } from 'react';
import { Vector2 } from './interfaces/Vector2';
import './App.css';
import { BoardType, GameBoard } from './components/GameBoard';

const randomPoints = (width: number, height: number, count: number) => {
    return Array.from({length: count}, () => ({
        row: Math.trunc(Math.random() * height),
        col: Math.trunc(Math.random() * width)
    }))
}


function App() {
  const [board, setBoard] = useState<Vector2[]>(randomPoints(200, 200, 200 * 200 / 2));
    const [currentBoardType, setCurrentBoardType] = useState<BoardType>(BoardType.BOUNDED);

  return (
    <div className="App">
      {
      <div className="menu-bar">
        <div className="menu-content-container">
          <button className="menu-button" onClick={() => setCurrentBoardType(BoardType.BOUNDED)}> LifeLike Board </button>
          <button className="menu-button" onClick={() => setCurrentBoardType(BoardType.ELEMENTARY)}> Elementary Board </button>
        {/*
              <button className='menu-button'> Create </button>
              <button className='menu-button'> Explore </button>
              <button className='menu-button'> Your Boards </button>
              <button className='menu-button'> Profile </button> 
           */}
        </div>
      </div>
      }
 
      <GameBoard type={currentBoardType} boardData={[board, setBoard]} />

    </div> 
  );
}

export default App;
