import layeredCanvasStyles from "ui/components/styles/LayeredCanvas.module.css"
import React from "react"
import { useCanvasHolderUpdater } from "functions/hooks"
import internal from "stream"

interface LayeredCanvasProps {
    children: React.ReactNode,
    className?: string
}

export const LayeredCanvas = React.forwardRef(({ children, className = "" }: LayeredCanvasProps, ref: React.ForwardedRef<HTMLDivElement>) => { 
    return <div ref={ref} className={`${layeredCanvasStyles["layered-canvas"]} ${className}`}> { children } </div>
})

// interface CanvasProps extends  React.CanvasHTMLAttributes<HTMLCanvasElement> {
//     onCanvasSizeUpdate: () => void
// }
// export const Canvas = React.forwardRef( (props: CanvasProps, canvasRef: React.ForwardedRef<HTMLCanvasElement>) => {
//     const boardHolderRef = React.useRef<HTMLDivElement>(null)
//     const internalCanvasRef = React.useRef<HTMLCanvasElement>(null)
//     useCanvasHolderUpdater(internalCanvasRef, boardHolderRef, props.onCanvasSizeUpdate)

//     return (
//         <div className={props.className} ref={boardHolderRef}>
//             <canvas ref={(el) => { internalCanvasRef.current = el } } />
//         </>
//     )
// })

export default LayeredCanvas