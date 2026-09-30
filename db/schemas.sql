-- ============================================================================
-- INDICA GABRIEL — PLATAFORMA DE INDICAÇÕES IMOBILIÁRIAS
-- Schema DDL PostgreSQL / Supabase para as 9 tabelas do sistema
-- ============================================================================

-- Habilita extensão para UUIDs se ainda não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. TEAMS (Equipas / Times de Vendas)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    leader_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_teams_leader ON public.teams (leader_id);
CREATE INDEX IF NOT EXISTS idx_teams_active ON public.teams (active);

-- ============================================================================
-- 2. PROFILES (Perfis de usuário estendendo auth.users)
-- ============================================================================
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('indicador', 'master', 'operator', 'manager');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    role user_role_enum NOT NULL DEFAULT 'indicador',
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_user ON public.profiles (user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role);
CREATE INDEX IF NOT EXISTS idx_profiles_team ON public.profiles (team_id);

-- ============================================================================
-- 3. INDICATORS (Perfil e dados cadastrais/financeiros do Indicador)
-- ============================================================================
DO $$ BEGIN
    CREATE TYPE pix_key_type_enum AS ENUM ('cpf', 'cnpj', 'email', 'phone', 'random');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.indicators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    cpf_cnpj TEXT,
    phone TEXT,
    pix_key TEXT,
    pix_key_type pix_key_type_enum,
    bank_info JSONB DEFAULT '{}'::jsonb,
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_indicators_user ON public.indicators (user_id);
CREATE INDEX IF NOT EXISTS idx_indicators_approved ON public.indicators (approved);

-- ============================================================================
-- 4. TEAM_MEMBERS (Membros e lideranças das equipas)
-- ============================================================================
DO $$ BEGIN
    CREATE TYPE team_role_enum AS ENUM ('leader', 'member');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_in_team team_role_enum NOT NULL DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_team_user UNIQUE (team_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_team_members_team ON public.team_members (team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user ON public.team_members (user_id);

-- ============================================================================
-- 5. REFERRALS (Indicações Imobiliárias — Entidade Central)
-- ============================================================================
DO $$ BEGIN
    CREATE TYPE property_type_enum AS ENUM ('rental', 'sale', 'vitacon');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE referral_status_enum AS ENUM (
        'sent',
        'in_analysis',
        'visited',
        'negotiating',
        'closed_won',
        'closed_lost'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    indicator_id UUID NOT NULL REFERENCES public.indicators(id) ON DELETE RESTRICT,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    client_email TEXT,
    property_description TEXT,
    property_type property_type_enum NOT NULL DEFAULT 'sale',
    expected_value NUMERIC(12, 2),
    status referral_status_enum NOT NULL DEFAULT 'sent',
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referrals_indicator ON public.referrals (indicator_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON public.referrals (status);
CREATE INDEX IF NOT EXISTS idx_referrals_assigned ON public.referrals (assigned_to);
CREATE INDEX IF NOT EXISTS idx_referrals_property_type ON public.referrals (property_type);

-- ============================================================================
-- 6. REFERRAL_STATUS_HISTORY (Histórico de alterações e auditoria de status)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.referral_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referral_id UUID NOT NULL REFERENCES public.referrals(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refhist_referral ON public.referral_status_history (referral_id);
CREATE INDEX IF NOT EXISTS idx_refhist_changedby ON public.referral_status_history (changed_by);

-- ============================================================================
-- 7. BONUSES (Bônus e Comissões de Indicações)
-- ============================================================================
DO $$ BEGIN
    CREATE TYPE bonus_type_enum AS ENUM ('rental_fixed', 'buyer_percent', 'sale_percent', 'vitacon_percent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE bonus_status_enum AS ENUM ('pending', 'approved', 'paid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.bonuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referral_id UUID NOT NULL REFERENCES public.referrals(id) ON DELETE RESTRICT,
    indicator_id UUID NOT NULL REFERENCES public.indicators(id) ON DELETE RESTRICT,
    bonus_type bonus_type_enum NOT NULL,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status bonus_status_enum NOT NULL DEFAULT 'pending',
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bonuses_referral ON public.bonuses (referral_id);
CREATE INDEX IF NOT EXISTS idx_bonuses_indicator ON public.bonuses (indicator_id);
CREATE INDEX IF NOT EXISTS idx_bonuses_status ON public.bonuses (status);

-- ============================================================================
-- 8. BONUS_SETTINGS (Tabela Chave/Valor de Parâmetros de Recompensa)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.bonus_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_bonus_settings_key ON public.bonus_settings (key);

-- Seed idempotente das configurações iniciais de bônus
INSERT INTO public.bonus_settings (key, value, description)
VALUES
    ('rental_fixed_amount', '200', 'Valor fixo padrão (R$) pago ao indicador por locação concluída com sucesso'),
    ('buyer_percent', '0.5', 'Percentual (%) de bônus sobre o valor da transação para indicação de comprador'),
    ('sale_percent', '1', 'Percentual (%) de bônus sobre o valor da transação para indicação de venda/proprietário'),
    ('vitacon_percent', '1', 'Percentual (%) de bônus sobre unidades ou projetos parceiros Vitacon')
ON CONFLICT (key) DO UPDATE
SET
    value = EXCLUDED.value,
    description = EXCLUDED.description,
    updated_at = NOW();

-- ============================================================================
-- 9. NOTIFICATIONS_LOG (Log de Notificações do Sistema)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notifications_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    referral_id UUID REFERENCES public.referrals(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notif_user ON public.notifications_log (user_id);
CREATE INDEX IF NOT EXISTS idx_notif_referral ON public.notifications_log (referral_id);
CREATE INDEX IF NOT EXISTS idx_notif_read ON public.notifications_log (read);

-- ============================================================================
-- POLICIES DE RLS BÁSICAS (Row Level Security)
-- ============================================================================
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bonuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bonus_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications_log ENABLE ROW LEVEL SECURITY;

-- Leitura pública para autenticados e regras base
CREATE POLICY "Autenticados podem ler teams" ON public.teams FOR SELECT TO authenticated USING (true);
CREATE POLICY "Autenticados podem ler profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Usuário pode atualizar seu próprio profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Autenticados podem ler indicators" ON public.indicators FOR SELECT TO authenticated USING (true);
CREATE POLICY "Usuário pode gerenciar seu indicator" ON public.indicators FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Autenticados podem ler bonus_settings" ON public.bonus_settings FOR SELECT TO authenticated USING (true);
