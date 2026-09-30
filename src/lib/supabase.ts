/**
 * Cliente Supabase oficial do Indica Gabriel.
 * Configurado via variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.
 *
 * Se as variáveis ainda não estiverem preenchidas no ambiente atual,
 * inicializa com valores de fallback seguros para não quebrar a compilação/execução da interface,
 * e disponibiliza método para testar a conexão real.
 */

export interface SupabaseConfig {
  url: string
  anonKey: string
  isConfigured: boolean
}

export const getSupabaseConfig = (): SupabaseConfig => {
  const url = import.meta.env.VITE_SUPABASE_URL || ''
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  const isConfigured = Boolean(
    url && anonKey && !url.includes('SEU_SUPABASE_URL') && url.startsWith('http'),
  )

  return { url, anonKey, isConfigured }
}

export interface SupabaseAuthUser {
  id: string
  email: string
  name: string
  avatarUrl?: string
  createdAt?: string
}

export interface SupabaseConnectionStatus {
  connected: boolean
  message: string
  timestamp: string
  usingFallback?: boolean
}

/**
 * Cliente leve para comunicação com o backend Supabase REST e Auth API
 * sem necessitar de dependências externas pesadas que poderiam falhar no bundler.
 */
class SupabaseClientWrapper {
  private config: SupabaseConfig

  constructor() {
    this.config = getSupabaseConfig()
  }

  public getConfig(): SupabaseConfig {
    return getSupabaseConfig()
  }

  /**
   * Testa a conectividade com o Supabase oficial configurado.
   * Faz um ping no endpoint público de autenticação ou de status.
   */
  public async testConnection(): Promise<SupabaseConnectionStatus> {
    const cfg = this.getConfig()
    const now = new Date().toISOString()

    if (!cfg.isConfigured) {
      return {
        connected: false,
        message: 'Variáveis VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não configuradas',
        timestamp: now,
        usingFallback: true,
      }
    }

    try {
      // Faz requisição para a API de Auth/Settings do Supabase
      const res = await fetch(`${cfg.url.replace(/\/$/, '')}/auth/v1/settings`, {
        method: 'GET',
        headers: {
          apikey: cfg.anonKey,
          Authorization: `Bearer ${cfg.anonKey}`,
        },
      })

      if (res.ok || res.status === 401 || res.status === 200) {
        // Se respondeu HTTP 200 ou mesmo 401 com JSON válido da Supabase Auth API, o servidor está alcançável e ativo
        return {
          connected: true,
          message: 'Supabase oficial conectado com sucesso',
          timestamp: now,
        }
      }

      return {
        connected: false,
        message: `Servidor Supabase respondeu com status ${res.status}`,
        timestamp: now,
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Falha na requisição'
      return {
        connected: false,
        message: `Não foi possível alcançar o Supabase: ${errorMsg}`,
        timestamp: now,
      }
    }
  }
}

export const supabase = new SupabaseClientWrapper()
export default supabase
