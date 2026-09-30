import React, { useEffect, useState } from 'react'
import { Settings, Shield, Percent, DollarSign, RefreshCw, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import pb from '@/lib/pocketbase/client'

interface BonusSettingRecord {
  id: string
  key: string
  value: string
  description: string
}

export default function AdminConfiguracoes() {
  const [settings, setSettings] = useState<BonusSettingRecord[]>([])
  const [loading, setLoading] = useState(true)

  const loadSettings = async () => {
    setLoading(true)
    try {
      const records = await pb.collection('bonus_settings').getFullList<BonusSettingRecord>({
        sort: 'key',
      })
      setSettings(records)
    } catch (err) {
      console.warn('Erro ao carregar bonus_settings:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadSettings()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1a5d8f]/10 text-xs font-semibold text-[#1a5d8f] mb-2">
            <Shield className="w-3.5 h-3.5" />
            Acesso Restrito: Master
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0f2a43]">
            Configurações de Bônus & Parâmetros
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Valores padrão aplicados automaticamente nas indicações fechadas com sucesso.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={loadSettings}
          disabled={loading}
          className="border-[#e5e0d8] text-gray-700 hover:bg-[#faf7f2]"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Recarregar Parâmetros
        </Button>
      </div>

      {/* Tabela Viva das Configurações Iniciais da Coleção bonus_settings */}
      <Card className="border-[#e5e0d8] shadow-sm bg-white">
        <CardHeader className="border-b border-[#e5e0d8] pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#1a5d8f]" />
              <CardTitle className="text-lg font-bold text-[#0f2a43]">
                Tabela: bonus_settings (Dados Reais do Backend)
              </CardTitle>
            </div>
            <Badge className="bg-emerald-600 text-white">4 Registros Ativos</Badge>
          </div>
          <CardDescription>
            Valores iniciais semeados e persistidos no Skip Cloud / PocketBase.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#faf7f2] text-xs font-semibold uppercase text-gray-500 border-b border-[#e5e0d8]">
                <tr>
                  <th className="py-3 px-4">Chave (Key)</th>
                  <th className="py-3 px-4">Valor Cadastrado</th>
                  <th className="py-3 px-4">Descrição Oficial</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e0d8]">
                {settings.length > 0 ? (
                  settings.map((item) => (
                    <tr key={item.id} className="hover:bg-[#faf7f2]/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-[#1a5d8f]">
                        {item.key}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                          {item.key.includes('amount') ? (
                            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Percent className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {item.value}
                          {item.key.includes('percent') ? '%' : ' R$'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-xs sm:text-sm">
                        {item.description}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-500">
                      {loading ? 'Carregando parâmetros...' : 'Nenhum parâmetro encontrado.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-[#faf7f2] border border-[#e5e0d8] flex items-center gap-3 text-xs text-gray-600">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-semibold text-[#0f2a43]">Valores iniciais integrados:</p>
              <p>
                <code>rental_fixed_amount: 200</code> | <code>buyer_percent: 0.5%</code> |{' '}
                <code>sale_percent: 1%</code> | <code>vitacon_percent: 1%</code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
