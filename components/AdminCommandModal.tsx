'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldAlert, 
  Key, 
  Terminal, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Lock 
} from 'lucide-react';

export interface AdminCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockSuccess: () => void;
}

export const AdminCommandModal: React.FC<AdminCommandModalProps> = ({
  isOpen,
  onClose,
  onUnlockSuccess
}) => {
  const [commandInput, setCommandInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setCommandInput('');
    setErrorMsg('');
    setIsSuccess(false);
    onClose();
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCommand = commandInput.trim();

    if (cleanCommand === '/detxwolf.ADM') {
      setIsSuccess(true);
      setErrorMsg('');
      setTimeout(() => {
        onUnlockSuccess();
        handleClose();
      }, 700);
    } else {
      setErrorMsg('Comando incorreto! Digite exatamente "/detxwolf.ADM" para autorizar o acesso.');
      setIsSuccess(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#4a151e] bg-[#090b10] shadow-[0_0_60px_rgba(220,38,38,0.35)]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#281116] bg-[#140b0f] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600/20 border border-red-600/50 text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold text-red-500 tracking-wider">
                AUTORIZAÇÃO DE SUPERADMINISTRADOR
              </h3>
              <p className="text-xs text-zinc-400">
                Acesso restrito ao Painel e Configurações de ADM
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-[#201015] hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="rounded-xl border border-red-900/40 bg-red-950/20 p-3.5 text-xs text-zinc-300 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-red-400">
              <Lock className="h-4 w-4" />
              <span>Chave de Acesso Administrativo</span>
            </div>
            <p className="text-zinc-400">
              Digite o código ou comando confidencial de autorização para autenticar os privilégios de superadministrador.
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">
                Comando / Chave de Segurança:
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-red-500">
                  <Terminal className="h-4 w-4" />
                </div>
                <input
                  ref={inputRef}
                  type="password"
                  value={commandInput}
                  onChange={(e) => {
                    setCommandInput(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Digite o comando de autorização..."
                  className="w-full rounded-xl border border-[#39151e] bg-[#12141c] py-2.5 pl-9 pr-4 text-xs font-mono text-white placeholder:text-zinc-600 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 transition-colors"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 rounded-lg border border-red-800/80 bg-red-950/40 p-2.5 text-xs text-red-300">
                <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {isSuccess && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-800/80 bg-emerald-950/40 p-2.5 text-xs text-emerald-300 animate-pulse">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Acesso autorizado com sucesso! Carregando Painel ADM...</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-zinc-400 hover:bg-[#181014] hover:text-white transition-colors"
              >
                Cancelar
              </button>

              <button
                id="btn-confirm-admin-command"
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-5 py-2 text-xs font-bold text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:from-red-500 hover:to-red-600 active:scale-[0.98] transition-all"
              >
                <Key className="h-3.5 w-3.5" />
                <span>Validar /detxwolf.ADM</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
