import { WheelEvent, useRef, useEffect, MutableRefObject, RefObject, PointerEvent, KeyboardEvent,  useState, ChangeEvent, useReducer } from "react";
import { View } from "common/View"
import { IVector2, Vector2 } from "common/Vector2"
import { BoardDrawing } from "ui/components/BoardDrawing";
import { CellMatrix } from "common/CellMatrix";
import { ElementaryDrawEditMode } from "editModes/elementary/ElementaryDrawEditMode";
import { ElementaryLineEditMode  } from "editModes/elementary/ElementaryLineEditMode";
import { FaPlay, FaBrush, FaArrowsAlt, FaSearch, FaEraser, FaLine, FaUndo, FaRedo } from "react-icons/fa"

import { useCanvasHolderUpdater, useHistory, useIsPointerDown, useWebGL2CanvasUpdater } from "common/hooks";
import { ElementaryBoardRender, RenderController } from "ui/components/ElementaryBoardRender";
import { StatefulData } from "common/StatefulData"
import { pointerPositionInElement, getHoveredCell } from 'common/editorFunctions';
import { ElementaryZoomEditMode } from 'editModes/elementary/ElementaryZoomEditMode';
import { ElementaryMoveEditMode } from 'editModes/elementary/ElementaryMoveEditMode';
import { EditMode } from 'editModes/EditMode';
import { ElementaryEraseEditMode } from 'editModes/elementary/ElementaryEraseEditMode';
import elementaryStyles from 'ui/components/styles/Elementary.module.css'
import { Box } from "common/Box";
import { isEqualNumberArray } from "common/util";
import { EditorData, ElementaryEditorData } from "common/EditorData";
import { GiStraightPipe } from "react-icons/gi";
import { Dimension2D } from "common/Dimension";
import { isValidElementaryRule } from "common/generationFunctions";
import { preview } from "vite";
import SubmitButton from "./reuse/SubmitButton";
import ActionButton from "./reuse/ActionButton";
import TextInput from "./reuse/TextInput";
import ToggleButton from "./reuse/ToggleButton";
import SideBarEditorTool from "./reuse/editor/SideBarEditorTool";
import SideBarToolTitle from "./reuse/editor/SideBarToolTitle";
import { getRefBoundingClientRect } from "common/reactUtil";
import Description from "./reuse/Description";
import { ElementaryEditorEditMode } from "state/elementary";
import ElementaryRuleEditor from "./ElementaryRuleEditor";
import SideBarToolContainer from "ui/components/reuse/editor/SideBarToolContainer";




