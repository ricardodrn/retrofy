import type { RGB } from '../index.js'
import { findClosestColor } from './palette.js'

// 4x4 Bayer ordered dithering matrix (normalized 0-1 by dividing by 16)
const BAYER_4X4 = [
  [ 0,  8,  2, 10],
  [12,  4, 14,  6],
  [ 3, 11,  1,  9],
  [15,  7, 13,  5],
]

export function floydSteinberg(buffer: Uint8ClampedArray, width: number, height: number, palette: RGB[]): void {
  // Work on float copy to accumulate errors without clamping
  const floats = new Float32Array(buffer.length)
  for (let i = 0; i < buffer.length; i++) floats[i] = buffer[i]

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4

      const oldR = Math.max(0, Math.min(255, floats[idx]))
      const oldG = Math.max(0, Math.min(255, floats[idx + 1]))
      const oldB = Math.max(0, Math.min(255, floats[idx + 2]))

      const [newR, newG, newB] = findClosestColor([Math.round(oldR), Math.round(oldG), Math.round(oldB)], palette)

      floats[idx] = newR
      floats[idx + 1] = newG
      floats[idx + 2] = newB

      const errR = oldR - newR
      const errG = oldG - newG
      const errB = oldB - newB

      const distribute = (dx: number, dy: number, factor: number) => {
        const nx = x + dx
        const ny = y + dy
        if (nx < 0 || nx >= width || ny >= height) return
        const ni = (ny * width + nx) * 4
        floats[ni] += errR * factor
        floats[ni + 1] += errG * factor
        floats[ni + 2] += errB * factor
      }

      distribute(1, 0, 7 / 16)
      distribute(-1, 1, 3 / 16)
      distribute(0, 1, 5 / 16)
      distribute(1, 1, 1 / 16)
    }
  }

  for (let i = 0; i < buffer.length; i++) {
    if (i % 4 !== 3) {
      buffer[i] = Math.max(0, Math.min(255, Math.round(floats[i])))
    }
  }
}

export function bayer(buffer: Uint8ClampedArray, width: number, height: number, palette: RGB[]): void {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4
      const threshold = (BAYER_4X4[y % 4][x % 4] / 16 - 0.5) * 64

      const r = Math.max(0, Math.min(255, buffer[idx] + threshold))
      const g = Math.max(0, Math.min(255, buffer[idx + 1] + threshold))
      const b = Math.max(0, Math.min(255, buffer[idx + 2] + threshold))

      const [nr, ng, nb] = findClosestColor([Math.round(r), Math.round(g), Math.round(b)], palette)
      buffer[idx] = nr
      buffer[idx + 1] = ng
      buffer[idx + 2] = nb
    }
  }
}
