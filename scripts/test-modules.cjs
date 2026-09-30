const fs = require('fs')
const path = require('path')

const modules = ['canvas', 'sharp', 'jimp', 'zlib', 'pngjs', 'jpeg-js']
const res = {}
modules.forEach((m) => {
  try {
    require(m)
    res[m] = true
  } catch (e) {
    res[m] = false
  }
})

fs.writeFileSync(path.resolve(__dirname, 'modules-result.json'), JSON.stringify(res, null, 2))
