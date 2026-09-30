// Utilitário para gerar ícones PNG a partir do logo anexado usando HTML5 Canvas em runtime (navegador)
// e fallback de logo perfeito SVG/Canvas.
// Importante: src/assets/img0183-e1d44.png é empacotado pelo Vite e acessível via importação direta.

import logoGabrielPng from '@/assets/img0183-e1d44.png'

export { logoGabrielPng }

/**
 * Retorna as coordenadas do símbolo G verde (corte da parte superior da imagem)
 * Na imagem anexada oficial:
 * Dimensões da imagem original: 1000 x 874 (aproximadamente)
 * O G verde circular fica na metade superior: 0% a ~60% vertical
 * A palavra "Gabriel" + INOVAÇÕES IMOBILIÁRIAS + CRECI 17.051 fica na metade inferior: ~55% a 100%
 */

export const GABRIEL_BRAND = {
  primaryGreen: '#14522a',
  primaryGreenLight: '#1b6e39',
  taglineColor: '#1f2933',
  fontFamily: 'Montserrat, system-ui, sans-serif',
}
