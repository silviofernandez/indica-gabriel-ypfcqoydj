import React from 'react'
import { ShieldCheck, BarChart3, Users, Building, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#0f2a43] to-[#15466d] rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs font-semibold text-[#d9995b] mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Módulo Administrativo ({user?.role?.toUpperCase() || 'ADMIN'})
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Painel Admin</h1>
          <p className="text-sm text-gray-200 mt-1 max-w-xl">
            Visão gerencial da Imobiliária Gabriel: controle de indicações recebidas, pipeline de
            vendas, corretores e bônus.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[#e5e0d8] shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-medium text-gray-500">
              Total de Indicações
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-[#0f2a43]">0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-gray-400" />
              Todas as categorias
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#e5e0d8] shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-medium text-gray-500">
              Indicadores Cadastrados
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-[#1a5d8f]">1</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-[#1a5d8f] flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              Perfis vinculados
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#e5e0d8] shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-medium text-gray-500">
              Em Negociação
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-amber-600">0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-amber-600 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              Pipeline ativo
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#e5e0d8] shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-medium text-gray-500">
              Bônus a Pagar
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-600">R$ 0,00</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-emerald-600">Aguardando fechamentos</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-[#e5e0d8] shadow-sm bg-white">
        <CardHeader className="border-b border-[#e5e0d8] pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#1a5d8f]" />
              <CardTitle className="text-lg font-bold text-[#0f2a43]">
                Painel Geral de Indicações
              </CardTitle>
            </div>
            <Badge variant="outline" className="border-[#e5e0d8] text-gray-600">
              Esqueleto Ativo
            </Badge>
          </div>
          <CardDescription>
            Tabela operacional com status, corretor atribuído e aprovação de bônus.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-10 pb-14 text-center">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#faf7f2] border border-[#e5e0d8] flex items-center justify-center mx-auto text-[#1a5d8f]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-[#0f2a43]">Conteúdo em breve</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Aqui a equipa interna poderá gerenciar status, transferir contatos entre corretores e
              auditar o funil de indicações.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
