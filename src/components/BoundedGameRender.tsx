import { useEffect, useRef, useState } from 'react'
import { Vector2 } from '../interfaces/Vector2';
import { View } from '../interfaces/View';
import { Box } from '../interfaces/Box';
import { BoundedBoardDrawing } from './BoundedBoardDrawing';
import "./styles/gamerender.scss"
import { CellMatrix } from '../interfaces/CellMatrix';
import {cellsInBoxToCellMatrix} from '../functions/conversions';
import {getNextLifeGeneration} from '../functions/generationFunctions';

export const BoundedGameRender = ({ start, view, bounds, automata }: { start: Vector2[], view: View, bounds: Box, automata: string }) => {
    const [currentRender, setCurrentRender] = useState<CellMatrix>(cellsInBoxToCellMatrix(start, bounds));
    const [currentGeneration, setCurrentGeneration] = useState<number>(0);

    useEffect( () => {
        if (currentRender.matrix.length > 0) {
            requestAnimationFrame(() => {
                setCurrentRender(currentRender =>  ({
                        ...currentRender,
                        matrix: getNextLifeGeneration(currentRender, automata)
                    }) );
                setCurrentGeneration(currentGeneration => currentGeneration + 1);
            })
        }
    }, [currentRender])


    return (
        <div>
            <BoundedBoardDrawing bounds={bounds} board={currentRender} view={view} />
            <div className='render-info'>
                <p> Current Generation: { currentGeneration } </p>
            </div>
        </div>
    )
}
