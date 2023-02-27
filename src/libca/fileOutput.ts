import { getNextElementaryGeneration, isValidElementaryRule } from "./generationFunctions"

const IMAGE_MIME_TYPES =  ["image/apng", "image/avif", "image/gif", "image/jpeg", "image/png", "image/svg", "image/webp"] as const
export type ImageMimeType = typeof IMAGE_MIME_TYPES[number]

type MimeTypes = ImageMimeType

const MAXIMUM_CANVAS_WIDTH = 8192;
const MAXIMUM_CANVAS_HEIGHT = 8192;

export async function createBlobFromDataURL(dataURL: string): Promise<Blob> {
    const blob = await fetch(dataURL).then(it => it.blob()); 
    return blob;
}

export function createFileFromBlob(blob: Blob, fileName: string, mimeType: MimeTypes, lastModifiedDate: number): File {
    const file = new File([blob], fileName, {type: mimeType, lastModified: lastModifiedDate});
    return file;
}


export function createElementaryCAImageImageData(startingGeneration: Uint8ClampedArray, generations: number, rule: number,  mimeType: ImageMimeType): ImageData {
    const width = startingGeneration.length;
    const height = generations;

    const imageDataU8 = new Uint8ClampedArray(width * height * 4);
    let currentGeneration = new Uint8ClampedArray([...startingGeneration]);
    
    for (let i = 0; i < generations; i++) {
        for (let col = 0; col < width; col++) {
            const color = currentGeneration[col] === 1 ? 255 : 0;
            imageDataU8[i * width * 4 + col * 4] = color; //R
            imageDataU8[i * width * 4 + col * 4 + 1] = color; //G
            imageDataU8[i * width * 4 + col * 4 + 2] = color; //B
            imageDataU8[i * width * 4 + col * 4 + 3] = 255; //A
        }
        currentGeneration = getNextElementaryGeneration(currentGeneration, rule)
    }

    const imageData: ImageData = new ImageData(imageDataU8, width, height);
    return imageData
}


export const MAX_ELEMENTARY_IMAGE_DATA_URL_WIDTH = MAXIMUM_CANVAS_WIDTH;
export const MAX_ELEMENTARY_IMAGE_DATA_URL_HEIGHT = MAXIMUM_CANVAS_HEIGHT;

export function createElementaryCAImageDataURL(startingGeneration: Uint8ClampedArray, generations: number, rule: number,  mimeType: ImageMimeType): string {
    if (!isValidElementaryRule(rule)) {
        throw new Error(`Cannot generate Elementary Data Image File from invalid rule (${rule}): Rule must be an integer between 0 and 255`)
    }
    if (generations < 0) {
        throw new Error(`Cannot generate Elementary Data Image File from invalid generation request (${generations}): Generations must be a positive integer less than or equal to ${MAX_ELEMENTARY_IMAGE_DATA_URL_HEIGHT}`)
    }
    if (generations > MAX_ELEMENTARY_IMAGE_DATA_URL_HEIGHT) {
        throw new Error(`Cannot generate Elementary Data Image File from invalid generation request (${generations}): Generations must be an integer less than the maximum height of ${MAX_ELEMENTARY_IMAGE_DATA_URL_HEIGHT}`)
    } 
    if (!Number.isInteger(generations)) {
        throw new Error(`Cannot generate Elementary Data Image File from invalid generation request (${generations}): Generations must a positive *integer* less than or equal to ${MAX_ELEMENTARY_IMAGE_DATA_URL_HEIGHT}`)
    }

    if (startingGeneration.length > MAX_ELEMENTARY_IMAGE_DATA_URL_WIDTH) {
        throw new Error(`Cannot generate Elementary Data Image File from invalid starting generation request (${[...startingGeneration.slice(0, 20)]}... len: ${startingGeneration.length}): Size of starting generation must be less than the maximum canvas width of ${MAX_ELEMENTARY_IMAGE_DATA_URL_WIDTH}`)
    }
    if (startingGeneration.length === 0) {
        throw new Error(`Cannot generate Elementary Data Image File from invalid starting generation request ([]... len: ${startingGeneration.length}): Size of starting generation must be greater than 0`)
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")
    if (context === null || context === undefined) {
        throw new Error("Cannot generate Elementary Data Image Data URL: Canvas 2D Context could not be generated")
    }

    const width = startingGeneration.length;
    const height = generations;

    const imageDataU8 = new Uint8ClampedArray(width * height * 4);
    let currentGeneration = new Uint8ClampedArray([...startingGeneration]);
    
    for (let i = 0; i < generations; i++) {
        for (let col = 0; col < width; col++) {
            const color = currentGeneration[col] === 1 ? 255 : 0;
            imageDataU8[i * width * 4 + col * 4] = color; //R
            imageDataU8[i * width * 4 + col * 4 + 1] = color; //G
            imageDataU8[i * width * 4 + col * 4 + 2] = color; //B
            imageDataU8[i * width * 4 + col * 4 + 3] = 255; //A
        }
        currentGeneration = getNextElementaryGeneration(currentGeneration, rule)
    }

    canvas.width = width;
    canvas.height = height;
    const imageData: ImageData = new ImageData(imageDataU8, width, height);
    context.putImageData(imageData, 0, 0);
    const dataURL = canvas.toDataURL(mimeType);
    return dataURL;
}

export async function createElementaryCAImageBlob(startingGeneration: Uint8ClampedArray, generations: number, rule: number,  mimeType: ImageMimeType): Promise<Blob> {
    const dataURL = createElementaryCAImageDataURL(startingGeneration, generations, rule, mimeType);
    const blob = await createBlobFromDataURL(dataURL);
    return blob;
}

/**
 * Make the user download a file onto their computer
 * 
 * NOTE: ONLY WORKS INSIDE THE CONTEXT OF THE BROWSER, SHOULD NOT BE USED SERVER-SIDE
 * NOTE: Since we are using vite as of now, this shouldn't matter, but in case of a switch to a different framework it will become necessary
 * NOTE: Implemented as a closure containing an anchor which is used to download files through simulated clicks
 * Probably would need to be modified to work in a non-static site generator, but it does fit into the context of this program
 */
export const requestWebDownload: (data: Blob, fileName: string) => void = ( () => {
    const downloadAnchor = document.createElement("a")
    downloadAnchor.setAttribute("data-purpose", "downloading")
    document.body.appendChild(downloadAnchor);
    
    return (data: Blob, fileName: string) => {
      const url = URL.createObjectURL(data)
      downloadAnchor.href = url
      downloadAnchor.download = fileName;
      downloadAnchor.click();
    }
  })()