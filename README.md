# ✨ retrofy

Transform your photos into nostalgic pixel-art masterpieces with authentic retro gaming palettes — straight from the NES, Game Boy, CGA, and PICO-8 era.

Ever want to turn a selfie into an 8-bit character? Or make your vacation photos look like classic Nintendo box art? That's what retrofy does — it's your time machine for digital images.

## Get Started

```bash
npm install retrofy
```

## Quick Example

**In Node.js:**
```ts
import { retrofy } from 'retrofy'

const result = await retrofy('photo.jpg', {
  pixelSize: 8,           // Chunky 8×8 blocks
  palette: 'nes',         // Use authentic NES colors
  dithering: 'floyd-steinberg', // Smooth color transitions
  output: 'retro.png',    // Save the result
})
```

**Via CLI:**
```bash
retrofy photo.jpg --pixel-size 8 --palette nes --dithering floyd-steinberg --output retro.png
```

## Configuration

Fine-tune your retro transformation with these options:

| Option        | Type                                | Default | What it does                                       |
|---------------|-------------------------------------|---------|----------------------------------------------------|
| `pixelSize`   | `number`                            | `8`     | Size of each pixel block (bigger = chunkier)       |
| `palette`     | `'nes' \| 'gameboy' \| 'cga' \| 'pico8' \| RGB[]` | none | Which color set to use (or define your own)     |
| `dithering`   | `'none' \| 'floyd-steinberg' \| 'bayer'` | `'none'` | How to blend colors smoothly                     |
| `colorDepth`  | `8 \| 16 \| 32`                    | none    | How many colors to extract from your image         |
| `output`      | `string`                            | none    | Where to save the retro image                      |
| `scale`       | `number`                            | `1`     | Make it bigger without blurring (2× = double size) |

## Pick Your Era

Choose a palette that brings back memories — each one is authentic hardware:

**NES — 64 colors**  
The original 1983 Nintendo Entertainment System's PPU palette. Rich variety perfect for detailed pixel art.

<img width="1280" height="320" alt="imagen" src="https://github.com/user-attachments/assets/4dca6306-574f-43a8-9824-bca465e5ff0f" />


From deep black to burnt orange—and 56 more authentic colors in between.

**Game Boy — 4 colors**  
That iconic monochrome green screen from 1989. Nostalgic, minimal, unforgettable.

<img width="320" height="80" alt="imagen" src="https://github.com/user-attachments/assets/64a8caaf-58b9-488e-be78-9a60afc59ccd" />

**CGA — 16 colors**  
The legendary IBM PCjr (1984) color palette. Pure 80s computing vibes.

<img width="640" height="160" alt="imagen" src="https://github.com/user-attachments/assets/d031f858-25ac-4036-bb7f-c05ff1e02d9e" />

**PICO-8 — 16 colors**  
Modern retro: the PICO-8 fantasy console's beloved 16-color set. Indie game darling.

<img width="640" height="160" alt="imagen" src="https://github.com/user-attachments/assets/7f3c6d91-9604-4570-9d44-ae1481796e77" />


## How It Works

**Pixelation** — Imagine dividing your image into a grid of blocks. retrofy averages all the colors in each block and paints the whole block with that single color. Bigger blocks = chunkier look. It's like viewing your image through a low-res security camera.

**Color Quantization** — Real hardware had limited colors. retrofy uses the median-cut algorithm to extract a balanced palette from your actual image — finding the most important colors and bundling similar ones together. This keeps your image looking good while respecting the palette limits.

**Dithering** — When you have fewer colors than you need, dithering tricks the eye into seeing more colors through patterns. **Floyd-Steinberg** spreads color errors to neighboring pixels for a smooth, natural look. **Bayer** creates a regular crosshatch pattern — more stylized, more "retro console."
