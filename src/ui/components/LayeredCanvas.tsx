import layeredCanvasStyles from "ui/components/styles/LayeredCanvas.module.css"
export const LayeredCanvas = ({ children, className = "" }: { children: any, className?: string }) => <div className={`${layeredCanvasStyles["layered-canvas"]} ${className}`}> { children } </div>

export default LayeredCanvas