import { ChangeEvent, KeyboardEvent, MutableRefObject, PointerEvent, RefObject, useCallback, useEffect, useRef, useState, WheelEvent } from 'react'
import { Vector2 } from '../interfaces/Vector2';
import { View } from '../interfaces/View';
import { EditMode } from "automata/editor/main";
import { BoxEditMode, BoxData, DrawEditMode, DrawData, EllipseEditMode, EllipseData, LineEditMode, LineData, MoveEditMode, MoveData, ZoomEditMode, ZoomData, EraseEditMode, EraseData } from 'automata/editor/bounded';
import { getHoveredCell, pointerPositionInElement } from '../functions/editorFunctions';
import { useHistory, useIsPointerDown, useWebGL2CanvasUpdater } from '../functions/hooks';
import { StatefulData } from '../interfaces/StatefulData';
import { BoundedBoardDrawing } from './BoundedBoardDrawing';
import { BoundedGameRender, RenderData } from './BoundedGameRender';
import { FaPlay, FaBrush, FaArrowsAlt, FaSearch, FaEraser, FaLine, FaBox, FaEllipsisH, FaUndo, FaRedo } from "react-icons/fa"
import { LayeredCanvas } from './LayeredCanvas';
import { renderBoard } from '../functions/drawing';
import { createLifeString, isValidLifeString, parseLifeLikeString } from '../functions/generationFunctions';
import {Box, inBox} from '../interfaces/Box';
import { BoardUI } from "./BoardUI"
import { RuleEditor } from "./RuleEditor"
import { ToolTip } from "./ToolTip/ToolTip"


interface EditorData {
    boardData: StatefulData<Vector2[]>;
    boundsData: StatefulData<Box>;
    viewData: StatefulData<View>;
    lastHoveredCell: Vector2;
    isPointerDown: boolean;
    getHoveredCell: (event: PointerEvent<Element>) => Vector2;
    ghostTilePositions: StatefulData<Vector2[]>
    isRendering: boolean;
}

enum EditorEditMode { MOVE, ZOOM, DRAW, ERASE, BOX, LINE, ELLIPSE };
type UnionData = MoveData | ZoomData | DrawData | EraseData | BoxData | LineData | EllipseData | EditorData;



