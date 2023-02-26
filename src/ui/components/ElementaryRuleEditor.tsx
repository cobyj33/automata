import { isValidElementaryRule } from "common/generationFunctions"
import { useResizeObserver } from "common/hooks";
import { getRefBoundingClientRect } from "common/reactUtil"
import { Vector2 } from "common/Vector2";
import { View } from "common/View";
import React from "react"
import ElementaryBoardRender, { RenderController } from "./ElementaryBoardRender"
import ActionButton from "./reuse/ActionButton";
import Description from "./reuse/Description";
import SideBarEditorTool from "./reuse/editor/SideBarEditorTool";
import SideBarToolTitle from "./reuse/editor/SideBarToolTitle";
import SubmitButton from "./reuse/SubmitButton";
import TextInput from "./reuse/TextInput";

const DEFAULT_ELEMENTARY_PREVIEW_MAX_GENERATIONS = 100;
const DEFAULT_ELEMENTARY_PREVIEW_START_SIZE = 150;

function ruleEditorPreviewStart(length: number): number[] {
    const arr = new Array(length).fill(length)
    arr[Math.trunc(length / 2)] = 1
    return arr
}

interface StartingPreviewState {
    start: number[],
    generations: number
}

const INITIAL_ELEMENTARY_PREVIEW_STATE: StartingPreviewState = {
    start: ruleEditorPreviewStart(DEFAULT_ELEMENTARY_PREVIEW_START_SIZE),
    generations: DEFAULT_ELEMENTARY_PREVIEW_MAX_GENERATIONS
}

type StartingPreviewStateFitAction = { type: "fit", width: number, height: number }
type StartingPreviewStateActions = StartingPreviewStateFitAction
type StartingPreviewStateReducer = React.Reducer<StartingPreviewState, StartingPreviewStateActions>
type StartingPreviewStateReducerFunction<T> = React.Reducer<StartingPreviewState, T>

const startingPreviewStateFitReducer: StartingPreviewStateReducerFunction<StartingPreviewStateFitAction> = (state, action) => {
    const { width, height } = action
    if (width > 0 && height > 0) {
        if (Number.isInteger(width) && Number.isInteger(height)) {
            return { start: ruleEditorPreviewStart(width), generations: height }
        }
        throw new Error("Preview Fit Action must take in two integers for width and height")
    }
    throw new Error("Preview Fit Action must take in two integers greater than 0 for width and height")
}

const startingPreviewStateReducer: StartingPreviewStateReducer = (state, action) => {
    const { type } = action
    switch (type) {
        case "fit": return startingPreviewStateFitReducer(state, action) 
    }
}

export function ElementaryRuleEditor({ rule, onRuleRequest }: { rule: number, onRuleRequest: (num: number) => void }) {
    const [ruleInput, setRuleInput] = React.useState<number>(30)
    const [requestedRule, setRequestedRule] = React.useState<number>(30)
    const renderController = React.useRef<RenderController>(new RenderController())
    const [previewState, previewDispatch] = React.useReducer<StartingPreviewStateReducer>(startingPreviewStateReducer, INITIAL_ELEMENTARY_PREVIEW_STATE)
    const { start: previewStart, generations: previewGenerations } = previewState
    const previewHolderRef: React.RefObject<HTMLDivElement> = React.useRef<HTMLDivElement>(null)

    const restartPreview = () => renderController.current.fire("restart")
    const sendRule = () => onRuleRequest(requestedRule)
    React.useEffect(restartPreview, [requestedRule])


    function onRuleInputChanged(event: React.ChangeEvent<Element>) {
        const inputElement = event.target as HTMLInputElement
        const input = Number(inputElement.value)
        if (!isNaN(input)) {
            setRuleInput(input)
            if (isValidElementaryRule(input)) {
                setRequestedRule(input);
            }
        }
    }

    function fitPreview() {
        const rect = getRefBoundingClientRect(previewHolderRef)
        if (rect !== null && rect !== undefined) {
            if (rect.width > 1 && rect.height > 1) {
                previewDispatch({type: "fit", width: Math.trunc(rect.width), height: Math.trunc(rect.height)})
            }
        }
    }

    React.useEffect(() => {
        fitPreview()
    }, [])

    useResizeObserver(previewHolderRef, () => {
        console.log("size changed", getRefBoundingClientRect(previewHolderRef))
        fitPreview()
    })

    return (
        <SideBarEditorTool title={`Rule Editor`}>
            <Description> Current Rule: <span className="text-green-400">{rule}</span> </Description>
            <Description> Rule must be between 0 and 255 </Description>

            <section className="grid grid-cols-2 gap-2 p-3 bg-neutral-900 rounded-lg">
                <div className="flex flex-col">
                    <TextInput valid={isValidElementaryRule(Number(ruleInput))} onChange={onRuleInputChanged} value={ruleInput}  />
                    <ActionButton onClick={restartPreview}>Restart Preview</ActionButton>
                </div>

                <div ref={previewHolderRef} style={{display: "grid", gridTemplateRows: "1fr", gridTemplateColumns: "1fr"}}>
                    <ElementaryBoardRender start={previewStart} view={new View(Vector2.ZERO, 1)} rule={requestedRule} maxGeneration={previewGenerations} controller={renderController} />
                </div>
            </section>

            <SubmitButton onClick={sendRule}> Set Rule {requestedRule} </SubmitButton>

        </SideBarEditorTool>  
    )
}

export default ElementaryRuleEditor