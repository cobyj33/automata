import lifeRuleEditorStyles from "ui/components/styles/LifeRuleEditor.module.css"
import { useImmerReducer, ImmerReducer, useImmer } from "use-immer";
import { useState, useRef, useCallback, useEffect, RefObject } from "react";
import { isValidLifeString, createLifeString, parseLifeLikeString, LifeRuleData, getLifeStringErrors } from "common/generationFunctions"
import { getLifeRuleName, getNamedLifeRuleString, isNamedLifeRuleString, NamedLifeRule, NAMED_LIFE_RULES_LIST } from "data";
import ToggleButton from "./reuse/ToggleButton";
import { capitalized } from "common/util";
import { SubmitButton } from "./reuse/SubmitButton";
import TextInput from "./reuse/TextInput";
import ErrorText from "./reuse/ErrorText";
import SideBarEditorTool from "./reuse/editor/SideBarEditorTool";
import Description from "./reuse/Description";
import SideBarToolTitle from "./reuse/editor/SideBarToolTitle";
import SideBarToolSection from "./reuse/editor/SideBarToolSection";

const RULE_EDIT_MODES = ["ASSISTED", "RAW", "NAMED"] as const;
type RuleEditMode = typeof RULE_EDIT_MODES[number];
interface LifeRuleEditorProps {
    currentRule: string,
    onLifeRuleSelect: (rule: string) => void
}
type LifeRuleEditorComponent = (props: LifeRuleEditorProps) => JSX.Element

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
        <SideBarEditorTool>
            <div className="flex flex-col gap-1 m-2">
                <SideBarToolTitle> Life-Like Rule Data </SideBarToolTitle> 
                <Description> Current Rule: <span className="text-green-400">{currentRule} {isNamedLifeRuleString(currentRule) ? `(${getLifeRuleName(currentRule)})` : ""}</span> </Description>
                <Description> Neighbors to be Born: { Array.from(parsedRule().birth.keys()).sort((a, b) => a - b).join(", ") } </Description>
                <Description> Neighbors to Survive: { Array.from(parsedRule().survival.keys()).sort((a, b) => a - b).join(", ") } </Description>
            </div>

            <div className="flex flex-row justify-between items-center p-1 m-1 bg-neutral-900 rounded-lg">
                { RULE_EDIT_MODES.map(mode => <ToggleButton selected={ruleEditMode === mode} onClick={() => setRuleEditMode(mode)} key={mode}>{capitalized(mode)}</ToggleButton>)}
            </div>

            { getRuleEditor(ruleEditMode, props) } 
        </SideBarEditorTool>
    )
}

type AssistedLifeRuleState = LifeRuleData
type AssistedLifeRuleBirthToggleAction = { type: "toggle birth", num: number }
type AssistedLifeRuleSurvivalToggleAction = { type: "toggle survival", num: number }
type AssistedLifeRuleActions = AssistedLifeRuleBirthToggleAction | AssistedLifeRuleSurvivalToggleAction
type AssistedLifeRuleStateReducerFunction = ImmerReducer<AssistedLifeRuleState, AssistedLifeRuleActions>

const assistedLifeRuleReducer: AssistedLifeRuleStateReducerFunction = (draft, action) => {
    const { type, num } = action
    switch (type) {
        case "toggle birth": 
            if (!draft.birth.some(val => val === num)) {
                draft.birth.push(num)
            } else {
                draft.birth = draft.birth.filter(val => val !== num)
            }
            break;
        case "toggle survival":
            if (!draft.survival.some(val => val === num)) {
                draft.survival.push(num)
            } else {
                draft.survival = draft.survival.filter(val => val !== num)
            }
            break;
    }
    return draft
}

