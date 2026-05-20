import type { RGB } from '../index.js'

interface ColorBox {
  colors: RGB[]
  rMin: number; rMax: number
  gMin: number; gMax: number
  bMin: number; bMax: number
}

function makeBox(colors: RGB[]): ColorBox {
  let rMin = 255, rMax = 0, gMin = 255, gMax = 0, bMin = 255, bMax = 0
  for (const [r, g, b] of colors) {
    if (r < rMin) rMin = r; if (r > rMax) rMax = r
    if (g < gMin) gMin = g; if (g > gMax) gMax = g
    if (b < bMin) bMin = b; if (b > bMax) bMax = b
  }
  return { colors, rMin, rMax, gMin, gMax, bMin, bMax }
}

function splitBox(box: ColorBox): [ColorBox, ColorBox] {
  const rRange = box.rMax - box.rMin
  const gRange = box.gMax - box.gMin
  const bRange = box.bMax - box.bMin

  let channel: 0 | 1 | 2 = 0
  if (gRange >= rRange && gRange >= bRange) channel = 1
  else if (bRange >= rRange && bRange >= gRange) channel = 2

  const sorted = [...box.colors].sort((a, b) => a[channel] - b[channel])
  const mid = Math.floor(sorted.length / 2)

  return [makeBox(sorted.slice(0, mid)), makeBox(sorted.slice(mid))]
}

function boxToColor(box: ColorBox): RGB {
  let r = 0, g = 0, b = 0
  const n = box.colors.length
  for (const [cr, cg, cb] of box.colors) {
    r += cr; g += cg; b += cb
  }
  return [Math.round(r / n), Math.round(g / n), Math.round(b / n)]
}

export function quantize(buffer: Uint8ClampedArray, colorCount: number): RGB[] {
  const colors: RGB[] = []
  for (let i = 0; i < buffer.length; i += 4) {
    if (buffer[i + 3] > 0) {
      colors.push([buffer[i], buffer[i + 1], buffer[i + 2]])
    }
  }

  if (colors.length === 0) return []

  const boxes: ColorBox[] = [makeBox(colors)]

  while (boxes.length < colorCount) {
    // pick the box with the largest range to split
    let maxRange = -1
    let maxIdx = 0
    for (let i = 0; i < boxes.length; i++) {
      const b = boxes[i]
      const range = Math.max(b.rMax - b.rMin, b.gMax - b.gMin, b.bMax - b.bMin)
      if (range > maxRange) {
        maxRange = range
        maxIdx = i
      }
    }

    if (maxRange === 0) break

    const [a, b] = splitBox(boxes[maxIdx])
    boxes.splice(maxIdx, 1, a, b)
  }

  return boxes.map(boxToColor)
}
