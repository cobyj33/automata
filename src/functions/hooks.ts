import { MutableRefObject, RefObject, useCallback, useEffect, useRef, useState } from "react";
import { HistoryStack } from "classes/Structures/HistoryStack";
import { StatefulData } from "common/StatefulData";
import { isEqualDOMRect } from "./util";
import { getRefBoundingClientRect } from "./reactUtil";

type Action = () => void;
type IComparer<T> = (first: T, second: T) => boolean;

export function useIsPointerDown(target: RefObject<HTMLElement>) {
    const isPointerDown: MutableRefObject<boolean> = useRef<boolean>(false);
    const setPointerTrue: Action = useCallback(() => isPointerDown.current = true, [])
    const setPointerFalse: Action = useCallback(() => isPointerDown.current = false, [])

    function bindEvents() {
        const element: HTMLElement | null = target.current;
        if (element !== null) {
            element.addEventListener('pointerdown', setPointerTrue);
            element.addEventListener('pointerup', setPointerFalse);
            element.addEventListener('pointerleave', setPointerFalse);
        }
    }

    function unbindEvents() {
        const element: HTMLElement | null = target.current;
        if (element !== null) {
            element.removeEventListener('pointerdown', setPointerTrue);
            element.removeEventListener('pointerup', setPointerFalse);
            element.removeEventListener('pointerleave', setPointerFalse);
        }
    }

    useEffect( () => {
        unbindEvents();
        bindEvents();
        return unbindEvents;
    })

    return isPointerDown;
}

export function useIsPointerDownState(target: RefObject<HTMLElement>): StatefulData<boolean> {
    const [isPointerDown, setIsPointerDown] = useState<boolean>(false);
    const setPointerTrue: Action = useCallback(() => setIsPointerDown(true), [])
    const setPointerFalse: Action = useCallback(() => setIsPointerDown(false), [])

    function bindEvents() {
        const element: HTMLElement | null = target.current;
        if (element !== null) {
            element.addEventListener('pointerdown', setPointerTrue);
            element.addEventListener('pointerup', setPointerFalse);
            element.addEventListener('pointerleave', setPointerFalse);
        }
    }

    function unbindEvents() {
        const element: HTMLElement | null = target.current;
        if (element !== null) {
            element.removeEventListener('pointerdown', setPointerTrue);
            element.removeEventListener('pointerup', setPointerFalse);
            element.removeEventListener('pointerleave', setPointerFalse);
        }
    }

    useEffect( () => {
        unbindEvents();
        bindEvents();
        return unbindEvents;
    })

    return [isPointerDown, setIsPointerDown]
}

export function useHistory<T>(stateData: StatefulData<T>, comparer: IComparer<T>): [Action, Action] {
    const [state, setState] = stateData;
    const history= useRef<HistoryStack<T>>(new HistoryStack<T>());

    useEffect(() => {
        if (history.current.empty === false) {
          if (comparer(state, history.current.peek()) === false) {
            history.current.pushState(state);
          }
        } else {
            history.current.pushState(state);
        }
      }, [state])
    
      function undo() {
        if (history.current.canGoBack()) {
          history.current.back();
          setState(history.current.state);
        }
      }
    
      function redo() {
        if (history.current.canGoForward()) {
            history.current.forward();
          setState(history.current.state);
        }
      }


    return [undo, redo];
}

export function useWebGL2CanvasUpdater(canvasRef: RefObject<HTMLCanvasElement>) {
    useEffect(() => {
        function updateCanvasSize() {
          const canvas: HTMLCanvasElement | null = canvasRef.current;
          if (canvas !== null) {
            const rect: DOMRect = canvas.getBoundingClientRect();
              canvas.width = rect.width;
              canvas.height = rect.height;
            const gl: WebGL2RenderingContext | null = canvas.getContext('webgl2');
            if (gl !== null) {
                gl.viewport(0, 0, canvas.width, canvas.height);
                }
            }
        }
    
        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
        return () => window.removeEventListener('resize', updateCanvasSize);
      }, [])

}

export function useCanvas2DUpdater(canvasRef: RefObject<HTMLCanvasElement>) {
    useEffect(() => {
        function updateCanvasSize() {
          const canvas: HTMLCanvasElement | null = canvasRef.current;
          if (canvas !== null) {
            const rect: DOMRect = canvas.getBoundingClientRect();
            const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
            if (context !== null) {
              const data = context.getImageData(0, 0, canvas.width, canvas.height);
              canvas.width = rect.width;
              canvas.height = rect.height;
              context.putImageData(data, 0, 0);
            } else {
              canvas.width = rect.width;
              canvas.height = rect.height;
            }
          }
        }
    
        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
        return () => window.removeEventListener('resize', updateCanvasSize);
      }, [])
}

