'use client';

import React, { useState, useRef } from 'react';
import { MessageAttachment } from '@/lib/types';
import { 
  FileText, 
  UploadCloud, 
  X, 
  CheckCircle2, 
  FileSpreadsheet, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface PdfUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAttachDocument: (attachment: MessageAttachment, autoPrompt?: string) => void;
}

export const PdfUploadModal: React.FC<PdfUploadModalProps> = ({
  isOpen,
  onClose,
  onAttachDocument
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedTextPreview, setExtractedTextPreview] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetAction, setTargetAction] = useState<'spreadsheet' | 'summary'>('spreadsheet');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const processFile = async (file: File) => {
    setSelectedFile(file);
    setIsProcessing(true);

    try {
      // Read file content
      const reader = new FileReader();

      // If it's a text-based document or pdf preview
      reader.onload = async (e) => {
        const result = e.target?.result;
        let textContent = '';

        if (typeof result === 'string') {
          // If it's text or csv
          textContent = result.slice(0, 4000);
        } else if (result instanceof ArrayBuffer) {
          // Decode sample bytes to text
          const decoder = new TextDecoder('utf-8');
          const decoded = decoder.decode(result.slice(0, 4000));
          // Clean non-printable characters
          textContent = decoded.replace(/[^\x20-\x7E\n\r\t\u00A0-\u024F]/g, ' ');
        }

        if (!textContent.trim()) {
          textContent = `[DOCUMENTO PROCESSADO: ${file.name}]\nTamanho: ${(file.size / 1024).toFixed(1)} KB\nTipo: ${file.type || 'application/pdf'}\nContém dados tabulares e registros corporativos para consolidação automática.`;
        }

        setExtractedTextPreview(textContent);
        setIsProcessing(false);
      };

      if (file.name.endsWith('.csv') || file.name.endsWith('.txt') || file.name.endsWith('.json')) {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    } catch (err) {
      console.error('Erro ao ler arquivo:', err);
      setIsProcessing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleConfirm = () => {
    if (!selectedFile) return;

    const attachment: MessageAttachment = {
      id: `att_${Date.now()}`,
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.name.endsWith('.pdf') ? 'pdf' : 'spreadsheet',
      extractedText: extractedTextPreview
    };

    const autoPrompt = targetAction === 'spreadsheet'
      ? `Por favor, extraia todos os dados estruturados e tabelas do documento "${selectedFile.name}" anexado e gere uma planilha completa com cabeçalhos e linhas prontas para exportar em Excel (.xlsx).`
      : `Por favor, analise o documento "${selectedFile.name}" anexado, extraia os principais pontos, métricas financeiras e elabore um resumo executivo com relatório em PDF.`;

    onAttachDocument(attachment, autoPrompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#3b1720] bg-[#0c0e14] shadow-[0_0_50px_rgba(220,38,38,0.2)]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#2d141b] bg-[#140b0f] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-950/90 text-red-500 border border-red-600/40">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Anexar Documento & Extrair Dados</h3>
              <p className="text-[11px] text-zinc-400">PDFs, planilhas ou relatórios para extração automática</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-[#1f1016] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-red-500 bg-red-950/20'
                : 'border-[#38161f] bg-[#08090d] hover:border-red-600/60 hover:bg-[#120d13]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.csv,.xlsx,.xls,.txt,.json,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  processFile(e.target.files[0]);
                }
              }}
            />
            <UploadCloud className="h-10 w-10 text-red-500 mb-2" />
            <p className="text-xs font-semibold text-zinc-200">
              Arraste e solte seu arquivo aqui, ou <span className="text-red-400 underline">clique para selecionar</span>
            </p>
            <p className="text-[10px] text-zinc-500 mt-1">
              Suporta PDF, Planilhas CSV/Excel, TXT (Até 25MB)
            </p>
          </div>

          {/* Selected File Feedback */}
          {selectedFile && (
            <div className="rounded-xl border border-red-900/40 bg-[#160d13] p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5 truncate">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <div className="truncate text-left">
                  <div className="text-xs font-bold text-zinc-200 truncate">{selectedFile.name}</div>
                  <div className="text-[10px] text-zinc-400 font-mono">
                    {(selectedFile.size / 1024).toFixed(1)} KB • Pronto para extração
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedFile(null);
                  setExtractedTextPreview('');
                }}
                className="text-zinc-500 hover:text-red-400 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Extraction Target Picker */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 mb-2 block">
              O que você deseja que o Ocypus faça com este arquivo?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTargetAction('spreadsheet')}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  targetAction === 'spreadsheet'
                    ? 'border-red-600 bg-red-950/30 text-white shadow-[0_0_12px_rgba(220,38,38,0.2)]'
                    : 'border-[#2c141c] bg-[#10121a] text-zinc-400 hover:bg-[#181116]'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                  <FileSpreadsheet className="h-4 w-4 text-red-500" />
                  <span>Extrair para Planilha</span>
                </div>
                <span className="text-[10px] text-zinc-400">
                  Estrutura tabelas e exporta direto em Excel (.xlsx)
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTargetAction('summary')}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  targetAction === 'summary'
                    ? 'border-red-600 bg-red-950/30 text-white shadow-[0_0_12px_rgba(220,38,38,0.2)]'
                    : 'border-[#2c141c] bg-[#10121a] text-zinc-400 hover:bg-[#181116]'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                  <Sparkles className="h-4 w-4 text-red-500" />
                  <span>Análise & Relatório PDF</span>
                </div>
                <span className="text-[10px] text-zinc-400">
                  Resumo executivo com gráficos e exportação em PDF
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-[#2d141b] bg-[#140b0f] px-5 py-3">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-zinc-400 hover:bg-[#1a1116] hover:text-white"
          >
            Cancelar
          </button>
          <button
            id="btn-confirm-pdf-upload"
            onClick={handleConfirm}
            disabled={!selectedFile || isProcessing}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-5 py-2 text-xs font-bold text-white shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:from-red-500 hover:to-red-600 disabled:opacity-50 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Processar com Ocypus AI</span>
          </button>
        </div>
      </div>
    </div>
  );
};
