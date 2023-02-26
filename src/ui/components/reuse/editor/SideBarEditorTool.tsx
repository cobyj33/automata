import React from 'react'
import SideBarToolTitle from "ui/components/reuse/editor/SideBarToolTitle"
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'

interface SideBarEditorToolProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {
    title: string
    initiallyOpened?: boolean
}

export const SideBarEditorTool = ({ title, initiallyOpened = false, ...props}: SideBarEditorToolProps) => {
    const [opened, setOpened] = React.useState<boolean>(initiallyOpened !== null && initiallyOpened !== undefined ? initiallyOpened : false);
    
    return (
        <div className={"bg-zinc-900 w-full rounded-lg text-center px-3 py-2 hover:border-b-2 hover:border-b-white flex flex-col justify-center align-center"} > 
        <section className={'flex flex-row justify-center items-center gap-2 p-1'} onClick={() => setOpened(!opened)}>
            <SideBarToolTitle> {title} </SideBarToolTitle>
            { opened ? <FaArrowUp className={"text-white hover:text-cyan-400 transition-colors"}/> : <FaArrowDown className={"text-white hover:text-cyan-400 transition-colors"}/> }
        </section>

        { opened ? <section {...props} /> : "" }
        </div>
    )
}


export default SideBarEditorTool