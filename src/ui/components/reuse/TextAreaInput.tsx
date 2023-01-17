import React from 'react'


interface TextAreaInputProps extends Omit<React.InputHTMLAttributes<HTMLTextAreaElement>, "className"> {
    valid: boolean
}

const baseStyles = "bg-zinc-900 text-white border-2 border-black hover:border-b-white"
const validStyles = baseStyles.concat("transition-colors border-green-500")
const invalidStyles = baseStyles.concat("transition-colors border-red-500")

export const TextAreaInput = ({ valid, ...props }: TextAreaInputProps) => {
  return (
    <textarea className={valid ? validStyles : invalidStyles} {...props} />
  )
}

export default TextAreaInput