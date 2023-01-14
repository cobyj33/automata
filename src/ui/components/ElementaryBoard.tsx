import { WheelEvent, useRef, useEffect, MutableRefObject, RefObject, PointerEvent, KeyboardEvent,  useState, ChangeEvent } from "react";
import { View } from "interfaces/View"
import { IVector2, Vector2 } from "interfaces/Vector2"
import {BoundedBoardDrawing} from "ui/components/BoundedBoardDrawing";
import { CellMatrix } from "interfaces/CellMatrix";
import { ElementaryDrawEditMode } from "classes/Editor/EditModes/Elementary/ElementaryDrawEditMode";
import { ElementaryLineEditMode  } from "classes/Editor/EditModes/Elementary/ElementaryLineEditMode";
import { FaPlay, FaBrush, FaArrowsAlt, FaSearch, FaEraser, FaLine, FaUndo, FaRedo } from "react-icons/fa"

import { useHistory, useIsPointerDown, useWebGL2CanvasUpdater } from "functions/hooks";
import { ElementaryBoardRender } from "ui/components/ElementaryBoardRender";
import { StatefulData } from "interfaces/StatefulData"
import { pointerPositionInElement, getHoveredCell } from 'functions/editorFunctions';
import { ZoomEditMode } from 'classes/Editor/EditModes/ZoomEditMode';
import { MoveEditMode } from 'classes/Editor/EditModes/MoveEditMode';
import { EditMode } from 'classes/Editor/EditModes/EditMode';
import { ElementaryEraseEditMode } from 'classes/Editor/EditModes/Elementary/ElementaryEraseEditMode';
import elementaryStyles from 'ui/components/styles/Elementary.module.css'
import { Box } from "interfaces/Box";
import { isSameNumberArray } from "functions/util";
import { EditorData, ElementaryEditorData } from "interfaces/EditorData";
import { GiStraightPipe } from "react-icons/gi";


type ElementaryEditorEditMode = "MOVE" | "ZOOM" | "DRAW" | "ERASE" | "LINE"

export const ElementaryBoard = ({ boardData }: { boardData: StatefulData<number[]> }) => {

  const [view, setView] = useState<View>(View.from(-5, 0, 50));
  const [board, setBoard] = boardData;

  const boardHolder = useRef(null);
  const [cursor, setCursor] = useState<string>('');
  const [ghostTilePositions, setGhostTilePositions] = useState<number[]>([]);
  const [rule, setRule] = useState<number>(30);
  // const [lastHoveredCell, setLastHoveredCell] = useState<number>(0);
  const currentHoveredCell = useRef<number>(0);
  const lastHoveredCell = useRef<number>(0)
  const isPointerDown: MutableRefObject<boolean> = useIsPointerDown(boardHolder);
  const [rendering, setRendering] = useState<boolean>(false);  
  const [inputRule, setInputRule] = useState<string>("");

  function getCurrentHoveredCell(event: PointerEvent<Element>): number {
    return Math.trunc(getHoveredCell(pointerPositionInElement(event), view).col)
  }

  function getElementaryEditorData(): ElementaryEditorData {
    return {
      boardData: [board, setBoard],
      viewData: [view, setView],
      ghostTilePositions: [ghostTilePositions, setGhostTilePositions],
      lastHoveredCell: lastHoveredCell.current,
      currentHoveredCell: currentHoveredCell.current,
      isPointerDown: isPointerDown.current,
      isRendering: rendering
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
  
  const [undo, redo] = useHistory([board, setBoard], isSameNumberArray);
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

  function onRuleInputChanged(event: ChangeEvent<Element>) {
    const inputElement = event.target as HTMLInputElement
    const input = Number(inputElement.value)
    setInputRule(inputElement.value);
    if (!isNaN(input)) {

        if (input >= 0 && input <= 255) {
            setRule(input);
        }

    }
  }

  
  // useCanvasUpdater(ghostCanvas)
    
    return (
    <div className={elementaryStyles["editor"]}  >
      <div className={elementaryStyles["board-holder"]} ref={boardHolder} style={{cursor: cursor}} onWheel={onWheel} onPointerMove={onPointerMove} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerLeave={onPointerLeave} onKeyDown={onKeyDown} onKeyUp={onKeyUp} tabIndex={0}>       
          { rendering ? <ElementaryBoardRender view={view} start={board} rule={rule} /> : 
              <BoundedBoardDrawing board={CellMatrix.fromNumberMatrix([board], new Vector2(0, 0))} view={view} bounds={Box.from(0, 0, board.length, 1)} />
          }
      </div>

      <aside className={elementaryStyles["left-side-bar"]}>
        <div className={elementaryStyles["rule-input-area"]}>
            <div className={elementaryStyles["current-rule-display"]}>
              Current Rule: <span className={elementaryStyles["current-rule"]}>{rule}</span>          
            </div>
            <span> Rule must be between 0 and 255 </span>

            <input className={`${elementaryStyles["rule-input"]} ${elementaryStyles[`${Number(inputRule) === rule ? 'valid' : 'invalid'}`]} `} onChange={onRuleInputChanged} value={inputRule}  />
          </div>    
          
        <div className={elementaryStyles["filler"]}> W.I.P... </div>
      </aside>

      <aside className={elementaryStyles["right-side-bar"]}>
          <div className={elementaryStyles["filler"]}> W.I.P... </div>
      </aside>


      <div className={elementaryStyles["tool-bar"]}>
        <div className={elementaryStyles["editing-buttons"]}> 
            <EditModeButton target="DRAW" current={editMode} setter={setEditMode}> <FaBrush /> </EditModeButton>
            <EditModeButton target="MOVE" current={editMode} setter={setEditMode}> <FaArrowsAlt /> </EditModeButton>
            <EditModeButton target="ZOOM" current={editMode} setter={setEditMode}> <FaSearch /> </EditModeButton>
            <EditModeButton target="ERASE" current={editMode} setter={setEditMode}> <FaEraser /> </EditModeButton>
            <EditModeButton target="LINE" current={editMode} setter={setEditMode}> <GiStraightPipe /> </EditModeButton>
            <button className={getSelectedEditButtonStyles(rendering)} onClick={() => setRendering(!rendering)}> <FaPlay /> </button>
            <button className={elementaryStyles["edit-button"]} onClick={undo}> <FaUndo /> </button>
            <button className={elementaryStyles["edit-button"]} onClick={redo}> <FaRedo /> </button>
        </div>

      </div>


      </div>
    )
}

function getSelectedEditButtonStyles(condition: boolean): string {
  return `${elementaryStyles["edit-button"]} ${condition ? elementaryStyles["selected"] : ""}`
}


function EditModeButton({ children = "", target, current, setter }: { children?: React.ReactNode, target: ElementaryEditorEditMode, current: ElementaryEditorEditMode, setter: React.Dispatch<ElementaryEditorEditMode> }) {
  return <button className={getSelectedEditButtonStyles(current === target)} onClick={() => setter(target)}>{children}</button>
}



export default ElementaryBoard