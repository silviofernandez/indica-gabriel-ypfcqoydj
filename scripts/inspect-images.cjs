const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Run inspect script and save output
try {
  const assetsDir = path.resolve(__dirname, '../src/assets')
  const files = ['img2016-69cdb.jpeg', 'img2018-d5709.jpeg', 'img2019-e0ea7.jpeg']

  function getDimensions(filePath) {
    const buf = fs.readFileSync(filePath)
    let offset = 2
    while (offset < buf.length) {
      if (buf[offset] !== 0xff) break
      const marker = buf[offset + 1]
      if (marker === 0xc0 || marker === 0xc2) {
        const height = buf.readUInt16BE(offset + 5)
        const width = buf.readUInt16BE(offset + 7)
        return { width, height, size: buf.length }
      }
      const len = buf.readUInt16BE(offset + 2)
      offset += 2 + len
    }
    return { width: null, height: null, size: buf.length }
  }

  const report = files.map((f) => {
    const p = path.join(assetsDir, f)
    return { file: f, ...getDimensions(p) }
  })

  fs.writeFileSync(path.resolve(__dirname, 'dims-report.json'), JSON.stringify(report, null, 2))
} catch (e) {
  console.error(e)
}
