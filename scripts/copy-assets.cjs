const fs = require('fs')
const path = require('path')

try {
  const src = path.resolve(__dirname, '../src/assets/img0183-e1d44.png')
  const dest = path.resolve(__dirname, '../public/logo-gabriel.png')
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest)
    console.log('Successfully copied logo to public/logo-gabriel.png')
  }
} catch (err) {
  console.error('Error copying asset:', err)
}
