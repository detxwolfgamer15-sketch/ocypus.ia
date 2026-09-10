-- =====================================================================
-- OCYPUS AI - SUPABASE INITIAL SCHEMA MIGRATION
-- Migration: 20260910000001_initial_schema.sql
-- Description: Core tables, RLS security policies, and initial seeds.
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'blocked')),
    requests_count INT NOT NULL DEFAULT 0,
    tokens_limit BIGINT NOT NULL DEFAULT 50000,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS public.conversations (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL DEFAULT 'Nova Conversa',
    category TEXT NOT NULL DEFAULT 'Hoje',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    mode TEXT NOT NULL DEFAULT 'general' CHECK (mode IN ('general', 'apk', 'spreadsheet', 'code', 'image')),
    language TEXT,
    spreadsheet_data JSONB,
    apk_data JSONB,
    generated_images JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. APK PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.apk_projects (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    app_name TEXT NOT NULL,
    package_name TEXT NOT NULL,
    version_name TEXT NOT NULL DEFAULT '1.0.0',
    version_code INT NOT NULL DEFAULT 1,
    files JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. SPREADSHEETS TABLE
CREATE TABLE IF NOT EXISTS public.spreadsheets (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    headers JSONB NOT NULL DEFAULT '[]'::jsonb,
    rows JSONB NOT NULL DEFAULT '[]'::jsonb,
    summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY,
    timestamp_str TEXT NOT NULL,
    user_email TEXT NOT NULL,
    action TEXT NOT NULL,
    tokens_used INT NOT NULL DEFAULT 0,
    duration_ms INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'error', 'warning')),
    details TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. ADMIN SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.admin_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apk_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spreadsheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Permissive policies for anon / authenticated application client access
DROP POLICY IF EXISTS "Allow all users read/write users" ON public.users;
CREATE POLICY "Allow all users read/write users" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all read/write conversations" ON public.conversations;
CREATE POLICY "Allow all read/write conversations" ON public.conversations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all read/write messages" ON public.messages;
CREATE POLICY "Allow all read/write messages" ON public.messages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all read/write apk_projects" ON public.apk_projects;
CREATE POLICY "Allow all read/write apk_projects" ON public.apk_projects FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all read/write spreadsheets" ON public.spreadsheets;
CREATE POLICY "Allow all read/write spreadsheets" ON public.spreadsheets FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all read/write audit_logs" ON public.audit_logs;
CREATE POLICY "Allow all read/write audit_logs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all read/write admin_settings" ON public.admin_settings;
CREATE POLICY "Allow all read/write admin_settings" ON public.admin_settings FOR ALL USING (true) WITH CHECK (true);

-- 10. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_messages_conv_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_email ON public.audit_logs(user_email);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- 11. INITIAL SEED DATA
INSERT INTO public.users (id, email, name, role, plan, status, tokens_limit)
VALUES 
  ('usr_admin_detx', 'detxwolfgamer15@gmail.com', 'Detx Wolf', 'admin', 'enterprise', 'active', 1000000),
  ('usr_carlos_dev', 'carlos.dev@tech.com', 'Carlos Andrade', 'user', 'pro', 'active', 100000),
  ('usr_marina_corp', 'marina.souza@corp.com', 'Marina Souza', 'user', 'enterprise', 'active', 500000)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role;

INSERT INTO public.admin_settings (key, value, description)
VALUES
  ('ai_model_chat', '"gemini-2.5-flash"'::jsonb, 'Modelo de Raciocínio & Chat Principal'),
  ('ai_model_image', '"imagen-3.0-generate-002"'::jsonb, 'Motor de Geração Visual'),
  ('admin_access_command', '"/detxwolf.ADM"'::jsonb, 'Comando restrito de autorização de superadministrador'),
  ('security_enforce_admin_command', 'true'::jsonb, 'Exige o comando /detxwolf.ADM para liberar controles')
ON CONFLICT (key) DO NOTHING;
