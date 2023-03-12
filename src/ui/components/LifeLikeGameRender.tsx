import { Reducer, useEffect, useRef, useState } from 'react'
import { IVector2, View, Box, Set2D, isError } from 'jsutil';
import BoardDrawing from 'ui/components/BoardDrawing';
import { CellMatrix } from 'common/CellMatrix';
import {getNextLifeGeneration, getNextLifeGeneration2D} from 'libca/generationFunctions';
import { LifeLikeBoardRenderer } from 'libca/board';


export interface RenderData {
    readonly generation: number
}

interface LifeLikeRenderState {
    currentRenderIVec2: IVector2[],
    currentGeneration: number
}

export const LifeLikeGameRender = ({ start, view, bounds, automata, getData }: { start: IVector2[], view: View, bounds: Box, automata: string, getData?: (data: RenderData) => any }) => {

    const [renderState, setRenderState] = useState<LifeLikeRenderState>({
        currentRenderIVec2: [...start],
        currentGeneration: 0
    });

    const renderer = useRef<LifeLikeBoardRenderer>(new LifeLikeBoardRenderer(Set2D.fromVector2DArray(start), automata))

    useEffect(() => {
        renderer.current.setRule(automata)
    }, [automata])

    useEffect( () => {
        if (renderState.currentRenderIVec2.length > 0) {
            requestAnimationFrame(() => {

                setRenderState( currentState => {
                    renderer.current.next();

                    return {
                        currentRenderIVec2: renderer.current.getPairs(),
                        currentGeneration: currentState.currentGeneration + 1
                    }
                })
                getData?.({ generation: renderState.currentGeneration });
                    
            })
        }
    }, [renderState])


    return <BoardDrawing bounds={bounds} board={renderState.currentRenderIVec2} view={view} />
}

export default LifeLikeGameRender