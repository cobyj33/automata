import { useCanvasHolderUpdater } from 'jsutil/react'
import React from 'react'
import boardDrawingStyles from "ui/components/styles/BoardDrawing.module.css"

interface HeldCanvasProps {
    canvasRef: React.RefObject<HTMLCanvasElement>
    onUpdate?: () => void
    holderClassName?: string
}

export const HeldCanvas = ({ canvasRef, onUpdate: requestedOnUpdate, holderClassName = "" }: HeldCanvasProps) => {
    const onUpdate: () => void = requestedOnUpdate ?? (() => {});
    const holderRef: React.RefObject<HTMLDivElement> = React.useRef<HTMLDivElement>(null)
    useCanvasHolderUpdater(canvasRef, holderRef, onUpdate)

  return (
    <div ref={holderRef} className={holderClassName ?? ""} style={{position: "relative"}}>
        <canvas className={boardDrawingStyles["board-drawing"]} ref={canvasRef}>Not Supported</canvas>
    </div>
  )
}

export default HeldCanvas