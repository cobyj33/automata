import { ChangeEvent, KeyboardEvent, MutableRefObject, PointerEvent, RefObject, useCallback, useEffect, useRef, useState, WheelEvent } from 'react'
import { Vector2 } from '../interfaces/Vector2';
import { View } from '../interfaces/View';
import { BoxEditMode, BoxData } from '../classes/Editor/BoxEditMode';
import { DrawEditMode, DrawData } from '../classes/Editor/DrawEditMode';
import { EditMode } from '../classes/Editor/EditMode';
import { EllipseEditMode, EllipseData } from '../classes/Editor/EllipseEditMode';
import { EraseEditMode, EraseData } from '../classes/Editor/EraseEditMode';
import { LineEditMode, LineData } from '../classes/Editor/LineEditMode';
import { MoveEditMode, MoveData } from '../classes/Editor/MoveEditMode';
import { ZoomEditMode, ZoomData } from '../classes/Editor/ZoomEditMode';
import { getHoveredCell, pointerPositionInElement } from '../functions/editorFunctions';
import { useHistory, useIsPointerDown, useWebGL2CanvasUpdater } from '../functions/hooks';
import { StatefulData } from '../interfaces/StatefulData';
import { BoundedBoardDrawing } from './BoundedBoardDrawing';
import { BoundedGameRender, RenderData } from './BoundedGameRender';
import { FaPlay, FaBrush, FaArrowsAlt, FaSearch, FaEraser, FaLine, FaBox, FaEllipsisH, FaUndo, FaRedo } from "react-icons/fa"
import { LayeredCanvas } from './LayeredCanvas';
import { renderBoard } from '../functions/drawing';
import { createLifeString, isValidLifeString, parseLifeLikeString } from '../functions/generationFunctions';
import {Box, inBox} from '../interfaces/Box';
import { BoardUI } from "./BoardUI"


interface EditorData {
    boardData: StatefulData<Vector2[]>;
    boundsData: StatefulData<Box>;
    viewData: StatefulData<View>;
    lastHoveredCell: Vector2;
    isPointerDown: boolean;
    getHoveredCell: (event: PointerEvent<Element>) => Vector2;
    ghostTilePositions: StatefulData<Vector2[]>
    isRendering: boolean;
}

enum EditorEditMode { MOVE, ZOOM, DRAW, ERASE, BOX, LINE, ELLIPSE };
type UnionData = MoveData | ZoomData | DrawData | EraseData | BoxData | LineData | EllipseData | EditorData;



