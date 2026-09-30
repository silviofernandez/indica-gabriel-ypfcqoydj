const fs = require('fs')
const path = require('path')

const assetsDir = path.resolve(__dirname, '../src/assets')
const files = fs.readdirSync(assetsDir)
const report = []

function getJpegDimensions(buffer) {
  let offset = 2
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) break
    const marker = buffer[offset + 1]
    if (marker === 0xc0 || marker === 0xc2) {
      const height = buffer.readUInt16BE(offset + 5)
      const width = buffer.readUInt16BE(offset + 7)
      return { width, height }
    }
    const len = buffer.readUInt16BE(offset + 2)
    offset += 2 + len
  }
  return null
}

function getPngDimensions(buffer) {
  if (buffer.length > 24 && buffer.toString('ascii', 1, 4) === 'PNG') {
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
    }
  }
  return null
}

files.forEach((f) => {
  const filePath = path.join(assetsDir, f)
  const buf = fs.readFileSync(filePath)
  const dims = f.endsWith('.png') ? getPngDimensions(buf) : getJpegDimensions(buf)
  report.push({ file: f, size: buf.length, dims })
})

fs.writeFileSync(path.resolve(__dirname, 'dims-report.json'), JSON.stringify(report, null, 2))
