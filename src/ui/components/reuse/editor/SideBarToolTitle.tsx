import React from 'react'

const styles = "text-white text-xs sm:text-base md:text-lg border-b-white hover:border-b-1 hover:text-cyan-400 transition-colors" 
interface SideBarToolTitleProps extends React.ParamHTMLAttributes<HTMLParagraphElement> {}
export const SideBarToolTitle = (props: SideBarToolTitleProps) => {
  return (
    <p className={styles} {...props} />
  )
}

export default SideBarToolTitle