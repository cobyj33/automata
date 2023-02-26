import React from 'react'

const styles = "text-white text-xs md:text-sm lg:text-base" 
interface DescriptionProps extends React.ParamHTMLAttributes<HTMLParagraphElement> {}
export const Description = (props: DescriptionProps) => {
  return (
    <p className={styles} {...props} />
  )
}

export default Description