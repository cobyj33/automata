import React, { useEffect } from "react"

import {Box } from 'common/Box';
import { IVector2, Vector2 } from 'common/Vector2';
import { View } from 'common/View';
import { StatefulData } from 'common/StatefulData';

import { EditMode } from "editModes/EditMode"
import { BoxEditMode, DrawEditMode, EllipseEditMode, LineEditMode, MoveEditMode, ZoomEditMode, EraseEditMode } from "editModes/lifeLike/LifeLikeEditModes";

import { renderBoard, withCanvasAndContextWebGL2 } from 'common/drawing';
import { createLifeString, isValidLifeString, isValidPatternText, parseLifeLikeString, parsePatternText } from 'common/generationFunctions';
import { getHoveredCell, pointerPositionInElement } from 'common/editorFunctions';
import { useCanvasHolderUpdater, useHistory, useIsPointerDown, useWebGL2CanvasUpdater } from 'common/hooks';

import { BoardDrawing } from 'ui/components/BoardDrawing';
import { LifeLikeGameRender, RenderData } from 'ui/components/LifeLikeGameRender';
import LifeRuleEditor from "ui/components/LifeRuleEditor"

import { FaPlay, FaBrush, FaArrowsAlt, FaSearch, FaEraser, FaBox, FaUndo, FaRedo } from "react-icons/fa"
import { GiStraightPipe } from "react-icons/gi"
import { AiOutlineClear } from "react-icons/ai"
import { BsCircle } from "react-icons/bs"

import gameBoardStyles from "ui/components/styles/GameBoard.module.css"
import { EditorData, LifeLikeEditorData } from "common/EditorData";
import { Dimension2D } from "common/Dimension";
import TextAreaInput from "./reuse/TextAreaInput";
import ActionButton from "./reuse/ActionButton";
import ToggleButton from "./reuse/ToggleButton";
import SideBarEditorTool from "./reuse/editor/SideBarEditorTool";
import Description from "./reuse/Description";
import SideBarToolTitle from "./reuse/editor/SideBarToolTitle";
import { DIAGRAM_NAMES, getDiagram } from "data";
import { LifeLikeEditorEditMode } from "state/lifelike";
import SideBarToolContainer from "ui/components/reuse/editor/SideBarToolContainer";




