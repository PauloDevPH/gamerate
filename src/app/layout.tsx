/**
 * [CRITÉRIO 3.1 — ROTEAMENTO / LAYOUTS ANINHADOS] Layout RAIZ: envolve TODAS as páginas.
 * Navbar e rodapé ficam aqui uma vez só. Outras pastas têm seu próprio layout.tsx
 * (ex.: (auth)/layout.tsx e dashboard/layout.tsx), que se encaixa DENTRO deste.
 * [CRITÉRIO 5.2] É Server Component; só <Providers> e <Navbar> são client.
 */
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: { default: "GameRate - Avaliação de Jogos", template: "%s | GameRate" },
  description: "Avalie jogos com estrelas e comentários. Projeto Web II.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="flex min-h-screen flex-col font-sans">
        <Providers>
          <Navbar />
          <main className="mx-auto w-full max-w-7xl flex-grow px-2 py-4 sm:px-4">{children}</main>
          <footer className="border-t border-slate-800 bg-slate-900 py-2 text-center text-[10px] text-slate-400">
            © 2026 GameRate — Desenvolvido para a disciplina de Web II
          </footer>
        </Providers>
      </body>
    </html>
  );
}
