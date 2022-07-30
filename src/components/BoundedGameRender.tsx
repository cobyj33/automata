import { render } from '@testing-library/react';
import React, { RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Dimension } from '../classes/Data/Dimension';
import { Vector2 } from '../classes/Data/Vector2';
import { View } from '../classes/Data/View';
import { cellsToMatrix, getMatrix, matrixToVector2 } from '../functions/conversions';
import { getNextGenerationKernelFunction } from '../functions/getNextGeneration';
import { padMatrixSides } from '../functions/matrixFunctions';
import { isInBounds } from '../functions/validation';
import { gpu } from '../globals';
import { Box } from '../interfaces/Box';
import { BoardDrawing } from './BoardDrawing';
import { BoundedBoardDrawing } from './BoundedBoardDrawing';
import "./gamerender.scss"

function getStartingMatrix(start: Vector2[], bounds: Box) {
    const matrix = getMatrix(bounds.height, bounds.width);
    start.forEach(cell => {
        if (isInBounds(matrix, cell.row, cell.col)) {
            matrix[cell.row][cell.col] = 1;
        }
    })
    return matrix;
}

export const BoundedGameRender = ({ start, view, bounds }: { start: Vector2[], view: View, bounds: Box }) => {
    const [currentRender, setCurrentRender] = useState<number[][]>(getStartingMatrix(start, bounds));
    const renderingKernel = useRef(gpu.createKernel(getNextGenerationKernelFunction).setOutput([bounds.width, bounds.height]).setDynamicOutput(true).setDynamicArguments(true));
    const [currentGeneration, setCurrentGeneration] = useState<number>(0);

    useEffect( () => {
        if (currentRender.length > 0) {
            requestAnimationFrame(() => {
                setCurrentRender(currentRender => renderingKernel.current(currentRender, currentRender[0].length, currentRender.length) as number[][])
                setCurrentGeneration(currentGeneration => currentGeneration + 1);
            })
        }
    }, [currentRender])

    useEffect( () => {
        renderingKernel.current.setOutput([bounds.width, bounds.height]);
    }, [bounds])


    return (
        <div>
            <BoundedBoardDrawing bounds={bounds} board={{ topLeft: Vector2.zero, matrix: currentRender }} view={view} />
            <div className='render-info'>
                <p> Current Generation: { currentGeneration } </p>
            </div>
        </div>
    )
}