const AssistedLifeRuleEditor: LifeRuleEditorComponent = ({ currentRule, onLifeRuleSelect }: LifeRuleEditorProps) => {
    const [input, inputDispatch] = useImmerReducer<AssistedLifeRuleState, AssistedLifeRuleActions>(assistedLifeRuleReducer, parseLifeLikeString(currentRule))
    const { birth, survival } = input

    function getLifeString() {
        return createLifeString([...birth].sort((a, b) => a - b), [...survival].sort((a, b) => a - b));
    }

    function onSubmit() {
        onLifeRuleSelect(getLifeString());
    }
    
    return (
        <SideBarToolSection>
            <section className="flex flex-col gap-2">
                <Description> Neighbors needed to be Born </Description>
                <div className="flex flex-row justify-evenly">
                    { new Array(9).fill(0).map(( num, index ) => (
                    <ToggleButton selected={birth.some(val => val === index)} onClick={() => inputDispatch({ type: "toggle birth", num: index })} key={`rule editor birth ${index}`}>{index}</ToggleButton>
                        )) }
                </div>
            </section>

            <section className="flex flex-col gap-2">
                <Description> Neighbors needed to Survive </Description>
                <div className="flex flex-row justify-evenly">
                    { new Array(9).fill(0).map(( num, index ) => (
                        <ToggleButton selected={survival.some(val => val === index)} onClick={() => inputDispatch({ type: "toggle survival", num: index })} key={`rule editor birth ${index}`}>{index}</ToggleButton>
                    )) }
                </div>
            </section>

            <SubmitButton onClick={onSubmit} > Sumbit </SubmitButton>
        </SideBarToolSection>);
}


const NamedLifeRuleEditor: LifeRuleEditorComponent = ({ currentRule, onLifeRuleSelect }: LifeRuleEditorProps) => {
    const [selectedNamedRule, setSelectedNamedRule] = useState<NamedLifeRule>(isNamedLifeRuleString(currentRule) ? getLifeRuleName(currentRule) : "Conway's Game Of Life")

    function submit() {
        onLifeRuleSelect(getNamedLifeRuleString(selectedNamedRule))
    }

    return (
        <SideBarToolSection>
            <main className="flex flex-col">
                <section className="flex flex-col justify-center items-center p-2 m-1 rounded-lg">
                    <Description> { selectedNamedRule } </Description>
                    <Description> <span className="text-green-400">{ getNamedLifeRuleString(selectedNamedRule) }</span> </Description> 
                </section>

                <section className="relative overflow-auto border border-black" style={{minHeight: 150}}>
                    <div className="flex-grow grid grid-cols-3 absolute insets-0 overflow-auto max-w-100 max-h-100 gap-1">
                        { NAMED_LIFE_RULES_LIST.map(namedRule => <ToggleButton selected={selectedNamedRule === namedRule} key={namedRule} onClick={() => setSelectedNamedRule(namedRule)}><span className="text-xs">{namedRule}</span></ToggleButton>)  }
                    </div>
                </section>
            </main>
            <SubmitButton onClick={submit}>Submit</SubmitButton>
        </SideBarToolSection> )
}

interface RawLifeRuleEditorState {
    input: string,
    error: string
}
type RawLifeRuleEditorUpdateInputAction = { type: "update input", input: string }
type RawLifeRuleEditorActions = RawLifeRuleEditorUpdateInputAction
type RawLifeRuleEditorStateReducer = ImmerReducer<RawLifeRuleEditorState, RawLifeRuleEditorActions>

const rawLifeReducer: RawLifeRuleEditorStateReducer = (draft, action) => {
    const { type } = action;
    switch (type) {
        case "update input":
            const { input } = action
            draft.input = input;
            draft.error = getLifeStringErrors(input)
    }
    return draft;
}

const RawLifeRuleEditor: LifeRuleEditorComponent = ({ currentRule, onLifeRuleSelect }: LifeRuleEditorProps) => {
    const [inputState, inputStateDispatch] = useImmerReducer<RawLifeRuleEditorState, RawLifeRuleEditorActions>(rawLifeReducer, { input: currentRule, error: "" })
    const { input, error } = inputState

    function hasError() { return error.length > 0 }

    function trySubmit() {
        if (!hasError()) {
            onLifeRuleSelect(input)
        }
    }

    return (
        <SideBarToolSection> 
            { hasError() ? <ErrorText>{ error }</ErrorText> : "" }
            <TextInput valid={!hasError()} value={input} onChange={(e) => inputStateDispatch({ type: "update input", input: e.target.value })} />
            <SubmitButton error={hasError()} onClick={trySubmit}>Submit</SubmitButton>
        </SideBarToolSection> );
}

export default LifeRuleEditor
