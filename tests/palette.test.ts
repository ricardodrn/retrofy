import { describe, it, expect } from 'vitest'
import { findClosestColor, mapToPalette } from '../src/core/palette.js'
import { NES, GAMEBOY, CGA, PICO8 } from '../src/palettes/index.js'
import type { RGB } from '../src/index.js'

describe('findClosestColor', () => {
  it('returns exact match when present', () => {
    const palette: RGB[] = [[255, 0, 0], [0, 255, 0], [0, 0, 255]]
    expect(findClosestColor([0, 255, 0], palette)).toEqual([0, 255, 0])
  })

  it('returns nearest by Euclidean distance', () => {
    const palette: RGB[] = [[0, 0, 0], [255, 255, 255]]
    // 100 is closer to 0 than to 255
    expect(findClosestColor([100, 100, 100], palette)).toEqual([0, 0, 0])
    // 200 is closer to 255
    expect(findClosestColor([200, 200, 200], palette)).toEqual([255, 255, 255])
  })

  it('works with NES palette', () => {
    const pure_red: RGB = [255, 0, 0]
    const result = findClosestColor(pure_red, NES)
    expect(result).toHaveLength(3)
    expect(NES).toContainEqual(result)
  })

  it('works with GameBoy palette (4 colors)', () => {
    const result = findClosestColor([0, 200, 0], GAMEBOY)
    expect(GAMEBOY).toContainEqual(result)
  })

  it('works with CGA palette (16 colors)', () => {
    const result = findClosestColor([128, 128, 128], CGA)
    expect(CGA).toContainEqual(result)
  })

  it('works with PICO-8 palette (16 colors)', () => {
    const result = findClosestColor([255, 100, 0], PICO8)
    expect(PICO8).toContainEqual(result)
  })
})

describe('mapToPalette', () => {
  it('snaps all pixels to palette colors', () => {
    const palette: RGB[] = [[0, 0, 0], [255, 255, 255]]
    const data = new Uint8ClampedArray([100, 100, 100, 255, 200, 200, 200, 255])
    mapToPalette(data, palette)

    // first pixel (100) → black
    expect(data[0]).toBe(0)
    // second pixel (200) → white
    expect(data[4]).toBe(255)
  })

  it('preserves alpha channel', () => {
    const palette: RGB[] = [[0, 0, 0], [255, 255, 255]]
    const data = new Uint8ClampedArray([100, 100, 100, 128])
    mapToPalette(data, palette)
    expect(data[3]).toBe(128)
  })
})
