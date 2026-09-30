const fs = require('fs')
const path = require('path')

/**
 * Script de pré-compilação para padronizar e distribuir os assets oficiais da marca Gabriel.
 *
 * Arquivos oficiais de entrada em src/assets/:
 * - img2016-69cdb.jpeg -> Imagem 1: Símbolo G circular isolado
 * - img2018-d5709.jpeg -> Imagem 2: Logo horizontal completo (G + Gabriel + Inovações + CRECI 29.083-J)
 * - img2019-e0ea7.jpeg -> Imagem 3: Logo horizontal só texto (Gabriel + Inovações + CRECI 29.083-J)
 *
 * Distribui para:
 * 1. src/assets/branding/ (g-symbol.jpeg, logo-completo.jpeg, logo-texto.jpeg)
 * 2. public/branding/ (g-symbol.jpeg, logo-completo.jpeg, logo-texto.jpeg)
 * 3. public/logo-gabriel.png (compatibilidade legada)
 */

try {
  const rootDir = path.resolve(__dirname, '..')
  const srcAssets = path.join(rootDir, 'src/assets')
  const srcBranding = path.join(rootDir, 'src/assets/branding')
  const publicBranding = path.join(rootDir, 'public/branding')

  if (!fs.existsSync(srcBranding)) fs.mkdirSync(srcBranding, { recursive: true })
  if (!fs.existsSync(publicBranding)) fs.mkdirSync(publicBranding, { recursive: true })

  const map = [
    { src: path.join(srcAssets, 'img2016-69cdb.jpeg'), name: 'g-symbol.jpeg' },
    { src: path.join(srcAssets, 'img2018-d5709.jpeg'), name: 'logo-completo.jpeg' },
    { src: path.join(srcAssets, 'img2019-e0ea7.jpeg'), name: 'logo-texto.jpeg' },
  ]

  map.forEach(({ src, name }) => {
    if (fs.existsSync(src)) {
      // Copia para src/assets/branding
      fs.copyFileSync(src, path.join(srcBranding, name))
      // Copia para public/branding
      fs.copyFileSync(src, path.join(publicBranding, name))
      console.log(`Copied ${name} to src/assets/branding and public/branding`)
    } else {
      console.warn(`Source file not found: ${src}`)
    }
  })

  // Fallback de compatibilidade
  const symbolSrc = path.join(srcAssets, 'img2016-69cdb.jpeg')
  if (fs.existsSync(symbolSrc)) {
    fs.copyFileSync(symbolSrc, path.join(rootDir, 'public/logo-gabriel.png'))
  }
} catch (err) {
  console.error('Error copying branding assets:', err)
}
