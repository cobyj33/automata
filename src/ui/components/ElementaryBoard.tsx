import { WheelEvent, useRef, useEffect, MutableRefObject, RefObject, PointerEvent, KeyboardEvent,  useState, ChangeEvent, useReducer } from "react";
import { View } from "interfaces/View"
import { IVector2, Vector2 } from "interfaces/Vector2"
import { BoardDrawing } from "ui/components/BoardDrawing";
import { CellMatrix } from "interfaces/CellMatrix";
import { ElementaryDrawEditMode } from "classes/Editor/EditModes/Elementary/ElementaryDrawEditMode";
import { ElementaryLineEditMode  } from "classes/Editor/EditModes/Elementary/ElementaryLineEditMode";
import { FaPlay, FaBrush, FaArrowsAlt, FaSearch, FaEraser, FaLine, FaUndo, FaRedo } from "react-icons/fa"

import { useCanvasHolderUpdater, useHistory, useIsPointerDown, useWebGL2CanvasUpdater } from "functions/hooks";
import { ElementaryBoardRender, RenderController } from "ui/components/ElementaryBoardRender";
import { StatefulData } from "interfaces/StatefulData"
import { pointerPositionInElement, getHoveredCell } from 'functions/editorFunctions';
import { ZoomEditMode } from 'classes/Editor/EditModes/ZoomEditMode';
import { MoveEditMode } from 'classes/Editor/EditModes/MoveEditMode';
import { EditMode } from 'classes/Editor/EditModes/EditMode';
import { ElementaryEraseEditMode } from 'classes/Editor/EditModes/Elementary/ElementaryEraseEditMode';
import elementaryStyles from 'ui/components/styles/Elementary.module.css'
import { Box } from "interfaces/Box";
import { isEqualNumberArray } from "functions/util";
import { EditorData, ElementaryEditorData } from "interfaces/EditorData";
import { GiStraightPipe } from "react-icons/gi";
import { Dimension2D } from "interfaces/Dimension";
import { isValidElementaryRule } from "functions/generationFunctions";
import { preview } from "vite";
import SubmitButton from "./reuse/SubmitButton";
import ActionButton from "./reuse/ActionButton";
import TextInput from "./reuse/TextInput";
import ToggleButton from "./reuse/ToggleButton";
import SideBarEditorTool from "./reuse/editor/SideBarTool";
import SideBarToolTitle from "./reuse/editor/SideBarToolTitle";
import { getRefBoundingClientRect } from "functions/reactUtil";
import Description from "./reuse/Description";
import { ElementaryEditorEditMode } from "state/elementary";
import ElementaryRuleEditor from "./ElementaryRuleEditor";




export const ElementaryBoard = ({ boardData }: { boardData: StatefulData<number[]> }) => {

    // const [editor, setEditor] = useReducer()

  const [view, setView] = useState<View>(View.from(-5, 0, 50));
  const [board, setBoard] = boardData;

  const boardHolderRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState<string>('');
  const [ghostTilePositions, setGhostTilePositions] = useState<number[]>([]);
  const [rule, setRule] = useState<number>(30);
  // const [lastHoveredCell, setLastHoveredCell] = useState<number>(0);
  
  const currentHoveredCell = useRef<Vector2>(Vector2.ZERO)
  const lastHoveredCell = useRef<Vector2>(Vector2.ZERO)

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
      lastHoveredCell: lastHoveredCell.current,
      currentHoveredCell: currentHoveredCell.current,
      lastHoveredColumn: lastHoveredCell.current.col,
      currentHoveredColumn: currentHoveredCell.current.col,
      isPointerDown: isPointerDown.current,
      isRendering: rendering,
      viewportSize: getViewportSize()
    }
  }
  
  const [editMode, setEditMode] = useState<ElementaryEditorEditMode>("MOVE");

  const editorModes: MutableRefObject<{[key in ElementaryEditorEditMode]: EditMode<ElementaryEditorData> | EditMode<EditorData>}> = useRef({ 
    "DRAW": new ElementaryDrawEditMode(getElementaryEditorData()),
    "ZOOM": new ZoomEditMode(getElementaryEditorData()),
    "MOVE": new MoveEditMode(getElementaryEditorData()),
    "ERASE": new ElementaryEraseEditMode(getElementaryEditorData()),
    "LINE": new ElementaryLineEditMode(getElementaryEditorData()),
  });
  
  useEffect( () => {
    setCursor(editorModes.current[editMode].cursor());
  }, [editMode])

  function updateHoveredCellData(event: PointerEvent<Element>) {
    lastHoveredCell.current = currentHoveredCell.current
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
              <BoardDrawing board={CellMatrix.fromNumberMatrix([board], Vector2.ZERO)} view={view} bounds={Box.from(0, 0, board.length, 1)} />
          }
      </div>

      <aside className={elementaryStyles["left-side-bar"]}>
        <div className="flex flex-col absolute insets-0 overflow-auto max-w-100 max-h-100 gap-1">
            <ElementaryRuleEditor rule={rule} onRuleRequest={(newRule) => setRule(newRule)} />
            <SideBarEditorTool>
                <SideBarToolTitle>W.I.P...</SideBarToolTitle>
            </SideBarEditorTool>
        </div>
      </aside>

      <aside className={elementaryStyles["right-side-bar"]}>
        <div className="flex flex-col absolute insets-0 overflow-auto max-w-100 max-h-100 gap-1">
            <SideBarEditorTool>
                <SideBarToolTitle>W.I.P...</SideBarToolTitle>
            </SideBarEditorTool>
        </div>
      </aside>


      <div className={elementaryStyles["tool-bar"]}>

        <div className="flex flex-row justify-center gap-1 items-center"> 
            <EditModeButton target="DRAW" current={editMode} setter={setEditMode}> <FaBrush /> </EditModeButton>
            <EditModeButton target="MOVE" current={editMode} setter={setEditMode}> <FaArrowsAlt /> </EditModeButton>
            <EditModeButton target="ZOOM" current={editMode} setter={setEditMode}> <FaSearch /> </EditModeButton>
            <EditModeButton target="ERASE" current={editMode} setter={setEditMode}> <FaEraser /> </EditModeButton>
            <EditModeButton target="LINE" current={editMode} setter={setEditMode}> <GiStraightPipe /> </EditModeButton>
            <ToggleButton selected={rendering} onClick={() => setRendering(!rendering)}> <FaPlay /> </ToggleButton>
            <ActionButton onClick={undo}> <FaUndo /> </ActionButton>
            <ActionButton onClick={redo}> <FaRedo /> </ActionButton>
        </div>

      </div>


      </div>
    )
}

function EditModeButton({ children = "", target, current, setter }: { children?: React.ReactNode, target: ElementaryEditorEditMode, current: ElementaryEditorEditMode, setter: React.Dispatch<ElementaryEditorEditMode> }) {
  return <ToggleButton selected={current === target} onClick={() => setter(target)}>{children}</ToggleButton>
}


interface ElementaryRuleEditorData {
    previewStart: number[],
    rule: number,
    requestedRule: number
}




export default ElementaryBoard