const fs = require('fs')
const path = require('path')
const decoderExport = require('./vendor-jpeg/decoder.js')
const decodeJpeg = typeof decoderExport === 'function' ? decoderExport : decoderExport.decode
console.log('decoderExport type:', typeof decoderExport, Object.keys(decoderExport || {}))

const assetsDir = path.resolve(__dirname, '../src/assets')
const img1Buf = fs.readFileSync(path.join(assetsDir, 'img2016-69cdb.jpeg'))
const img2Buf = fs.readFileSync(path.join(assetsDir, 'img2018-d5709.jpeg'))
const img3Buf = fs.readFileSync(path.join(assetsDir, 'img2019-e0ea7.jpeg'))

console.log('Decoding img1...')
const dec1 = decodeJpeg(img1Buf, { useTArray: true })
console.log('Img1:', dec1.width, dec1.height, 'length:', dec1.data.length)

console.log('Decoding img2...')
const dec2 = decodeJpeg(img2Buf, { useTArray: true })
console.log('Img2:', dec2.width, dec2.height, 'length:', dec2.data.length)

console.log('Decoding img3...')
const dec3 = decodeJpeg(img3Buf, { useTArray: true })
console.log('Img3:', dec3.width, dec3.height, 'length:', dec3.data.length)

// Sample colors: corners (background) and green pixels
function analyzeImage(dec, name) {
  const { width, height, data } = dec
  // Corner 0,0
  const cR = data[0],
    cG = data[1],
    cB = data[2]
  console.log(`${name} corner (0,0): rgb(${cR}, ${cG}, ${cB})`)

  // Find highest green saturation pixel
  let maxGreenDiff = -999
  let sampleGreen = [0, 0, 0]
  let darkCount = 0
  let brightCount = 0
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2]
    const brightness = (r + g + b) / 3
    if (brightness < 30) darkCount++
    else brightCount++
    const diff = g - Math.max(r, b)
    if (diff > maxGreenDiff && g > 100) {
      maxGreenDiff = diff
      sampleGreen = [r, g, b]
    }
  }
  console.log(`${name} dark pixels: ${darkCount}, non-dark: ${brightCount}`)
  console.log(`${name} most saturated green: rgb(${sampleGreen.join(', ')})`)
  return { corner: [cR, cG, cB], green: sampleGreen, darkCount, brightCount }
}

const res = {
  img1: analyzeImage(dec1, 'img1 (symbol)'),
  img2: analyzeImage(dec2, 'img2 (completo)'),
  img3: analyzeImage(dec3, 'img3 (texto)'),
}

fs.writeFileSync(path.resolve(__dirname, 'color-analysis.json'), JSON.stringify(res, null, 2))
console.log('Saved color analysis!')
