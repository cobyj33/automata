import React from 'react'

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { 
    error?: boolean
}

const baseStyles = "p-0.5 text-white bg-zinc-800 rounded-lg text-center text-xs sm:p-1 sm:text-sm md:text-base"
const styles = baseStyles.concat(" hover:border-b hover:border-b-white hover:bg-zinc-600 active:border-2 active:border-white")
const errorStyles = baseStyles.concat(" hover:border-b hover:border-b-red hover:bg-zinc-600 active:border-b-red-500 active:border-b-2 active:text-red-500")

export const ActionButton = ({ className, ...props }: ActionButtonProps) => {
  return (
    <button className={`${styles} ${className}` } {...props} />
  )
}

export default ActionButton