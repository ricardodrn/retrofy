import type { RGB } from '../index.js'
import { NES } from './nes.js'
import { GAMEBOY } from './gameboy.js'
import { CGA } from './cga.js'
import { PICO8 } from './pico8.js'

export type PaletteName = 'nes' | 'gameboy' | 'cga' | 'pico8'

const registry: Record<PaletteName, RGB[]> = {
  nes: NES,
  gameboy: GAMEBOY,
  cga: CGA,
  pico8: PICO8,
}

export function getPalette(name: PaletteName): RGB[] {
  return registry[name]
}

export { NES, GAMEBOY, CGA, PICO8 }
