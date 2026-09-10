'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { UserAccount } from '@/lib/types';
import { SAMPLE_USERS } from '@/lib/storage';
import { signUpWithSupabase, signInWithSupabase } from '@/lib/supabase';
import { 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  X,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export interface LoginScreenProps {
  currentUser: UserAccount | null;
  onLoginSuccess: (user: UserAccount) => void;
  onContinueAsGuest: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  currentUser,
  onLoginSuccess,
  onContinueAsGuest
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setError('Por favor preencha todos os campos obrigatórios.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      if (activeTab === 'register') {
        const res = await signUpWithSupabase(email, password, name);
        if (res.success && res.user) {
          setSuccessMsg('Usuário criado com sucesso no Supabase Authentication!');
          setTimeout(() => {
            onLoginSuccess(res.user!);
          }, 600);
        } else {
          setError(res.error || 'Não foi possível cadastrar o usuário no Supabase.');
        }
      } else {
        const res = await signInWithSupabase(email, password);
        if (res.success && res.user) {
          onLoginSuccess(res.user);
        } else {
          // Fallback check for local sample account if applicable
          const matched = SAMPLE_USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
          if (matched && password === 'admin123') {
            onLoginSuccess(matched);
          } else {
            setError(res.error || 'Credenciais inválidas. Verifique seu e-mail e senha.');
          }
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Erro na comunicação com Supabase: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07080a]/95 p-4 backdrop-blur-xl overflow-y-auto">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-red-950/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#3b151e] bg-[#0b0d14] shadow-[0_0_80px_rgba(220,38,38,0.25)] p-6 sm:p-8">
        
        {/* Close / Guest button */}
        <button
          onClick={onContinueAsGuest}
          className="absolute top-4 right-4 rounded-xl p-2 text-zinc-400 hover:bg-[#1a1116] hover:text-white transition-colors"
          title="Fechar tela de login"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="relative mx-auto mb-3 h-16 w-16 overflow-hidden rounded-2xl border border-red-600/50 bg-black/60 shadow-[0_0_25px_rgba(220,38,38,0.4)]">
            <Image
              src="/assets/aistudio/logo.png"
              alt="Ocypus Logo"
              width={64}
              height={64}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>OCYPUS</span>
            <span className="text-red-600">AI</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Plataforma Autônoma de IA, APKs, Planilhas & Código
          </p>
        </div>

        {/* Login / Register Toggle */}
        <div className="flex rounded-xl bg-[#141722] p-1 mb-5 border border-[#251720]">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'login'
                ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.4)]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Acessar Conta
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'register'
                ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.4)]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Cadastrar
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {activeTab === 'register' && (
            <div>
              <label className="text-xs font-semibold text-zinc-300 mb-1 block">Nome Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome ou apelido"
                  className="w-full rounded-xl border border-[#2f1822] bg-[#12141d] py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-zinc-600 focus:border-red-600 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-zinc-300 mb-1 block">E-mail</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                required
                className="w-full rounded-xl border border-[#2f1822] bg-[#12141d] py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-zinc-600 focus:border-red-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-zinc-300">Senha</label>
              {activeTab === 'login' && (
                <span className="text-[11px] text-red-400 hover:underline cursor-pointer">
                  Esqueceu a senha?
                </span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-[#2f1822] bg-[#12141d] py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-zinc-600 focus:border-red-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-900/60 bg-red-950/30 p-2.5 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-900/60 bg-emerald-950/30 p-2.5 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 py-3 text-xs font-bold text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:from-red-500 hover:to-red-600 active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <span>{activeTab === 'login' ? 'Entrar no Sistema' : 'Criar Nova Conta'}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Continue as Guest */}
        <div className="mt-6 pt-5 border-t border-[#23151c] text-center">
          <button
            type="button"
            onClick={onContinueAsGuest}
            className="text-xs text-zinc-400 hover:text-white transition-colors underline decoration-zinc-600"
          >
            Continuar como visitante anônimo
          </button>
        </div>

        {/* Security watermark */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-zinc-500">
          <ShieldCheck className="h-3.5 w-3.5 text-red-500" />
          <span>Autenticação Criptografada • Protocolo Ocypus DetxWolf</span>
        </div>
      </div>
    </div>
  );
};
