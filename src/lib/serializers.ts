import type { IGame } from "@/models/Game";
import type { IReview } from "@/models/Review";
import type { GameDTO, ReviewDTO } from "@/types";

/** Converte documento do Mongo (lean) -> objeto simples e serializável (DTO). */
export function toGameDTO(g: IGame, stats?: { avg: number; count: number }): GameDTO {
  return {
    id: g._id.toString(),
    title: g.title,
    cover: g.cover,
    description: g.description,
    media: g.media.map((m) => ({ type: m.type, url: m.url })),
    avgRating: stats ? Number(stats.avg.toFixed(1)) : 0,
    reviewCount: stats?.count ?? 0,
  };
}

export function toReviewDTO(r: IReview): ReviewDTO {
  return {
    id: r._id.toString(),
    gameId: r.game.toString(),
    userId: r.user ? r.user.toString() : null,
    author: r.author,
    rating: r.rating,
    comment: r.comment,
    createdAt: new Date(r.createdAt).toISOString(),
  };
}
