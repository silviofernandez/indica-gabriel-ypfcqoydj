const fs = require('fs')
const path = require('path')

const symbolPath = path.resolve(__dirname, '../public/branding/g-symbol.jpeg')
const completePath = path.resolve(__dirname, '../public/branding/logo-completo.jpeg')
const textPath = path.resolve(__dirname, '../public/branding/logo-texto.jpeg')

const symbolBase64 = fs.readFileSync(symbolPath).toString('base64')
const completeBase64 = fs.readFileSync(completePath).toString('base64')
const textBase64 = fs.readFileSync(textPath).toString('base64')

console.log('Symbol length b64:', symbolBase64.length)
console.log('Complete length b64:', completeBase64.length)
console.log('Text length b64:', textBase64.length)
