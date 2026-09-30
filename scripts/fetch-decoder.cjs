const fs = require('fs')
const https = require('https')
const path = require('path')

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    https
      .get(url, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          return download(response.headers.location, dest).then(resolve).catch(reject)
        }
        response.pipe(file)
        file.on('finish', () => {
          file.close(resolve)
        })
      })
      .on('error', (err) => {
        fs.unlink(dest, () => {})
        reject(err)
      })
  })
}

async function run() {
  const targetDir = path.resolve(__dirname, 'vendor-jpeg')
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })
  console.log('Downloading decoder.js...')
  await download(
    'https://raw.githubusercontent.com/jpeg-js/jpeg-js/v0.4.4/lib/decoder.js',
    path.join(targetDir, 'decoder.js'),
  )
  console.log('Done downloading.')
}

run().catch(console.error)
