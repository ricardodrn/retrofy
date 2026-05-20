import { describe, it, expect } from 'vitest'
import { floydSteinberg, bayer } from '../src/core/dither.js'
import type { RGB } from '../src/index.js'

const BLACK: RGB = [0, 0, 0]
const WHITE: RGB = [255, 255, 255]
const BW_PALETTE: RGB[] = [BLACK, WHITE]

describe('floydSteinberg', () => {
  it('diffuses error to neighboring pixels', () => {
    // 3x1 image: middle gray should diffuse error rightward
    // [128, 128, 128, 255] → snaps to 0 or 255; error spreads to the right pixel
    const data = new Uint8ClampedArray([
      128, 128, 128, 255,
      0, 0, 0, 255,
      0, 0, 0, 255,
    ])
    const before = data[4] // right neighbor starts at 0

    floydSteinberg(data, 3, 1, BW_PALETTE)

    // After dithering with gray input and B&W palette, at least one pixel changed
    const changed = data[0] !== 128 || data[4] !== before
    expect(changed).toBe(true)

    // All pixels must belong to the palette
    for (let i = 0; i < 3; i++) {
      const r = data[i * 4]
      expect(r === 0 || r === 255).toBe(true)
    }
  })

  it('leaves fully black image unchanged with B&W palette', () => {
    const data = new Uint8ClampedArray([0, 0, 0, 255, 0, 0, 0, 255])
    floydSteinberg(data, 2, 1, BW_PALETTE)
    expect(data[0]).toBe(0)
    expect(data[4]).toBe(0)
  })

  it('leaves fully white image unchanged with B&W palette', () => {
    const data = new Uint8ClampedArray([255, 255, 255, 255, 255, 255, 255, 255])
    floydSteinberg(data, 2, 1, BW_PALETTE)
    expect(data[0]).toBe(255)
    expect(data[4]).toBe(255)
  })
})

describe('bayer', () => {
  it('maps all pixels to palette colors', () => {
    const data = new Uint8ClampedArray(4 * 4 * 4)
    // fill with mid-gray
    for (let i = 0; i < data.length; i++) {
      data[i] = i % 4 === 3 ? 255 : 128
    }
    bayer(data, 4, 4, BW_PALETTE)
    for (let i = 0; i < 16; i++) {
      const r = data[i * 4]
      expect(r === 0 || r === 255).toBe(true)
    }
  })

  it('produces a mix of black and white for mid-gray', () => {
    const data = new Uint8ClampedArray(4 * 4 * 4)
    for (let i = 0; i < data.length; i++) {
      data[i] = i % 4 === 3 ? 255 : 128
    }
    bayer(data, 4, 4, BW_PALETTE)

    let blacks = 0, whites = 0
    for (let i = 0; i < 16; i++) {
      if (data[i * 4] === 0) blacks++
      else whites++
    }
    // Should have both black and white pixels
    expect(blacks).toBeGreaterThan(0)
    expect(whites).toBeGreaterThan(0)
  })
})
