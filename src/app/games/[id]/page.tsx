/**
 * [CRITÉRIO 3.1 — ROTA DINÂMICA] A pasta `[id]` (colchetes) casa com /games/QUALQUER-ID;
 * o valor chega em `params.id`.
 * [CRITÉRIO 5.2] Server Component: busca jogo + avaliações no servidor (HTML já pronto, bom p/ SEO).
 * Só MediaGallery e ReviewsSection (interativos) são Client Components, nas "folhas" da árvore.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGameById, getReviewsByGame } from "@/lib/data";
import { MediaGallery } from "@/components/MediaGallery";
import { ReviewsSection } from "@/components/ReviewsSection";
import { StarRating } from "@/components/StarRating";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const game = await getGameById(params.id);
  return { title: game?.title ?? "Jogo não encontrado" };
}

export default async function GamePage({ params }: Props) {
  // Busca em paralelo (mais rápido que uma após a outra).
  const [game, reviews] = await Promise.all([getGameById(params.id), getReviewsByGame(params.id)]);
  if (!game) notFound(); // renderiza not-found.tsx

  return (
    <article className="space-y-6 rounded-2xl border border-slate-700 bg-[#1b2838] p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-black uppercase tracking-wide text-white">{game.title}</h1>
        <div className="mt-1 flex items-center gap-2 text-xs">
          <StarRating value={game.avgRating} />
          <strong className="text-white">{game.avgRating.toFixed(1)}</strong>
          <span className="text-slate-400">({game.reviewCount} avaliações)</span>
        </div>
      </header>

      <MediaGallery media={game.media} title={game.title} />

      <section className="rounded-xl border border-slate-800 bg-[#171a21] p-4">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">Sobre este jogo</h2>
        <p className="text-sm leading-relaxed text-slate-300">{game.description}</p>
      </section>

      <ReviewsSection gameId={game.id} initialReviews={reviews} />
    </article>
  );
}
