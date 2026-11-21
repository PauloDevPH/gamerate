"use client";
/**
 * [CRITÉRIO 2.1] Logout: `signOut()` apaga o cookie do JWT. `useSession()` lê a sessão no cliente.
 * [CRITÉRIO 2.2 — camada de UX] Mostra "Entrar" ou "Painel/Sair" conforme a sessão.
 * [CRITÉRIO 3.3] A busca grava no store Zustand (e só aparece na home).
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Gamepad2, LogOut, Search, User } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const searchTerm = useUIStore((s) => s.searchTerm);
  const setSearchTerm = useUIStore((s) => s.setSearchTerm);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/90 shadow-md backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-2 md:flex-row">
        <Link href="/" className="flex items-center gap-2">
          <Gamepad2 className="h-6 w-6 text-yellow-500" />
          <span className="bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-lg font-black tracking-wider text-transparent">GameRate</span>
        </Link>

        {pathname === "/" && (
          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Pesquisar jogo por nome..." className="py-1.5 pl-8" />
          </div>
        )}

        <nav className="flex items-center gap-2">
          {status === "loading" ? null : session?.user ? (
            <>
              <Link href="/dashboard" className="flex items-center gap-1 text-xs text-slate-300 hover:text-yellow-400">
                <User className="h-3.5 w-3.5" /> {session.user.name}
              </Link>
              <Button size="sm" variant="secondary" onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut className="h-3.5 w-3.5" /> Sair
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-xs text-slate-300 hover:text-yellow-400">Entrar</Link>
              <Link href="/register"><Button size="sm">Cadastrar</Button></Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
