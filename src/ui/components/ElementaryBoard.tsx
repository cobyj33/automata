import { WheelEvent, useRef, useEffect, MutableRefObject, RefObject, PointerEvent, KeyboardEvent,  useState, ChangeEvent } from "react";
import { View } from "interfaces/View"
import { Vector2 } from "interfaces/Vector2"
import {BoundedBoardDrawing} from "ui/components/BoundedBoardDrawing";
import { CellMatrix } from "interfaces/CellMatrix";
import { ElementaryDrawEditMode, ElementaryDrawData } from "classes/Editor/EditModes/Elementary/ElementaryDrawEditMode";
import {ElementaryLineEditMode, ElementaryLineData } from "classes/Editor/EditModes/Elementary/ElementaryLineEditMode";
import { FaPlay, FaBrush, FaArrowsAlt, FaSearch, FaEraser, FaLine, FaUndo, FaRedo } from "react-icons/fa"

import { useHistory, useIsPointerDown, useWebGL2CanvasUpdater } from "functions/hooks";
import { ElementaryBoardRender } from "ui/components/ElementaryBoardRender";
import { StatefulData } from "interfaces/StatefulData"
import { pointerPositionInElement, getHoveredCell } from 'functions/editorFunctions';
import { ZoomEditMode, ZoomData } from 'classes/Editor/EditModes/ZoomEditMode';
import { MoveEditMode, MoveData } from 'classes/Editor/EditModes/MoveEditMode';
import { EditMode } from 'classes/Editor/EditModes/EditMode';
import { ElementaryEraseEditMode, ElementaryEraseData } from 'classes/Editor/EditModes/Elementary/ElementaryEraseEditMode';
import elementaryStyles from 'ui/components/styles/Elementary.module.css'
import { e } from "vitest/dist/index-40ebba2b";

interface ElementaryEditorData {
    boardData: StatefulData<CellMatrix>;
    viewData: StatefulData<View>;
    ghostTilePositions: StatefulData<number[]>;
    getHoveredCell: (event: PointerEvent<Element>) => number;
    lastHoveredCell: number;
    isPointerDown: boolean;
    isRendering: boolean;
}

const defaultWidth = 1000;

type EditorEditMode = "MOVE" | "ZOOM" | "DRAW" | "ERASE" | "LINE"
type DataUnion = ElementaryDrawData | ElementaryEraseData | ElementaryLineData | MoveData | ZoomData | ElementaryEditorData;

