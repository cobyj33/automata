import React from 'react'


interface TextEntryProps extends Omit<Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">, "className"> {
    valid: boolean
}

const baseStyles = "text-center bg-zinc-900 text-white border-2 border-black hover:border-b-white inset-0 relative min-w-0 text-xs sm:text-sm md:text-base"
const validStyles = baseStyles.concat("transition-colors border-green-500")
const invalidStyles = baseStyles.concat("transition-colors border-red-500")

export const TextInput = ({ valid, ...props }: TextEntryProps) => {
  return (
    <div className="flex flex-col bg-red-500 relative">
        <input className={valid ? validStyles : invalidStyles} type="text"  {...props} />
    </div>
  )
}

export default TextInput