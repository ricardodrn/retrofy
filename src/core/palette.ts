import type { RGB } from '../index.js'

export function findClosestColor(pixel: RGB, palette: RGB[]): RGB {
  let minDist = Infinity
  let closest = palette[0]

  for (const color of palette) {
    const dr = pixel[0] - color[0]
    const dg = pixel[1] - color[1]
    const db = pixel[2] - color[2]
    const dist = dr * dr + dg * dg + db * db
    if (dist < minDist) {
      minDist = dist
      closest = color
      if (dist === 0) break
    }
  }

  return closest
}

export function mapToPalette(buffer: Uint8ClampedArray, palette: RGB[]): void {
  for (let i = 0; i < buffer.length; i += 4) {
    const pixel: RGB = [buffer[i], buffer[i + 1], buffer[i + 2]]
    const closest = findClosestColor(pixel, palette)
    buffer[i] = closest[0]
    buffer[i + 1] = closest[1]
    buffer[i + 2] = closest[2]
    // alpha (i+3) is preserved
  }
}
