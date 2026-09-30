/**
 * Gabriel Branding Assets - Indica Gabriel
 *
 * Arquivo central de caminhos e referências visuais oficiais da Imobiliária Gabriel.
 * Permite manutenção simplificada pelo usuário:
 *
 * Pastas onde os arquivos originais residem:
 * - public/branding/g-symbol.jpeg (Símbolo G isolado original)
 * - public/branding/logo-completo.jpeg (Logo horizontal completo com G + Gabriel + Inovações Imobiliárias + CRECI)
 * - public/branding/logo-texto.jpeg (Wordmark Gabriel + Inovações Imobiliárias + CRECI sem a bola)
 *
 * Também importamos via bundler Vite (em src/assets/branding/) para hash de cache e carregamento direto.
 */

// Importações dos ativos oficiais empacotados pelo Vite
import gSymbolOrig from '@/assets/branding/g-symbol.jpeg'
import logoCompletoOrig from '@/assets/branding/logo-completo.jpeg'
import logoTextoOrig from '@/assets/branding/logo-texto.jpeg'

export interface BrandAssetConfig {
  /** Caminho do arquivo processado/importado pelo Vite */
  src: string
  /** Caminho público direto servido em /branding/... */
  publicPath: string
  /** Texto alternativo acessível */
  alt: string
  /** Proporção típica (largura / altura) */
  aspectRatio: number
}

export const GABRIEL_BRAND = {
  // Paleta oficial retirada dos assets enviados
  limeGreen: '#66cc33', // Verde-limão vibrante oficial dos logos 2 e 3
  darkGreen: '#1b4d24', // Verde clássico da imagem 1
  darkBg: '#0f171d', // Fundo escuro oficial
  creci: '29.083-J',
  companyName: 'Imobiliária Gabriel',
  tagline: 'Inovações Imobiliárias',
  website: 'https://www.imobiliariagabriel.com.br',
  assets: {
    symbol: {
      src: gSymbolOrig,
      publicPath: '/branding/g-symbol.jpeg',
      alt: 'Símbolo G Oficial — Imobiliária Gabriel',
      aspectRatio: 1, // Circular 1203 x 1214
    },
    full: {
      src: logoCompletoOrig,
      publicPath: '/branding/logo-completo.jpeg',
      alt: 'Logo Oficial Completo — Imobiliária Gabriel • CRECI 29.083-J',
      aspectRatio: 1695 / 563, // ~3.01:1
    },
    text: {
      src: logoTextoOrig,
      publicPath: '/branding/logo-texto.jpeg',
      alt: 'Gabriel Inovações Imobiliárias • CRECI 29.083-J',
      aspectRatio: 1101 / 404, // ~2.72:1
    },
  },
}

export { gSymbolOrig, logoCompletoOrig, logoTextoOrig }
