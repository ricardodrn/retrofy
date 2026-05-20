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

<table style="border-collapse: collapse; border: none; margin: 10px 0;">
<tr>
<td style="width: 25px; height: 25px; background: #000000; border: 1px solid #999;"></td>
<td style="width: 25px; height: 25px; background: #1a0000; border: 1px solid #999;"></td>
<td style="width: 25px; height: 25px; background: #3f0700; border: 1px solid #999;"></td>
<td style="width: 25px; height: 25px; background: #5a1600; border: 1px solid #999;"></td>
<td style="width: 25px; height: 25px; background: #750000; border: 1px solid #999;"></td>
<td style="width: 25px; height: 25px; background: #7d2600; border: 1px solid #999;"></td>
<td style="width: 25px; height: 25px; background: #a03000; border: 1px solid #999;"></td>
<td style="width: 25px; height: 25px; background: #b03c00; border: 1px solid #999;"></td>
</tr>
<tr style="font-size: 12px; text-align: center;">
<td>#000000</td>
<td>#1a0000</td>
<td>#3f0700</td>
<td>#5a1600</td>
<td>#750000</td>
<td>#7d2600</td>
<td>#a03000</td>
<td>#b03c00</td>
</tr>
</table>

From deep black to burnt orange—and 56 more authentic colors in between.

**Game Boy — 4 colors**  
That iconic monochrome green screen from 1989. Nostalgic, minimal, unforgettable.

<table style="border-collapse: collapse; border: none; margin: 10px 0;">
<tr>
<td style="width: 40px; height: 40px; background: #0f380f; border: 1px solid #999;"></td>
<td style="width: 40px; height: 40px; background: #306230; border: 1px solid #999;"></td>
<td style="width: 40px; height: 40px; background: #8bac0f; border: 1px solid #999;"></td>
<td style="width: 40px; height: 40px; background: #9bbc0f; border: 1px solid #999;"></td>
</tr>
<tr style="font-size: 12px; text-align: center;">
<td>#0f380f</td>
<td>#306230</td>
<td>#8bac0f</td>
<td>#9bbc0f</td>
</tr>
</table>

**CGA — 16 colors**  
The legendary IBM PCjr (1984) color palette. Pure 80s computing vibes.

<table style="border-collapse: collapse; border: none; margin: 10px 0;">
<tr>
<td style="width: 30px; height: 30px; background: #000000; border: 1px solid #999;">#000000</td>
<td style="width: 30px; height: 30px; background: #0000aa; border: 1px solid #999;">#0000aa</td>
<td style="width: 30px; height: 30px; background: #00aa00; border: 1px solid #999;">#00aa00</td>
<td style="width: 30px; height: 30px; background: #00aaaa; border: 1px solid #999;">#00aaaa</td>
<td style="width: 30px; height: 30px; background: #aa0000; border: 1px solid #999;">#aa0000</td>
<td style="width: 30px; height: 30px; background: #aa00aa; border: 1px solid #999;">#aa00aa</td>
<td style="width: 30px; height: 30px; background: #aa5500; border: 1px solid #999;">#aa5500</td>
<td style="width: 30px; height: 30px; background: #aaaaaa; border: 1px solid #999;">#aaaaaa</td>
</tr>
<tr>
<td style="width: 30px; height: 30px; background: #555555; border: 1px solid #999;">#555555</td>
<td style="width: 30px; height: 30px; background: #5555ff; border: 1px solid #999;">#5555ff</td>
<td style="width: 30px; height: 30px; background: #55ff55; border: 1px solid #999;">#55ff55</td>
<td style="width: 30px; height: 30px; background: #55ffff; border: 1px solid #999;">#55ffff</td>
<td style="width: 30px; height: 30px; background: #ff5555; border: 1px solid #999;">#ff5555</td>
<td style="width: 30px; height: 30px; background: #ff55ff; border: 1px solid #999;">#ff55ff</td>
<td style="width: 30px; height: 30px; background: #ffff55; border: 1px solid #999;">#ffff55</td>
<td style="width: 30px; height: 30px; background: #ffffff; border: 1px solid #999;">#ffffff</td>
</tr>
</table>

**PICO-8 — 16 colors**  
Modern retro: the PICO-8 fantasy console's beloved 16-color set. Indie game darling.

<table style="border-collapse: collapse; border: none; margin: 10px 0;">
<tr>
<td style="width: 30px; height: 30px; background: #000000; border: 1px solid #999;">#000000</td>
<td style="width: 30px; height: 30px; background: #1d2b53; border: 1px solid #999;">#1d2b53</td>
<td style="width: 30px; height: 30px; background: #7e2553; border: 1px solid #999;">#7e2553</td>
<td style="width: 30px; height: 30px; background: #008751; border: 1px solid #999;">#008751</td>
</tr>
<tr>
<td style="width: 30px; height: 30px; background: #ab5236; border: 1px solid #999;">#ab5236</td>
<td style="width: 30px; height: 30px; background: #5f574f; border: 1px solid #999;">#5f574f</td>
<td style="width: 30px; height: 30px; background: #c2c3c7; border: 1px solid #999; color: #000;">#c2c3c7</td>
<td style="width: 30px; height: 30px; background: #fff1e8; border: 1px solid #999;">#fff1e8</td>
</tr>
<tr>
<td style="width: 30px; height: 30px; background: #ff004d; border: 1px solid #999;">#ff004d</td>
<td style="width: 30px; height: 30px; background: #ffa300; border: 1px solid #999;">#ffa300</td>
<td style="width: 30px; height: 30px; background: #ffec27; border: 1px solid #999;">#ffec27</td>
<td style="width: 30px; height: 30px; background: #00e436; border: 1px solid #999;">#00e436</td>
</tr>
<tr>
<td style="width: 30px; height: 30px; background: #29adff; border: 1px solid #999;">#29adff</td>
<td style="width: 30px; height: 30px; background: #83769c; border: 1px solid #999;">#83769c</td>
<td style="width: 30px; height: 30px; background: #ff77a8; border: 1px solid #999;">#ff77a8</td>
<td style="width: 30px; height: 30px; background: #ffccaa; border: 1px solid #999;">#ffccaa</td>
</tr>
</table>

## How It Works

**Pixelation** — Imagine dividing your image into a grid of blocks. retrofy averages all the colors in each block and paints the whole block with that single color. Bigger blocks = chunkier look. It's like viewing your image through a low-res security camera.

**Color Quantization** — Real hardware had limited colors. retrofy uses the median-cut algorithm to extract a balanced palette from your actual image — finding the most important colors and bundling similar ones together. This keeps your image looking good while respecting the palette limits.

**Dithering** — When you have fewer colors than you need, dithering tricks the eye into seeing more colors through patterns. **Floyd-Steinberg** spreads color errors to neighboring pixels for a smooth, natural look. **Bayer** creates a regular crosshatch pattern — more stylized, more "retro console."
