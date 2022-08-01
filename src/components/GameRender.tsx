import { RefObject, useEffect, useRef, useState } from 'react'
import { Vector2 } from '../interfaces/Vector2';

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
