import React from "react"

export function getRefBoundingClientRect(ref: React.RefObject<HTMLElement>): DOMRect | null {
    const el = ref.current;
    if (el !== null && el !== undefined) {
        return el.getBoundingClientRect()
    } 
    return null;
}
