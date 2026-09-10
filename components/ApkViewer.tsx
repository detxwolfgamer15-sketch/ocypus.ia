'use client';

import React, { useState } from 'react';
import { ApkProjectData } from '@/lib/types';
import { downloadApkProjectZip } from '@/lib/apk-generator';
import { 
  Smartphone, 
  Download, 
  FileCode, 
  Copy, 
  Check, 
  Layers, 
  Terminal, 
  Cpu, 
  Package,
  ExternalLink
} from 'lucide-react';

interface ApkViewerProps {
  apkData: ApkProjectData;
}

export const ApkViewer: React.FC<ApkViewerProps> = ({ apkData }) => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const currentFile = apkData.files[activeFileIndex] || apkData.files[0];

  const handleCopyCode = () => {
    if (currentFile?.content) {
      navigator.clipboard.writeText(currentFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadZip = async () => {
    setIsDownloading(true);
    try {
      await downloadApkProjectZip(apkData);
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  return (
    <div className="my-3 overflow-hidden rounded-2xl border border-[#3b1720] bg-[#0b0c12] shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
      {/* Top Banner: App Info & Main Download Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2d141b] bg-[#140b0f] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-950 border border-red-600/50 text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
            <Smartphone className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-white">{apkData.appName}</h4>
              <span className="rounded bg-red-950/80 px-2 py-0.5 text-[10px] font-bold text-red-400 border border-red-800/40">
                v{apkData.versionName}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              {apkData.packageName} • Target SDK {apkData.targetSdk}
            </p>
          </div>
        </div>

        {/* Big Download ZIP Action */}
        <button
          id="btn-download-apk-zip"
          onClick={handleDownloadZip}
          disabled={isDownloading}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:from-red-500 hover:to-red-600 active:scale-95 transition-all"
        >
          <Download className="h-4 w-4" />
          <span>{isDownloading ? 'Gerando Pacote...' : 'Baixar Projeto APK (.ZIP)'}</span>
        </button>
      </div>

      {/* Key Features Chips */}
      {apkData.keyFeatures && apkData.keyFeatures.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-b border-[#231016] bg-[#0d0e15] px-4 py-2.5">
          {apkData.keyFeatures.map((feat, idx) => (
            <span
              key={idx}
              className="flex items-center gap-1 rounded-md border border-[#30161c] bg-[#170e12] px-2 py-0.5 text-[11px] text-zinc-300"
            >
              <Cpu className="h-3 w-3 text-red-500" />
              <span>{feat}</span>
            </span>
          ))}
        </div>
      )}

      {/* Code Inspector Area */}
      <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#231016]">
        {/* Left: File Tree */}
        <div className="p-3 bg-[#08090d] space-y-1">
          <div className="px-2 py-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
            <Layers className="h-3 w-3 text-red-500" />
            <span>Arquivos do Projeto</span>
          </div>
          {apkData.files.map((file, idx) => (
            <button
              key={idx}
              onClick={() => setActiveFileIndex(idx)}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-left transition-colors ${
                activeFileIndex === idx
                  ? 'bg-[#201016] text-red-400 font-bold border border-red-800/40'
                  : 'text-zinc-400 hover:bg-[#12141c] hover:text-zinc-200'
              }`}
            >
              <FileCode className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{file.name}</span>
            </button>
          ))}
        </div>

        {/* Right: Code Editor / Viewer */}
        <div className="md:col-span-3 flex flex-col bg-[#07080b]">
          {/* Editor Header */}
          <div className="flex items-center justify-between border-b border-[#231016] bg-[#0c0e14] px-4 py-2 text-xs">
            <span className="font-mono text-zinc-400 truncate">
              {currentFile?.path || 'file'}
            </span>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 text-zinc-400 hover:text-white px-2 py-1 rounded bg-[#170e13] hover:bg-red-950/60 transition-colors"
              title="Copiar código do arquivo"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-zinc-400" />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>

          {/* Code Content */}
          <pre className="flex-1 overflow-x-auto p-4 text-xs font-mono text-zinc-300 bg-[#050608] max-h-72 leading-relaxed">
            <code>{currentFile?.content}</code>
          </pre>
        </div>
      </div>

      {/* Build Instructions Accordion */}
      {apkData.buildInstructions && apkData.buildInstructions.length > 0 && (
        <div className="border-t border-[#231016] bg-[#0c0e14] p-3 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-red-400 mb-1.5">
            <Terminal className="h-3.5 w-3.5" />
            <span>Instruções para Compilar no Android Studio:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-zinc-400 pl-1">
            {apkData.buildInstructions.map((step, idx) => (
              <li key={idx} className="text-zinc-300">{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};