export const BoundedGameBoard = ({ boardData }: { boardData: StatefulData<Vector2[]> }) => {
  const boardHolder = useRef<HTMLDivElement>(null);
  const ghostCanvas = useRef<HTMLCanvasElement>(null);
  const [cursor, setCursor] = useState<string>('');
  
    const [view, setView] = useState<View>({
        row: 0,
        col: 0,
        cellSize: 10
    });
    const [renderData, setRenderData] = useState<RenderData>({ generation: 0 });

  const [board, setBoard] = boardData;
  const [rendering, setRendering] = useState<boolean>(false);
  const [bounds, setBounds] = useState<Box>({ row: 0, col: 0, width: 200, height: 200 });
  const [ghostTilePositions, setGhostTilePositions] = useState<Vector2[]>([]);
  const [lastHoveredCell, setLastHoveredCell] = useState<Vector2>({ row: 0, col: 0 });
  const [automata, setAutomata] = useState<string>("B3/S23");
  const isPointerDown: MutableRefObject<boolean> = useIsPointerDown(boardHolder);

    useEffect( () => {
        if (rendering === false) {
            setRenderData({generation: 0});
        }
    }, [rendering] )

  useEffect( () => {
    const canvas: HTMLCanvasElement | null = ghostCanvas.current;
    if (canvas !== null) {
      const gl: WebGL2RenderingContext | null = canvas.getContext("webgl2");
      if (gl !== null && gl !== undefined) {
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);
        renderBoard(gl, view, ghostTilePositions.concat(lastHoveredCell), 0.5);
      }
    }
  }, [ghostTilePositions, lastHoveredCell])

  function getCurrentHoveredCell(event: PointerEvent<Element>) {
    return boardHolder.current !== null ? getHoveredCell(pointerPositionInElement(event, boardHolder.current), view) : lastHoveredCell;
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
  
  const [editMode, setEditMode] = useState<EditorEditMode>(EditorEditMode.MOVE);
  const editorModes: MutableRefObject<{[key in EditorEditMode]: EditMode<UnionData>}> = useRef({ 
    [EditorEditMode.DRAW]: new DrawEditMode(getEditorData()),
    [EditorEditMode.ZOOM]: new ZoomEditMode(getEditorData()),
    [EditorEditMode.MOVE]: new MoveEditMode(getEditorData()),
    [EditorEditMode.ERASE]: new EraseEditMode(getEditorData()),
    [EditorEditMode.LINE]: new LineEditMode(getEditorData()),
    [EditorEditMode.BOX]: new BoxEditMode(getEditorData()),
    [EditorEditMode.ELLIPSE]: new EllipseEditMode(getEditorData())
  });
  
  useEffect( () => {
    setCursor(editorModes.current[editMode].cursor());
  }, [editMode])

  function onPointerMove(event: PointerEvent<Element>) {
    editorModes.current[editMode].setEditorData(getEditorData())
    editorModes.current[editMode].onPointerMove?.(event);
    const currentHoveredCell = getCurrentHoveredCell(event)
    if (!(lastHoveredCell.row === currentHoveredCell.row && lastHoveredCell.col === currentHoveredCell.col)) {
      setLastHoveredCell(currentHoveredCell)
    }
  }
  
  function onPointerDown(event: PointerEvent<Element>) {
    editorModes.current[editMode].setEditorData(getEditorData())
    editorModes.current[editMode].onPointerDown?.(event);
    const currentHoveredCell = getCurrentHoveredCell(event)
    if (!(lastHoveredCell.row === currentHoveredCell.row && lastHoveredCell.col === currentHoveredCell.col)) {
      setLastHoveredCell(currentHoveredCell)
    }
  }
  
  function onPointerUp(event: PointerEvent<Element>) {
    editorModes.current[editMode].setEditorData(getEditorData())
    editorModes.current[editMode].onPointerUp?.(event);
  }

  function onPointerLeave(event: PointerEvent<Element>) {
    editorModes.current[editMode].setEditorData(getEditorData())
    editorModes.current[editMode].onPointerLeave?.(event);
  }
  
  const [undo, redo] = useHistory(boardData, (first: Vector2[], second: Vector2[]) => first.length === second.length && first.every(cell => second.includes(cell)) )
  function onKeyDown(event: KeyboardEvent<Element>) {
    editorModes.current[editMode].setEditorData(getEditorData())
    editorModes.current[editMode].onKeyDown?.(event);

    if (event.code === "KeyZ" && event.shiftKey === true && event.ctrlKey === true) {
      redo();
    } else if (event.code === "KeyZ" && event.ctrlKey === true) {
      undo();
    } else if (event.code === 'Enter') {
      setRendering(!rendering)
    } else if (event.code === 'KeyC') {
      setBoard([]);
    }
  }

  function onKeyUp(event: KeyboardEvent<Element>) {
    editorModes.current[editMode].setEditorData(getEditorData())
    editorModes.current[editMode].onKeyUp?.(event);
  }

  function onWheel(event: WheelEvent<Element>) {
    editorModes.current[editMode].setEditorData(getEditorData())
    editorModes.current[editMode].onWheel?.(event);
  }

  useWebGL2CanvasUpdater(ghostCanvas)

  return (
    <div>
      <div style={{cursor: cursor}} ref={boardHolder} className="board-holder" onWheel={onWheel} onPointerMove={onPointerMove} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerLeave={onPointerLeave} onKeyDown={onKeyDown} onKeyUp={onKeyUp} tabIndex={0} >
        <LayeredCanvas>
          {rendering ? 
              <div>
                  <BoundedGameRender automata={automata} start={board} view={view} bounds={bounds} getData={(data) => setRenderData(data)} /> 
                    <div className='render-info'>
                        <p> Current Generation: { renderData.generation } </p>
                    </div>
              </div>
           : <BoundedBoardDrawing bounds={bounds} view={view} board={board} />}
          <canvas style={{}} className="board-drawing" ref={ghostCanvas} />
            
        </LayeredCanvas>
      </div>

      <BoardUI left={<RuleEditor lifeRule={[automata, setAutomata]} currentBoard={board}/>} bottom={ 
          <div className="editing-buttons"> 
            <button className={`edit-button ${ editMode === EditorEditMode.DRAW ? 'selected' : '' }`} onClick={() => setEditMode(EditorEditMode.DRAW)}> <FaBrush /> </button>
            <button className={`edit-button ${ editMode === EditorEditMode.MOVE ? 'selected' : '' }`} onClick={() => setEditMode(EditorEditMode.MOVE)}> <FaArrowsAlt /> </button>
            <button className={`edit-button ${ editMode === EditorEditMode.ZOOM ? 'selected' : '' }`} onClick={() => setEditMode(EditorEditMode.ZOOM)}> <FaSearch /> </button>
            <button className={`edit-button ${ editMode === EditorEditMode.ERASE ? 'selected' : '' }`} onClick={() => setEditMode(EditorEditMode.ERASE)}> <FaEraser /> </button>
            <button className={`edit-button ${ editMode === EditorEditMode.LINE ? 'selected' : '' }`} onClick={() => setEditMode(EditorEditMode.LINE)}> <FaLine /> </button>
            <button className={`edit-button ${ editMode === EditorEditMode.BOX ? 'selected' : '' }`} onClick={() => setEditMode(EditorEditMode.BOX)}> <FaBox /> </button>
            <button className={`edit-button ${ editMode === EditorEditMode.ELLIPSE ? 'selected' : '' }`} onClick={() => setEditMode(EditorEditMode.ELLIPSE)}> <FaEllipsisH /> </button>
            <button className={`edit-button ${ rendering ? 'selected' : '' }`} onClick={() => setRendering(!rendering)}> <FaPlay /> </button>
            <button className={`edit-button`} onClick={undo}> <FaUndo /> </button>
            <button className={`edit-button`} onClick={redo}> <FaRedo /> </button>
          </div>
      } />

    </div>
  )
}

