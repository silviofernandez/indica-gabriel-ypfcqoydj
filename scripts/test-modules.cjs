const fs = require('fs')
const path = require('path')

console.log('Testing modules...')
const modules = ['canvas', 'sharp', 'jimp', 'jpeg-js', 'pngjs']
const available = {}
modules.forEach((m) => {
  try {
    require(m)
    available[m] = true
  } catch (e) {
    available[m] = false
  }
})
fs.writeFileSync(
  path.resolve(__dirname, 'available-modules.json'),
  JSON.stringify(available, null, 2),
)
