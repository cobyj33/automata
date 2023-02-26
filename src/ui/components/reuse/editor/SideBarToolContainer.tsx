import React from "react"

export const SideBarToolContainer = (props: Omit<React.HTMLAttributes<HTMLDivElement>, "className">) => {
    return (
        <div className={"flex flex-col gap-5 absolute right-0 top-0 bottom-0 left-0 max-w-full max-h-full h-full w-full p-2"} {...props} />
    )
}

export default SideBarToolContainer