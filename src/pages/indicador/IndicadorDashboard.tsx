import React from 'react'
import { Link } from 'react-router-dom'
import { PlusCircle, ListOrdered, Sparkles, Clock, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'

export default function IndicadorDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0f2a43] to-[#1a5d8f] rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs font-semibold text-[#d9995b] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Portal do Indicador
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Olá, {user?.name?.split(' ')[0] || 'Indicador'}!
          </h1>
          <p className="text-sm text-gray-200 mt-1 max-w-xl">
            Acompanhe o andamento das suas indicações imobiliárias e solicite novas oportunidades
            para a Imobiliária Gabriel.
          </p>
        </div>

        <Button
          asChild
          className="bg-[#d9995b] hover:bg-[#c48548] text-white font-bold px-5 h-11 rounded-xl shadow shrink-0"
        >
          <Link to="/indicador/nova-indicacao" className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Nova Indicação
          </Link>
        </Button>
      </div>

      {/* Cards de Métricas (Esqueleto informativo) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-[#e5e0d8] shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-medium text-gray-500">
              Total de Indicações
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-[#0f2a43]">0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              Nenhuma indicação cadastrada ainda
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#e5e0d8] shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-medium text-gray-500">
              Em Análise / Andamento
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-[#1a5d8f]">0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#1a5d8f]" />
              Em contato e visitas
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#e5e0d8] shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-medium text-gray-500">
              Bônus Acumulado
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-600">R$ 0,00</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Recompensas liberadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder de Minhas Indicações */}
      <Card className="border-[#e5e0d8] shadow-sm bg-white">
        <CardHeader className="border-b border-[#e5e0d8] pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListOrdered className="w-5 h-5 text-[#1a5d8f]" />
              <CardTitle className="text-lg font-bold text-[#0f2a43]">Minhas Indicações</CardTitle>
            </div>
            <Badge variant="outline" className="text-xs text-gray-600 border-[#e5e0d8]">
              Esqueleto Ativo
            </Badge>
          </div>
          <CardDescription>
            Tabela de indicações, status em tempo real e valores esperados.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 pb-12 text-center">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#faf7f2] border border-[#e5e0d8] flex items-center justify-center mx-auto text-[#1a5d8f]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-[#0f2a43]">Conteúdo em breve</h3>
            <p className="text-sm text-gray-500">
              A listagem funcional das suas indicações com filtros por status e histórico detalhado
              estará disponível na próxima etapa.
            </p>
            <div className="pt-2">
              <Button asChild variant="outline" className="border-[#1a5d8f] text-[#1a5d8f]">
                <Link to="/indicador/nova-indicacao">Criar Primeira Indicação</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
