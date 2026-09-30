import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Send, Sparkles, Building2, User, Phone, Mail, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function NovaIndicacao() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header com Voltar */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="text-gray-600 hover:text-[#1a5d8f]">
          <Link to="/indicador" className="flex items-center gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            Voltar para Minhas Indicações
          </Link>
        </Button>
        <Badge className="bg-[#1a5d8f] text-white">Esqueleto Navegável</Badge>
      </div>

      <Card className="border-[#e5e0d8] shadow-sm bg-white">
        <CardHeader className="border-b border-[#e5e0d8] pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1a5d8f]/10 text-[#1a5d8f] flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-[#0f2a43]">
                Nova Indicação
              </CardTitle>
              <CardDescription className="text-sm text-gray-500 mt-1">
                Envie dados de um cliente interessado em compra, locação ou empreendimentos Vitacon.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-8 pb-12 space-y-6">
          {/* Mock dos campos que existirão */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-75 pointer-events-none">
            <div className="p-4 rounded-xl border border-dashed border-[#e5e0d8] bg-[#faf7f2] flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs font-semibold text-gray-500">Nome do Cliente</p>
                <p className="text-sm font-medium text-gray-400">Ex.: Carlos Eduardo Santos</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-dashed border-[#e5e0d8] bg-[#faf7f2] flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs font-semibold text-gray-500">Telefone / WhatsApp</p>
                <p className="text-sm font-medium text-gray-400">(11) 98765-4321</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-dashed border-[#e5e0d8] bg-[#faf7f2] flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs font-semibold text-gray-500">E-mail do Cliente</p>
                <p className="text-sm font-medium text-gray-400">carlos@exemplo.com</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-dashed border-[#e5e0d8] bg-[#faf7f2] flex items-center gap-3">
              <Building2 className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs font-semibold text-gray-500">Tipo de Negócio</p>
                <p className="text-sm font-medium text-gray-400">Locação / Venda / Vitacon</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-dashed border-[#e5e0d8] bg-[#faf7f2] flex items-center gap-3 sm:col-span-2">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs font-semibold text-gray-500">
                  Valor Estimado do Imóvel / Negócio
                </p>
                <p className="text-sm font-medium text-gray-400">R$ 500.000,00</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#faf7f2] border border-[#e5e0d8] text-center max-w-md mx-auto space-y-3">
            <div className="w-10 h-10 rounded-full bg-white border border-[#e5e0d8] flex items-center justify-center mx-auto text-[#d9995b]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#0f2a43]">Formulário em construção</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              O formulário funcional com validação e salvamento direto na coleção{' '}
              <code>referrals</code> será implementado no próximo ciclo de funcionalidades.
            </p>
            <Button disabled className="bg-[#1a5d8f] text-white opacity-60 cursor-not-allowed">
              Enviar Indicação (Em breve)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