export const LifeLikeEditor = ({ boardData }: { boardData: StatefulData<IVector2[]> }) => {
  const boardHolderRef = React.useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = React.useState<string>('');
  
    const [view, setView] = React.useState<View>(View.from(0, 0, 10));
    const [renderData, setRenderData] = React.useState<RenderData>({ generation: 0 });

  const [board, setBoard] = boardData;
  const [rendering, setRendering] = React.useState<boolean>(false);
  const [bounds, setBounds] = React.useState<Box>(Box.from(0, 0, 150, 150));
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

  const [pattern, setPattern] = React.useState<string>("")
  function loadPattern() {
    if (isValidPatternText(pattern)) {
        const cells = parsePatternText(pattern)
        const box = Box.enclosed(cells).setCenter(bounds.center)
        const translatedCells = cells.map(cell => Vector2.fromData(cell)).map(cell => cell.add(box.topleft).trunc())
        setBoard(translatedCells.filter(cell => bounds.pointInside(cell)))
    } else {
        throw new Error("Invalid pattern text: " + pattern)
    }
  }


  return (
    <div className={gameBoardStyles["editor"]}>

      <div style={{cursor: cursor}} ref={boardHolderRef} className={gameBoardStyles["board-holder"]} onWheel={onWheel} onPointerMove={onPointerMove} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerLeave={onPointerLeave} onKeyDown={onKeyDown} onKeyUp={onKeyUp} tabIndex={0} >
          {rendering ? 
                <LifeLikeGameRender automata={automata} start={board} view={view} bounds={bounds} getData={(data) => setRenderData(data)} /> 
           : <BoardDrawing bounds={bounds} view={view} board={board.concat(ghostTilePositions).concat(currentHoveredCell.current)} />}
      </div>

      <aside className={gameBoardStyles["left-side-bar"]}>
        <SideBarToolContainer>
            <LifeRuleEditor currentRule={automata} onLifeRuleSelect={(rule) => setAutomata(rule)} />
            <SideBarEditorTool title={`W.I.P...`} />
        </SideBarToolContainer>
      </aside>

      <aside className={gameBoardStyles["right-side-bar"]}>
        <SideBarToolContainer>
            <SideBarEditorTool title={`Editor Data`}>
                <div className={gameBoardStyles["view-data"]}>
                    <Description>{` View ( Row: ${view.position.row.toFixed(1)} Col: ${view.position.col.toFixed(1)} ) `}</Description>
                    <Description>{` View CellSize: ${view.cellSize} `}</Description> 
                    <Description>{` Hovering: ( Row: ${currentHoveredCell.current.row} Col: ${currentHoveredCell.current.col} ) `}</Description>
                </div>
            </SideBarEditorTool>

            <SideBarEditorTool title={`Render Data`}>
                <div className="flex flex-col">
                    <Description> Current Generation: {rendering ? String(renderData.generation) : "0"} </Description>
                </div>
            </SideBarEditorTool>

                
            <SideBarEditorTool title={`Text Pattern Reader`}>
                <div className="flex flex-col">
                    <TextAreaInput valid={isValidPatternText(pattern)} onChange={(e) => setPattern(e.target.value)} value={pattern}></TextAreaInput>
                    <ActionButton onClick={loadPattern}>Load Pattern</ActionButton>
                    <div className="relative overflow-auto border border-black" style={{minHeight: 150}}>
                        <div className="flex-grow grid grid-cols-3 absolute insets-0 overflow-auto max-w-100 max-h-100 gap-1">
                            { DIAGRAM_NAMES.map(namedDiagram => <ToggleButton selected={pattern === getDiagram(namedDiagram)} key={namedDiagram} onClick={() => setPattern(getDiagram(namedDiagram))}><span className="text-xs">{namedDiagram}</span></ToggleButton>)  }
                        </div>
                    </div>
                    
                    <ActionButton onClick={() => setPattern("")}>Clear Pattern</ActionButton>
                </div>
            </SideBarEditorTool>

            <SideBarEditorTool title={`W.I.P...`} />
          </SideBarToolContainer>
      </aside>

      <div className={gameBoardStyles["tool-bar"]}>
          <div className="absolute left-0 top-0 right-0 bottom-0 overflow-auto max-w-full max-h-full w-full h-full py-2 px-1 flex flex-row flex-start gap-1 items-stretch"> 
            <ToggleButton className="flex-grow flex items-center justify-center" selected={editMode === "DRAW"} onClick={() => setEditMode("DRAW")}> <FaBrush /> </ToggleButton>
            <ToggleButton className="flex-grow flex items-center justify-center" selected={editMode === "MOVE"} onClick={() => setEditMode("MOVE")}>  <FaArrowsAlt /> </ToggleButton>
            <ToggleButton className="flex-grow flex items-center justify-center" selected={editMode === "ZOOM"} onClick={() => setEditMode("ZOOM")}>  <FaSearch /> </ToggleButton>
            <ToggleButton className="flex-grow flex items-center justify-center" selected={editMode === "ERASE"} onClick={() => setEditMode("ERASE")}>  <FaEraser /> </ToggleButton>
            <ToggleButton className="flex-grow flex items-center justify-center" selected={editMode === "LINE"} onClick={() => setEditMode("LINE")}>  <GiStraightPipe /> </ToggleButton>
            <ToggleButton className="flex-grow flex items-center justify-center" selected={editMode === "BOX"} onClick={() => setEditMode("BOX")}>  <FaBox /> </ToggleButton>
            <ToggleButton className="flex-grow flex items-center justify-center" selected={editMode === "ELLIPSE"} onClick={() => setEditMode("ELLIPSE")}>  <BsCircle /> </ToggleButton>
            <ToggleButton className="flex-grow flex items-center justify-center" selected={rendering} onClick={() => setRendering(!rendering)}> <FaPlay /> </ToggleButton>
            <ActionButton className="flex-grow flex items-center justify-center" onClick={clear}> <AiOutlineClear /> </ActionButton>
            <ActionButton className="flex-grow flex items-center justify-center" onClick={undo}> <FaUndo /> </ActionButton>
            <ActionButton className="flex-grow flex items-center justify-center" onClick={redo}> <FaRedo /> </ActionButton>
          </div>
      </div>

    </div>
  )
}

function RenderDataDisplay({ label, value }: { label: string, value: string }) {
    return <div className={gameBoardStyles["render-data-display"]}>
        <p className={gameBoardStyles["render-data-label"]}>{label}</p>
        <p className={gameBoardStyles["render-data-value"]}>{value}</p>
    </div>
}




export default LifeLikeEditor