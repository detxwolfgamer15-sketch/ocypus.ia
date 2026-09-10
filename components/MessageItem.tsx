'use client';

import React from 'react';
import Image from 'next/image';
import { ChatMessage, SupportedLanguage } from '@/lib/types';
import { SpreadsheetViewer } from './SpreadsheetViewer';
import { ApkViewer } from './ApkViewer';
import { CodeViewer } from './CodeViewer';
import { ImageViewer } from './ImageViewer';
import { generatePdfReport } from '@/lib/pdf-export';
import { 
  Copy, 
  Check, 
  FileDown, 
  User, 
  Printer, 
  FileText,
  Smartphone,
  FileSpreadsheet
} from 'lucide-react';

interface MessageItemProps {
  message: ChatMessage;
  onSelectLanguage?: (lang: SupportedLanguage) => void;
  onGenerateImage?: (prompt: string, aspectRatio: string) => void;
  isImageLoading?: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onSelectLanguage,
  onGenerateImage,
  isImageLoading
}) => {
  const [copied, setCopied] = React.useState(false);

  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportThisMessagePdf = () => {
    generatePdfReport({
      title: 'Relatório Ocypus AI',
      subtitle: `Mensagem gerada em ${message.timestamp}`,
      generalText: message.content,
      spreadsheet: message.spreadsheetData
    });
  };

  // Helper to format basic markdown text cleanly
  const renderFormattedText = (text: string) => {
    // Remove the json blocks from raw text display since we render them visually
    const cleanText = text
      .replace(/```json_apk[\s\S]*?```/g, '')
      .replace(/```json_spreadsheet[\s\S]*?```/g, '')
      .trim();

    if (!cleanText) return null;

    return (
      <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-zinc-200">
        {cleanText.split('\n\n').map((paragraph, pIdx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={pIdx} className="text-base font-bold text-red-500 mt-2 mb-1">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('#### ')) {
            return (
              <h4 key={pIdx} className="text-sm font-bold text-white mt-1.5 mb-1">
                {paragraph.replace('#### ', '')}
              </h4>
            );
          }
          if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
            const items = paragraph.split('\n').filter(Boolean);
            return (
              <ul key={pIdx} className="list-disc list-inside space-y-1 pl-1 text-zinc-300">
                {items.map((it, itIdx) => (
                  <li key={itIdx}>{it.replace(/^[-*]\s*/, '')}</li>
                ))}
              </ul>
            );
          }
          return <p key={pIdx}>{paragraph}</p>;
        })}
      </div>
    );
  };

  return (
    <div className={`flex w-full gap-3 py-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Assistant Logo Avatar */}
      {!isUser && (
        <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-xl border border-red-600/40 bg-black shadow-[0_0_12px_rgba(220,38,38,0.3)]">
          <Image
            src="/ocypus_logo.jpg"
            alt="Ocypus"
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Message Box */}
      <div className={`flex flex-col max-w-[92%] sm:max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Role label & timestamp */}
        <div className="flex items-center gap-2 mb-1 text-[11px] text-zinc-400">
          <span className={`font-bold ${isUser ? 'text-zinc-300' : 'text-red-400 font-mono'}`}>
            {isUser ? 'Você' : 'OCYPUS AI'}
          </span>
          <span className="text-[10px] text-zinc-500">{message.timestamp}</span>
        </div>

        {/* Attachment preview pill if user uploaded file */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {message.attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center gap-2 rounded-xl border border-red-900/40 bg-[#160d13] px-3 py-1.5 text-xs text-zinc-200"
              >
                <FileText className="h-4 w-4 text-red-500" />
                <span className="font-semibold">{att.name}</span>
                <span className="text-[10px] text-zinc-400">({(att.size / 1024).toFixed(1)} KB)</span>
              </div>
            ))}
          </div>
        )}

        {/* Main Bubble Content */}
        <div
          className={`rounded-2xl px-4 py-3.5 shadow-lg ${
            isUser
              ? 'border border-[#38161f] bg-[#160c11] text-zinc-100 rounded-tr-sm'
              : 'border border-[#261318] bg-[#0a0c12] text-zinc-200 rounded-tl-sm w-full'
          }`}
        >
          {renderFormattedText(message.content)}

          {/* Interactive Spreadsheet Viewer */}
          {message.spreadsheetData && (
            <SpreadsheetViewer initialData={message.spreadsheetData} />
          )}

          {/* Interactive APK Project Viewer */}
          {message.apkData && (
            <ApkViewer apkData={message.apkData} />
          )}

          {/* Interactive Code Viewer */}
          {message.codeSnippets && message.codeSnippets.length > 0 && (
            message.codeSnippets.map((snippet, idx) => (
              <CodeViewer
                key={idx}
                initialLanguage={snippet.language}
                code={snippet.code}
                explanation={snippet.explanation}
                onLanguageChange={onSelectLanguage}
              />
            ))
          )}

          {/* Interactive Image Viewer */}
          {message.generatedImages && message.generatedImages.length > 0 && (
            <ImageViewer
              images={message.generatedImages}
              onGenerateNew={onGenerateImage}
              isLoading={isImageLoading}
            />
          )}
        </div>

        {/* Action bar for Assistant messages */}
        {!isUser && (
          <div className="mt-1.5 flex items-center gap-2 text-xs">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-zinc-500 hover:bg-[#1a1116] hover:text-zinc-300 transition-colors"
              title="Copiar texto"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>

            <button
              onClick={handleExportThisMessagePdf}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-zinc-500 hover:bg-[#1a1116] hover:text-red-400 transition-colors"
              title="Exportar esta resposta em PDF"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Exportar PDF</span>
            </button>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#201016] border border-[#3b1720] text-zinc-300">
          <User className="h-5 w-5 text-red-500" />
        </div>
      )}
    </div>
  );
};
