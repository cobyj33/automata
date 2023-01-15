import lifeRuleEditorStyles from "ui/components/styles/LifeRuleEditor.module.css"
import { useState, useRef, useCallback, useEffect, RefObject } from "react";
import { StatefulData } from "interfaces/StatefulData"
import { isValidLifeString, createLifeString, parseLifeLikeString } from "functions/generationFunctions"

type RuleEditMode = "ASSISTED" | "RAW";

export const LifeRuleEditor = ({ lifeRule }: { lifeRule: StatefulData<string> }) => {
    const [automataInput, setAutomataInput] = useState<string>(lifeRule[0]);
    const [lastCorrect, setLastCorrect] = useState<string>(lifeRule[0]);

    const [ruleErr, setRuleErr] = useState<string>("");
    const [ruleEditMode, setRuleEditMode] = useState<RuleEditMode>("ASSISTED");

    const [birth, setBirth] = useState<Set<number>>(new Set<number>());
    const [survive, setSurvive] = useState<Set<number>>(new Set<number>());


    const renderArea: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    useEffect( () => {
        if (isValidLifeString(automataInput)) {
            setRuleErr("")
        }
    }, [automataInput])

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

    function rawSubmit() {
        if (isValidLifeString(automataInput, validityErrorCallback)) {
            lifeRule[1](automataInput);
            setLastCorrect(automataInput);
        }
    }

    function getEditModeArea() {
        switch (ruleEditMode) {
            case "ASSISTED": return (
                <div className={lifeRuleEditorStyles["assisted-change-area"]}>
                    <span className={lifeRuleEditorStyles["text"]}> Neighbors needed to be Born </span>
                    <div className={lifeRuleEditorStyles["selection-button-list"]}>
                        { new Array(9).fill(0).map(( num, index ) => (
                        <button className={`${lifeRuleEditorStyles["select-button"]} ${lifeRuleEditorStyles[`${birth.has(index) ? "selected" : "unselected"}`]} `} onClick={() => birth.has(index) ? (() => { birth.delete(index); setBirth(new Set<number>(birth)); })() : (() => { birth.add(index); setBirth(new Set<number>(birth)); })() } key={`rule editor birth ${index}`}> {index} </button>
                            )) }
                    </div>

                    <span className={lifeRuleEditorStyles["text"]}> Neighbors needed to Survive </span>
                    
                    <div className={lifeRuleEditorStyles["selection-button-list"]}>
                        { new Array(9).fill(0).map(( num, index ) => (
                            <button onClick={() => survive.has(index) ? (() => { survive.delete(index); setSurvive(new Set<number>(survive)); })() : (() => { survive.add(index); setSurvive(new Set<number>(survive)); })() } className={`${lifeRuleEditorStyles["select-button"]} ${lifeRuleEditorStyles[`${survive.has(index) ? "selected" : "unselected"}`]} `} key={`rule editor survive ${index}`}> {index} </button>
                        )) }
                    </div>

                    <button className={lifeRuleEditorStyles["assisted-change-submit"]} onClick={() => { 
                        const lifeString = createLifeString(Array.from(birth).sort((a, b) => a - b), Array.from(survive).sort((a, b) => a - b));
                        lifeRule[1](lifeString);
                        setLastCorrect(lifeString);
                    }} > Sumbit </button>
                
                </div>);
            case "RAW": return (
                <div className={lifeRuleEditorStyles["raw-change-area"]}> 
                    { ruleErr !== "" ? <p> { ruleErr } </p> : "" }
                    <input type="text" className={`${lifeRuleEditorStyles["life-rule-string-input"]} ${lifeRuleEditorStyles[`${isValidLifeString(automataInput, validityErrorCallback) } ? "valid" : "invalid"}`]} `} value={automataInput} onChange={(e) => {
                        setAutomataInput(e.target.value); 
                    }} />

                    <button className={lifeRuleEditorStyles["raw-change-button"]} onClick={rawSubmit}>Submit</button>
                </div>);
        }
    }

    return (
        <div className={lifeRuleEditorStyles["rule-editor"]}>
            <div className={lifeRuleEditorStyles["life-rule-data"]}>
                <h3 className={lifeRuleEditorStyles["title"]}> Life-Like Rule Data </h3> 
                <span className={lifeRuleEditorStyles["text"]}> Current Rule: <span className={lifeRuleEditorStyles["current-life-rule"]}>{lifeRule[0]}</span> </span>
                <span className={lifeRuleEditorStyles["text"]}> Neighbors to be Born: { Array.from(birth.keys()).sort((a, b) => a - b).join(", ") } </span>
                <span className={lifeRuleEditorStyles["text"]}> Neighbors to Survive: { Array.from(survive.keys()).sort((a, b) => a - b).join(", ") } </span>
            </div>

            <div className={lifeRuleEditorStyles["mode-selection-area"]}>
                <button className={`${lifeRuleEditorStyles["mode-selection-button"]} ${lifeRuleEditorStyles[`${ruleEditMode === "ASSISTED" ? "selected" : ""}`]} `} onClick={() => setRuleEditMode("ASSISTED")} > Assisted </button>
                <button className={`${lifeRuleEditorStyles["mode-selection-button"]} ${lifeRuleEditorStyles[`${ruleEditMode === "RAW" ? "selected" : ""}`]} `} onClick={() => setRuleEditMode("RAW")} > Raw </button>
            </div>

            <div>
                { getEditModeArea() } 
            </div>

            {/* <div ref={renderArea}> 
                     Planned to be a preview of what the rule looks like getRender()
            </div> */}

        </div>
    )

}

const loading = "Loading Preview";
function LoadingText({ className = "" }: { className?: string }) {
    const [text, setText] = useState<string>(loading);
    useEffect( () => {
        if (text.endsWith("...")) {
            setTimeout( () => requestAnimationFrame( () => setText(loading)), 100);
        } else {
            setTimeout( () => requestAnimationFrame( () => setText(text.concat("."))), 100);
        }
    }, [text]);

    return (
        <p className={className}> Loading Preview </p>
    )
}

export default LifeRuleEditor
