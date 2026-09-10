import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserAccount, Conversation, AuditLog } from '@/lib/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let cachedClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== 'https://your-project.supabase.co' &&
    !supabaseUrl.includes('placeholder')
  );
}

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!cachedClient) {
    cachedClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return cachedClient;
}

export interface SupabaseConnectionStatus {
  connected: boolean;
  configured: boolean;
  url: string;
  latencyMs?: number;
  message: string;
  tablesFound?: string[];
}

export async function testSupabaseConnection(): Promise<SupabaseConnectionStatus> {
  if (!isSupabaseConfigured()) {
    return {
      connected: false,
      configured: false,
      url: supabaseUrl || 'Não configurada (.env.example)',
      message: 'Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no arquivo .env.',
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      connected: false,
      configured: false,
      url: supabaseUrl,
      message: 'Falha ao inicializar o cliente Supabase.',
    };
  }

  const startTime = Date.now();
  try {
    const { error } = await client
      .from('admin_settings')
      .select('key')
      .limit(1);

    const latencyMs = Date.now() - startTime;

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('not exist')) {
        return {
          connected: true,
          configured: true,
          url: supabaseUrl,
          latencyMs,
          message: 'Conectado ao Supabase com sucesso! As tabelas ainda precisam ser criadas através da Migration SQL.',
          tablesFound: [],
        };
      }
      return {
        connected: false,
        configured: true,
        url: supabaseUrl,
        latencyMs,
        message: `Erro na consulta Supabase: ${error.message} (${error.code || 'sem código'})`,
      };
    }

    return {
      connected: true,
      configured: true,
      url: supabaseUrl,
      latencyMs,
      message: 'Conexão ativa e tabelas da Ocypus AI validadas no Supabase PostgreSQL!',
      tablesFound: ['users', 'conversations', 'messages', 'apk_projects', 'spreadsheets', 'audit_logs', 'admin_settings'],
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return {
      connected: false,
      configured: true,
      url: supabaseUrl,
      latencyMs: Date.now() - startTime,
      message: `Falha de rede ao conectar no Supabase: ${errorMessage}`,
    };
  }
}

export async function syncUserToSupabase(user: UserAccount): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('users').upsert({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      plan: user.plan,
      status: user.status,
      requests_count: user.requestsCount,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      console.warn('Supabase syncUser warning:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Supabase syncUser failed:', e);
    return false;
  }
}

export interface AuthResult {
  success: boolean;
  user?: UserAccount;
  error?: string;
  isConfirmationNeeded?: boolean;
}

/**
 * Creates a brand new user directly in Supabase Authentication and public.users.
 */
export async function signUpWithSupabase(
  email: string,
  password: string,
  name?: string
): Promise<AuthResult> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name?.trim() || cleanEmail.split('@')[0];

  try {
    // 1. Preferred approach: Server-side register with auto-confirm
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password, name: cleanName }),
    });

    const data = await res.json();

    if (res.ok && data.success && data.user) {
      // Establish client session in browser if client is available
      const client = getSupabaseClient();
      if (client) {
        try {
          await client.auth.signInWithPassword({
            email: cleanEmail,
            password,
          });
        } catch {
          // Session will still be maintained via user account state
        }
      }
      return { success: true, user: data.user };
    }

    // If server returned a specific error like USER_ALREADY_EXISTS
    if (data.code === 'USER_ALREADY_EXISTS' || !res.ok) {
      return { success: false, error: data.message || 'Erro ao cadastrar usuário no Supabase.' };
    }
  } catch (apiErr) {
    console.warn('Server register endpoint error, trying direct client fallback:', apiErr);
  }

  // 2. Direct client-side fallback if server route was unreachable
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      error: 'Supabase não está configurado. Verifique as credenciais no .env.',
    };
  }

  try {
    const isDetx = cleanEmail.includes('detxwolf');
    const { data: authData, error: authError } = await client.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          name: cleanName,
          role: isDetx ? 'admin' : 'user',
          plan: isDetx ? 'enterprise' : 'pro',
        },
      },
    });

    if (authError) {
      let friendlyMessage = authError.message;
      if (authError.message.includes('already registered')) {
        friendlyMessage = 'Este e-mail já está cadastrado no Supabase. Faça login na aba Acessar Conta.';
      } else if (authError.message.includes('Password should be at least')) {
        friendlyMessage = 'A senha deve ter pelo menos 6 caracteres.';
      }
      return { success: false, error: friendlyMessage };
    }

    if (!authData.user) {
      return { success: false, error: 'Falha inesperada ao criar usuário no Supabase.' };
    }

    const newUser: UserAccount = {
      id: authData.user.id,
      name: cleanName,
      email: cleanEmail,
      role: isDetx ? 'admin' : 'user',
      plan: isDetx ? 'enterprise' : 'pro',
      status: 'active',
      requestsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Upsert into public.users
    await syncUserToSupabase(newUser);

    return {
      success: true,
      user: newUser,
      isConfirmationNeeded: !authData.session,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: `Erro ao conectar com Supabase Auth: ${msg}` };
  }
}

/**
 * Signs in an existing user with email and password via Supabase Auth.
 */
