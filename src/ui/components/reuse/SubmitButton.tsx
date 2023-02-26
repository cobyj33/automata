import React from 'react'

interface SubmitButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> { 
    error?: boolean
}

const baseStyles = "p-1 text-white bg-zinc-800 rounded-lg m-2 text-xs sm:text-sm md:text-base lg:text-lg"
const styles = baseStyles.concat(" hover:border-b hover:border-b-white hover:bg-zinc-600 active:border-b-lime-500 active:border-b-2 active:text-lime-500")
const errorStyles = baseStyles.concat(" hover:border-b hover:border-b-red hover:bg-zinc-600 active:border-b-red-500 active:border-b-2 active:text-red-500")

export const SubmitButton = ({ error = false, ...props }: SubmitButtonProps) => {
  return (
    <button className={error ? errorStyles : styles} {...props} />
  )
}

export default SubmitButton