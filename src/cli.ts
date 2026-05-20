#!/usr/bin/env node
import { parseArgs } from 'node:util'
import { retrofy } from './index.js'
import type { RetrofyOptions, PaletteName } from './index.js'

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    'pixel-size': { type: 'string', short: 'p' },
    palette: { type: 'string' },
    dithering: { type: 'string', short: 'd' },
    'color-depth': { type: 'string' },
    output: { type: 'string', short: 'o' },
    scale: { type: 'string', short: 's' },
    help: { type: 'boolean', short: 'h' },
  },
  allowPositionals: true,
})

if (values.help || positionals.length === 0) {
  console.log(`
Usage: retrofy <input> [options]

Options:
  -p, --pixel-size <n>      Block size in pixels (default: 8)
      --palette <name>      Palette: nes, gameboy, cga, pico8 (default: none)
  -d, --dithering <type>    none, floyd-steinberg, bayer (default: none)
      --color-depth <n>     Target color count: 8, 16, 32
  -o, --output <path>       Output file path (default: stdout)
  -s, --scale <n>           Output scale multiplier (default: 1)
  -h, --help                Show this help message
`.trim())
  process.exit(0)
}

const input = positionals[0]

const options: RetrofyOptions = {}

if (values['pixel-size']) options.pixelSize = parseInt(values['pixel-size'], 10)
if (values['palette']) options.palette = values['palette'] as PaletteName
if (values['dithering']) options.dithering = values['dithering'] as RetrofyOptions['dithering']
if (values['color-depth']) options.colorDepth = parseInt(values['color-depth'], 10) as 8 | 16 | 32
if (values['output']) options.output = values['output']
if (values['scale']) options.scale = parseFloat(values['scale'])

retrofy(input, options)
  .then((buf) => {
    if (!options.output) {
      process.stdout.write(buf)
    }
  })
  .catch((err: unknown) => {
    console.error('Error:', err instanceof Error ? err.message : String(err))
    process.exit(1)
  })
