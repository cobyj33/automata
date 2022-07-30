import React, { KeyboardEvent, MutableRefObject, PointerEvent, useEffect, useRef, useState, WheelEvent } from 'react'
import { Dimension } from '../classes/Data/Dimension';
import { Vector2 } from '../classes/Data/Vector2';
import { View } from '../classes/Data/View';
import { BoxEditMode } from '../classes/Editor/BoxEditMode';
import { DrawEditMode } from '../classes/Editor/DrawEditMode';
import { EditMode } from '../classes/Editor/EditMode';
import { EditorData } from '../classes/Editor/EditorData';
import { EllipseEditMode } from '../classes/Editor/EllipseEditMode';
import { EraseEditMode } from '../classes/Editor/EraseEditMode';
import { LineEditMode } from '../classes/Editor/LineEditMode';
import { MoveEditMode } from '../classes/Editor/MoveEditMode';
import { ZoomEditMode } from '../classes/Editor/ZoomEditMode';
import { getHoveredCell, pointerPositionInElement } from '../functions/editorFunctions';
import { useHistory, useIsPointerDown } from '../functions/hooks';
import { StatefulData } from '../interfaces/StatefulData';
import { BoardDrawing } from './BoardDrawing';
import { BoundedBoardDrawing } from './BoundedBoardDrawing';
import { BoundedGameRender } from './BoundedGameRender';
import { GameRender } from './GameRender';
import { FaPlay, FaBrush, FaArrowsAlt, FaSearch, FaEraser, FaLine, FaBox, FaEllipsisH, FaUndo, FaRedo, FaHammer } from "react-icons/fa"
import { hasDuplicates, removeDuplicates } from '../functions/utilityFunctions';
import { LayeredCanvas } from './LayeredCanvas';
import { renderBoard } from '../functions/drawing';
import { useCanvasUpdater } from '../functions/useCanvasUpdater';




export const BoundedGameBoard = ({ boardData }: { boardData: StatefulData<Vector2[]> }) => {
  enum EditorEditMode { MOVE, ZOOM, DRAW, ERASE, BOX, LINE, ELLIPSE };
  const boardHolder = useRef<HTMLDivElement>(null);
  const ghostCanvas = useRef<HTMLCanvasElement>(null);
  const [cursor, setCursor] = useState<string>('');
  
  const [view, setView] = useState<View>(new View(new Vector2(0, 0), 10));
  const [board, setBoard] = boardData;
  const [rendering, setRendering] = useState<boolean>(false);
  const [bounds, setBounds] = useState<Dimension>(new Dimension(400, 400));
  const [ghostTilePositions, setGhostTilePositions] = useState<Vector2[]>([]);
  const [lastHoveredCell, setLastHoveredCell] = useState<Vector2>(Vector2.zero);
  const isPointerDown: MutableRefObject<boolean> = useIsPointerDown(boardHolder);

  useEffect( () => {
    const canvas: HTMLCanvasElement | null = ghostCanvas.current;
    if (canvas !== null) {
      const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
      if (context !== null) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.globalAlpha = 0.5;
        renderBoard(canvas, context, view, ghostTilePositions.concat(lastHoveredCell))
      }
    }
  }, [ghostTilePositions, lastHoveredCell])

  function getCurrentHoveredCell(event: PointerEvent<Element>) {
    return boardHolder.current !== null ? getHoveredCell(pointerPositionInElement(event, boardHolder.current), view) : lastHoveredCell;
  }

  function getEditorData(): EditorData {
    return {
      boardData: [board, setBoard],
      viewData: [view, setView],
      ghostTilePositions: [ghostTilePositions, setGhostTilePositions],
      lastHoveredCell: lastHoveredCell,
      getHoveredCell: getCurrentHoveredCell,
      isPointerDown: isPointerDown.current
    }
  }
  
  const [editMode, setEditMode] = useState<EditorEditMode>(EditorEditMode.MOVE);
  const editorModes: MutableRefObject<{[key in EditorEditMode]: EditMode}> = useRef({ 
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
    if (!lastHoveredCell.equals(currentHoveredCell)) {
      setLastHoveredCell(currentHoveredCell)
    }
  }
  
  function onPointerDown(event: PointerEvent<Element>) {
    editorModes.current[editMode].setEditorData(getEditorData())
    editorModes.current[editMode].onPointerDown?.(event);
    const currentHoveredCell = getCurrentHoveredCell(event)
    if (!lastHoveredCell.equals(currentHoveredCell)) {
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

  useCanvasUpdater(ghostCanvas)

  return (
    <div>
      <div style={{cursor: cursor}} ref={boardHolder} className="board-holder" onWheel={onWheel} onPointerMove={onPointerMove} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerLeave={onPointerLeave} onKeyDown={onKeyDown} onKeyUp={onKeyUp} tabIndex={0} >
        <LayeredCanvas>
          {rendering ?<BoundedGameRender start={board} view={view} bounds={bounds.toBox()}  />  : <BoundedBoardDrawing bounds={bounds.toBox()} view={view} board={board} />}
          <canvas style={{}} className="board-drawing" ref={ghostCanvas} />
        </LayeredCanvas>
      </div>

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
    </div>
  )
}