export function useResizeObserver(toObserve: RefObject<HTMLElement>, ...actions: Action[]) {
    const lastBoundingBox = useRef<DOMRect>( new DOMRect(0, 0, 0, 0) )
    const onDetect = () => {
        const rect = getRefBoundingClientRect(toObserve)
        if (rect !== null && rect !== undefined) {
            if (!isEqualDOMRect(lastBoundingBox.current, rect)) {
                actions.forEach(action => action())
            }
            lastBoundingBox.current = rect
        }
    }

    const observer = useRef(new ResizeObserver(onDetect));
    useEffect(() => {
        if (toObserve.current !== null && toObserve.current !== undefined) {
            observer.current.disconnect()
            observer.current = new ResizeObserver(onDetect)
            observer.current.observe(toObserve.current)
        }
    })
}

/**
 * A hook to automatically update a canvas's actual size to fit it's holder on window size changes and holder size changes
 * 
 * @param canvasRef Reference to a canvas object which is positioned absolutely and filling its holder completely
 * @param canvasHolderRef Reference to the holder element which holds the absolutely positioned canvas
 * @param actions variable argument of actions (methods which take no parameters and return void) to take on a canvas holder's resize. will generally be an action to re-render the canvas after changing sizes
 */
export function useCanvasHolderUpdater(canvasRef: RefObject<HTMLCanvasElement>, canvasHolderRef: RefObject<HTMLElement>, ...actions: Action[]): void {

    const updateCanvasSize = useCallback( () => {
      const canvas: HTMLCanvasElement | null = canvasRef.current;
      const canvasHolder: HTMLElement | null = canvasHolderRef.current
      if (canvas !== null && canvas !== undefined && canvasHolder !== null && canvasHolder !== undefined) {
        const rect: DOMRect = canvasHolder.getBoundingClientRect();
          canvas.width = rect.width;
          canvas.height = rect.height;
      }
    }, [])
  
    useResizeObserver(canvasHolderRef, updateCanvasSize, ...actions)
  
    useEffect(() => {
        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
        return () => window.removeEventListener('resize', updateCanvasSize);
    }, [])
  }

// export function useEditModes(modes: { [key: string]: EditMode }, data: MutableRefObject<() => EditorData>, editMode: string, canvasRef: RefObject<HTMLElement>): void {
//     const editorModes: MutableRefObject<{ [key: string]: EditMode }> = useRef(modes);

//     const onPointerDown = useCallback((event: PointerEvent<Element>) => {
//         editorModes.current[editMode].sendUpdatedEditorData(data.current())
//         editorModes.current[editMode].onPointerDown?.(event);
//     }, [])

//     const onPointerUp = useCallback((event: PointerEvent<Element>) => {
//         editorModes.current[editMode].sendUpdatedEditorData(data.current())
//         editorModes.current[editMode].onPointerUp?.(event);
//     }, [])

//     const onPointerMove = useCallback((event: PointerEvent<Element>) => {
//         editorModes.current[editMode].sendUpdatedEditorData(data.current())
//         editorModes.current[editMode].onPointerMove?.(event);
//     }, [])

//     const onPointerLeave = useCallback((event: PointerEvent<Element>) => {
//         editorModes.current[editMode].sendUpdatedEditorData(data.current())
//         editorModes.current[editMode].onPointerLeave?.(event);
//     }, [])

//     const onKeyDown = useCallback((event: KeyboardEvent<Element>) => {
//         editorModes.current[editMode].sendUpdatedEditorData(data.current())
//         editorModes.current[editMode].onKeyDown?.(event);
//     }, [])

//     const onKeyUp = useCallback((event: KeyboardEvent<Element>) => {
//         editorModes.current[editMode].sendUpdatedEditorData(data.current())
//         editorModes.current[editMode].onKeyUp?.(event);
//     }, [])

//     function unbindEvents() {
//         const canvas: HTMLCanvasElement | null = canvasRef.current;
//         if (canvas !== null) {
//             canvas.addEventListener('pointerdown', onPointerDown);
//             canvas.addEventListener('pointerup', onPointerUp);
//             canvas.addEventListener('pointerleave', onPointerLeave);
//         }
//     }

//     function bindEvents() {
//         const canvas: HTMLCanvasElement | null = canvasRef.current;
//         if (canvas !== null) {
//             canvas.addEventListener('pointerdown', setPointerTrue);
//             canvas.addEventListener('pointerup', setPointerFalse);
//             canvas.addEventListener('pointerleave', setPointerFalse);
//         }
//     }

//     useEffect( () => {
//         unbindEvents();
//         bindEvents();
//         return unbindEvents;
//     })
// }
