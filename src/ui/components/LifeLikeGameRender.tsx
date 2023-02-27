import { Reducer, useEffect, useRef, useState } from 'react'
import { IVector2 } from 'common/Vector2';
import { View } from 'common/View';
import { Box } from 'common/Box';
import BoardDrawing from 'ui/components/BoardDrawing';
import { CellMatrix } from 'common/CellMatrix';
import {getNextLifeGeneration, getNextLifeGeneration2D} from 'libca/generationFunctions';
import { Set2D } from 'common/Set2D';


export interface RenderData {
    readonly generation: number
}

interface LifeLikeRenderState {
    currentRender: Set2D
    currentRenderIVec2: IVector2[],
    currentGeneration: number
}

export const LifeLikeGameRender = ({ start, view, bounds, automata, getData }: { start: IVector2[], view: View, bounds: Box, automata: string, getData?: (data: RenderData) => any }) => {
    // const [currentRender, setCurrentRender] = useState<CellMatrix>(CellMatrix.fromBoundedIVector2List(start, bounds));
    // const [currentGeneration, setCurrentGeneration] = useState<number>(0);

    // useEffect( () => {
    //     if (currentRender.area > 0) {
    //         requestAnimationFrame(() => {
    //             setCurrentRender(currentRender =>  currentRender.withCellData(getNextLifeGeneration(currentRender, automata)));
    //             setCurrentGeneration(currentGeneration => currentGeneration + 1);
    //             getData?.({ generation: currentGeneration });
    //         })
    //     }
    // }, [currentRender])

    const [renderState, setRenderState] = useState<LifeLikeRenderState>({
        currentRender: Set2D.fromVector2DArray(start),
        currentRenderIVec2: [...start],
        currentGeneration: 0
    });


    useEffect( () => {
        if (renderState.currentRender.length > 0) {
            requestAnimationFrame(() => {
                setRenderState( currentState => {
                    const next = getNextLifeGeneration2D(currentState.currentRender, automata)
                    getData?.({ generation: currentState.currentGeneration });
                    return {
                        currentRender: next,
                        currentRenderIVec2: next.getPairs(),
                        currentGeneration: currentState.currentGeneration + 1
                    }
                })
            })
        }
    }, [renderState])


    return <BoardDrawing bounds={bounds} board={renderState.currentRenderIVec2} view={view} />
}

export default LifeLikeGameRender