import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Ocypus AI',
  description: 'IA/Chatbot avançado com geração de APKs, planilhas Excel, extração de PDFs, relatórios, código em 10 linguagens e painel administrativo.',
  openGraph: {
    title: 'Ocypus AI',
    description: 'IA/Chatbot avançado com geração de APKs, planilhas Excel, extração de PDFs, relatórios, código em 10 linguagens e painel administrativo.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ocypus AI',
    description: 'IA/Chatbot avançado com geração de APKs, planilhas Excel, extração de PDFs, relatórios, código em 10 linguagens e painel administrativo.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className="dark">
      <body suppressHydrationWarning className="bg-[#08080a] text-zinc-100 antialiased selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
