'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GeneratedImageItem } from '@/lib/types';
import { 
  Download, 
  Sparkles, 
  Maximize2, 
  RefreshCw, 
  Image as ImageIcon 
} from 'lucide-react';

interface ImageViewerProps {
  images: GeneratedImageItem[];
  onGenerateNew?: (prompt: string, aspectRatio: string) => void;
  isLoading?: boolean;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  onGenerateNew,
  isLoading = false
}) => {
  const [selectedImage, setSelectedImage] = useState<GeneratedImageItem | null>(images[0] || null);
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [promptInput, setPromptInput] = useState<string>('');

  const handleDownload = (imgUrl: string, prompt: string) => {
    const a = document.createElement('a');
    a.href = imgUrl;
    a.download = `ocypus_${prompt.slice(0, 20).replace(/[^a-z0-9]/gi, '_')}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleTriggerGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim() || !onGenerateNew) return;
    onGenerateNew(promptInput.trim(), aspectRatio);
    setPromptInput('');
  };

  return (
    <div className="my-3 overflow-hidden rounded-2xl border border-[#3b1720] bg-[#0c0e14] shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2d141b] bg-[#140b0f] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-950/80 text-red-500 border border-red-700/40">
            <ImageIcon className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Gerador de Imagens Ocypus</h4>
            <p className="text-[11px] text-zinc-400">Criação visual de alta definição com IA</p>
          </div>
        </div>

        {/* Aspect Ratio Picker */}
        <div className="flex items-center gap-1 rounded-lg border border-[#35161f] bg-[#1a1218] p-1 text-xs">
          {(['1:1', '16:9', '9:16'] as const).map((ratio) => (
            <button
              key={ratio}
              onClick={() => setAspectRatio(ratio)}
              className={`px-2 py-0.5 rounded font-semibold transition-all ${
                aspectRatio === ratio
                  ? 'bg-red-600 text-white shadow-[0_0_8px_rgba(220,38,38,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {ratio === '1:1' ? '1:1 Quadrado' : ratio === '16:9' ? '16:9 Paisagem' : '9:16 Story'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Showcase */}
      <div className="p-4 flex flex-col items-center">
        {selectedImage ? (
          <div className="group relative overflow-hidden rounded-xl border border-red-900/40 bg-black max-w-lg w-full">
            <div className="relative aspect-square w-full">
              <Image
                src={selectedImage.url}
                alt={selectedImage.prompt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />
            </div>

            {/* Overlay on hover with download */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
              <p className="text-xs text-white font-medium line-clamp-2 mb-2">
                &ldquo;{selectedImage.prompt}&rdquo;
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(selectedImage.url, selectedImage.prompt)}
                  className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-500 transition-colors shadow-[0_0_12px_rgba(220,38,38,0.4)]"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Baixar Imagem</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center text-zinc-500">
            <ImageIcon className="h-12 w-12 text-red-900/60 mb-2" />
            <p className="text-xs">Nenhuma imagem gerada ainda. Digite um prompt abaixo!</p>
          </div>
        )}

        {/* Thumbnail row if multiple */}
        {images.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto w-full mt-3 p-1">
            {images.map((img) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className={`relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border transition-all ${
                  selectedImage?.id === img.id
                    ? 'border-red-600 ring-2 ring-red-600/50 scale-105'
                    : 'border-[#30161d] opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.prompt}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Prompt bar for generating inside viewer */}
      {onGenerateNew && (
        <form
          onSubmit={handleTriggerGenerate}
          className="border-t border-[#231016] bg-[#090a0f] p-3 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Descreva a imagem que deseja criar com a IA Ocypus..."
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-[#2b141a] bg-[#12141c] px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
          />
          <button
            type="submit"
            disabled={isLoading || !promptInput.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 text-xs font-bold text-white shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:from-red-500 hover:to-red-600 disabled:opacity-50 transition-all"
          >
            {isLoading ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            <span>{isLoading ? 'Criando...' : 'Gerar'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
