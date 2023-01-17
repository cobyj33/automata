import React from 'react'

interface ActionButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> { 
    error?: boolean
}

const baseStyles = "p-1 text-white bg-zinc-800 rounded-lg m-2"
const styles = baseStyles.concat(" hover:border-b hover:border-b-white hover:bg-zinc-600 active:border-2 active:border-white")
const errorStyles = baseStyles.concat(" hover:border-b hover:border-b-red hover:bg-zinc-600 active:border-b-red-500 active:border-b-2 active:text-red-500")

export const ActionButton = (props: ActionButtonProps) => {
  return (
    <button className={styles} {...props} />
  )
}

export default ActionButton