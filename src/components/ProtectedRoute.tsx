import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-[#1a5d8f] animate-spin" />
        <p className="mt-3 text-sm text-[#6b7280]">Carregando sessão...</p>
      </div>
    )
  }

  if (!user) {
    // Redireciona para /auth mantendo a rota pretendida
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
