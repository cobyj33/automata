import React from 'react'

const styles = "bg-zinc-900 rounded-lg text-center px-3 py-2 m-2 hover:border-b-2 hover:border-b-white flex flex-col"

interface SideBarEditorToolStyles extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {}

export const SideBarEditorTool = (props: SideBarEditorToolStyles) => {
  return (
    <div className={styles} {...props} />
  )
}


export default SideBarEditorTool