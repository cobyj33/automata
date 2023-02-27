import { isError } from 'common/util'
import { createElementaryCAImageBlob, ImageMimeType, MAX_ELEMENTARY_IMAGE_DATA_URL_HEIGHT, requestWebDownload } from 'libca/fileOutput'
import Description from './reuse/Description'
import SideBarEditorTool from './reuse/editor/SideBarEditorTool'
import SubmitButton from './reuse/SubmitButton'
import TextInput from './reuse/TextInput'


interface ElementaryImageDownloadToolProps {
    board: number[]
    rule: number
}

export const ElementaryImageDownloadTool = ({board, rule}: ElementaryImageDownloadToolProps) => {
    
    function initiateDownload() {
        createElementaryCAImageBlob(new Uint8ClampedArray(board), 100, rule, "image/png")
        .then(blob => requestWebDownload(blob, "elementary.png"))
        .catch(error => console.error(error))
    }

  return (
    <SideBarEditorTool title={"Image Download"}>

        <SubmitButton onClick={initiateDownload} > Click to Test </SubmitButton>
    </SideBarEditorTool>
  )
}

export default ElementaryImageDownloadTool