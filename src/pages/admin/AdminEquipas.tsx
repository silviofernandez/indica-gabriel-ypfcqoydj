import React from 'react'
import { Users2, Plus, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function AdminEquipas() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1a5d8f]/10 text-xs font-semibold text-[#1a5d8f] mb-2">
            <Shield className="w-3.5 h-3.5" />
            Acesso Restrito: Master
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0f2a43]">
            Gestão de Equipas
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Organize os corretores em grupos, atribua líderes e defina metas por equipe.
          </p>
        </div>

        <Button disabled className="bg-[#1a5d8f] text-white opacity-60 cursor-not-allowed">
          <Plus className="w-4 h-4 mr-2" />
          Nova Equipa (Em breve)
        </Button>
      </div>

      <Card className="border-[#e5e0d8] shadow-sm bg-white">
        <CardHeader className="border-b border-[#e5e0d8] pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users2 className="w-5 h-5 text-[#1a5d8f]" />
              <CardTitle className="text-lg font-bold text-[#0f2a43]">
                Equipas Cadastradas
              </CardTitle>
            </div>
            <Badge variant="outline" className="border-[#e5e0d8] text-gray-600">
              Esqueleto Ativo
            </Badge>
          </div>
          <CardDescription>
            Conectado às tabelas <code>teams</code> e <code>team_members</code> do Skip Cloud.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-10 pb-14 text-center">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#faf7f2] border border-[#e5e0d8] flex items-center justify-center mx-auto text-[#1a5d8f]">
              <Users2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-[#0f2a43]">Conteúdo em breve</h3>
            <p className="text-sm text-gray-500">
              O módulo de cadastro de times e vinculação de corretores membros será implementado na
              próxima fase.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
