import { MutableRefObject, RefObject, useCallback, useEffect, useRef, useState } from "react";
import { HistoryStack } from "../classes/Structures/HistoryStack";
import { StatefulData } from "../interfaces/StatefulData";

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
        console.log(state);
        console.log(history.current.peek());
        if (history.current.empty === false) {
          if (comparer(state, history.current.peek()) === false) {
            history.current.pushState(state);
          }
        } else {
            history.current.pushState(state);
        }
      }, [state])
    
      function undo() {
        console.log(history.current.length);
        console.log(history.current.canGoBack());
        if (history.current.canGoBack()) {
          history.current.back();
          setState(history.current.state);
        }
      }
    
      function redo() {
        console.log(history.current.length);
        if (history.current.canGoForward()) {
            history.current.forward();
          setState(history.current.state);
        }
      }


    return [undo, redo];
}

export function useCanvasUpdater(canvasRef: RefObject<HTMLCanvasElement>) {
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

// export function useEditModes(modes: { [key: string]: EditMode }, data: MutableRefObject<() => EditorData>, editMode: string, canvasRef: RefObject<HTMLElement>): void {
//     const editorModes: MutableRefObject<{ [key: string]: EditMode }> = useRef(modes);

//     const onPointerDown = useCallback((event: PointerEvent<Element>) => {
//         editorModes.current[editMode].setEditorData(data.current())
//         editorModes.current[editMode].onPointerDown?.(event);
//     }, [])

//     const onPointerUp = useCallback((event: PointerEvent<Element>) => {
//         editorModes.current[editMode].setEditorData(data.current())
//         editorModes.current[editMode].onPointerUp?.(event);
//     }, [])

//     const onPointerMove = useCallback((event: PointerEvent<Element>) => {
//         editorModes.current[editMode].setEditorData(data.current())
//         editorModes.current[editMode].onPointerMove?.(event);
//     }, [])

//     const onPointerLeave = useCallback((event: PointerEvent<Element>) => {
//         editorModes.current[editMode].setEditorData(data.current())
//         editorModes.current[editMode].onPointerLeave?.(event);
//     }, [])

//     const onKeyDown = useCallback((event: KeyboardEvent<Element>) => {
//         editorModes.current[editMode].setEditorData(data.current())
//         editorModes.current[editMode].onKeyDown?.(event);
//     }, [])

//     const onKeyUp = useCallback((event: KeyboardEvent<Element>) => {
//         editorModes.current[editMode].setEditorData(data.current())
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
