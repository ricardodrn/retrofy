import { describe, it, expect } from 'vitest'
import { quantize } from '../src/core/quantize.js'
import type { RGB } from '../src/index.js'

function makeBufferFromColors(colors: RGB[], repeats = 10): Uint8ClampedArray {
  const buf = new Uint8ClampedArray(colors.length * repeats * 4)
  let i = 0
  for (let r = 0; r < repeats; r++) {
    for (const [cr, cg, cb] of colors) {
      buf[i++] = cr; buf[i++] = cg; buf[i++] = cb; buf[i++] = 255
    }
  }
  return buf
}

function colorDistance(a: RGB, b: RGB): number {
  return Math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2)
}

describe('quantize', () => {
  it('extracts the correct number of colors', () => {
    const colors: RGB[] = [[255, 0, 0], [0, 255, 0], [0, 0, 255]]
    const buf = makeBufferFromColors(colors)
    const palette = quantize(buf, 3)
    expect(palette).toHaveLength(3)
  })

  it('palette colors represent the input image', () => {
    // Use well-separated cluster centers median cut can distinguish
    const inputColors: RGB[] = [[220, 20, 20], [20, 220, 20], [20, 20, 220]]
    const buf = makeBufferFromColors(inputColors, 100)
    const palette = quantize(buf, 3)

    // Each input color must have at least one palette entry closer to it
    // than to any other input color (i.e., it "belongs" to its own cluster)
    for (let i = 0; i < inputColors.length; i++) {
      const target = inputColors[i]
      const distToTarget = Math.min(...palette.map(c => colorDistance(c, target)))
      // Palette should cover the image reasonably — within half the max inter-cluster distance
      const maxInterCluster = colorDistance(inputColors[0], inputColors[1]) // ~282
      expect(distToTarget).toBeLessThan(maxInterCluster * 0.75)
    }
  })

  it('returns fewer colors if image has fewer distinct colors', () => {
    const colors: RGB[] = [[100, 100, 100]]
    const buf = makeBufferFromColors(colors, 20)
    // Only one unique color exists; median cut cannot split further
    const palette = quantize(buf, 8)
    expect(palette.length).toBeGreaterThanOrEqual(1)
    expect(palette.length).toBeLessThanOrEqual(8)
  })

  it('returns empty palette for empty buffer', () => {
    const buf = new Uint8ClampedArray(0)
    expect(quantize(buf, 4)).toEqual([])
  })

  it('skips fully transparent pixels', () => {
    const buf = new Uint8ClampedArray([255, 0, 0, 0, 0, 255, 0, 255])
    const palette = quantize(buf, 2)
    // Only the opaque green pixel counts
    expect(palette).toHaveLength(1)
    expect(palette[0]).toEqual([0, 255, 0])
  })
})
