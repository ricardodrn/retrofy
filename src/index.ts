import { writeFile } from 'node:fs/promises'
import { decodeImage, encodeImageScaled } from './adapters/node.js'
import { pixelate } from './core/pixelate.js'
import { mapToPalette } from './core/palette.js'
import { floydSteinberg, bayer } from './core/dither.js'
import { quantize } from './core/quantize.js'
import { getPalette } from './palettes/index.js'
import type { PaletteName } from './palettes/index.js'

export type { PaletteName }
export type RGB = [number, number, number]

export interface RetrofyOptions {
  pixelSize?: number
  palette?: PaletteName | RGB[]
  dithering?: 'none' | 'floyd-steinberg' | 'bayer'
  colorDepth?: 8 | 16 | 32
  output?: string
  scale?: number
}

export async function retrofy(input: string | Buffer, options: RetrofyOptions = {}): Promise<Buffer> {
  const {
    pixelSize = 8,
    palette,
    dithering = 'none',
    colorDepth,
    output,
    scale = 1,
  } = options

  const image = await decodeImage(input)

  if (pixelSize > 1) {
    pixelate(image, pixelSize)
  }

  let resolvedPalette: RGB[] | undefined

  if (typeof palette === 'string') {
    resolvedPalette = getPalette(palette)
  } else if (Array.isArray(palette)) {
    resolvedPalette = palette
  } else if (colorDepth) {
    resolvedPalette = quantize(image.data, colorDepth)
  }

  if (resolvedPalette && resolvedPalette.length > 0) {
    if (dithering === 'floyd-steinberg') {
      floydSteinberg(image.data, image.width, image.height, resolvedPalette)
    } else if (dithering === 'bayer') {
      bayer(image.data, image.width, image.height, resolvedPalette)
    } else {
      mapToPalette(image.data, resolvedPalette)
    }
  }

  const result = await encodeImageScaled(image, scale)

  if (output) {
    await writeFile(output, result)
  }

  return result
}

export { findClosestColor, mapToPalette } from './core/palette.js'
export { pixelate } from './core/pixelate.js'
export { quantize } from './core/quantize.js'
export { floydSteinberg, bayer } from './core/dither.js'
export { NES, GAMEBOY, CGA, PICO8 } from './palettes/index.js'
