import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { UserAccount } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Por favor forneça um e-mail válido.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'A senha deve conter no mínimo 6 caracteres.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (name && typeof name === 'string' && name.trim()) 
      ? name.trim() 
      : cleanEmail.split('@')[0];

    const isDetx = cleanEmail.includes('detxwolf') || cleanEmail === 'detxwolfgamer15@gmail.com';
    const role: 'admin' | 'user' = isDetx ? 'admin' : 'user';
    const plan = isDetx ? 'enterprise' : 'pro';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    // If service role key is present, create user with admin API (auto-confirms email)
    if (supabaseUrl && serviceRoleKey) {
      const adminClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      // 1. Create in Supabase Authentication (auth.users)
      const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email: cleanEmail,
        password: password,
        email_confirm: true,
        user_metadata: {
          name: cleanName,
          role,
          plan,
        },
      });

      if (authError) {
        // If user already exists in auth.users
        if (
          authError.message.toLowerCase().includes('already registered') ||
          authError.message.toLowerCase().includes('already exists') ||
          authError.status === 422
        ) {
          return NextResponse.json({
            success: false,
            code: 'USER_ALREADY_EXISTS',
            message: 'Este e-mail já está cadastrado no Supabase. Por favor, acesse a aba "Acessar Conta" para entrar.',
          }, { status: 409 });
        }

        return NextResponse.json({
          success: false,
          message: `Erro ao criar usuário no Supabase Auth: ${authError.message}`,
        }, { status: 400 });
      }

      const uid = authData.user.id;

      // 2. Upsert into public.users table
      const newUserAccount: UserAccount = {
        id: uid,
        name: cleanName,
        email: cleanEmail,
        role,
        plan,
        status: 'active',
        requestsCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };

      try {
        await adminClient.from('users').upsert({
          id: uid,
          email: cleanEmail,
          name: cleanName,
          role,
          plan,
          status: 'active',
          requests_count: 0,
          tokens_limit: isDetx ? 1000000 : 50000,
          updated_at: new Date().toISOString(),
        });
      } catch (upsertErr) {
        console.warn('Warning updating public.users table:', upsertErr);
      }

      return NextResponse.json({
        success: true,
        user: newUserAccount,
        message: 'Usuário criado com sucesso no Supabase Authentication!',
      });
    }

    // Fallback: If only anon key is available
    if (supabaseUrl && anonKey) {
      const publicClient = createClient(supabaseUrl, anonKey);
      const { data: signUpData, error: signUpError } = await publicClient.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: {
            name: cleanName,
            role,
            plan,
          },
        },
      });

      if (signUpError) {
        return NextResponse.json({
          success: false,
          message: signUpError.message,
        }, { status: 400 });
      }

      if (signUpData.user) {
        const uid = signUpData.user.id;
        const newUserAccount: UserAccount = {
          id: uid,
          name: cleanName,
          email: cleanEmail,
          role,
          plan,
          status: 'active',
          requestsCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
        };

        return NextResponse.json({
          success: true,
          user: newUserAccount,
          message: 'Usuário registrado no Supabase!',
        });
      }
    }

    return NextResponse.json({
      success: false,
      message: 'Supabase não está configurado no servidor.',
    }, { status: 500 });

  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Error in /api/auth/register:', errorMsg);
    return NextResponse.json(
      { success: false, message: `Erro interno no servidor: ${errorMsg}` },
      { status: 500 }
    );
  }
}
