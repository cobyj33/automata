import React, { RefObject, useEffect, useRef, useState } from 'react'
import { Vector2 } from '../classes/Data/Vector2';
import { cellsToMatrix } from '../functions/conversions';

export const GameRender = ({ start }: { start: Vector2[] }) => {
    const canvasRef: RefObject<HTMLCanvasElement> = useRef<HTMLCanvasElement>(null);
    const currentRender = useState<Vector2[]>(start);

    useEffect( () => {

    }, [currentRender])


    return (
      <div>
        <canvas ref={canvasRef}> </canvas>
      </div>
    )
}
