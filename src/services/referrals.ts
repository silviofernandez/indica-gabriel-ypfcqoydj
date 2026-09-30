import pb from '@/lib/pocketbase/client'

export type ReferralPropertyType = 'buyer' | 'rental' | 'sale' | 'vitacon'

export interface CreateReferralPayload {
  client_name: string
  client_contact: string
  property_type: ReferralPropertyType
  details?: string
  raw_transcription?: string
}

/**
 * Obtém o registro do indicator correspondente ao usuário autenticado ou perfil
 */
export async function getLoggedInIndicator(userId?: string): Promise<{
  id: string
  full_name?: string
  user_id?: string
  profile_id?: string
} | null> {
  const currentUserId = userId || pb.authStore.record?.id
  if (!currentUserId) return null

  // 1. Tenta buscar em indicators por user_id
  try {
    const ind = await pb.collection('indicators').getFirstListItem(`user_id="${currentUserId}"`)
    if (ind) {
      return {
        id: ind.id,
        full_name: ind.full_name,
        user_id: ind.user_id,
        profile_id: ind.profile_id,
      }
    }
  } catch {
    // Continua para fallback
  }

  // 2. Se não encontrou diretamente por user_id, tenta buscar pelo profile_id
  try {
    const profile = await pb.collection('profiles').getFirstListItem(`user_id="${currentUserId}"`)
    if (profile) {
      const ind = await pb.collection('indicators').getFirstListItem(`profile_id="${profile.id}"`)
      if (ind) {
        return {
          id: ind.id,
          full_name: ind.full_name,
          user_id: ind.user_id,
          profile_id: ind.profile_id,
        }
      }
    }
  } catch {
    // Silencioso
  }

  return null
}

/**
 * Busca as indicações pertencentes ao indicador logado respeitando o RLS/regras da API.
 * Se o indicador tiver seu ID em 'indicators', filtra por indicator_id="{id}".
 * Também se apoia na listRule: indicator_id.user_id = @request.auth.id
 */
export async function listIndicatorReferrals(indicatorId?: string): Promise<ReferralRecord[]> {
  try {
    const filter = indicatorId ? `indicator_id = "${indicatorId}"` : ''
    const records = await pb.collection('referrals').getFullList<ReferralRecord>({
      filter: filter || undefined,
      sort: '-created',
    })
    return records
  } catch (err) {
    console.warn('Erro ao listar indicações do indicador:', err)
    return []
  }
}

/**
 * Busca os bônus acumulados do indicador logado.
 */
export async function listIndicatorBonuses(indicatorId?: string): Promise<BonusRecord[]> {
  try {
    const filter = indicatorId ? `indicator_id = "${indicatorId}"` : ''
    const records = await pb.collection('bonuses').getFullList<BonusRecord>({
      filter: filter || undefined,
      sort: '-created',
      expand: 'referral_id',
    })
    return records
  } catch (err) {
    console.warn('Erro ao listar bônus do indicador:', err)
    return []
  }
}

/**
 * Carrega todos os dados consolidados do painel do indicador:
 * - Histórico de indicações
 * - Registros de bônus
 * - Totalizadores agregados
 */
export async function getIndicatorDashboardData(userId?: string): Promise<IndicatorSummary> {
  const indicator = await getLoggedInIndicator(userId)
  const indicatorId = indicator?.id

  // Executa leituras em paralelo
  const [referrals, bonuses] = await Promise.all([
    listIndicatorReferrals(indicatorId),
    listIndicatorBonuses(indicatorId),
  ])

  // Cálculo de bônus
  let totalBonusAccumulated = 0
  let totalBonusPaid = 0
  let totalBonusPending = 0

  for (const b of bonuses) {
    const val = Number(b.amount) || 0
    totalBonusAccumulated += val
    if (b.status === 'paid') {
      totalBonusPaid += val
    } else {
      totalBonusPending += val
    }
  }

  // Contadores de indicações
  // Em andamento: sent, in_analysis, visited, negotiating, in_progress
  // Concluídas: closed_won, closed, paid
  let inProgressCount = 0
  let closedCount = 0

  for (const r of referrals) {
    const s = (r.status || '').toLowerCase()
    if (s === 'closed_won' || s === 'closed' || s === 'paid') {
      closedCount++
    } else if (s === 'closed_lost' || s === 'cancelled' || s === 'expired') {
      // finalizadas sem sucesso
    } else {
      inProgressCount++
    }
  }

  return {
    indicatorId,
    totalReferrals: referrals.length,
    inProgressCount,
    closedCount,
    totalBonusAccumulated,
    totalBonusPaid,
    totalBonusPending,
    referrals,
    bonuses,
  }
}

