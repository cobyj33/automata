import { useEffect, useRef, useState } from 'react'
import { Vector2 } from '../interfaces/Vector2';
import { View } from '../interfaces/View';
import { Box } from '../interfaces/Box';
import { BoundedBoardDrawing } from './BoundedBoardDrawing';
import "./styles/gamerender.scss"
import { IKernelRunShortcut, Input } from "gpu.js"
import { getLifeKernel } from '../functions/generationFunctions';
import { CellMatrix } from '../interfaces/CellMatrix';
import {cellsInBoxToCellMatrix} from '../functions/conversions';

export const BoundedGameRender = ({ start, view, bounds, automata }: { start: Vector2[], view: View, bounds: Box, automata: string }) => {
    const [currentRender, setCurrentRender] = useState<CellMatrix>(cellsInBoxToCellMatrix(start, bounds));
    const [currentGeneration, setCurrentGeneration] = useState<number>(0);
    const renderingKernel = useRef<IKernelRunShortcut>(getLifeKernel(automata).setOutput([bounds.width * bounds.height]).setDynamicArguments(true).setDynamicOutput(true))

    useEffect( () => {
        if (currentRender.matrix.length > 0) {
            requestAnimationFrame(() => {
                setCurrentRender(currentRender => { 

                    if (renderingKernel.current.output.length === 1) {
                        if (renderingKernel.current.output[0] !== bounds.width * bounds.height) {
                            renderingKernel.current.setOutput([bounds.width * bounds.height]);
                        }
                    } else {
                        renderingKernel.current.setOutput([bounds.width * bounds.height]);
                    }

                    console.log(currentRender);
                    console.log(currentRender.matrix);
                    console.log(currentRender.width, currentRender.height);
                    
                    console.log( ( () => {
                        let amount = 0;
                        currentRender.matrix.forEach(num => {
                            if (num === 1) {
                                amount++;
                            }
                        });
                        return amount;
                    }  )() ) 
                    
                    return ({
                        ...currentRender,
                        matrix: (renderingKernel.current([...currentRender.matrix], currentRender.width, currentRender.height) as number[])
                    })  }   );
                setCurrentGeneration(currentGeneration => currentGeneration + 1);
            })
        }
    }, [currentRender])

    useEffect( () => {
        renderingKernel.current.setOutput([bounds.width * bounds.height]);
    }, [bounds])


    return (
        <div>
            <BoundedBoardDrawing bounds={bounds} board={currentRender} view={view} />
            <div className='render-info'>
                <p> Current Generation: { currentGeneration } </p>
            </div>
        </div>
    )
}
