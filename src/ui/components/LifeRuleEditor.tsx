import lifeRuleEditorStyles from "ui/components/styles/LifeRuleEditor.module.css"
import { useState, useRef, useCallback, useEffect, RefObject } from "react";
import { StatefulData } from "interfaces/StatefulData"
import { isValidLifeString, createLifeString, parseLifeLikeString } from "functions/generationFunctions"
import { parse } from "path";
import { getLifeRuleName, getNamedLifeRuleString, isNamedLifeRule, NamedLifeRule, NAMED_LIFE_RULES_LIST } from "data";


type RuleEditMode = "ASSISTED" | "RAW" | "NAMED";

function getRuleEditor(mode: RuleEditMode, props: LifeRuleEditorProps) {
    switch (mode) {
        case "ASSISTED": return <AssistedLifeRuleEditor {...props} />
        case "RAW": return <RawLifeRuleEditor {...props} />
        case "NAMED": return <NamedLifeRuleEditor {...props} />
    }
}


interface LifeRuleEditorProps {
    currentRule: string,
    onLifeRuleSelect: (rule: string) => void
}
export const LifeRuleEditor = (props: LifeRuleEditorProps) => {
    const { currentRule, onLifeRuleSelect } = props
    const [ruleEditMode, setRuleEditMode] = useState<RuleEditMode>("ASSISTED");

    function parsedRule() {
        return parseLifeLikeString(currentRule)
    }

    return (
        <div className={lifeRuleEditorStyles["rule-editor"]}>
            <div className={lifeRuleEditorStyles["life-rule-data"]}>
                <h3 className={lifeRuleEditorStyles["title"]}> Life-Like Rule Data </h3> 
                <span className={lifeRuleEditorStyles["text"]}> Current Rule: <span className={lifeRuleEditorStyles["current-life-rule"]}>{currentRule} {isNamedLifeRule(currentRule) ? `(${getLifeRuleName(currentRule)})` : ""}</span> </span>
                <span className={lifeRuleEditorStyles["text"]}> Neighbors to be Born: { Array.from(parsedRule().birth.keys()).sort((a, b) => a - b).join(", ") } </span>
                <span className={lifeRuleEditorStyles["text"]}> Neighbors to Survive: { Array.from(parsedRule().survival.keys()).sort((a, b) => a - b).join(", ") } </span>
            </div>

            <div className={lifeRuleEditorStyles["mode-selection-area"]}>
                <button className={`${lifeRuleEditorStyles["mode-selection-button"]} ${lifeRuleEditorStyles[`${ruleEditMode === "ASSISTED" ? "selected" : ""}`]} `} onClick={() => setRuleEditMode("ASSISTED")} > Assisted </button>
                <button className={`${lifeRuleEditorStyles["mode-selection-button"]} ${lifeRuleEditorStyles[`${ruleEditMode === "RAW" ? "selected" : ""}`]} `} onClick={() => setRuleEditMode("RAW")} > Raw </button>
                <button className={`${lifeRuleEditorStyles["mode-selection-button"]} ${lifeRuleEditorStyles[`${ruleEditMode === "NAMED" ? "selected" : ""}`]} `} onClick={() => setRuleEditMode("NAMED")} > Named </button>
            </div>

            <div>
                { getRuleEditor(ruleEditMode, props) } 
            </div>

            {/* <div ref={renderArea}> 
                     Planned to be a preview of what the rule looks like getRender()
            </div> */}

        </div>
    )

}




function AssistedLifeRuleEditor({ currentRule, onLifeRuleSelect }: LifeRuleEditorProps) {
    const [birth, setBirth] = useState<Set<number>>(new Set<number>(parseLifeLikeString(currentRule).birth));
    const [survive, setSurvive] = useState<Set<number>>(new Set<number>(parseLifeLikeString(currentRule).survival));

    function getLifeString() {
        return createLifeString(Array.from(birth).sort((a, b) => a - b), Array.from(survive).sort((a, b) => a - b));
    }

    function onSubmit() {
        onLifeRuleSelect(getLifeString());
    }
    
    return (
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

            <button className={lifeRuleEditorStyles["assisted-change-submit"]} onClick={onSubmit} > Sumbit </button>
        
        </div>);
}


function NamedLifeRuleEditor({ currentRule, onLifeRuleSelect }: LifeRuleEditorProps) {
    const [selectedNamedRule, setSelectedNamedRule] = useState<NamedLifeRule>("Conway's Game Of Life")

    function submit() {
        onLifeRuleSelect(getNamedLifeRuleString(selectedNamedRule))
    }

    return ( <div>
        <div className={lifeRuleEditorStyles[""]}>
            <div>
                <p> { selectedNamedRule } </p>
                <p> { getNamedLifeRuleString(selectedNamedRule) } </p> 
            </div>

            <div>
                { NAMED_LIFE_RULES_LIST.map(namedRule => <button key={namedRule} onClick={() => setSelectedNamedRule(namedRule)}>{namedRule}</button>)  }
            </div>
        </div>

        <button onClick={submit}>Submit</button>
    </div> )
}

function RawLifeRuleEditor({ currentRule, onLifeRuleSelect }: LifeRuleEditorProps) {
    const [automataInput, setAutomataInput] = useState<string>(currentRule)
    const [ruleErr, setRuleErr] = useState<string>("");

    const validityErrorCallback = useCallback((error: string) => {
        if (error !== ruleErr) {
            setRuleErr(error)
        }
    }, [ruleErr])

    useEffect( () => {
        if (isValidLifeString(automataInput, validityErrorCallback)) {
            setRuleErr("")
        }
    }, [automataInput])

    function rawSubmit() {
        if (isValidLifeString(automataInput, validityErrorCallback)) {
            onLifeRuleSelect(automataInput)
            setRuleErr("")
        }
    }


    return (
        <div className={lifeRuleEditorStyles["raw-change-area"]}> 
            { ruleErr !== "" ? <p> { ruleErr } </p> : "" }
            <input type="text" className={`${lifeRuleEditorStyles["life-rule-string-input"]} ${lifeRuleEditorStyles[`${isValidLifeString(automataInput, validityErrorCallback) } ? "valid" : "invalid"}`]} `} value={automataInput} onChange={(e) => {
                setAutomataInput(e.target.value); 
            }} />

            <button className={lifeRuleEditorStyles["raw-change-button"]} onClick={rawSubmit}>Submit</button>
        </div> );
}

export default LifeRuleEditor
