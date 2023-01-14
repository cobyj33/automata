import React from "react"

import {Box } from 'interfaces/Box';
import { IVector2, Vector2 } from 'interfaces/Vector2';
import { View } from 'interfaces/View';
import { StatefulData } from 'interfaces/StatefulData';

import { EditMode } from "automata/editor/main";
import { BoxEditMode, DrawEditMode, EllipseEditMode, LineEditMode, MoveEditMode, ZoomEditMode, EraseEditMode } from 'automata/editor/bounded';

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
import { EditorData, LifeLikeEditorData } from "interfaces/EditorData";


type EditorEditMode = "MOVE" | "ZOOM" | "DRAW" | "ERASE" | "BOX" | "LINE" | "ELLIPSE";

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
  const currentHoveredCell = React.useRef<Vector2>(new Vector2(0, 0))
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

  function getEditorData(): LifeLikeEditorData {
    return {
      boardData: [board, setBoard],
      boundsData: [bounds, setBounds],
      viewData: [view, setView],
      ghostTilePositions: [ghostTilePositions, setGhostTilePositions],
      lastHoveredCell: lastHoveredCell,
      currentHoveredCell: currentHoveredCell.current,
      isPointerDown: isPointerDown.current,
      isRendering: rendering
    }
  }
  
  const [editMode, setEditMode] = React.useState<EditorEditMode>("MOVE");
  const editorModes: React.MutableRefObject<{[key in EditorEditMode]: EditMode<LifeLikeEditorData> | EditMode<EditorData>}> = React.useRef({ 
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

  function updateHoveredCellData(event: React.PointerEvent<Element>) {
    setLastHoveredCell(currentHoveredCell.current)
    currentHoveredCell.current = getCurrentHoveredCell(event)
  }


  function onPointerMove(event: React.PointerEvent<Element>) {
    updateHoveredCellData(event)
    editorModes.current[editMode].sendUpdatedEditorData(getEditorData())
    editorModes.current[editMode].onPointerMove?.(event);
  }
  
  function onPointerDown(event: React.PointerEvent<Element>) {
    updateHoveredCellData(event)
    editorModes.current[editMode].sendUpdatedEditorData(getEditorData())
    editorModes.current[editMode].onPointerDown?.(event);
  }
  
  function onPointerUp(event: React.PointerEvent<Element>) {
    updateHoveredCellData(event)
    editorModes.current[editMode].sendUpdatedEditorData(getEditorData())
    editorModes.current[editMode].onPointerUp?.(event);
  }

  function onPointerLeave(event: React.PointerEvent<Element>) {
    updateHoveredCellData(event)
    editorModes.current[editMode].sendUpdatedEditorData(getEditorData())
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
    editorModes.current[editMode].sendUpdatedEditorData(getEditorData())
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
    editorModes.current[editMode].sendUpdatedEditorData(getEditorData())
    editorModes.current[editMode].onKeyUp?.(event);
  }

  function onWheel(event: React.WheelEvent<Element>) {
    editorModes.current[editMode].sendUpdatedEditorData(getEditorData())
    editorModes.current[editMode].onWheel?.(event);
  }

  function getSelectedEditButtonStyles(condition: boolean): string {
    return `${gameBoardStyles["edit-button"]} ${condition ? gameBoardStyles["selected"] : ""}`
  }

  function EditModeButton({ children = "", mode }: { mode: EditorEditMode, children?: React.ReactNode }) {
    return <button className={getSelectedEditButtonStyles(editMode === mode)} onClick={() => setEditMode(mode)}>{children}</button>
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
            <EditModeButton mode="DRAW"> <FaBrush /> </EditModeButton>
            <EditModeButton mode="MOVE"> <FaArrowsAlt /> </EditModeButton>
            <EditModeButton mode="ZOOM"> <FaSearch /> </EditModeButton>
            <EditModeButton mode="ERASE"> <FaEraser /> </EditModeButton>
            <EditModeButton mode="LINE"> <GiStraightPipe /> </EditModeButton>
            <EditModeButton mode="BOX"> <FaBox /> </EditModeButton>
            <EditModeButton mode="ELLIPSE"> <BsCircle /> </EditModeButton>
            <button className={getSelectedEditButtonStyles(rendering)} onClick={() => setRendering(!rendering)}> <FaPlay /> </button>
            <button className={`${gameBoardStyles["edit-button"]}`} onClick={clear}> <AiOutlineClear /> </button>
            <button className={gameBoardStyles["edit-button"]} onClick={undo}> <FaUndo /> </button>
            <button className={gameBoardStyles["edit-button"]} onClick={redo}> <FaRedo /> </button>
          </div>
      </div>

    </div>
  )
}

export default LifeLikeEditor