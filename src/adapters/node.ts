import sharp from 'sharp'
import type { ImageData } from './types.js'

export async function decodeImage(input: string | Buffer): Promise<ImageData> {
  const image = sharp(input)
  const { width, height } = await image.metadata()

  if (!width || !height) throw new Error('Unable to read image dimensions')

  const raw = await image.ensureAlpha().raw().toBuffer()
  return {
    data: new Uint8ClampedArray(raw.buffer, raw.byteOffset, raw.byteLength),
    width,
    height,
  }
}

export async function encodeImage(image: ImageData): Promise<Buffer> {
  return sharp(Buffer.from(image.data.buffer, image.data.byteOffset, image.data.byteLength), {
    raw: { width: image.width, height: image.height, channels: 4 },
  })
    .png()
    .toBuffer()
}

export async function encodeImageScaled(image: ImageData, scale: number): Promise<Buffer> {
  return sharp(Buffer.from(image.data.buffer, image.data.byteOffset, image.data.byteLength), {
    raw: { width: image.width, height: image.height, channels: 4 },
  })
    .resize(image.width * scale, image.height * scale, { kernel: 'nearest' })
    .png()
    .toBuffer()
}
