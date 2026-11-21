/**
 * [CRITÉRIO 5.1] <Image> do Next.js: redimensiona/converte (WebP/AVIF) automaticamente e faz
 * lazy-load. `fill` + `sizes` dizem ao Next qual tamanho gerar para cada tela.
 * <Link>: navegação sem recarregar a página + prefetch da rota quando o card aparece na tela.
 */
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import type { GameDTO } from "@/types";

export function GameCard({ game, priority = false }: { game: GameDTO; priority?: boolean }) {
  return (
    <Link
      href={`/games/${game.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-800/80 shadow-lg transition-all hover:border-yellow-500/50"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
        <Image
          src={game.cover}
          alt={`Capa de ${game.title}`}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
      </div>
      <div className="p-2.5">
        <h3 className="mb-0.5 truncate text-xs font-bold text-white sm:text-sm">{game.title}</h3>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="flex items-center gap-1 text-yellow-500">
            <Star className="h-3 w-3 fill-yellow-500" /> {game.avgRating.toFixed(1)}
          </span>
          <span className="text-[10px] text-slate-500">({game.reviewCount})</span>
        </div>
        <span className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-yellow-400 group-hover:underline">
          Ver detalhes e avaliar <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
