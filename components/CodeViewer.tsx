'use client';

import React, { useState } from 'react';
import { SupportedLanguage } from '@/lib/types';
import { TOP_10_LANGUAGES } from '@/lib/languages';
import { 
  Code2, 
  Copy, 
  Check, 
  Play, 
  Download, 
  Terminal, 
  Sparkles 
} from 'lucide-react';

interface CodeViewerProps {
  initialLanguage?: SupportedLanguage;
  code: string;
  explanation?: string;
  onLanguageChange?: (lang: SupportedLanguage) => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  initialLanguage = 'python',
  code,
  explanation,
  onLanguageChange
}) => {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>(initialLanguage);
  const [copied, setCopied] = useState(false);
  const [simulatedOutput, setSimulatedOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCode = () => {
    const langObj = TOP_10_LANGUAGES.find(l => l.id === selectedLang);
    const ext = langObj?.extension || '.txt';
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ocypus_script_${selectedLang}${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRunSimulation = () => {
    setIsRunning(true);
    setSimulatedOutput(null);

    setTimeout(() => {
      setIsRunning(false);
      setSimulatedOutput(`[OCYPUS RUNTIME - ${selectedLang.toUpperCase()}]\n✔ Compilação concluída sem erros de sintaxe (0.12s)\n✔ Execução finalizada com status code 0.\nSaída do console:\n>> Processamento executado com sucesso.\n>> Memória utilizada: 4.8 MB\n>> Performance otimizada pela IA Ocypus.`);
    }, 700);
  };

  return (
    <div className="my-3 overflow-hidden rounded-2xl border border-[#38161f] bg-[#090a0f] shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
      {/* 10 Languages Selector Bar */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-[#291319] bg-[#120c10] p-1.5 scrollbar-thin">
        {TOP_10_LANGUAGES.map((lang) => {
          const isSelected = lang.id === selectedLang;
          return (
            <button
              key={lang.id}
              onClick={() => {
                setSelectedLang(lang.id);
                if (onLanguageChange) onLanguageChange(lang.id);
              }}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.4)]'
                  : 'text-zinc-400 hover:bg-[#1f1217] hover:text-zinc-200'
              }`}
            >
              <span>{lang.icon}</span>
              <span>{lang.name}</span>
            </button>
          );
        })}
      </div>

      {/* Top Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#231016] bg-[#0d0e15] px-4 py-2 text-xs">
        <div className="flex items-center gap-2 text-zinc-400 font-mono">
          <Code2 className="h-4 w-4 text-red-500" />
          <span>ocypus_solution.{TOP_10_LANGUAGES.find(l => l.id === selectedLang)?.extension.replace('.', '')}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRunSimulation}
            disabled={isRunning}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-900/40 border border-emerald-700/50 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-800/60 hover:text-white transition-colors"
            title="Executar / Simular Código"
          >
            <Play className={`h-3 w-3 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Executando...' : 'Executar'}</span>
          </button>

          <button
            onClick={handleDownloadCode}
            className="flex items-center gap-1 rounded-lg border border-[#3b1722] bg-[#160d12] px-2.5 py-1 text-xs text-zinc-300 hover:bg-[#201018] hover:text-white transition-colors"
            title="Baixar Arquivo de Código"
          >
            <Download className="h-3 w-3" />
            <span className="hidden sm:inline">Baixar</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-lg bg-red-950/60 border border-red-800/50 px-2.5 py-1 text-xs font-semibold text-red-300 hover:bg-red-900/80 hover:text-white transition-colors"
            title="Copiar Código"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="relative">
        <pre className="overflow-x-auto p-4 text-xs font-mono text-zinc-200 bg-[#06070a] leading-relaxed max-h-96">
          <code>{code}</code>
        </pre>
      </div>

      {/* Run Output Terminal */}
      {simulatedOutput && (
        <div className="border-t border-[#231016] bg-[#0a0b10] p-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
            <Terminal className="h-3.5 w-3.5" />
            <span>Console Output:</span>
          </div>
          <pre className="text-zinc-300 whitespace-pre-wrap">{simulatedOutput}</pre>
        </div>
      )}

      {/* Optional Explanation */}
      {explanation && (
        <div className="border-t border-[#231016] bg-[#0c0e14] p-3 text-xs text-zinc-400">
          <div className="font-semibold text-red-400 mb-0.5">Explicação da IA Ocypus:</div>
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
};
