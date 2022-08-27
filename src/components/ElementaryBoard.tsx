import { WheelEvent, useRef, useEffect, MutableRefObject, RefObject, PointerEvent, KeyboardEvent,  useState } from "react";
import { View } from "../interfaces/View"
import { Vector2 } from "../interfaces/Vector2"
import {BoundedBoardDrawing} from "./BoundedBoardDrawing";
import { CellMatrix } from "../interfaces/CellMatrix";
import { ElementaryDrawEditMode, ElementaryDrawData } from "../classes/Editor/Elementary/ElementaryDrawEditMode";
import {ElementaryLineEditMode, ElementaryLineData } from "../classes/Editor/Elementary/ElementaryLineEditMode";
import { FaPlay, FaBrush, FaArrowsAlt, FaSearch, FaEraser, FaLine, FaUndo, FaRedo } from "react-icons/fa"

import { useHistory, useIsPointerDown, useCanvasUpdater } from "../functions/hooks";
import { ElementaryBoardRender } from "./ElementaryBoardRender";
import { StatefulData } from "../interfaces/StatefulData"
import { pointerPositionInElement, getHoveredCell } from '../functions/editorFunctions';
import { ZoomEditMode, ZoomData } from '../classes/Editor/ZoomEditMode';
import { MoveEditMode, MoveData } from '../classes/Editor/MoveEditMode';
import { EditMode } from '../classes/Editor/EditMode';
import { ElementaryEraseEditMode, ElementaryEraseData } from '../classes/Editor/Elementary/ElementaryEraseEditMode';
import './styles/elementary.scss'

interface ElementaryEditorData {
    boardData: StatefulData<CellMatrix>;
    viewData: StatefulData<View>;
    ghostTilePositions: StatefulData<number[]>;
    getHoveredCell: (event: PointerEvent<Element>) => number;
    lastHoveredCell: number;
    isPointerDown: boolean;
}

const defaultWidth = 1000;

enum EditorEditMode { MOVE, ZOOM, DRAW, ERASE, LINE };
type DataUnion = ElementaryDrawData | ElementaryEraseData | ElementaryLineData | MoveData | ZoomData | ElementaryEditorData;

export const ElementaryBoard = () => {
    const [view, setView] = useState<View>({
        row: 0,
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
      isPointerDown: isPointerDown.current
    }
  }
  
  const [editMode, setEditMode] = useState<EditorEditMode>(EditorEditMode.MOVE);

  const editorModes: MutableRefObject<{[key in EditorEditMode]: EditMode<DataUnion>}> = useRef({ 
    [EditorEditMode.DRAW]: new ElementaryDrawEditMode(getElementaryEditorData()),
    [EditorEditMode.ZOOM]: new ZoomEditMode(getElementaryEditorData()),
    [EditorEditMode.MOVE]: new MoveEditMode(getElementaryEditorData()),
    [EditorEditMode.ERASE]: new ElementaryEraseEditMode(getElementaryEditorData()),
    [EditorEditMode.LINE]: new ElementaryLineEditMode(getElementaryEditorData()),
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

  // useCanvasUpdater(ghostCanvas)
    
    const [rendering, setRendering] = useState<boolean>(false);  
    const [inputRule, setInputRule] = useState<string>("");
    return (
        <div  >
        <div className="elementary-board board-holder" ref={boardHolder} style={{cursor: cursor}} onWheel={onWheel} onPointerMove={onPointerMove} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerLeave={onPointerLeave} onKeyDown={onKeyDown} onKeyUp={onKeyUp} tabIndex={0}>       
            { rendering ? <ElementaryBoardRender view={view} start={[...cellMatrix.matrix]} rule={rule} /> : 
                <BoundedBoardDrawing board={cellMatrix} view={view} bounds={cellMatrix} />
            }
        </div>


      <div className="board-ui">

        <div className="board-ui-bar top-bar">
            
        </div>
      
        <div className="middle-area">
            
            <div className="board-ui-bar left-bar">

            </div>
            
            <div className="middle-separator"> </div>
            <div className="board-ui-bar right-bar">
                
            </div>

        </div>

        <div className="board-ui-bar bottom-bar">
          <div className="editing-buttons"> 
                <button className={`edit-button ${ editMode === EditorEditMode.DRAW ? 'selected' : '' }`} onClick={() => setEditMode(EditorEditMode.DRAW)}> <FaBrush /> </button>
                <button className={`edit-button ${ editMode === EditorEditMode.MOVE ? 'selected' : '' }`} onClick={() => setEditMode(EditorEditMode.MOVE)}> <FaArrowsAlt /> </button>
                <button className={`edit-button ${ editMode === EditorEditMode.ZOOM ? 'selected' : '' }`} onClick={() => setEditMode(EditorEditMode.ZOOM)}> <FaSearch /> </button>
                <button className={`edit-button ${ editMode === EditorEditMode.ERASE ? 'selected' : '' }`} onClick={() => setEditMode(EditorEditMode.ERASE)}> <FaEraser /> </button>
                <button className={`edit-button ${ editMode === EditorEditMode.LINE ? 'selected' : '' }`} onClick={() => setEditMode(EditorEditMode.LINE)}> <FaLine /> </button>
                <button className={`edit-button ${ rendering ? 'selected' : '' }`} onClick={() => setRendering(!rendering)}> <FaPlay /> </button>
                <button className={`edit-button`} onClick={undo}> <FaUndo /> </button>
                <button className={`edit-button`} onClick={redo}> <FaRedo /> </button>
        </div>


            <div className="rule-input-area">

        <input className={`rule-input ${Number(inputRule) === rule ? 'valid' : 'invalid'}`} onChange={e => {
                    const input = Number(e.target.value)
                    setInputRule(e.target.value);
                    if (!isNaN(input)) {

                        if (input >= 0 && input <= 255) {
                            setRule(input);
                        }

                    }

                }} value={inputRule}  />

            </div>
        </div>

      </div>

    </div>
    )
}
