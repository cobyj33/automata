import "./styles/layeredcanvas.scss"

export const LayeredCanvas = ({ children, styles = "" }: { children: any, styles?: string }) => <div className={`layered-canvas ${styles}`}> { children } </div>
