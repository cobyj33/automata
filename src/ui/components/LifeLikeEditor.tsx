import React from "react"

import {Box } from 'interfaces/Box';
import { IVector2, Vector2 } from 'interfaces/Vector2';
import { View } from 'interfaces/View';
import { StatefulData } from 'interfaces/StatefulData';

import { EditMode } from "automata/editor/main";
import { BoxEditMode, BoxData, DrawEditMode, DrawData, EllipseEditMode, EllipseData, LineEditMode, LineData, MoveEditMode, MoveData, ZoomEditMode, ZoomData, EraseEditMode, EraseData } from 'automata/editor/bounded';

import { renderBoard, withCanvasAndContextWebGL2 } from 'functions/drawing';
import { createLifeString, isValidLifeString, parseLifeLikeString } from 'functions/generationFunctions';
import { getHoveredCell, pointerPositionInElement } from 'functions/editorFunctions';
import { useHistory, useIsPointerDown, useWebGL2CanvasUpdater } from 'functions/hooks';

import LayeredCanvas from 'ui/components/LayeredCanvas';
import { BoundedBoardDrawing } from 'ui/components/BoundedBoardDrawing';
import { BoundedGameRender, RenderData } from 'ui/components/BoundedGameRender';
import LifeRuleEditor from "ui/components/LifeRuleEditor"

import { FaPlay, FaBrush, FaArrowsAlt, FaSearch, FaEraser, FaBox, FaUndo, FaRedo } from "react-icons/fa"
import { GiStraightPipe } from "react-icons/gi"
import { AiOutlineClear } from "react-icons/ai"
import { BsCircle } from "react-icons/bs"

import gameBoardStyles from "ui/components/styles/GameBoard.module.css"


interface EditorData {
    boardData: StatefulData<IVector2[]>;
    boundsData: StatefulData<Box>;
    viewData: StatefulData<View>;
    lastHoveredCell: IVector2;
    isPointerDown: boolean;
    getHoveredCell: (event: React.PointerEvent<Element>) => IVector2;
    ghostTilePositions: StatefulData<IVector2[]>
    isRendering: boolean;
}

type EditorEditMode = "MOVE" | "ZOOM" | "DRAW" | "ERASE" | "BOX" | "LINE" | "ELLIPSE";
type UnionData = MoveData | ZoomData | DrawData | EraseData | BoxData | LineData | EllipseData | EditorData;



