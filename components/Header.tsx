'use client';

import React from 'react';
import Image from 'next/image';
import { UserAccount, AppMode } from '@/lib/types';
import { 
  Shield, 
  Menu, 
  User, 
  Sparkles, 
  Terminal, 
  FileSpreadsheet, 
  Smartphone,
  Image as ImageIcon,
  Lock,
  Unlock,
  LogIn
} from 'lucide-react';

export interface HeaderProps {
  currentUser: UserAccount | null;
  onOpenAdmin: () => void;
  onRequestAdmin: () => void;
  isAdminUnlocked: boolean;
  onOpenAuth: () => void;
  onOpenLoginScreen: () => void;
  onToggleSidebar: () => void;
  activeMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenAdmin,
  onRequestAdmin,
  isAdminUnlocked,
  onOpenAuth,
  onOpenLoginScreen,
  onToggleSidebar,
  activeMode,
  onSelectMode
}) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#2b0f14] bg-[#07080b]/90 px-3 md:px-6 backdrop-blur-md">
      {/* Left side: Hamburger + Logo & Brand */}
      <div className="flex items-center gap-3">
        <button
          id="btn-toggle-sidebar"
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-zinc-400 hover:bg-[#1a0f12] hover:text-red-400 md:hidden transition-colors"
          title="Alternar Histórico"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-red-600/40 bg-black shadow-[0_0_15px_rgba(220,38,38,0.3)]">
            <Image
              src="/ocypus_logo.jpg"
              alt="Ocypus AI Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-black tracking-wider text-red-500">
                OCYPUS
              </span>
              <span className="rounded bg-red-950/80 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-red-400 border border-red-800/50">
                AI PRO
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] text-zinc-400 font-medium">
                Sistemas Prontos • Midnight Engine
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Quick Mode Selector pills */}
      <div className="hidden lg:flex items-center gap-1 bg-[#10121a]/80 p-1 rounded-xl border border-[#261519]">
        <button
          id="nav-mode-general"
          onClick={() => onSelectMode('general')}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
            activeMode === 'general'
              ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.4)]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1f1519]'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Geral</span>
        </button>

        <button
          id="nav-mode-apk"
          onClick={() => onSelectMode('apk')}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
            activeMode === 'apk'
              ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.4)]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1f1519]'
          }`}
        >
          <Smartphone className="h-3.5 w-3.5" />
          <span>Gerar APK</span>
        </button>

        <button
          id="nav-mode-spreadsheet"
          onClick={() => onSelectMode('spreadsheet')}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
            activeMode === 'spreadsheet'
              ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.4)]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1f1519]'
          }`}
        >
          <FileSpreadsheet className="h-3.5 w-3.5" />
          <span>Planilhas Excel</span>
        </button>

        <button
          id="nav-mode-code"
          onClick={() => onSelectMode('code')}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
            activeMode === 'code'
              ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.4)]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1f1519]'
          }`}
        >
          <Terminal className="h-3.5 w-3.5" />
          <span>10 Linguagens</span>
        </button>

        <button
          id="nav-mode-image"
          onClick={() => onSelectMode('image')}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
            activeMode === 'image'
              ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.4)]'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1f1519]'
          }`}
        >
          <ImageIcon className="h-3.5 w-3.5" />
          <span>Criar Imagem</span>
        </button>
      </div>

      {/* Right side: Admin Panel trigger + Login Screen + User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Admin Panel Button - ONLY rendered for users with admin permissions */}
        {(isAdminUnlocked || currentUser?.role === 'admin') && (
          <button
            id="btn-header-admin-panel"
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 rounded-lg border border-red-700/80 bg-red-950/60 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-900/80 hover:text-white transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)]"
            title="Painel de Controle Administrativo"
          >
            <Shield className="h-3.5 w-3.5 text-red-400" />
            <span className="hidden sm:inline">Painel Admin</span>
            <span className="sm:hidden text-[10px]">Admin</span>
          </button>
        )}

        {/* Dedicated Login Screen Trigger Button */}
        <button
          id="btn-open-login-screen"
          onClick={onOpenLoginScreen}
          className="flex items-center gap-1.5 rounded-lg border border-[#3b1720] bg-[#12141c] px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:border-red-600/60 hover:text-white transition-all"
          title="Abrir Tela de Login do Sistema"
        >
          <LogIn className="h-3.5 w-3.5 text-red-500" />
          <span className="hidden md:inline">Tela de Login</span>
        </button>

        <button
          id="btn-user-profile"
          onClick={onOpenAuth}
          className="flex items-center gap-2 rounded-xl border border-[#2f141a] bg-[#12141c] p-1.5 sm:px-3 sm:py-1.5 hover:border-red-600/50 hover:bg-[#1c1418] transition-all"
        >
          {currentUser ? (
            <>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600 text-xs font-bold text-white shadow-[0_0_8px_rgba(220,38,38,0.5)]">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-zinc-200 truncate max-w-[120px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-red-400 capitalize">
                  {currentUser.role === 'admin' ? 'Administrador' : currentUser.plan}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
              <User className="h-4 w-4 text-red-400" />
              <span>Entrar / Cadastrar</span>
            </div>
          )}
        </button>
      </div>
    </header>
  );
};