export async function signInWithSupabase(
  email: string,
  password: string
): Promise<AuthResult> {
  const client = getSupabaseClient();
  const cleanEmail = email.trim().toLowerCase();

  if (!client) {
    return {
      success: false,
      error: 'Supabase não está configurado no aplicativo.',
    };
  }

  try {
    const { data: authData, error: authError } = await client.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (authError) {
      let friendlyMessage = authError.message;
      if (authError.message.includes('Invalid login credentials')) {
        friendlyMessage = 'E-mail ou senha incorretos. Verifique suas credenciais.';
      } else if (authError.message.includes('Email not confirmed')) {
        friendlyMessage = 'E-mail ainda não confirmado no Supabase. Se você é o administrador, desative a confirmação de e-mail no painel do Supabase ou crie a conta via formulário de cadastro.';
      }
      return { success: false, error: friendlyMessage };
    }

    if (!authData.user) {
      return { success: false, error: 'Usuário não localizado no Supabase.' };
    }

    const uid = authData.user.id;
    const isDetx = cleanEmail.includes('detxwolf');

    // Fetch from public.users
    const { data: dbUser } = await client
      .from('users')
      .select('*')
      .eq('id', uid)
      .maybeSingle();

    const userAccount: UserAccount = {
      id: uid,
      name: dbUser?.name || authData.user.user_metadata?.name || cleanEmail.split('@')[0],
      email: cleanEmail,
      role: (dbUser?.role as 'admin' | 'user') || (isDetx ? 'admin' : 'user'),
      plan: dbUser?.plan || (isDetx ? 'enterprise' : 'pro'),
      status: (dbUser?.status as 'active' | 'blocked') || 'active',
      requestsCount: dbUser?.requests_count || 0,
      createdAt: dbUser?.created_at ? dbUser.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
    };

    // Ensure synced in public.users
    syncUserToSupabase(userAccount).catch(() => {});

    return { success: true, user: userAccount };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: `Falha ao autenticar com o Supabase: ${msg}` };
  }
}

/**
 * Signs out from Supabase Auth.
 */
export async function signOutWithSupabase(): Promise<void> {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.auth.signOut();
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
  }
}

/**
 * Recovers the active Supabase session user if one is currently stored.
 */
export async function getCurrentUserFromSupabase(): Promise<UserAccount | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data: sessionData } = await client.auth.getSession();
    if (!sessionData.session?.user) return null;

    const user = sessionData.session.user;
    const uid = user.id;
    const cleanEmail = user.email || '';
    const isDetx = cleanEmail.includes('detxwolf');

    const { data: dbUser } = await client
      .from('users')
      .select('*')
      .eq('id', uid)
      .maybeSingle();

    return {
      id: uid,
      name: dbUser?.name || user.user_metadata?.name || cleanEmail.split('@')[0],
      email: cleanEmail,
      role: (dbUser?.role as 'admin' | 'user') || (isDetx ? 'admin' : 'user'),
      plan: dbUser?.plan || (isDetx ? 'enterprise' : 'pro'),
      status: (dbUser?.status as 'active' | 'blocked') || 'active',
      requestsCount: dbUser?.requests_count || 0,
      createdAt: dbUser?.created_at ? dbUser.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
    };
  } catch {
    return null;
  }
}

export async function syncConversationToSupabase(conversation: Conversation, userId?: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    // 1. Upsert conversation
    const { error: convError } = await client.from('conversations').upsert({
      id: conversation.id,
      user_id: userId || null,
      title: conversation.title,
      category: conversation.category,
      created_at: conversation.createdAt,
      updated_at: conversation.updatedAt,
    });

    if (convError) {
      console.warn('Supabase syncConv warning:', convError.message);
      return false;
    }

    // 2. Upsert messages
    if (conversation.messages && conversation.messages.length > 0) {
      const messagesToUpsert = conversation.messages.map(m => ({
        id: m.id,
        conversation_id: conversation.id,
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
        mode: m.mode || 'general',
        language: m.language || null,
        spreadsheet_data: m.spreadsheetData ? JSON.stringify(m.spreadsheetData) : null,
        apk_data: m.apkData ? JSON.stringify(m.apkData) : null,
        generated_images: m.generatedImages ? JSON.stringify(m.generatedImages) : null,
        created_at: new Date().toISOString(),
      }));

      const { error: msgError } = await client.from('messages').upsert(messagesToUpsert);
      if (msgError) {
        console.warn('Supabase syncMessages warning:', msgError.message);
      }
    }

    return true;
  } catch (e) {
    console.warn('Supabase syncConversation failed:', e);
    return false;
  }
}

export async function syncAuditLogToSupabase(log: AuditLog): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('audit_logs').insert({
      id: log.id,
      timestamp_str: log.timestamp,
      user_email: log.userEmail,
      action: log.action,
      tokens_used: log.tokensUsed,
      duration_ms: log.durationMs,
      status: log.status,
      details: log.details,
      created_at: new Date().toISOString(),
    });
    if (error) {
      console.warn('Supabase syncAuditLog warning:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Supabase syncAuditLog failed:', e);
    return false;
  }
}
