"use client";
/**
 * [CRITÉRIO 3.3 — ZUSTAND] A grade lê `searchTerm` e `minRating` do store e filtra a lista
 * (que veio PRONTA do Server Component da home). Filtrar no cliente dá resposta instantânea
 * a cada tecla, sem ir ao servidor.
 */
import { useMemo } from "react";
import { useUIStore } from "@/store/useUIStore";
import { GameCard } from "@/components/GameCard";
import { cn } from "@/lib/utils";
import type { GameDTO } from "@/types";

export function GameGrid({ games }: { games: GameDTO[] }) {
  // Selectors: re-renderiza só quando ESSAS fatias mudam.
  const searchTerm = useUIStore((s) => s.searchTerm);
  const minRating = useUIStore((s) => s.minRating);
  const setMinRating = useUIStore((s) => s.setMinRating);

  const filtered = useMemo(
    () => games.filter((g) => g.title.toLowerCase().includes(searchTerm.toLowerCase()) && g.avgRating >= minRating),
    [games, searchTerm, minRating]
  );

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400">Nota mínima:</span>
        {[0, 3, 4, 4.5].map((r) => (
          <button
            key={r}
            onClick={() => setMinRating(r)}
            className={cn("rounded-full border px-3 py-1 transition-colors", minRating === r ? "border-yellow-500 bg-yellow-500 font-bold text-slate-950" : "border-slate-700 text-slate-300 hover:border-yellow-500/60")}
          >
            {r === 0 ? "Todas" : `${r}+ ★`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-slate-400">Nenhum jogo encontrado.</p>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4">
          {filtered.map((g, i) => (
            <GameCard key={g.id} game={g} priority={i < 4} />
          ))}
        </div>
      )}
    </>
  );
}
