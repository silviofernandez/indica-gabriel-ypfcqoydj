import pb from '@/lib/pocketbase/client'

export type ReferralPropertyType = 'buyer' | 'rental' | 'sale' | 'vitacon'

export interface CreateReferralPayload {
  client_name: string
  client_contact: string
  property_type: ReferralPropertyType
  details?: string
  raw_transcription?: string
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
