import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Home, AlertCircle, Loader2, Lock, Mail } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Se já autenticado, redireciona de acordo com o papel ou fluxo de troca de senha
  useEffect(() => {
    if (user) {
      if (user.must_change_password) {
        navigate('/trocar-senha', { replace: true })
        return
      }
      // Redireciona para o destino pretendido ou dashboard por papel
      const stateFrom = (location.state as { from?: { pathname?: string } })?.from?.pathname
      if (stateFrom && stateFrom !== '/login' && stateFrom !== '/auth') {
        navigate(stateFrom, { replace: true })
        return
      }
      const destination = user.role === 'indicador' ? '/indicador' : '/admin'
      navigate(destination, { replace: true })
    }
  }, [user, navigate, location.state])

  // Campos do formulário
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Estados de submissão e validação
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    const errors: { [key: string]: string } = {}

    const cleanEmail = email.trim()
    if (!cleanEmail) {
      errors.email = 'Informe seu e-mail'
    } else if (!/\S+@\S+\.\S+/.test(cleanEmail)) {
      errors.email = 'Digite um e-mail válido'
    }

    if (!password) {
      errors.password = 'Informe sua senha'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setLoading(true)
    try {
      const res = await login(cleanEmail, password)
      if (!res.success) {
        setErrorMessage(res.error || 'E-mail ou senha incorretos.')
      }
      // Caso de sucesso: o useEffect cuidará do redirecionamento com base no perfil carregado
    } catch {
      setErrorMessage('E-mail ou senha incorretos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-[#0f2a43] via-[#15466d] to-[#1a5d8f] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Cabeçalho da Autenticação */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md text-white border border-white/20 mb-4 hover:bg-white/15 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-[#1a5d8f] flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold tracking-tight">Indica Gabriel</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Acessar Plataforma
          </h1>
          <p className="text-sm text-gray-300 mt-1.5">
            Entre com suas credenciais para gerenciar suas indicações
          </p>
        </div>

        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/20">
          {/* Alerta de erro amigável sem jargão técnico */}
          {errorMessage && (
            <Alert className="mb-6 bg-red-50 border-red-200 text-red-800">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              <AlertDescription className="text-sm font-medium">{errorMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="login-email" className="text-sm font-semibold text-[#1f2933]">
                E-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (fieldErrors.email) {
                      setFieldErrors({ ...fieldErrors, email: '' })
                    }
                  }}
                  className={`pl-10 h-11 rounded-lg border-[#e5e0d8] focus-visible:ring-[#1a5d8f] ${
                    fieldErrors.email ? 'border-red-500' : ''
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-red-600 font-medium">{fieldErrors.email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password" className="text-sm font-semibold text-[#1f2933]">
                  Senha
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-[#1a5d8f] hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (fieldErrors.password) {
                      setFieldErrors({ ...fieldErrors, password: '' })
                    }
                  }}
                  className={`pl-10 h-11 rounded-lg border-[#e5e0d8] focus-visible:ring-[#1a5d8f] ${
                    fieldErrors.password ? 'border-red-500' : ''
                  }`}
                />
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-red-600 font-medium">{fieldErrors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a5d8f] hover:bg-[#144a72] text-white font-bold h-11 rounded-lg mt-2 shadow-md transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>

            <div className="text-center pt-3 border-t border-[#e5e0d8] mt-4">
              <p className="text-xs text-gray-600">
                Ainda não tem conta de indicador?{' '}
                <Link to="/auth?mode=signup" className="font-bold text-[#1a5d8f] hover:underline">
                  Criar conta
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
