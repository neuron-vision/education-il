import sharp from 'sharp'
import { mkdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const svgPath = path.join(root, 'src', 'icon.svg')
const outDir = path.join(root, 'public')

const sizes = [
  { file: 'favicon-16.png', size: 16 },
  { file: 'favicon-32.png', size: 32 },
  { file: 'favicon-192.png', size: 192 },
  { file: 'favicon-512.png', size: 512 },
  { file: 'apple-touch-icon.png', size: 180 },
]

async function run() {
  await mkdir(outDir, { recursive: true })
  const svgBuffer = await readFile(svgPath)

  for (const { file, size } of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(outDir, file))
    console.log(`generated ${file}`)
  }

  // favicon.ico from the 32px png
  await sharp(svgBuffer).resize(32, 32).png().toFile(path.join(outDir, 'favicon.ico'))
  console.log('generated favicon.ico')

  // OG / social preview image: 1200x630 with centered icon on gradient background
  const ogWidth = 1200
  const ogHeight = 630
  const iconSize = 280

  const iconPng = await sharp(svgBuffer).resize(iconSize, iconSize).png().toBuffer()

  const background = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${ogWidth}" height="${ogHeight}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#1e3a8a"/>
          <stop offset="1" stop-color="#2563eb"/>
        </linearGradient>
      </defs>
      <rect width="${ogWidth}" height="${ogHeight}" fill="url(#bg)"/>
      <text x="${ogWidth / 2}" y="520" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="700" fill="#ffffff">Israel Education Dashboard</text>
      <text x="${ogWidth / 2}" y="568" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" fill="#dbeafe">PISA · TIMSS · Meitzav — trends over time vs. the world</text>
    </svg>`
  )

  await sharp(background)
    .composite([
      {
        input: iconPng,
        left: Math.round((ogWidth - iconSize) / 2),
        top: 70,
      },
    ])
    .png()
    .toFile(path.join(outDir, 'og-image.png'))
  console.log('generated og-image.png')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
