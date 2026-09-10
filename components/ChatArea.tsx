'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { 
  ChatMessage, 
  Conversation, 
  AppMode, 
  SupportedLanguage, 
  MessageAttachment 
} from '@/lib/types';
import { TOP_10_LANGUAGES } from '@/lib/languages';
import { MessageItem } from './MessageItem';
import { 
  Send, 
  Paperclip, 
  Sparkles, 
  Smartphone, 
  FileSpreadsheet, 
  Terminal, 
  Image as ImageIcon, 
  FileText,
  RefreshCw,
  PlusCircle
} from 'lucide-react';

interface ChatAreaProps {
  conversation: Conversation | null;
  onSendMessage: (text: string, mode: AppMode, language?: SupportedLanguage, attachments?: MessageAttachment[]) => void;
  isLoading: boolean;
  activeMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  onOpenPdfModal: () => void;
  pendingAttachments: MessageAttachment[];
  onRemoveAttachment: (id: string) => void;
  onGenerateImage: (prompt: string, aspectRatio: string) => void;
  isImageLoading: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  conversation,
  onSendMessage,
  isLoading,
  activeMode,
  onSelectMode,
  onOpenPdfModal,
  pendingAttachments,
  onRemoveAttachment,
  onGenerateImage,
  isImageLoading
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('python');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages, isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!inputText.trim() && pendingAttachments.length === 0) || isLoading) return;

    onSendMessage(
      inputText.trim() || 'Processar documento anexado',
      activeMode,
      selectedLanguage,
      pendingAttachments
    );
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    // Auto grow textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
  };

  return (
    <div className="flex flex-1 flex-col h-[calc(100vh-4rem)] bg-[#07080a] relative overflow-hidden">
      
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-10 scrollbar-thin scrollbar-thumb-red-950">
        {!conversation || conversation.messages.length === 0 ? (
          /* Welcome Banner & Quick Action Cards */
          <div className="flex min-h-full flex-col items-center justify-center max-w-3xl mx-auto text-center py-8">
            <div className="relative h-28 w-28 overflow-hidden rounded-3xl border-2 border-red-600/60 bg-black shadow-[0_0_40px_rgba(220,38,38,0.4)] mb-4">
              <Image
                src="/ocypus_logo.jpg"
                alt="Ocypus Wolf Logo"
                fill
                className="object-cover"
                priority
              />
            </div>

            <h1 className="font-mono text-3xl sm:text-4xl font-black tracking-widest text-red-500 mb-2">
              OCYPUS AI
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mb-8 leading-relaxed">
              Assistente avançado com criação de APKs Android, planilhas Excel (.xlsx), extração automática de documentos PDF, código em 10 linguagens e geração de imagens.
            </p>

            {/* Quick Starter Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
              <button
                onClick={() => {
                  onSelectMode('apk');
                  setInputText('Crie um APK Android para um app de notas com Kotlin e Compose');
                }}
                className="group flex flex-col rounded-2xl border border-[#2e141a] bg-[#0c0e14] p-4 hover:border-red-600 hover:bg-[#150d12] transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
              >
                <div className="flex items-center gap-2 font-bold text-sm text-white group-hover:text-red-400 transition-colors">
                  <Smartphone className="h-4 w-4 text-red-500" />
                  <span>Gerar Aplicativo APK</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Estrutura completa pronta para compilar com Kotlin, Gradle e Manifest.
                </p>
              </button>

              <button
                onClick={() => {
                  onSelectMode('spreadsheet');
                  setInputText('Crie uma planilha de fluxo de caixa mensal com receitas, despesas e margem líquida');
                }}
                className="group flex flex-col rounded-2xl border border-[#2e141a] bg-[#0c0e14] p-4 hover:border-red-600 hover:bg-[#150d12] transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
              >
                <div className="flex items-center gap-2 font-bold text-sm text-white group-hover:text-red-400 transition-colors">
                  <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                  <span>Criar Planilha Excel (.xlsx)</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Tabelas com fórmulas interativas e download em formato Excel e PDF.
                </p>
              </button>

              <button
                onClick={onOpenPdfModal}
                className="group flex flex-col rounded-2xl border border-[#2e141a] bg-[#0c0e14] p-4 hover:border-red-600 hover:bg-[#150d12] transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
              >
                <div className="flex items-center gap-2 font-bold text-sm text-white group-hover:text-red-400 transition-colors">
                  <FileText className="h-4 w-4 text-red-500" />
                  <span>Anexar PDF & Extrair Dados</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Extração automática de relatórios e faturas para tabelas organizadas.
                </p>
              </button>

              <button
                onClick={() => {
                  onSelectMode('code');
                  setInputText('Implemente um algoritmo concorrente de alta performance em Python e Rust');
                }}
                className="group flex flex-col rounded-2xl border border-[#2e141a] bg-[#0c0e14] p-4 hover:border-red-600 hover:bg-[#150d12] transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
              >
                <div className="flex items-center gap-2 font-bold text-sm text-white group-hover:text-red-400 transition-colors">
                  <Terminal className="h-4 w-4 text-red-500" />
                  <span>Código nas 10 Linguagens</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Python, JavaScript, TS, Java, C++, C#, Go, Rust, PHP e Kotlin.
                </p>
              </button>

              <button
                onClick={() => {
                  onSelectMode('image');
                  setInputText('Lobo vermelho geométrico cyberpunk em fundo preto midnight com olhos brilhantes');
                }}
                className="group flex flex-col rounded-2xl border border-[#2e141a] bg-[#0c0e14] p-4 hover:border-red-600 hover:bg-[#150d12] transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)] sm:col-span-2"
              >
                <div className="flex items-center gap-2 font-bold text-sm text-white group-hover:text-red-400 transition-colors">
                  <ImageIcon className="h-4 w-4 text-red-500" />
                  <span>Criar Imagens com IA</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Gere imagens exclusivas em alta definição com controle de proporção (1:1, 16:9, 9:16).
                </p>
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {conversation.messages.map((msg) => (
              <MessageItem
                key={msg.id}
                message={msg}
                onSelectLanguage={(lang) => setSelectedLanguage(lang)}
                onGenerateImage={onGenerateImage}
                isImageLoading={isImageLoading}
              />
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-3 py-3 text-xs text-red-400">
                <div className="relative h-8 w-8 overflow-hidden rounded-xl border border-red-600/50 bg-black">
                  <Image
                    src="/ocypus_logo.jpg"
                    alt="Ocypus"
                    fill
                    className="object-cover animate-pulse"
                  />
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-red-500" />
                  <span>OCYPUS AI está processando sua solicitação...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Control Area */}
      <div className="border-t border-[#261318] bg-[#090a0f]/95 p-3 sm:p-4 backdrop-blur-md">
        <div className="max-w-4xl mx-auto">
          
          {/* Active Mode & Language Picker Pills Bar */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <span className="text-[11px] font-bold text-zinc-400 uppercase">Modo:</span>
              <button
                type="button"
                onClick={() => onSelectMode('general')}
                className={`rounded-lg px-2 py-0.5 text-xs font-semibold transition-all ${
                  activeMode === 'general' ? 'bg-red-600 text-white' : 'bg-[#14161f] text-zinc-400 hover:text-white'
                }`}
              >
                Geral
              </button>
              <button
                type="button"
                onClick={() => onSelectMode('apk')}
                className={`rounded-lg px-2 py-0.5 text-xs font-semibold transition-all ${
                  activeMode === 'apk' ? 'bg-red-600 text-white' : 'bg-[#14161f] text-zinc-400 hover:text-white'
                }`}
              >
                APK Android
              </button>
              <button
                type="button"
                onClick={() => onSelectMode('spreadsheet')}
                className={`rounded-lg px-2 py-0.5 text-xs font-semibold transition-all ${
                  activeMode === 'spreadsheet' ? 'bg-red-600 text-white' : 'bg-[#14161f] text-zinc-400 hover:text-white'
                }`}
              >
                Planilha Excel
              </button>
              <button
                type="button"
                onClick={() => onSelectMode('code')}
                className={`rounded-lg px-2 py-0.5 text-xs font-semibold transition-all ${
                  activeMode === 'code' ? 'bg-red-600 text-white' : 'bg-[#14161f] text-zinc-400 hover:text-white'
                }`}
              >
                Código
              </button>
              <button
                type="button"
                onClick={() => onSelectMode('image')}
                className={`rounded-lg px-2 py-0.5 text-xs font-semibold transition-all ${
                  activeMode === 'image' ? 'bg-red-600 text-white' : 'bg-[#14161f] text-zinc-400 hover:text-white'
                }`}
              >
                Criar Imagem
              </button>
            </div>

            {/* If in code mode: language selector dropdown */}
            {activeMode === 'code' && (
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-zinc-500 font-semibold">Linguagem:</span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
                  className="rounded-lg border border-[#30161d] bg-[#12141c] px-2 py-0.5 text-xs text-white focus:border-red-600 focus:outline-none"
                >
                  {TOP_10_LANGUAGES.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.icon} {l.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Pending Attachments preview */}
          {pendingAttachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2 p-2 rounded-xl bg-[#140c10] border border-red-900/40">
              {pendingAttachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center gap-2 rounded-lg bg-[#201016] px-2.5 py-1 text-xs text-zinc-200"
                >
                  <FileText className="h-3.5 w-3.5 text-red-500" />
                  <span className="truncate max-w-[150px] font-semibold">{att.name}</span>
                  <button
                    onClick={() => onRemoveAttachment(att.id)}
                    className="text-zinc-500 hover:text-red-400 ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Form and Input Bar */}
          <form
            onSubmit={handleSubmit}
            className="relative flex items-end gap-2 rounded-2xl border border-[#35161f] bg-[#0e1017] p-2 shadow-[0_0_20px_rgba(0,0,0,0.5)] focus-within:border-red-600 focus-within:ring-1 focus-within:ring-red-600 transition-all"
          >
            {/* Attach PDF / File Button */}
            <button
              type="button"
              id="btn-attach-document"
              onClick={onOpenPdfModal}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-zinc-400 hover:bg-[#1f1117] hover:text-red-400 transition-colors"
              title="Anexar documento PDF / Planilha para extração"
            >
              <Paperclip className="h-5 w-5" />
            </button>

            {/* Input Textarea */}
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              placeholder={
                activeMode === 'apk'
                  ? 'Descreva o aplicativo Android que deseja criar com APK...'
                  : activeMode === 'spreadsheet'
                  ? 'Descreva a planilha e colunas que deseja gerar e exportar para Excel...'
                  : activeMode === 'code'
                  ? `Digite sua solicitação de código em ${selectedLanguage}...`
                  : activeMode === 'image'
                  ? 'Descreva a imagem que deseja gerar com a IA Ocypus...'
                  : 'Faça qualquer pergunta ao Ocypus AI ou anexe um documento PDF...'
              }
              className="max-h-44 flex-1 resize-none bg-transparent py-2.5 px-2 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
            />

            {/* Send Button */}
            <button
              type="submit"
              id="btn-send-message"
              disabled={(!inputText.trim() && pendingAttachments.length === 0) || isLoading}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:from-red-500 hover:to-red-600 disabled:opacity-40 disabled:hover:from-red-600 transition-all"
            >
              <Send className="h-4 w-4 stroke-[2.5]" />
            </button>
          </form>

          <div className="mt-1.5 flex items-center justify-between text-[11px] text-zinc-400 px-2">
            <span>Pressione Enter para enviar, Shift+Enter para nova linha</span>
            <span className="font-mono">Ocypus AI • Midnight Red Edition</span>
          </div>
        </div>
      </div>
    </div>
  );
};
