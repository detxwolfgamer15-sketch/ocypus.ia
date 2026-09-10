'use client';

import React, { useState } from 'react';
import { Conversation, AppMode } from '@/lib/types';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Search, 
  Smartphone, 
  FileSpreadsheet, 
  Terminal, 
  Image as ImageIcon,
  ShieldAlert,
  X
} from 'lucide-react';

export interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: (mode?: AppMode) => void;
  onDeleteConversation: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin: () => void;
  onRequestAdmin?: () => void;
  isAdminUnlocked?: boolean;
  onOpenLoginScreen?: () => void;
  isAdmin: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isOpen,
  onClose,
  onOpenAdmin,
  onRequestAdmin,
  isAdminUnlocked = false,
  onOpenLoginScreen,
  isAdmin
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = conversations.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#261216] bg-[#07080b] transition-transform duration-300 md:static md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Top: New Chat + Close on mobile */}
        <div className="p-4 border-b border-[#221014] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold tracking-wider text-red-500 uppercase">
              Histórico Ocypus
            </span>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-zinc-400 hover:bg-[#1a0f12] md:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <button
            id="btn-new-chat"
            onClick={() => {
              onNewConversation('general');
              if (window.innerWidth < 768) onClose();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(220,38,38,0.35)] hover:from-red-500 hover:to-red-600 active:scale-[0.98] transition-all"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Nova Conversa</span>
          </button>

          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Pesquisar conversas..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[#261318] bg-[#0f1118] pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-red-950">
          {filtered.length === 0 ? (
            <div className="px-3 py-8 text-center text-xs text-zinc-500">
              Nenhuma conversa encontrada.
            </div>
          ) : (
            filtered.map((conv) => {
              const isActive = conv.id === activeConversationId;
              return (
                <div
                  key={conv.id}
                  className={`group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'border border-red-600/60 bg-[#160e12] text-white shadow-[0_0_15px_rgba(220,38,38,0.15)] font-semibold'
                      : 'border border-transparent text-zinc-400 hover:bg-[#12141c] hover:text-zinc-200'
                  }`}
                  onClick={() => {
                    onSelectConversation(conv.id);
                    if (window.innerWidth < 768) onClose();
                  }}
                >
                  <div className="flex items-center gap-2.5 truncate pr-2">
                    <MessageSquare className={`h-3.5 w-3.5 flex-shrink-0 ${isActive ? 'text-red-500' : 'text-zinc-500'}`} />
                    <span className="truncate">{conv.title}</span>
                  </div>

                  {/* Delete button */}
                  <button
                    id={`btn-delete-conv-${conv.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded transition-opacity"
                    title="Excluir conversa"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Creators Shortcuts in Sidebar */}
        <div className="p-3 border-t border-[#221014] bg-[#090b10] space-y-1">
          <div className="px-2 py-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
            Criadores Rápidos
          </div>
          <button
            onClick={() => onNewConversation('apk')}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-[#181116] hover:text-red-400 transition-colors"
          >
            <Smartphone className="h-3.5 w-3.5 text-red-500" />
            <span>Criar Novo APK</span>
          </button>
          <button
            onClick={() => onNewConversation('spreadsheet')}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-[#181116] hover:text-red-400 transition-colors"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-red-500" />
            <span>Nova Planilha Excel</span>
          </button>
          <button
            onClick={() => onNewConversation('code')}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-[#181116] hover:text-red-400 transition-colors"
          >
            <Terminal className="h-3.5 w-3.5 text-red-500" />
            <span>Gerar Código (10 línguas)</span>
          </button>
          <button
            onClick={() => onNewConversation('image')}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-[#181116] hover:text-red-400 transition-colors"
          >
            <ImageIcon className="h-3.5 w-3.5 text-red-500" />
            <span>Criar Imagem IA</span>
          </button>

          <div className="pt-2 space-y-1.5">
            <button
              id="btn-sidebar-admin"
              onClick={() => {
                if (isAdminUnlocked) {
                  onOpenAdmin();
                } else if (onRequestAdmin) {
                  onRequestAdmin();
                } else {
                  onOpenAdmin();
                }
                if (window.innerWidth < 768) onClose();
              }}
              className={`flex w-full items-center justify-between rounded-lg border px-2.5 py-2 text-xs font-semibold transition-all ${
                isAdminUnlocked
                  ? 'border-red-700/70 bg-red-950/40 text-red-300 hover:bg-red-900/50 hover:text-white'
                  : 'border-red-950 bg-red-950/20 text-zinc-400 hover:border-red-800/60 hover:text-red-300'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <ShieldAlert className="h-4 w-4 text-red-400 flex-shrink-0" />
                <span className="truncate">
                  {isAdminUnlocked ? 'Painel Admin' : 'ADM (/detxwolf.ADM)'}
                </span>
              </div>
              <span className="font-mono text-[9px] text-red-400 bg-black/40 px-1 py-0.5 rounded border border-red-900/40 flex-shrink-0">
                {isAdminUnlocked ? 'UNLOCKED' : 'LOCKED'}
              </span>
            </button>

            {onOpenLoginScreen && (
              <button
                id="btn-sidebar-login-screen"
                onClick={() => {
                  onOpenLoginScreen();
                  if (window.innerWidth < 768) onClose();
                }}
                className="flex w-full items-center gap-2 rounded-lg border border-[#2d151c] bg-[#12141c] px-2.5 py-1.5 text-xs text-zinc-300 hover:border-red-600/50 hover:text-white transition-all"
              >
                <Terminal className="h-3.5 w-3.5 text-red-400" />
                <span>Tela de Login</span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
