import React from 'react'
import logoGabrielPng from '@/assets/img0183-e1d44.png'

interface GabrielLogoProps {
  /**
   * 'symbol': Mostra apenas o "G" verde circular oficial da Gabriel
   * 'full': Mostra a composição completa clássica (G verde circular + Gabriel + Inovações Imobiliárias / CRECI)
   * 'responsive': No mobile (< sm ou < md) mostra apenas o G, e em telas maiores mostra o G + Nome Gabriel
   */
  variant?: 'symbol' | 'full' | 'responsive'
  /**
   * Tamanho base em pixels ou classes tailwind
   */
  className?: string
  /**
   * Altura do G em pixels quando for símbolo isolado (padrão 36)
   */
  size?: number
  /**
   * Se está sobre fundo escuro (como Hero ou Footer), aplica fundo/contraste clássico ou chip
   */
  inverted?: boolean
  /**
   * Exibir o texto com estilo de subtítulo personalizado ou clássico
   */
  showTagline?: boolean
}

/**
 * Componente do Logo Oficial da Imobiliária Gabriel
 * Recorta perfeitamente o 'G' circular verde oficial a partir do ativo original de alta resolução
 * ou renderiza a composição completa clássica.
 */
export const GabrielLogo: React.FC<GabrielLogoProps> = ({
  variant = 'responsive',
  className = '',
  size = 36,
  inverted = false,
  showTagline = true,
}) => {
  // Renderizador do Símbolo "G" circular
  const renderSymbol = (customSize = size) => {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden rounded-full ${
          inverted ? 'bg-white shadow-sm ring-1 ring-white/20' : 'bg-transparent'
        }`}
        style={{
          width: customSize,
          height: customSize,
          padding: inverted ? Math.max(2, Math.floor(customSize * 0.08)) : 0,
        }}
        aria-label="Logo Imobiliária Gabriel - Símbolo G"
        title="Imobiliária Gabriel"
      >
        <div
          className="w-full h-full relative overflow-hidden"
          style={{
            borderRadius: '50%',
          }}
        >
          {/*
            A imagem oficial tem o G verde circular no topo centralizado.
            Aplicamos object-fit cover e object-position: center 2% para focar exatamente no círculo G.
          */}
          <img
            src={logoGabrielPng}
            alt="G — Imobiliária Gabriel"
            className="w-full h-full object-cover select-none pointer-events-none"
            style={{
              objectPosition: '50% 3%',
              transform: 'scale(1.78)',
            }}
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
    )
  }

  // Renderizador Completo: G + Gabriel
  const renderFull = () => {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {renderSymbol(size)}
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`font-black tracking-tight text-xl ${
                inverted ? 'text-white' : 'text-[#0f2a43]'
              }`}
              style={{ letterSpacing: '-0.02em' }}
            >
              Indica
            </span>
            <span
              className={`font-bold tracking-tight text-xl ${
                inverted ? 'text-emerald-400' : 'text-[#14522a]'
              }`}
              style={{ letterSpacing: '-0.01em' }}
            >
              Gabriel
            </span>
          </div>
          {showTagline && (
            <div className="flex items-center gap-1.5 mt-1">
              <span
                className={`text-[10px] font-semibold tracking-wider uppercase ${
                  inverted ? 'text-gray-300' : 'text-gray-500'
                }`}
              >
                Imobiliária Gabriel
              </span>
              <span
                className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                  inverted
                    ? 'bg-white/10 text-emerald-300 border border-white/10'
                    : 'bg-[#14522a]/10 text-[#14522a]'
                }`}
              >
                CRECI 17.051
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (variant === 'symbol') {
    return <div className={`inline-flex items-center ${className}`}>{renderSymbol(size)}</div>
  }

  if (variant === 'full') {
    return renderFull()
  }

  // Responsivo: No mobile mostra o G + Indica (compacto); no desktop mostra G + Gabriel + Indica
  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      {renderSymbol(size)}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline gap-1">
          <span
            className={`font-black tracking-tight text-lg sm:text-xl ${
              inverted ? 'text-white' : 'text-[#0f2a43]'
            }`}
          >
            Indica
          </span>
          <span
            className={`font-bold tracking-tight text-lg sm:text-xl ${
              inverted ? 'text-emerald-400' : 'text-[#14522a]'
            }`}
          >
            Gabriel
          </span>
        </div>
        {/* Mostra "Imobiliária Gabriel" onde houver mais espaço */}
        <span
          className={`hidden sm:inline-block text-[11px] font-medium tracking-wide mt-0.5 ${
            inverted ? 'text-[#d9995b]' : 'text-gray-500'
          }`}
        >
          Imobiliária Gabriel • CRECI 17.051
        </span>
      </div>
    </div>
  )
}

/**
 * Logo Clássico Oficial Completo (a imagem original com o G + escrita Gabriel + Inovações Imobiliárias + CRECI)
 */
export const GabrielOfficialLogoImg: React.FC<{
  className?: string
  inverted?: boolean
  maxHeight?: number
}> = ({ className = '', inverted = false, maxHeight = 70 }) => {
  return (
    <div
      className={`inline-block ${inverted ? 'p-2 rounded-xl bg-white shadow-sm' : ''} ${className}`}
    >
      <img
        src={logoGabrielPng}
        alt="Imobiliária Gabriel - Inovações Imobiliárias - CRECI 17.051"
        style={{ maxHeight, width: 'auto', objectFit: 'contain' }}
        className="select-none"
        loading="lazy"
      />
    </div>
  )
}

export default GabrielLogo
