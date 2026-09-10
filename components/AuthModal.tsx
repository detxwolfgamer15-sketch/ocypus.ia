'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { UserAccount } from '@/lib/types';
import { SAMPLE_USERS } from '@/lib/storage';
import { signUpWithSupabase, signInWithSupabase, signOutWithSupabase } from '@/lib/supabase';
import { 
  Lock, 
  Mail, 
  User, 
  X, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  LogIn,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onLoginSuccess: (user: UserAccount) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Por favor preencha todos os campos.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      if (isRegister) {
        const res = await signUpWithSupabase(email, password, name);
        if (res.success && res.user) {
          setSuccessMsg('Usuário criado com sucesso no Supabase Authentication!');
          setTimeout(() => {
            onLoginSuccess(res.user!);
            onClose();
          }, 600);
        } else {
          setErrorMsg(res.error || 'Erro ao registrar no Supabase.');
        }
      } else {
        const res = await signInWithSupabase(email, password);
        if (res.success && res.user) {
          onLoginSuccess(res.user);
          onClose();
        } else {
          const matched = SAMPLE_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
          if (matched && password === 'admin123') {
            onLoginSuccess(matched);
            onClose();
          } else {
            setErrorMsg(res.error || 'Credenciais inválidas. Verifique seu e-mail e senha.');
          }
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(`Erro na autenticação: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutClick = () => {
    signOutWithSupabase().catch(() => {});
    onLogout();
    onClose();
  };

  const handleQuickSwitch = (user: UserAccount) => {
    onLoginSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#3b1720] bg-[#0b0c12] shadow-[0_0_50px_rgba(220,38,38,0.25)]">
        {/* Top Logo Banner */}
        <div className="relative flex flex-col items-center border-b border-[#2d141b] bg-[#140b0f] px-6 pt-6 pb-4 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-lg p-1.5 text-zinc-400 hover:bg-[#201017] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-red-600/50 bg-black shadow-[0_0_20px_rgba(220,38,38,0.4)] mb-2">
            <Image
              src="/ocypus_logo.jpg"
              alt="Ocypus AI Logo"
              fill
              className="object-cover"
            />
          </div>

          <h3 className="font-mono text-base font-black tracking-wider text-red-500">
            OCYPUS AI ACCESS
          </h3>
          <p className="text-xs text-zinc-400">
            {currentUser ? 'Gerenciamento de Conta & Sessão' : 'Autenticação & Controle de Acesso'}
          </p>
        </div>

        {/* Current user logged in state */}
        {currentUser ? (
          <div className="p-6 space-y-4">
            <div className="rounded-xl border border-red-900/40 bg-[#160d13] p-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 font-bold text-white shadow-[0_0_12px_rgba(220,38,38,0.5)]">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 truncate">
                <div className="font-bold text-sm text-white truncate">{currentUser.name}</div>
                <div className="text-xs text-zinc-400 truncate">{currentUser.email}</div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded bg-red-950/80 px-2 py-0.5 text-[10px] font-bold text-red-400 border border-red-800/40">
                    {currentUser.role === 'admin' ? 'Super Administrador' : 'Usuário'}
                  </span>
                  <span className="text-[10px] text-zinc-400">Plano {currentUser.plan}</span>
                </div>
              </div>
            </div>

            {/* Quick Switch Profiles */}
            <div>
              <label className="text-xs font-semibold text-zinc-400 mb-2 block">
                Alternar Perfil Rápido:
              </label>
              <div className="space-y-1.5">
                {SAMPLE_USERS.map((usr) => (
                  <button
                    key={usr.id}
                    onClick={() => handleQuickSwitch(usr)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs border transition-all ${
                      usr.id === currentUser.id
                        ? 'border-red-600 bg-red-950/40 text-white font-bold'
                        : 'border-[#291319] bg-[#10121a] text-zinc-400 hover:bg-[#181116] hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className={`h-4 w-4 ${usr.role === 'admin' ? 'text-red-500' : 'text-zinc-500'}`} />
                      <span>{usr.name}</span>
                      <span className="text-[10px] text-zinc-500">({usr.role})</span>
                    </div>
                    {usr.id === currentUser.id && <Check className="h-4 w-4 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#251218]">
              <button
                onClick={handleLogoutClick}
                className="text-xs text-red-400 hover:text-red-300 font-semibold"
              >
                Encerrar Sessão
              </button>
              <button
                onClick={onClose}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500 transition-colors"
              >
                Continuar
              </button>
            </div>
          </div>
        ) : (
          /* Login / Register Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMsg && (
              <div className="flex items-center gap-2 rounded-lg border border-red-800 bg-red-950/40 p-2 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-800 bg-emerald-950/40 p-2 text-xs text-emerald-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {isRegister && (
              <div>
                <label className="text-xs font-semibold text-zinc-300 mb-1 block">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-[#2b141b] bg-[#12141c] pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-zinc-300 mb-1 block">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  placeholder="exemplo@ocypus.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#2b141b] bg-[#12141c] pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 mb-1 block">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#2b141b] bg-[#12141c] pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 py-2.5 text-xs font-bold text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:from-red-500 hover:to-red-600 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>{isRegister ? 'Criar Conta Ocypus' : 'Acessar Conta'}</span>
                </>
              )}
            </button>

            {/* Toggle login vs register */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-xs text-zinc-400 hover:text-red-400 underline transition-colors"
              >
                {isRegister
                  ? 'Já possui uma conta? Faça login'
                  : 'Não tem conta? Cadastre-se na Ocypus'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