export interface CreateReferralResponse {
  success: boolean
  id?: string
  client_name?: string
  client_contact?: string
  property_type?: string
  status?: string
  sla_deadline?: string
  sla_hours?: number
  message?: string
  error?: string
}

export type ReferralStatus =
  | 'sent'
  | 'in_analysis'
  | 'visited'
  | 'negotiating'
  | 'closed_won'
  | 'closed_lost'
  // Compatibilidade com possíveis valores futuros ou de documentação:
  | 'in_progress'
  | 'closed'
  | 'paid'
  | 'cancelled'
  | 'expired'
  | string

export interface ReferralRecord {
  id: string
  indicator_id: string
  client_name: string
  client_phone: string
  client_email?: string
  property_description?: string
  property_type: 'rental' | 'sale' | 'vitacon' | 'buyer' | string
  expected_value?: number
  status: ReferralStatus
  assigned_to?: string
  notes?: string
  raw_transcription?: string
  sla_deadline?: string
  created: string
  updated: string
  // Expansões opcionais PocketBase
  expand?: {
    indicator_id?: {
      id: string
      full_name?: string
      user_id?: string
    }
  }
}

export type BonusType =
  | 'rental_fixed'
  | 'buyer_percent'
  | 'sale_percent'
  | 'vitacon_percent'
  | string
export type BonusStatus = 'pending' | 'approved' | 'paid' | string

export interface BonusRecord {
  id: string
  referral_id: string
  indicator_id: string
  bonus_type: BonusType
  amount: number
  status: BonusStatus
  paid_at?: string
  created: string
  updated: string
  expand?: {
    referral_id?: ReferralRecord
  }
}

export interface IndicatorSummary {
  indicatorId?: string
  totalReferrals: number
  inProgressCount: number
  closedCount: number
  totalBonusAccumulated: number // Total de bônus acumulados (aprovados + pagos ou soma total dos bônus gerados)
  totalBonusPaid: number // Total de bônus já pagos
  totalBonusPending: number // Total de bônus pendentes / a receber
  referrals: ReferralRecord[]
  bonuses: BonusRecord[]
}

export interface TranscribeAudioResponse {
  text: string
  name?: string
  phone?: string
  error?: string
}

/**
 * Envia arquivo de áudio gravado para transcrição Whisper e extração heurística de Nome e Telefone
 */
export async function transcribeReferralAudio(audioBlob: Blob): Promise<{
  success: boolean
  data?: TranscribeAudioResponse
  error?: string
}> {
  try {
    const formData = new FormData()
    // Determina extensão apropriada
    const ext = audioBlob.type.includes('mp4') || audioBlob.type.includes('m4a') ? 'm4a' : 'webm'
    formData.append('audio', audioBlob, `audio_referral.${ext}`)

    const res = await pb.send<TranscribeAudioResponse>('/backend/v1/transcribe-referral-audio', {
      method: 'POST',
      body: formData,
    })

    return {
      success: true,
      data: res,
    }
  } catch (err: unknown) {
    const errorObj = err as { response?: { error?: string; message?: string }; message?: string }
    const errorMsg =
      errorObj?.response?.error ||
      errorObj?.response?.message ||
      errorObj?.message ||
      'Não consegui ouvir o áudio, tente de novo ou preencha manualmente.'
    return {
      success: false,
      error: errorMsg,
    }
  }
}

/**
 * Cria indicação no backend PocketBase calculando SLA de 3 horas e registrando histórico inicial
 */
export async function createReferral(payload: CreateReferralPayload): Promise<{
  success: boolean
  data?: CreateReferralResponse
  error?: string
}> {
  try {
    const res = await pb.send<CreateReferralResponse>('/backend/v1/create-referral', {
      method: 'POST',
      body: {
        client_name: payload.client_name,
        client_contact: payload.client_contact,
        property_type: payload.property_type,
        details: payload.details || '',
        raw_transcription: payload.raw_transcription || '',
      },
    })

    return {
      success: true,
      data: res,
    }
  } catch (err: unknown) {
    const errorObj = err as { response?: { error?: string; message?: string }; message?: string }
    const errorMsg =
      errorObj?.response?.error ||
      errorObj?.response?.message ||
      errorObj?.message ||
      'Não foi possível registrar a indicação. Verifique os dados e tente novamente.'
    return {
      success: false,
      error: errorMsg,
    }
  }
}
