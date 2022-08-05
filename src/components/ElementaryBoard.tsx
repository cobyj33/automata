import { WheelEvent, useRef, useEffect, MutableRefObject, RefObject, PointerEvent, KeyboardEvent,  useState } from "react";
import { View } from "../interfaces/View"
import { Vector2 } from "../interfaces/Vector2"
import {BoundedBoardDrawing} from "./BoundedBoardDrawing";
import { CellMatrix } from "../interfaces/CellMatrix";import {ElementaryDrawEditMode} from "../classes/Editor/Elementary/ElementaryDrawEditMode";
import {ElementaryLineEditMode} from "../classes/Editor/Elementary/ElementaryLineEditMode";

import { useHistory, useIsPointerDown, useCanvasUpdater } from "../functions/hooks";
import { ElementaryBoardRender } from "./ElementaryBoardRender";
import { StatefulData } from "../interfaces/StatefulData"
import { pointerPositionInElement, getHoveredCell } from '../functions/editorFunctions';
import { ZoomEditMode } from '../classes/Editor/ZoomEditMode';
import { MoveEditMode } from '../classes/Editor/MoveEditMode';
import { EditMode } from '../classes/Editor/EditMode';
import { ElementaryEraseEditMode } from '../classes/Editor/Elementary/ElementaryEraseEditMode';

enum EditorEditMode { MOVE, ZOOM, DRAW, ERASE, LINE };

interface ElementaryEditorData {
    boardData: StatefulData<CellMatrix>;
    viewData: StatefulData<View>;
    ghostTilePositions: StatefulData<number[]>;
    getHoveredCell: (event: PointerEvent<Element>) => number;
    lastHoveredCell: number;
    isPointerDown: boolean;
}

export const ElementaryBoard = () => {
    const [view, setView] = useState<View>({
        row: 0,
        col: 0,
        cellSize: 50
    });

    const [rule, setRule] = useState<number>(110);
    
    const [cellMatrix, setCellMatrix] = useState<CellMatrix>({
        row: 0,
        col: 0,
        width: 100,
        height: 1,
        matrix: new Array<number>(100).fill(0)
    });

    const boardHolder = useRef(null);
  const [cursor, setCursor] = useState<string>('');
  const [bounds, setBounds] = useState<Box>({ row: 0, col: 0, width: 200, height: 200 });
  const [ghostTilePositions, setGhostTilePositions] = useState<number[]>([]);
  const [lastHoveredCell, setLastHoveredCell] = useState<number>(0);
  const [automata, setAutomata] = useState<string>("B3/S23");
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
  const editorModes: MutableRefObject<{[key in EditorEditMode]: EditMode<ElementaryEditorData>}> = useRef({ 
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

    return (
        <div ref={boardHolder} style={{cursor: cursor}} className="board-holder" onWheel={onWheel} onPointerMove={onPointerMove} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerLeave={onPointerLeave} onKeyDown={onKeyDown} onKeyUp={onKeyUp} tabIndex={0} >
        <div className="elementary-board">       
            { rendering ? <ElementaryBoardRender view={view} start={cellMatrix.matrix} rule={rule} /> : 
                <BoundedBoardDrawing board={cellMatrix} view={view} bounds={cellMatrix} />
            }
        </div>
    </div>
    )
}
