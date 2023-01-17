import React from "react"

const LOADING = "Loading";

type LoadingTextProgressAction = { type: "progress" }
type LoadingTextActions = LoadingTextProgressAction
type LoadingTextReducerFunction = React.Reducer<string, LoadingTextActions>

function loadingTextReducer(state: string, action: LoadingTextActions): string {
    const { type } = action
    switch (type) {
        case "progress": return state.endsWith("...") ? state.slice(0, state.length - 3) : state.concat(".")
    }
}


function LoadingText({ className = "" }: { className?: string }) {
    const [text, textDispatch] = React.useReducer<LoadingTextReducerFunction>(loadingTextReducer, LOADING);

    React.useEffect( () => {
        setTimeout( () => textDispatch({ type: "progress" }), 100);
    }, [text]);

    return (
        <p className={className}>{text}</p>
    )
}

export default LoadingText