export const ElementaryBoard = () => {

    const [view, setView] = useState<View>({
        row: -5,
        col: 0,
        cellSize: 50
    });

    const [cellMatrix, setCellMatrix] = useState<CellMatrix>({
        row: 0,
        col: 0,
        width: 1000,
        height: 1,
        matrix: new Uint8ClampedArray(1000)
    });

    const boardHolder = useRef(null);
  const [cursor, setCursor] = useState<string>('');
  const [ghostTilePositions, setGhostTilePositions] = useState<number[]>([]);
    const [rule, setRule] = useState<number>(30);
  const [lastHoveredCell, setLastHoveredCell] = useState<number>(0);
  const isPointerDown: MutableRefObject<boolean> = useIsPointerDown(boardHolder);
    const [rendering, setRendering] = useState<boolean>(false);  
    const [inputRule, setInputRule] = useState<string>("");

  // useEffect( () => {
  //   const canvas: htmlcanvaselement | null = ghostcanvas.current;
  //   if (canvas !== null) {
  //     const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
  //     if (context !== null) {
  //       context.clearRect(0, 0, canvas.width, canvas.height);
  //       context.globalAlpha = 0.5;
  //       renderBoard(canvas, context, view, ghostTilePositions.concat(lastHoveredCell))
  //     }
  //   }
  // }, [ghostTilePositions, lastHoveredCell])

  function getCurrentHoveredCell(event: PointerEvent<Element>): number {
    return boardHolder.current !== null ? getHoveredCell(pointerPositionInElement(event, boardHolder.current), view)?.col : lastHoveredCell;
  }

  function getElementaryEditorData(): ElementaryEditorData {
    return {
      boardData: [cellMatrix, setCellMatrix],
      viewData: [view, setView],
      ghostTilePositions: [ghostTilePositions, setGhostTilePositions],
      lastHoveredCell: lastHoveredCell,
      getHoveredCell: getCurrentHoveredCell,
      isPointerDown: isPointerDown.current,
        isRendering: rendering
    }
  }
  
  const [editMode, setEditMode] = useState<EditorEditMode>("MOVE");

  const editorModes: MutableRefObject<{[key in EditorEditMode]: EditMode<DataUnion>}> = useRef({ 
    "DRAW": new ElementaryDrawEditMode(getElementaryEditorData()),
    "ZOOM": new ZoomEditMode(getElementaryEditorData()),
    "MOVE": new MoveEditMode(getElementaryEditorData()),
    "ERASE": new ElementaryEraseEditMode(getElementaryEditorData()),
    "LINE": new ElementaryLineEditMode(getElementaryEditorData()),
  });
  
  useEffect( () => {
    setCursor(editorModes.current[editMode].cursor());
  }, [editMode])

  function onPointerMove(event: PointerEvent<Element>) {
    editorModes.current[editMode].setEditorData(getElementaryEditorData())
    editorModes.current[editMode].onPointerMove?.(event);
    const currentHoveredCell = getCurrentHoveredCell(event)
    if (!(lastHoveredCell === currentHoveredCell)) {
      setLastHoveredCell(currentHoveredCell)
    }
  }
  
  function onPointerDown(event: PointerEvent<Element>) {
    editorModes.current[editMode].setEditorData(getElementaryEditorData())
    editorModes.current[editMode].onPointerDown?.(event);
    const currentHoveredCell = getCurrentHoveredCell(event)
    if (!(lastHoveredCell === currentHoveredCell)) {
      setLastHoveredCell(currentHoveredCell)
    }
  }
  
  function onPointerUp(event: PointerEvent<Element>) {
    editorModes.current[editMode].setEditorData(getElementaryEditorData())
    editorModes.current[editMode].onPointerUp?.(event);
  }

  function onPointerLeave(event: PointerEvent<Element>) {
    editorModes.current[editMode].setEditorData(getElementaryEditorData())
    editorModes.current[editMode].onPointerLeave?.(event);
  }
  
  const [undo, redo] = useHistory([cellMatrix, setCellMatrix], (first: CellMatrix, second: CellMatrix) => first.row === second.row && first.col === second.col && first.width === second.width && first.height === second.height && first.matrix.every((value, index) => second.matrix[index] = value));
  function onKeyDown(event: KeyboardEvent<Element>) {
    editorModes.current[editMode].setEditorData(getElementaryEditorData())
    editorModes.current[editMode].onKeyDown?.(event);

    if (event.code === "KeyZ" && event.shiftKey === true && event.ctrlKey === true) {
      redo();
    } else if (event.code === "KeyZ" && event.ctrlKey === true) {
      undo();
    } else if (event.code === 'Enter') {
      setRendering(!rendering)
    } else if (event.code === 'KeyC') {
      setCellMatrix(cellMatrix => ({ ...cellMatrix, matrix: cellMatrix.matrix.map(num => 0) }));
    }
  }

  function onKeyUp(event: KeyboardEvent<Element>) {
    editorModes.current[editMode].setEditorData(getElementaryEditorData())
    editorModes.current[editMode].onKeyUp?.(event);
  }

  function onWheel(event: WheelEvent<Element>) {
    editorModes.current[editMode].setEditorData(getElementaryEditorData())
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
          { rendering ? <ElementaryBoardRender view={view} start={[...cellMatrix.matrix]} rule={rule} /> : 
              <BoundedBoardDrawing board={cellMatrix} view={view} bounds={cellMatrix} />
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
              <button className={`${elementaryStyles["edit-button"]} ${elementaryStyles[`${ editMode === "DRAW" ? 'selected' : '' }`]} `} onClick={() => setEditMode("DRAW")}> <FaBrush /> </button>
              <button className={`${elementaryStyles["edit-button"]} ${elementaryStyles[`${ editMode === "MOVE" ? 'selected' : '' }`]} `} onClick={() => setEditMode("MOVE")}> <FaArrowsAlt /> </button>
              <button className={`${elementaryStyles["edit-button"]} ${elementaryStyles[`${ editMode === "ZOOM" ? 'selected' : '' }`]} `} onClick={() => setEditMode("ZOOM")}> <FaSearch /> </button>
              <button className={`${elementaryStyles["edit-button"]} ${elementaryStyles[`${ editMode === "ERASE" ? 'selected' : '' }`]} `} onClick={() => setEditMode("ERASE")}> <FaEraser /> </button>
              <button className={`${elementaryStyles["edit-button"]} ${elementaryStyles[`${ editMode === "LINE" ? 'selected' : '' }`]} `} onClick={() => setEditMode("LINE")}> <FaLine /> </button>
              <button className={`${elementaryStyles["edit-button"]} ${ rendering ? 'selected' : '' }`} onClick={() => setRendering(!rendering)}> <FaPlay /> </button>
              <button className={elementaryStyles["edit-button"]} onClick={undo}> <FaUndo /> </button>
              <button className={elementaryStyles["edit-button"]} onClick={redo}> <FaRedo /> </button>
        </div>

      </div>


      </div>
    )
}

export default ElementaryBoard