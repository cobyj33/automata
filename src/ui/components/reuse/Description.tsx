import React from 'react'

const styles = "text-white text-sm" 
interface DescriptionProps extends React.ParamHTMLAttributes<HTMLParagraphElement> {}
export const Description = (props: DescriptionProps) => {
  return (
    <p className={styles} {...props} />
  )
}

export default Description