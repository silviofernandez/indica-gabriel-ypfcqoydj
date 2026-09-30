import React, { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { Home, Menu, X, LogOut, User, CheckCircle2, ArrowRight } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function Layout() {
  const { user, logout, supabaseStatus } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Detecta scroll para aplicar efeito de blur e fundo semi-transparente
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fecha o menu mobile ao navegar
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U'

  return (
    <div className="flex flex-col min-h-screen bg-[#faf7f2] text-[#1f2933] font-sans antialiased selection:bg-[#1a5d8f] selection:text-white">
      {/* Header Fixo com Blur */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/85 backdrop-blur-md shadow-sm border-b border-[#e5e0d8]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Marca */}
            <Link
              to="/"
              className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#1a5d8f] rounded-lg p-1"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1a5d8f] flex items-center justify-center text-white shadow-md shadow-[#1a5d8f]/20 group-hover:bg-[#144a72] transition-colors">
                <Home className="w-5 h-5 transition-transform group-hover:scale-110 duration-200" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-[#0f2a43] leading-none">
                  Indica Gabriel
                </span>
                <span className="text-xs text-[#d9995b] font-medium tracking-wide mt-1">
                  Imobiliária Gabriel
                </span>
              </div>
            </Link>

            {/* Navegação Desktop */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className="text-sm font-semibold text-[#1f2933] hover:text-[#1a5d8f] transition-colors"
              >
                Início
              </Link>
              <a
                href="/#como-funciona"
                className="text-sm font-semibold text-[#6b7280] hover:text-[#1a5d8f] transition-colors"
              >
                Como Funciona
              </a>
              {user && (
                <Link
                  to="/dashboard"
                  className="text-sm font-semibold text-[#1a5d8f] hover:text-[#144a72] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Painel de Indicações
                </Link>
              )}
            </nav>

            {/* Ações de Usuário Desktop */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1a5d8f]">
                        <Avatar className="h-9 w-9 border-2 border-[#1a5d8f]">
                          <AvatarFallback className="bg-[#1a5d8f] text-white font-semibold text-sm">
                            {userInitial}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-semibold text-[#1f2933] max-w-[130px] truncate">
                          {user.name}
                        </span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 bg-white border-[#e5e0d8] shadow-lg rounded-xl"
                    >
                      <DropdownMenuLabel className="font-normal p-3">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-semibold text-[#0f2a43]">{user.name}</p>
                          <p className="text-xs text-[#6b7280] truncate">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-[#e5e0d8]" />
                      <DropdownMenuItem
                        onClick={() => navigate('/dashboard')}
                        className="cursor-pointer py-2.5 text-sm font-medium focus:bg-[#faf7f2] focus:text-[#1a5d8f]"
                      >
                        <User className="mr-2 h-4 w-4 text-[#1a5d8f]" />
                        Minha Conta / Painel
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-[#e5e0d8]" />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer py-2.5 text-sm font-medium text-red-600 focus:bg-red-50 focus:text-red-700"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair da Conta
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/auth?mode=login')}
                    className="border-[#1a5d8f] text-[#1a5d8f] hover:bg-[#1a5d8f] hover:text-white font-semibold rounded-lg px-4 h-10 transition-all duration-150"
                  >
                    Entrar
                  </Button>
                  <Button
                    onClick={() => navigate('/auth?mode=signup')}
                    className="bg-[#1a5d8f] hover:bg-[#144a72] text-white font-semibold rounded-lg px-5 h-10 shadow-sm hover:shadow transition-all duration-150 hover:scale-[1.02]"
                  >
                    Criar Conta
                  </Button>
                </div>
              )}
            </div>

            {/* Botão Hambúrguer Mobile */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-lg text-[#0f2a43] hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-[#1a5d8f]"
                aria-label="Abrir menu de navegação"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Mobile Lateral */}
        <div
          className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Backdrop Escuro */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Painel Deslizante */}
          <div
            className={`fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
              mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#e5e0d8]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#1a5d8f] flex items-center justify-center text-white">
                    <Home className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-lg text-[#0f2a43]">Indica Gabriel</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status do Backend */}
              <div className="mt-4 p-3 bg-[#faf7f2] border border-[#e5e0d8] rounded-lg flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-gray-700 font-medium truncate">
                  {supabaseStatus.connected
                    ? 'Conexão com Backend Ativa'
                    : 'Verificando Backend...'}
                </span>
              </div>

              {/* Links Mobile */}
              <nav className="mt-6 flex flex-col gap-2">
                <Link
                  to="/"
                  className="flex items-center justify-between p-3 rounded-lg text-[#1f2933] hover:bg-[#faf7f2] font-semibold text-base"
                >
                  Início
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
                <a
                  href="/#como-funciona"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-lg text-[#6b7280] hover:bg-[#faf7f2] font-semibold text-base"
                >
                  Como Funciona
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </a>
                {user && (
                  <Link
                    to="/dashboard"
                    className="flex items-center justify-between p-3 rounded-lg text-[#1a5d8f] bg-[#1a5d8f]/5 font-semibold text-base"
                  >
                    Painel de Indicações
                    <ArrowRight className="w-4 h-4 text-[#1a5d8f]" />
                  </Link>
                )}
              </nav>
            </div>

            {/* Rodapé do Menu Mobile */}
            <div className="pt-6 border-t border-[#e5e0d8] flex flex-col gap-3">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 p-2">
                    <Avatar className="h-10 w-10 border-2 border-[#1a5d8f]">
                      <AvatarFallback className="bg-[#1a5d8f] text-white font-bold">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                    <div className="truncate">
                      <p className="font-semibold text-sm text-[#0f2a43]">{user.name}</p>
                      <p className="text-xs text-[#6b7280] truncate">{user.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 font-semibold"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      navigate('/auth?mode=login')
                    }}
                    className="w-full border-[#1a5d8f] text-[#1a5d8f] font-semibold h-11"
                  >
                    Entrar
                  </Button>
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      navigate('/auth?mode=signup')
                    }}
                    className="w-full bg-[#1a5d8f] hover:bg-[#144a72] text-white font-semibold h-11"
                  >
                    Criar Conta
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal com compensação do Header */}
      <main className="flex-1 pt-20 flex flex-col">
        <Outlet />
      </main>

      {/* Rodapé Oficial da Imobiliária Gabriel */}
      <footer className="bg-[#0f2a43] text-white pt-16 pb-12 border-t border-[#1a5d8f]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-white/10">
            {/* Coluna 1: Marca */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1a5d8f] flex items-center justify-center text-white shadow">
                  <Home className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-tight text-white">
                    Indica Gabriel
                  </span>
                  <span className="text-xs text-[#d9995b] font-medium">Imobiliária Gabriel</span>
                </div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed max-w-sm">
                Conectando você às melhores oportunidades do mercado imobiliário. Indique clientes,
                acompanhe negócios e conquiste recompensas com total transparência e segurança.
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Backend Oficial Conectado & Operante</span>
              </div>
            </div>

            {/* Coluna 2: Links Rápidos */}
            <div className="flex flex-col space-y-3">
              <h3 className="text-base font-semibold text-white tracking-wide">Navegação Rápida</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link to="/" className="hover:text-[#d9995b] transition-colors">
                    Início
                  </Link>
                </li>
                <li>
                  <a href="/#como-funciona" className="hover:text-[#d9995b] transition-colors">
                    Como Funciona a Indicação
                  </a>
                </li>
                <li>
                  <Link to="/auth?mode=signup" className="hover:text-[#d9995b] transition-colors">
                    Criar Minha Conta
                  </Link>
                </li>
                <li>
                  <Link to="/auth?mode=login" className="hover:text-[#d9995b] transition-colors">
                    Acessar Plataforma
                  </Link>
                </li>
              </ul>
            </div>

            {/* Coluna 3: Redes Sociais e Contato */}
            <div className="flex flex-col space-y-3">
              <h3 className="text-base font-semibold text-white tracking-wide">
                Imobiliária Gabriel
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Atendimento consultivo, confiança e tradição na compra, venda e locação de imóveis.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <a
                  href="#instagram"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#d9995b] flex items-center justify-center transition-colors text-white"
                >
                  <span className="text-xs font-bold">IG</span>
                </a>
                <a
                  href="#facebook"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#d9995b] flex items-center justify-center transition-colors text-white"
                >
                  <span className="text-xs font-bold">FB</span>
                </a>
                <a
                  href="#whatsapp"
                  aria-label="WhatsApp"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#d9995b] flex items-center justify-center transition-colors text-white"
                >
                  <span className="text-xs font-bold">WA</span>
                </a>
              </div>
            </div>
          </div>

          {/* Linha Inferior */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
            <p>© 2025 Indica Gabriel — Imobiliária Gabriel. Todos os direitos reservados.</p>
            <p className="flex items-center gap-1">
              Plataforma desenvolvida para alta performance e segurança
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
