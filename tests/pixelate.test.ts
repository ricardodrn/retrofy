import { describe, it, expect } from 'vitest'
import { pixelate } from '../src/core/pixelate.js'
import type { ImageData } from '../src/adapters/types.js'

function makeBuffer(pixels: number[][]): Uint8ClampedArray {
  // pixels is array of [r, g, b, a]
  const data = new Uint8ClampedArray(pixels.length * 4)
  for (let i = 0; i < pixels.length; i++) {
    data[i * 4] = pixels[i][0]
    data[i * 4 + 1] = pixels[i][1]
    data[i * 4 + 2] = pixels[i][2]
    data[i * 4 + 3] = pixels[i][3] ?? 255
  }
  return data
}

describe('pixelate', () => {
  it('averages 2x2 blocks in a 4x4 image', () => {
    // 4x4 image, pixelSize=2
    // Top-left 2x2 block: (0,0), (1,0), (0,1), (1,1) → avg
    // We set them to distinct values and verify they collapse to their block average
    const pixels = Array.from({ length: 16 }, (_, i) => {
      const x = i % 4
      const y = Math.floor(i / 4)
      // block (0,0): rows 0-1, cols 0-1 → all red=40
      if (x < 2 && y < 2) return [40, 0, 0, 255]
      // block (1,0): rows 0-1, cols 2-3 → avg of 100 and 200 = 150
      if (x >= 2 && y < 2) return [x === 2 ? 100 : 200, 0, 0, 255]
      // block (0,1): rows 2-3, cols 0-1 → all green=80
      if (x < 2 && y >= 2) return [0, 80, 0, 255]
      // block (1,1): rows 2-3, cols 2-3 → all blue=120
      return [0, 0, 120, 255]
    })

    const data = makeBuffer(pixels)
    const image: ImageData = { data, width: 4, height: 4 }
    pixelate(image, 2)

    // block (0,0): all pixels should be [40, 0, 0, 255]
    for (const idx of [0, 1, 4, 5]) {
      expect(image.data[idx * 4]).toBe(40)
      expect(image.data[idx * 4 + 1]).toBe(0)
    }

    // block (1,0): avg of 100 and 200 = 150, cols 2 and 3, rows 0 and 1
    for (const idx of [2, 3, 6, 7]) {
      expect(image.data[idx * 4]).toBe(150)
    }

    // block (0,1): all green=80
    for (const idx of [8, 9, 12, 13]) {
      expect(image.data[idx * 4 + 1]).toBe(80)
    }

    // block (1,1): all blue=120
    for (const idx of [10, 11, 14, 15]) {
      expect(image.data[idx * 4 + 2]).toBe(120)
    }
  })

  it('handles pixelSize=1 (no change)', () => {
    const data = new Uint8ClampedArray([255, 0, 0, 255, 0, 255, 0, 255])
    const original = new Uint8ClampedArray(data)
    pixelate({ data, width: 2, height: 1 }, 1)
    expect(data).toEqual(original)
  })

  it('handles pixelSize larger than image', () => {
    const data = new Uint8ClampedArray([100, 50, 25, 255, 200, 150, 75, 255])
    pixelate({ data, width: 2, height: 1 }, 8)
    // avg: r=(100+200)/2=150, g=(50+150)/2=100, b=(25+75)/2=50
    expect(data[0]).toBe(150)
    expect(data[1]).toBe(100)
    expect(data[2]).toBe(50)
    expect(data[4]).toBe(150)
    expect(data[5]).toBe(100)
    expect(data[6]).toBe(50)
  })
})
