import "./styles/liferuleeditor.scss"
import { useState, useRef, useCallback, useEffect, RefObject } from "react";
import { StatefulData } from "../interfaces/StatefulData"
import { BoundedGameRender } from "./BoundedGameRender"
import { isValidLifeString, createLifeString, parseLifeLikeString } from "../functions/generationFunctions"
import { View } from "../interfaces/View"
import { Box, inBox } from "../interfaces/Box"
import { Vector2 } from "../interfaces/Vector2"

type RuleEditMode = "assisted" | "raw";


export const RuleEditor = ({ lifeRule, currentBoard }: { lifeRule: StatefulData<string>, currentBoard: Vector2[] }) => {
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

    useEffect(() => {
        const data = parseLifeLikeString(lifeRule[0]);
        setBirth(new Set<number>([...data.birth]));
        setSurvive(new Set<number>([...data.survival]));
    }, [])

    const validityErrorCallback = useCallback((error: string) => {
        if (error !== ruleErr) {
            setRuleErr(error)
        }
    }, [ruleErr])

    function getEditModeArea() {
        switch (ruleEditMode) {
            case "assisted": return (
                <div className="rule-edit-area assisted-rule-editor">
                    <span className="rule-editor-text"> Neighbors needed to be Born </span>
                    <div className="rule-editor-selection-button-list">
                        { new Array(10).fill(0).map(( num, index ) => (
                <button className={`rule-editor-select-button ${birth.has(index) ? "selected" : "unselected"}`} onClick={() => birth.has(index) ? (() => { birth.delete(index); setBirth(new Set<number>(birth)); })() : (() => { birth.add(index); setBirth(new Set<number>(birth)); })() } key={`rule editor birth ${index}`}> {index} </button>
                    )) }
                    </div>

                    <span className="rule-editor-text"> Neighbors needed to Survive </span>
                    <div className="rule-editor-selection-button-list">
                    { new Array(10).fill(0).map(( num, index ) => (
                        <button onClick={() => survive.has(index) ? (() => { survive.delete(index); setSurvive(new Set<number>(survive)); })() : (() => { survive.add(index); setSurvive(new Set<number>(survive)); })() } className={`rule-editor-select-button ${survive.has(index) ? "selected" : "unselected"}`} key={`rule editor survive ${index}`}> {index} </button>
                    )) }
                    </div>

                    <button onClick={() => { 
                        const lifeString = createLifeString(Array.from(birth).sort((a, b) => a - b), Array.from(survive).sort((a, b) => a - b));
                        lifeRule[1](lifeString);
                        setLastCorrect(lifeString);
                    }} className={`rule-editor-assisted-submit-button`} > Sumbit </button>
                
                </div>);
            case "raw": return (
                <div className="rule-edit-area raw-life-rule-editor"> 
                     { ruleErr !== "" ? <p className="life-rule-string-input-error"> { ruleErr } </p> : "" }
                    <input type="text" className={`life-rule-string-input ${isValidLifeString(automataInput, validityErrorCallback) } ? "valid" : "invalid"} `} value={automataInput} onChange={(e) => {
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
                <h3 className="life-rule-editor-title"> Life-Like Rule Data </h3> 
                <br />
                <span className="rule-editor-text"> Current Rule: <span className="current-life-rule"> {lifeRule[0]} </span> </span>
                <br />
                <span className="rule-editor-text"> Neighbors to be Born: { Array.from(birth.keys()).sort((a, b) => a - b).join(", ") } </span>
                <br />
                <span className="rule-editor-text"> Neighbors to Survive: { Array.from(survive.keys()).sort((a, b) => a - b).join(", ") } </span>
                <br />
            </div>

            <div className="rule-editor-mode-selection-area">
                <button className={`rule-editor-mode-selection-button ${ruleEditMode === "assisted" ? "selected" : ""}`} onClick={() => setRuleEditMode("assisted")} > Assisted </button>
                <button className={`rule-editor-mode-selection-button ${ruleEditMode === "raw" ? "selected" : ""}`} onClick={() => setRuleEditMode("raw")} > Raw </button>
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

const loading = "Loading Preview";
function LoadingText() {
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
