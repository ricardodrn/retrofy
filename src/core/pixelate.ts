import type { ImageData } from '../adapters/types.js'

export function pixelate(image: ImageData, pixelSize: number): void {
  const { data, width, height } = image

  for (let blockY = 0; blockY < height; blockY += pixelSize) {
    for (let blockX = 0; blockX < width; blockX += pixelSize) {
      const blockW = Math.min(pixelSize, width - blockX)
      const blockH = Math.min(pixelSize, height - blockY)
      const count = blockW * blockH

      let sumR = 0, sumG = 0, sumB = 0, sumA = 0

      for (let dy = 0; dy < blockH; dy++) {
        for (let dx = 0; dx < blockW; dx++) {
          const idx = ((blockY + dy) * width + (blockX + dx)) * 4
          sumR += data[idx]
          sumG += data[idx + 1]
          sumB += data[idx + 2]
          sumA += data[idx + 3]
        }
      }

      const avgR = Math.round(sumR / count)
      const avgG = Math.round(sumG / count)
      const avgB = Math.round(sumB / count)
      const avgA = Math.round(sumA / count)

      for (let dy = 0; dy < blockH; dy++) {
        for (let dx = 0; dx < blockW; dx++) {
          const idx = ((blockY + dy) * width + (blockX + dx)) * 4
          data[idx] = avgR
          data[idx + 1] = avgG
          data[idx + 2] = avgB
          data[idx + 3] = avgA
        }
      }
    }
  }
}
