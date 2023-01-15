import React, { useEffect } from "react"

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
import { Dimension2D } from "interfaces/Dimension";


type LifeLikeEditorEditMode = "MOVE" | "ZOOM" | "DRAW" | "ERASE" | "BOX" | "LINE" | "ELLIPSE";

export const LifeLikeEditor = ({ boardData }: { boardData: StatefulData<IVector2[]> }) => {
  const boardHolderRef = React.useRef<HTMLDivElement>(null);
  const ghostCanvas = React.useRef<HTMLCanvasElement>(null);
  const [cursor, setCursor] = React.useState<string>('');
  
    const [view, setView] = React.useState<View>(View.from(0, 0, 10));
    const [renderData, setRenderData] = React.useState<RenderData>({ generation: 0 });

  const [board, setBoard] = boardData;
  const [rendering, setRendering] = React.useState<boolean>(false);
  const [bounds, setBounds] = React.useState<Box>(Box.from(0, 0, 100, 100));
  const [ghostTilePositions, setGhostTilePositions] = React.useState<IVector2[]>([]);
  const [lastHoveredCell, setLastHoveredCell] = React.useState<IVector2>({ row: 0, col: 0 });
  const currentHoveredCell = React.useRef<Vector2>(Vector2.ZERO)
  const [automata, setAutomata] = React.useState<string>("B3/S23");
  const [editMode, setEditMode] = React.useState<LifeLikeEditorEditMode>("MOVE");
  const isPointerDown: React.MutableRefObject<boolean> = useIsPointerDown(boardHolderRef);

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

  function getViewportSize(): Dimension2D {
    const boardHolder = boardHolderRef.current
    if (boardHolder !== null && boardHolder !== undefined) {
      const rect: DOMRect = boardHolder.getBoundingClientRect()
      return new Dimension2D(rect.width, rect.height)
    }
    return Dimension2D.ZERO
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
      isRendering: rendering,
      viewportSize: getViewportSize()
    }
  }
  
  const editorModes: React.MutableRefObject<{[key in LifeLikeEditorEditMode]: EditMode<LifeLikeEditorData> | EditMode<EditorData>}> = React.useRef({ 
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
    isPointerDown.current = true
    editorModes.current[editMode].sendUpdatedEditorData(getEditorData())
    editorModes.current[editMode].onPointerDown?.(event);
  }
  
  function onPointerUp(event: React.PointerEvent<Element>) {
    updateHoveredCellData(event)
    isPointerDown.current = false
    editorModes.current[editMode].sendUpdatedEditorData(getEditorData())
    editorModes.current[editMode].onPointerUp?.(event);
  }

  function onPointerLeave(event: React.PointerEvent<Element>) {
    updateHoveredCellData(event)
    isPointerDown.current = false
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

  useWebGL2CanvasUpdater(ghostCanvas)

  return (
    <div className={gameBoardStyles["editor"]}>

      <div style={{cursor: cursor}} ref={boardHolderRef} className={gameBoardStyles["board-holder"]} onWheel={onWheel} onPointerMove={onPointerMove} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerLeave={onPointerLeave} onKeyDown={onKeyDown} onKeyUp={onKeyUp} tabIndex={0} >
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
            <EditModeButton target="DRAW" current={editMode} setter={setEditMode}> <FaBrush /> </EditModeButton>
            <EditModeButton target="MOVE" current={editMode} setter={setEditMode}> <FaArrowsAlt /> </EditModeButton>
            <EditModeButton target="ZOOM" current={editMode} setter={setEditMode}> <FaSearch /> </EditModeButton>
            <EditModeButton target="ERASE" current={editMode} setter={setEditMode}> <FaEraser /> </EditModeButton>
            <EditModeButton target="LINE" current={editMode} setter={setEditMode}> <GiStraightPipe /> </EditModeButton>
            <EditModeButton target="BOX" current={editMode} setter={setEditMode}> <FaBox /> </EditModeButton>
            <EditModeButton target="ELLIPSE" current={editMode} setter={setEditMode}> <BsCircle /> </EditModeButton>
            <EditToggleButton selected={rendering} onClick={() => setRendering(!rendering)}> <FaPlay /> </EditToggleButton>
            <EditButton onClick={clear}> <AiOutlineClear /> </EditButton>
            <EditButton onClick={undo}> <FaUndo /> </EditButton>
            <EditButton onClick={redo}> <FaRedo /> </EditButton>
          </div>
      </div>

    </div>
  )
}

function getSelectedStyles(condition: boolean): string {
  return condition ? gameBoardStyles["selected"] : ""
}

interface EditButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
function EditButton(props: EditButtonProps) {
  return <button className={gameBoardStyles["edit-button"]} {...props} />
}

interface ToggleEditButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected: boolean
}

function EditToggleButton({ selected, ...props }: ToggleEditButtonProps) {
  return <button className={`${gameBoardStyles["edit-button"]} ${getSelectedStyles(selected)}`} {...props} />
}

function EditModeButton({ children = "", target, current, setter }: { children?: React.ReactNode, target: LifeLikeEditorEditMode, current: LifeLikeEditorEditMode, setter: React.Dispatch<LifeLikeEditorEditMode> }) {
  return <EditToggleButton selected={current === target} onClick={() => setter(target)}>{children}</EditToggleButton>
}


export default LifeLikeEditor