export const LifeLikeEditor = ({ boardData }: { boardData: StatefulData<IVector2[]> }) => {
  const boardHolder = React.useRef<HTMLDivElement>(null);
  const ghostCanvas = React.useRef<HTMLCanvasElement>(null);
  const [cursor, setCursor] = React.useState<string>('');
  
    const [view, setView] = React.useState<View>(View.from(0, 0, 10));
    const [renderData, setRenderData] = React.useState<RenderData>({ generation: 0 });

  const [board, setBoard] = boardData;
  const [rendering, setRendering] = React.useState<boolean>(false);
  const [bounds, setBounds] = React.useState<Box>(Box.from(0, 0, 100, 100));
  const [ghostTilePositions, setGhostTilePositions] = React.useState<IVector2[]>([]);
  const [lastHoveredCell, setLastHoveredCell] = React.useState<IVector2>({ row: 0, col: 0 });
  const [automata, setAutomata] = React.useState<string>("B3/S23");
  const isPointerDown: React.MutableRefObject<boolean> = useIsPointerDown(boardHolder);

    React.useEffect( () => {
        if (rendering === false) {
            setRenderData({generation: 0});
        }
    }, [rendering] )

  React.useEffect( () => {
    withCanvasAndContextWebGL2(ghostCanvas, ({ gl }) => {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      renderBoard(gl, view, ghostTilePositions.concat(lastHoveredCell), 0.5);
    })
  }, [ghostTilePositions, lastHoveredCell])

  function getCurrentHoveredCell(event: React.PointerEvent<Element>): Vector2 {
    return getHoveredCell(pointerPositionInElement(event), view).trunc()
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
  
  const [editMode, setEditMode] = React.useState<EditorEditMode>("MOVE");
  const editorModes: React.MutableRefObject<{[key in EditorEditMode]: EditMode<UnionData>}> = React.useRef({ 
    "DRAW": new DrawEditMode(getEditorData()),
    "ZOOM": new ZoomEditMode(getEditorData()),
    "MOVE": new MoveEditMode(getEditorData()),
    "ERASE": new EraseEditMode(getEditorData()),
    "LINE": new LineEditMode(getEditorData()),
    "BOX": new BoxEditMode(getEditorData()),
    "ELLIPSE": new EllipseEditMode(getEditorData())
  });
  
  React.useEffect( () => {
    setCursor(editorModes.current[editMode].cursor());
  }, [editMode])

  function onPointerMove(event: React.PointerEvent<Element>) {
    editorModes.current[editMode].setEditorData(getEditorData())
    editorModes.current[editMode].onPointerMove?.(event);
    const currentHoveredCell = getCurrentHoveredCell(event)
    if (!(lastHoveredCell.row === currentHoveredCell.row && lastHoveredCell.col === currentHoveredCell.col)) {
      setLastHoveredCell(currentHoveredCell)
    }
  }
  
  function onPointerDown(event: React.PointerEvent<Element>) {
    editorModes.current[editMode].setEditorData(getEditorData())
    editorModes.current[editMode].onPointerDown?.(event);
    const currentHoveredCell = getCurrentHoveredCell(event)
    if (!(lastHoveredCell.row === currentHoveredCell.row && lastHoveredCell.col === currentHoveredCell.col)) {
      setLastHoveredCell(currentHoveredCell)
    }
  }
  
  function onPointerUp(event: React.PointerEvent<Element>) {
    editorModes.current[editMode].setEditorData(getEditorData())
    editorModes.current[editMode].onPointerUp?.(event);
  }

  function onPointerLeave(event: React.PointerEvent<Element>) {
    editorModes.current[editMode].setEditorData(getEditorData())
    editorModes.current[editMode].onPointerLeave?.(event);
  }

  function toggleRendering() {
    setRendering(!rendering)
  }

  function clear() {
    setBoard([]);
  }
  
  const [undo, redo] = useHistory(boardData, (first: IVector2[], second: IVector2[]) => first.length === second.length && first.every(cell => second.includes(cell)) )
  function onKeyDown(event: React.KeyboardEvent<Element>) {
    editorModes.current[editMode].setEditorData(getEditorData())
    editorModes.current[editMode].onKeyDown?.(event);

    if (event.code === "KeyZ" && event.shiftKey === true && event.ctrlKey === true) {
      redo();
    } else if (event.code === "KeyZ" && event.ctrlKey === true) {
      undo();
    } else if (event.code === 'Enter') {
      toggleRendering()
    } else if (event.code === 'KeyC') {
      clear()
    }
  }

  function onKeyUp(event: React.KeyboardEvent<Element>) {
    editorModes.current[editMode].setEditorData(getEditorData())
    editorModes.current[editMode].onKeyUp?.(event);
  }

  function onWheel(event: React.WheelEvent<Element>) {
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
            <button className={`${gameBoardStyles["edit-button"]} ${selectedButtonStyle("BOX")}`} onClick={() => setEditMode("BOX")}> <FaBox /> </button>
            <button className={`${gameBoardStyles["edit-button"]} ${selectedButtonStyle("ELLIPSE")}`} onClick={() => setEditMode("ELLIPSE")}> <BsCircle /> </button>
            <button className={`${gameBoardStyles["edit-button"]} ${rendering ? gameBoardStyles['selected'] : '' }`} onClick={() => setRendering(!rendering)}> <FaPlay /> </button>
            <button className={`${gameBoardStyles["edit-button"]}`} onClick={clear}> <AiOutlineClear /> </button>
            <button className={gameBoardStyles["edit-button"]} onClick={undo}> <FaUndo /> </button>
            <button className={gameBoardStyles["edit-button"]} onClick={redo}> <FaRedo /> </button>
          </div>
      </div>

    </div>
  )
}

export default LifeLikeEditor