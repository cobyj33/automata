import React, { useRef } from 'react'
import { useIsPointerDown, useIsPointerDownState } from '../../functions/hooks'

export const PointerDownTest = () => {
    const target = useRef(null);
    const [isPointerDown, setIsPointerDown] = useIsPointerDownState(target);

  return (
    <div ref={target} style={{backgroundColor: isPointerDown ? 'red' : 'green', width: 10, height: 100}}>  </div>
  )
}