export const ElementaryBoard = ({ boardData }: { boardData: StatefulData<number[]> }) => {

    // const [editor, setEditor] = useReducer()

  const [view, setView] = useState<View>(View.from(-5, 0, 50));
  const [board, setBoard] = boardData;

  const boardHolderRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState<string>('');
  const [ghostTilePositions, setGhostTilePositions] = useState<number[]>([]);
  const [rule, setRule] = useState<number>(30);
  const [lastHoveredCell, setLastHoveredCell] = useState<Vector2>(Vector2.ZERO);
  
  const currentHoveredCell = useRef<Vector2>(Vector2.ZERO)

  const isPointerDown: MutableRefObject<boolean> = useIsPointerDown(boardHolderRef);
  const [rendering, setRendering] = useState<boolean>(false);  

  function getCurrentHoveredCell(event: PointerEvent<Element>): Vector2 {
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

  function getElementaryEditorData(): ElementaryEditorData {
    return {
      boardData: [board, setBoard],
      viewData: [view, setView],
      ghostTilePositions: [ghostTilePositions, setGhostTilePositions],
      lastHoveredCell: lastHoveredCell,
      currentHoveredCell: currentHoveredCell.current,
      lastHoveredColumn: lastHoveredCell.col,
      currentHoveredColumn: currentHoveredCell.current.col,
      isPointerDown: isPointerDown.current,
      isRendering: rendering,
      viewportSize: getViewportSize()
    }
  }

  useEffect(() => {
    if (rendering === false) {
        const viewportSize = getViewportSize()
        const verticalCells = viewportSize.height / view.cellSize;
        setView(view => view.withPosition(new Vector2(-verticalCells / 2, view.col)));
    }
  }, [rendering])
  
  const [editMode, setEditMode] = useState<ElementaryEditorEditMode>("MOVE");

  const editorModes: MutableRefObject<{[key in ElementaryEditorEditMode]: EditMode<ElementaryEditorData> | EditMode<EditorData>}> = useRef({ 
    "DRAW": new ElementaryDrawEditMode(getElementaryEditorData()),
    "ZOOM": new ElementaryZoomEditMode(getElementaryEditorData()),
    "MOVE": new ElementaryMoveEditMode(getElementaryEditorData()),
    "ERASE": new ElementaryEraseEditMode(getElementaryEditorData()),
    "LINE": new ElementaryLineEditMode(getElementaryEditorData()),
  });
  
  useEffect( () => {
    setCursor(editorModes.current[editMode].cursor());
  }, [editMode])

  function updateHoveredCellData(event: PointerEvent<Element>) {
    setLastHoveredCell(currentHoveredCell.current)
    currentHoveredCell.current = getCurrentHoveredCell(event)
  }

  function onPointerMove(event: PointerEvent<Element>) {
    updateHoveredCellData(event)
    editorModes.current[editMode].sendUpdatedEditorData(getElementaryEditorData())
    editorModes.current[editMode].onPointerMove?.(event);
  }
  
  function onPointerDown(event: PointerEvent<Element>) {
    updateHoveredCellData(event)
    isPointerDown.current = true
    editorModes.current[editMode].sendUpdatedEditorData(getElementaryEditorData())
    editorModes.current[editMode].onPointerDown?.(event);
  }
  
  function onPointerUp(event: PointerEvent<Element>) {
    updateHoveredCellData(event)
    isPointerDown.current = false
    editorModes.current[editMode].sendUpdatedEditorData(getElementaryEditorData())
    editorModes.current[editMode].onPointerUp?.(event);
  }

  function onPointerLeave(event: PointerEvent<Element>) {
    updateHoveredCellData(event)
    isPointerDown.current = false
    editorModes.current[editMode].sendUpdatedEditorData(getElementaryEditorData())
    editorModes.current[editMode].onPointerLeave?.(event);
  }

  function toggleRendering() {
    setRendering(!rendering)
  }

  function clear() {
    setBoard(new Array<number>(board.length).fill(0));
  }
  
  const [undo, redo] = useHistory([board, setBoard], isEqualNumberArray);
  function onKeyDown(event: KeyboardEvent<Element>) {
    editorModes.current[editMode].sendUpdatedEditorData(getElementaryEditorData())
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

  function onKeyUp(event: KeyboardEvent<Element>) {
    editorModes.current[editMode].sendUpdatedEditorData(getElementaryEditorData())
    editorModes.current[editMode].onKeyUp?.(event);
  }

  function onWheel(event: WheelEvent<Element>) {
    editorModes.current[editMode].sendUpdatedEditorData(getElementaryEditorData())
    editorModes.current[editMode].onWheel?.(event);
  }

  

  // useCanvasUpdater(ghostCanvas)
    
    return (
    <div className={elementaryStyles["editor"]}  >
      <div className={elementaryStyles["board-holder"]} ref={boardHolderRef} style={{cursor: cursor}} onWheel={onWheel} onPointerMove={onPointerMove} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerLeave={onPointerLeave} onKeyDown={onKeyDown} onKeyUp={onKeyUp} tabIndex={0}>       
          { rendering ? <ElementaryBoardRender view={view} start={board} rule={rule} /> : 
              <BoardDrawing board={CellMatrix.fromNumberMatrix([board], Vector2.ZERO).toVector2List().concat(...CellMatrix.fromNumberMatrix([ghostTilePositions], Vector2.ZERO).toVector2List().concat(lastHoveredCell.colcomp()))} view={view} bounds={Box.from(0, 0, board.length, 1)} />
          }
      </div>

      <aside className={elementaryStyles["left-side-bar"]}>
        <SideBarToolContainer>
            <ElementaryRuleEditor rule={rule} onRuleRequest={(newRule) => setRule(newRule)} />
            <SideBarEditorTool title={`W.I.P...`} />
        </SideBarToolContainer>
      </aside>

      <aside className={elementaryStyles["right-side-bar"]}>
        <SideBarToolContainer>
            <SideBarEditorTool title={`Editor Data`}>
                <div className={elementaryStyles["view-data"]}>
                    <Description>{` View ( Row: ${view.position.row.toFixed(1)} Col: ${view.position.col.toFixed(1)} ) `}</Description>
                    <Description>{` View CellSize: ${view.cellSize} `}</Description> 
                    <Description>{` Hovering: ( Row: ${currentHoveredCell.current.row} Col: ${currentHoveredCell.current.col} ) `}</Description>
                </div>
            </SideBarEditorTool>
            <SideBarEditorTool title={`W.I.P...`} />
        </SideBarToolContainer>
      </aside>


      <div className={elementaryStyles["tool-bar"]}>

        <div className="absolute left-0 top-0 overflow-auto max-w-full max-h-full w-full h-full py-2 px-1 flex flex-row flex-start gap-1 items-stretch"> 
            <ToggleButton className="flex-grow flex items-center justify-center" selected={editMode === "DRAW"} onClick={() => setEditMode("DRAW")}> <FaBrush /> </ToggleButton>
            <ToggleButton className="flex-grow flex items-center justify-center" selected={editMode === "MOVE"} onClick={() => setEditMode("MOVE")}>  <FaArrowsAlt /> </ToggleButton>
            <ToggleButton className="flex-grow flex items-center justify-center" selected={editMode === "ZOOM"} onClick={() => setEditMode("ZOOM")}>  <FaSearch /> </ToggleButton>
            <ToggleButton className="flex-grow flex items-center justify-center" selected={editMode === "ERASE"} onClick={() => setEditMode("ERASE")}>  <FaEraser /> </ToggleButton>
            <ToggleButton className="flex-grow flex items-center justify-center" selected={editMode === "LINE"} onClick={() => setEditMode("LINE")}>  <GiStraightPipe /> </ToggleButton>
            <ToggleButton className="flex-grow flex items-center justify-center" selected={rendering} onClick={() => setRendering(!rendering)}> <FaPlay /> </ToggleButton>
            <ActionButton className="flex-grow flex items-center justify-center" onClick={undo}> <FaUndo /> </ActionButton>
            <ActionButton className="flex-grow flex items-center justify-center" onClick={redo}> <FaRedo /> </ActionButton>
        </div>

      </div>


      </div>
    )
}


interface ElementaryRuleEditorData {
    previewStart: number[],
    rule: number,
    requestedRule: number
}




export default ElementaryBoard