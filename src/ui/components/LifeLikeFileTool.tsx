import React from 'react'
import { readLifeString } from 'llcacodec'
import SideBarEditorTool from './reuse/editor/SideBarEditorTool'
import SubmitButton from './reuse/SubmitButton'
import { IVector2, getErrorMessage } from 'jsutil'
import ErrorText from './reuse/ErrorText'

export const LifeLikeFileTool = ({ onFileLoad }: { onFileLoad: (coordinates: IVector2[]) => void }) => {
    const [file, setFile] = React.useState<File | null>(null)
    const [err, setErr] = React.useState<string>("")

    function onFileInput(e: React.ChangeEvent<HTMLInputElement>) {
        setErr("");
        if (e.target.files !== null) {
            if (e.target.files.length > 0) {
                setFile(e.target.files[0]);
            }
        }
    }

    function tryLoadFile() {
        if (file !== null) {
            file.text()
            .then(data => readLifeString(data).liveCoordinates)
            .then(xy =>  xy.map(([x, y]) => ({ row: -y, col: x })) )
            .then(rowCol => onFileLoad( rowCol )  )
            .catch(err => { console.error(err); setErr(getErrorMessage(err)); })
        } else {
            setErr("No File Selected")
        }
    }


  return (
    <SideBarEditorTool title={`File`} >
        <input type="file" onChange={onFileInput} />
        <ErrorText>{err}</ErrorText>
        <SubmitButton onClick={tryLoadFile}>Load File</SubmitButton>
    </SideBarEditorTool>
  )
}

export default LifeLikeFileTool