export const BoundedGameBoard = ({ boardData }: { boardData: StatefulData<Vector2[]> }) => {
  const boardHolder = useRef<HTMLDivElement>(null);
  const ghostCanvas = useRef<HTMLCanvasElement>(null);
  const [cursor, setCursor] = useState<string>('');
  
    const [view, setView] = useState<View>({
        row: 0,
        col: 0,
        cellSize: 10
    });
    const [renderData, setRenderData] = useState<RenderData>({ generation: 0 });

  const [board, setBoard] = boardData;
  const [rendering, setRendering] = useState<boolean>(false);
  const [bounds, setBounds] = useState<Box>({ row: 0, col: 0, width: 200, height: 200 });
  const [ghostTilePositions, setGhostTilePositions] = useState<Vector2[]>([]);
  const [lastHoveredCell, setLastHoveredCell] = useState<Vector2>({ row: 0, col: 0 });
  const [automata, setAutomata] = useState<string>("B3/S23");
  const isPointerDown: MutableRefObject<boolean> = useIsPointerDown(boardHolder);

    useEffect( () => {
        if (rendering === false) {
            setRenderData({generation: 0});
        }
    }, [rendering] )

  useEffect( () => {
    const canvas: HTMLCanvasElement | null = ghostCanvas.current;
    if (canvas !== null) {
      const gl: WebGL2RenderingContext | null = canvas.getContext("webgl2");
      if (gl !== null && gl !== undefined) {
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);
        renderBoard(gl, view, ghostTilePositions.concat(lastHoveredCell), 0.5);
      }
    }
  }, [ghostTilePositions, lastHoveredCell])

  function getCurrentHoveredCell(event: PointerEvent<Element>) {
    return boardHolder.current !== null ? getHoveredCell(pointerPositionInElement(event, boardHolder.current), view) : lastHoveredCell;
  }

  function getEditorData(): EditorData {
    return {
      boardData: [board, setBoard],
      boundsData: [bounds, setBounds],
      viewData: [view, setView],
      ghostTilePositions: [ghostTilePositions, setGhostTilePositions],
      lastHoveredCell: lastHoveredCell,
      getHoveredCell: getCurrentHoveredCell,
      isPointerDown: isPointerDown.current,
      isRendering: rendering
    }
  }
  
  const [editMode, setEditMode] = useState<EditorEditMode>(EditorEditMode.MOVE);
  const editorModes: MutableRefObject<{[key in EditorEditMode]: EditMode<UnionData>}> = useRef({ 
    [EditorEditMode.DRAW]: new DrawEditMode(getEditorData()),
    [EditorEditMode.ZOOM]: new ZoomEditMode(getEditorData()),
    [EditorEditMode.MOVE]: new MoveEditMode(getEditorData()),
    [EditorEditMode.ERASE]: new EraseEditMode(getEditorData()),
    [EditorEditMode.LINE]: new LineEditMode(getEditorData()),
    [EditorEditMode.BOX]: new BoxEditMode(getEditorData()),
    [EditorEditMode.ELLIPSE]: new EllipseEditMode(getEditorData())
  });
  
  useEffect( () => {
    setCursor(editorModes.current[editMode].cursor());
  }, [editMode])

  function onPointerMove(event: PointerEvent<Element>) {
    editorModes.current[editMode].setEditorData(getEditorData())
    editorModes.current[editMode].onPointerMove?.(event);
    const currentHoveredCell = getCurrentHoveredCell(event)
    if (!(lastHoveredCell.row === currentHoveredCell.row && lastHoveredCell.col === currentHoveredCell.col)) {
      setLastHoveredCell(currentHoveredCell)
    }
  }
  
  function onPointerDown(event: PointerEvent<Element>) {
    editorModes.current[editMode].setEditorData(getEditorData())
    editorModes.current[editMode].onPointerDown?.(event);
    const currentHoveredCell = getCurrentHoveredCell(event)
    if (!(lastHoveredCell.row === currentHoveredCell.row && lastHoveredCell.col === currentHoveredCell.col)) {
      setLastHoveredCell(currentHoveredCell)
    }
  }
  
  function onPointerUp(event: PointerEvent<Element>) {
    editorModes.current[editMode].setEditorData(getEditorData())
    editorModes.current[editMode].onPointerUp?.(event);
  }

  function onPointerLeave(event: PointerEvent<Element>) {
    editorModes.current[editMode].setEditorData(getEditorData())
    editorModes.current[editMode].onPointerLeave?.(event);
  }
  
  const [undo, redo] = useHistory(boardData, (first: Vector2[], second: Vector2[]) => first.length === second.length && first.every(cell => second.includes(cell)) )
  function onKeyDown(event: KeyboardEvent<Element>) {
    editorModes.current[editMode].setEditorData(getEditorData())
    editorModes.current[editMode].onKeyDown?.(event);

    if (event.code === "KeyZ" && event.shiftKey === true && event.ctrlKey === true) {
      redo();
    } else if (event.code === "KeyZ" && event.ctrlKey === true) {
      undo();
    } else if (event.code === 'Enter') {
      setRendering(!rendering)
    } else if (event.code === 'KeyC') {
      setBoard([]);
    }
  }

  function onKeyUp(event: KeyboardEvent<Element>) {
    editorModes.current[editMode].setEditorData(getEditorData())
    editorModes.current[editMode].onKeyUp?.(event);
  }

  function onWheel(event: WheelEvent<Element>) {
    editorModes.current[editMode].setEditorData(getEditorData())
    editorModes.current[editMode].onWheel?.(event);
  }

  useWebGL2CanvasUpdater(ghostCanvas)

  return (
    <div>
      <div style={{cursor: cursor}} ref={boardHolder} className="board-holder" onWheel={onWheel} onPointerMove={onPointerMove} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerLeave={onPointerLeave} onKeyDown={onKeyDown} onKeyUp={onKeyUp} tabIndex={0} >
        <LayeredCanvas>
          {rendering ? 
              <div>
                  <BoundedGameRender automata={automata} start={board} view={view} bounds={bounds} getData={(data) => setRenderData(data)} /> 
                    <div className='render-info'>
                        <p> Current Generation: { renderData.generation } </p>
                    </div>
              </div>
           : <BoundedBoardDrawing bounds={bounds} view={view} board={board} />}
          <canvas style={{}} className="board-drawing" ref={ghostCanvas} />
            
        </LayeredCanvas>
      </div>

      <BoardUI left={<RuleEditor lifeRule={[automata, setAutomata]} currentBoard={board}/>} bottom={ 
          <div className="editing-buttons"> 
            <button className={`edit-button ${ editMode === EditorEditMode.DRAW ? 'selected' : '' }`} onClick={() => setEditMode(EditorEditMode.DRAW)}> <FaBrush /> </button>
            <button className={`edit-button ${ editMode === EditorEditMode.MOVE ? 'selected' : '' }`} onClick={() => setEditMode(EditorEditMode.MOVE)}> <FaArrowsAlt /> </button>
            <button className={`edit-button ${ editMode === EditorEditMode.ZOOM ? 'selected' : '' }`} onClick={() => setEditMode(EditorEditMode.ZOOM)}> <FaSearch /> </button>
            <button className={`edit-button ${ editMode === EditorEditMode.ERASE ? 'selected' : '' }`} onClick={() => setEditMode(EditorEditMode.ERASE)}> <FaEraser /> </button>
            <button className={`edit-button ${ editMode === EditorEditMode.LINE ? 'selected' : '' }`} onClick={() => setEditMode(EditorEditMode.LINE)}> <FaLine /> </button>
            <button className={`edit-button ${ editMode === EditorEditMode.BOX ? 'selected' : '' }`} onClick={() => setEditMode(EditorEditMode.BOX)}> <FaBox /> </button>
            <button className={`edit-button ${ editMode === EditorEditMode.ELLIPSE ? 'selected' : '' }`} onClick={() => setEditMode(EditorEditMode.ELLIPSE)}> <FaEllipsisH /> </button>
            <button className={`edit-button ${ rendering ? 'selected' : '' }`} onClick={() => setRendering(!rendering)}> <FaPlay /> </button>
            <button className={`edit-button`} onClick={undo}> <FaUndo /> </button>
            <button className={`edit-button`} onClick={redo}> <FaRedo /> </button>
          </div>
      } />

    </div>
  )
}

