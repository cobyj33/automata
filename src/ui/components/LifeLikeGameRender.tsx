import { Reducer, useEffect, useRef, useState } from 'react'
import { IVector2 } from 'interfaces/Vector2';
import { View } from 'interfaces/View';
import { Box } from 'interfaces/Box';
import { BoundedBoardDrawing } from 'ui/components/BoundedBoardDrawing';
import { CellMatrix } from 'interfaces/CellMatrix';
import {getNextLifeGeneration} from 'functions/generationFunctions';


export interface RenderData {
    readonly generation: number
}

export const LifeLikeGameRender = ({ start, view, bounds, automata, getData }: { start: IVector2[], view: View, bounds: Box, automata: string, getData?: (data: RenderData) => any }) => {
    const [currentRender, setCurrentRender] = useState<CellMatrix>(CellMatrix.fromBoundedIVector2List(start, bounds));
    const [currentGeneration, setCurrentGeneration] = useState<number>(0);

    useEffect( () => {
        if (currentRender.area > 0) {
            requestAnimationFrame(() => {
                setCurrentRender(currentRender =>  currentRender.withCellData(getNextLifeGeneration(currentRender, automata)));
                setCurrentGeneration(currentGeneration => currentGeneration + 1);
                getData?.({ generation: currentGeneration });
            })
        }
    }, [currentRender])


    return <BoundedBoardDrawing bounds={bounds} board={currentRender} view={view} />
}

export default LifeLikeGameRender