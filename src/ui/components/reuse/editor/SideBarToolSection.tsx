import React from 'react'

const styles = "bg-neutral-900 pt-4 rounded-lg justify-around flex flex-col"

interface SideBarToolSectionStyles extends Omit<React.HTMLAttributes<HTMLDivElement>, "className"> {}

export const SideBarToolSection = (props: SideBarToolSectionStyles) => {
  return (
    <div className={styles} {...props} />
  )
}


export default SideBarToolSection

// .raw-change-area, .assisted-change-area {
//     padding: 10px;
//     padding-top: 20px;
//     background-color: rgb(20, 20, 20);
//     border-radius: 5px;
//     display: flex;
//     flex-direction: column;
//     justify-content: space-around;
// }