type RuleEditMode = "assisted" | "raw";


const loading = "Loading Preview";
const LoadingText = () => {
    const [text, setText] = useState<string>(loading);
    useEffect( () => {
        if (text.endsWith("...")) {
            setTimeout( () => requestAnimationFrame( () => setText(loading)), 100);
        } else {
            setTimeout( () => requestAnimationFrame( () => setText(text.concat("."))), 100);
        }
    }, [text]);

    return (
        <p className="rule-editor-preview-loading"> Loading Preview </p>
    )
}

const RuleEditor = ({ lifeRule, currentBoard }: { lifeRule: StatefulData<string>, currentBoard: Vector2[] }) => {
    const [automataInput, setAutomataInput] = useState<string>(lifeRule[0]);
    const [lastCorrect, setLastCorrect] = useState<string>(lifeRule[0]);

    const [ruleErr, setRuleErr] = useState<string>("");
    const [ruleEditMode, setRuleEditMode] = useState<RuleEditMode>("assisted");
    const [previewing, setPreviewing] = useState<boolean>(false);

    const [birth, setBirth] = useState<Set<number>>(new Set<number>());
    const [survive, setSurvive] = useState<Set<number>>(new Set<number>());

    const renderArea: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    useEffect( () => {
        if (isValidLifeString(automataInput)) {
            setRuleErr("")
        }
    }, [automataInput])

    const getRender = useCallback(() => {
        const desiredPreviewSize = 20;
        if (renderArea.current !== null && renderArea.current !== undefined) {
            const renderDOMRect: DOMRect = renderArea.current.getBoundingClientRect();
            const cellSize: number = Math.max(1, Math.trunc(Math.min(renderDOMRect.width / desiredPreviewSize, renderDOMRect.height / desiredPreviewSize)));

            const view: View = {
                row: 0,
                col: 0,
                cellSize: cellSize
            }
            
            const bounds: Box = {
                row: 0,
                col: 0,
                width: Math.max(1, Math.trunc(renderDOMRect.width / cellSize)),
                height: Math.max(1, Math.trunc(renderDOMRect.height / cellSize))
            }; 

            console.log(bounds);
            console.log(view);

            return <BoundedGameRender bounds={bounds} view={view} start={currentBoard.filter(vector => inBox(vector, bounds))} automata={lastCorrect} />
        }
        
        return <LoadingText />;
    }, [currentBoard, lastCorrect]);

    const validityErrorCallback = useCallback((error: string) => {
        if (error !== ruleErr) {
            setRuleErr(error)
        }
    }, [ruleErr])

    function getEditModeArea() {
        switch (ruleEditMode) {
            case "assisted": return (
                <div className="assisted-rule-editor">
                    <span> Neighbors needed to be Born </span>
                    <div>
                        { new Array(10).fill(0).map(( num, index ) => (
                <button className={` ${birth.has(index) ? "rule-editor-select-button-selected" : "rule-editor-select-button-unselected"} rule-editor-select-button`} onClick={() => birth.has(index) ? (() => { birth.delete(index); setBirth(new Set<number>(birth)); })() : (() => { birth.add(index); setBirth(new Set<number>(birth)); })() } key={`rule editor birth ${index}`}> {index} </button>
                    )) }
                    </div>

                    <span> Neighbors needed to Survive </span>
                    <div>
                    { new Array(10).fill(0).map(( num, index ) => (
                        <button onClick={() => survive.has(index) ? (() => { survive.delete(index); setSurvive(new Set<number>(survive)); })() : (() => { survive.add(index); setSurvive(new Set<number>(survive)); })() } className={` ${birth.has(index) ? "rule-editor-select-button-selected" : "rule-editor-select-button-unselected"} rule-editor-select-button`} key={`rule editor survive ${index}`}> {index} </button>
                    )) }
                    </div>

                    <button onClick={() => { 
                        const lifeString = createLifeString(Array.from(birth).sort((a, b) => a - b), Array.from(survive).sort((a, b) => a - b));
                        lifeRule[1](lifeString);
                        setLastCorrect(lifeString);
                    }} className={`rule-editor-assisted-submit-button`} > Sumbit </button>
                
                </div>);
            case "raw": return (
                <div className="raw-life-rule-editor"> 
                     { ruleErr !== "" ? <p className="life-rule-string-input-error"> { ruleErr } </p> : "" }
                    <input type="text" className={`life-rule-string-input ${isValidLifeString(automataInput, validityErrorCallback) } ? "life-rule-string-valid" : "life-rule-string-invalid"} `} value={automataInput} onChange={(e) => {
                            setAutomataInput(e.target.value); 
                        }} />

                        <button className="life-rule-apply" onClick={ () => {
                            if (isValidLifeString(automataInput, validityErrorCallback)) {
                                lifeRule[1](automataInput);
                                setLastCorrect(automataInput);
                            } }}> 
                            Change
                        </button>
                </div>);
        }
    }

    return (
        <div className="rule-editor">
            <div className="life-rule-data">
                <h3> Life-Like Rule Data </h3> 
                <br />
                <br />
                <span> Current Rule: {lifeRule[0]} </span>
                <br />
                <span> Neighbors to be Born: { Array.from(birth.keys()).sort((a, b) => a - b).join(", ") } </span>
                <br />
                <span> Neighbors to Survive: { Array.from(survive.keys()).sort((a, b) => a - b).join(", ") } </span>
                <br />
            </div>

            <div className="rule-editor-mode-selection-area">
                <button className="rule-editor-mode-selection-button" onClick={() => setRuleEditMode("assisted")} > Assisted </button>
                <button className="rule-editor-mode-selection-button" onClick={() => setRuleEditMode("raw")} > Raw </button>
            </div>

            <div className="rule-editor-area">
                { getEditModeArea() } 
            </div>

            <div ref={renderArea} className="life-rule-preview">
                    { /* getRender() */ }
            </div>

        </div>
    )

}
