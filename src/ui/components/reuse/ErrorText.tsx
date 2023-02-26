import React from 'react'

const styles = "text-red-500 text-sm lg:text-base" 
interface ErrorTextProps extends React.ParamHTMLAttributes<HTMLParagraphElement> {}
export const ErrorText = (props: ErrorTextProps) => {
  return (
    <p className={styles} {...props} />
  )
}

export default ErrorText