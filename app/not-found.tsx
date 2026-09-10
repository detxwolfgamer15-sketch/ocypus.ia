import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#07080a] text-zinc-200 px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-950/40 border border-red-800/60 text-red-500 mb-6 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-black tracking-tight text-white mb-2">404 - Página Não Encontrada</h1>
      <p className="text-sm text-zinc-400 max-w-md text-center mb-6">
        A rota solicitada não existe no sistema Ocypus AI.
      </p>
      <Link
        href="/"
        className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-[0_0_15px_rgba(220,38,38,0.4)]"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Voltar para Ocypus AI</span>
      </Link>
    </div>
  );
}
