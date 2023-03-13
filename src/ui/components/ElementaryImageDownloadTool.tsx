import { requestWebDownload } from "jsutil/browser"
import { createElementaryCAImageBlob, ImageMimeType, MAX_ELEMENTARY_IMAGE_DATA_URL_HEIGHT } from 'libca/fileOutput'
import SideBarEditorTool from 'ui/components/reuse/editor/SideBarEditorTool'
import SubmitButton from 'ui/components/reuse/SubmitButton'


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