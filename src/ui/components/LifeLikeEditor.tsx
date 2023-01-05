import React from "react"
import { ChangeEvent, KeyboardEvent, MutableRefObject, PointerEvent, RefObject, useCallback, useEffect, useRef, useState, WheelEvent } from 'react'

import { StatefulData } from 'interfaces/StatefulData';
import { Vector2 } from 'interfaces/Vector2';
import { View } from 'interfaces/View';
import { EditMode } from "automata/editor/main";


import { BoxEditMode, BoxData, DrawEditMode, DrawData, EllipseEditMode, EllipseData, LineEditMode, LineData, MoveEditMode, MoveData, ZoomEditMode, ZoomData, EraseEditMode, EraseData } from 'automata/editor/bounded';

import { getHoveredCell, pointerPositionInElement } from 'functions/editorFunctions';
import { useHistory, useIsPointerDown, useWebGL2CanvasUpdater } from 'functions/hooks';

import LifeRuleEditor from "ui/components/LifeRuleEditor"
import { BoundedBoardDrawing } from 'ui/components/BoundedBoardDrawing';
import { BoundedGameRender, RenderData } from 'ui/components/BoundedGameRender';
import LayeredCanvas from 'ui/components/LayeredCanvas';

import { FaPlay, FaBrush, FaArrowsAlt, FaSearch, FaEraser, FaUndo, FaRedo } from "react-icons/fa"
import { GiStraightPipe } from "react-icons/gi"
import { BsCircle } from "react-icons/bs"
import { AiOutlineClear } from "react-icons/ai"
import { BiRectangle } from "react-icons/bi"

import { renderBoard } from 'functions/drawing';
import { Box } from 'interfaces/Box';

import gameBoardStyles from "ui/components/styles/GameBoard.module.css"

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

type EditorEditMode = "MOVE" | "ZOOM" | "DRAW" | "ERASE" | "BOX" | "LINE" | "ELLIPSE";
type UnionData = MoveData | ZoomData | DrawData | EraseData | BoxData | LineData | EllipseData | EditorData;



export const LifeLikeEditor = ({ boardData }: { boardData: StatefulData<Vector2[]> }) => {
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
  
  const [editMode, setEditMode] = useState<EditorEditMode>("MOVE");
  const editorModes: MutableRefObject<{[key in EditorEditMode]: EditMode<UnionData>}> = useRef({ 
    "DRAW": new DrawEditMode(getEditorData()),
    "ZOOM": new ZoomEditMode(getEditorData()),
    "MOVE": new MoveEditMode(getEditorData()),
    "ERASE": new EraseEditMode(getEditorData()),
    "LINE": new LineEditMode(getEditorData()),
    "BOX": new BoxEditMode(getEditorData()),
    "ELLIPSE": new EllipseEditMode(getEditorData())
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

  function clear() {
    setBoard([]);
  }

  function toggleRender() {
    setRendering(!rendering)
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
      toggleRender()
    } else if (event.code === 'KeyC') {
      clear()
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

  function selectedButtonStyle(type: EditorEditMode) {
    return editMode === type ? gameBoardStyles["selected"] : ""
  }

  useWebGL2CanvasUpdater(ghostCanvas)

  return (
    <div className={gameBoardStyles["editor"]}>

      <div style={{cursor: cursor}} ref={boardHolder} className={gameBoardStyles["board-holder"]} onWheel={onWheel} onPointerMove={onPointerMove} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerLeave={onPointerLeave} onKeyDown={onKeyDown} onKeyUp={onKeyUp} tabIndex={0} >
        <LayeredCanvas>
          {rendering ? 
              <div>
                  <BoundedGameRender automata={automata} start={board} view={view} bounds={bounds} getData={(data) => setRenderData(data)} /> 
                    <div className={gameBoardStyles['render-info']}>
                        <p> Current Generation: { renderData.generation } </p>
                    </div>
              </div>
           : <BoundedBoardDrawing bounds={bounds} view={view} board={board} />}
          <canvas className={gameBoardStyles["board-drawing"]} ref={ghostCanvas} />
        </LayeredCanvas>
      </div>

      <aside className={gameBoardStyles["left-side-bar"]}>
        <LifeRuleEditor lifeRule={[automata, setAutomata]} />
      </aside>

      <aside className={gameBoardStyles["right-side-bar"]}>
          <div className={gameBoardStyles["filler"]}> W.I.P... </div>
      </aside>

      <div className={gameBoardStyles["tool-bar"]}>
          <div className={gameBoardStyles["editing-buttons"]}> 
            <button className={`${gameBoardStyles["edit-button"]} ${selectedButtonStyle("DRAW")}`} onClick={() => setEditMode("DRAW")}> <FaBrush /> </button>
            <button className={`${gameBoardStyles["edit-button"]} ${selectedButtonStyle("MOVE")}`} onClick={() => setEditMode("MOVE")}> <FaArrowsAlt /> </button>
            <button className={`${gameBoardStyles["edit-button"]} ${selectedButtonStyle("ZOOM")}`} onClick={() => setEditMode("ZOOM")}> <FaSearch /> </button>
            <button className={`${gameBoardStyles["edit-button"]} ${selectedButtonStyle("ERASE")}`} onClick={() => setEditMode("ERASE")}> <FaEraser /> </button>
            <button className={`${gameBoardStyles["edit-button"]} ${selectedButtonStyle("LINE")}`} onClick={() => setEditMode("LINE")}> <GiStraightPipe /> </button>
            <button className={`${gameBoardStyles["edit-button"]} ${selectedButtonStyle("BOX")}`} onClick={() => setEditMode("BOX")}> <BiRectangle /> </button>
            <button className={`${gameBoardStyles["edit-button"]} ${selectedButtonStyle("ELLIPSE")}`} onClick={() => setEditMode("ELLIPSE")}> <BsCircle /> </button>
            <button className={`${gameBoardStyles["edit-button"]} ${rendering ? gameBoardStyles['selected'] : '' }`} onClick={() => setRendering(!rendering)}> <FaPlay /> </button>
            <button className={gameBoardStyles["edit-button"]} onClick={clear}> <AiOutlineClear /> </button>
            <button className={gameBoardStyles["edit-button"]} onClick={undo}> <FaUndo /> </button>
            <button className={gameBoardStyles["edit-button"]} onClick={redo}> <FaRedo /> </button>
          </div>
      </div>

    </div>
  )
}

export default LifeLikeEditor