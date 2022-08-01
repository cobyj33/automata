import { useState } from 'react';
import './App.css';
import { Vector2 } from './interfaces/Vector2';
import { BoardType, GameBoard } from './components/GameBoard';

const randomPoints = (width: number, height: number, count: number) => {
    return Array.from({length: count}, () => ({
        row: Math.trunc(Math.random() * height),
        col: Math.trunc(Math.random() * width)
    }))
}

function App() {
  const [board, setBoard] = useState<Vector2[]>(randomPoints(200, 200, 200 * 200 / 2));
    

  return (
    <div className="App">
      {
      // <div className="menu-bar">
      //   <div className="menu-content-container">
      //     <button className='menu-button'> Create </button>
      //     <button className='menu-button'> Explore </button>
      //     <button className='menu-button'> Your Boards </button>
      //     <button className='menu-button'> Profile </button> 
      //   </div>
      // </div>
      }
 
      <GameBoard type={BoardType.BOUNDED} boardData={[board, setBoard]} />

      {/* <PointerDownTest /> */}
    </div> 
  );
}

export default App;
