import layeredCanvasStyles from "ui/components/styles/LayeredCanvas.module.css"
export function LayeredCanvas({ children, className = "" }: { children: any, className?: string }) { 
    return <div className={`${layeredCanvasStyles["layered-canvas"]} ${className}`}> { children } </div>
}
export default LayeredCanvas