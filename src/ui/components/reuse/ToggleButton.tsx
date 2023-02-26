import React from 'react'

interface ToggleButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> { 
    selected: boolean
}

const styles = "text-center border-none rounded-lg p-1 border-r-4 text-white bg-neutral-700 hover:border-white hover:border-2 hover:border-solid"
const selectedStyles = "text-center border-x-0 border-t-0 rounded-lg p-1 text-white bg-neutral-900 hover:border-white hover:border-2 hover:border-solid transition-colors bg-black border-b-lime-800 border-b-2"

export const ToggleButton = ({ selected, ...props }: ToggleButtonProps) => {
    return <button className={selected ? selectedStyles : styles} {...props} />
}

export default ToggleButton
