import { useState } from 'react';
import './App.css';
import { Vector2 } from './classes/Data/Vector2';
import { BoardType, GameBoard } from './components/GameBoard';

function App() {
  const [board, setBoard] = useState<Vector2[]>([]);
  
  return (
    <div className="App">
      <div className="menu-bar">
        <div className="menu-content-container">
          <button className='menu-button'> Create </button>
          <button className='menu-button'> Explore </button>
          <button className='menu-button'> Your Boards </button>
          <button className='menu-button'> Profile </button> 
        </div>
      </div>
 
      <GameBoard type={BoardType.BOUNDED} boardData={[board, setBoard]} />

      {/* <PointerDownTest /> */}
    </div> 
  );
}

export default App;
