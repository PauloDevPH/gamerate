/**
 * [CRITÉRIO 1.2 — CRUD (parte "Read")] + [CRITÉRIO 3.2 — Clean Architecture]
 * Camada de acesso a dados. Server Components e API Routes chamam estas funções,
 * então a lógica de consulta fica em UM lugar só (e não espalhada nas páginas).
 */
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Game from "@/models/Game";
import Review from "@/models/Review";
import { toGameDTO, toReviewDTO } from "@/lib/serializers";
import type { GameDTO, ReviewDTO } from "@/types";

/** Média e contagem de avaliações por jogo, calculadas pelo próprio MongoDB (aggregation). */
async function getRatingStats(match: Record<string, unknown> = {}) {
  const rows = await Review.aggregate<{ _id: unknown; avg: number; count: number }>([
    { $match: match },
    { $group: { _id: "$game", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  return new Map(rows.map((r) => [String(r._id), { avg: r.avg, count: r.count }]));
}

export async function getGames(): Promise<GameDTO[]> {
  await connectDB();
  const [games, stats] = await Promise.all([
    Game.find().sort({ createdAt: 1 }).lean(),
    getRatingStats(),
  ]);
  return games.map((g) => toGameDTO(g, stats.get(String(g._id))));
}

export async function getGameById(id: string): Promise<GameDTO | null> {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  const game = await Game.findById(id).lean();
  if (!game) return null;
  const stats = await getRatingStats({ game: game._id });
  return toGameDTO(game, stats.get(String(game._id)));
}

export async function getReviewsByGame(gameId: string): Promise<ReviewDTO[]> {
  if (!isValidObjectId(gameId)) return [];
  await connectDB();
  const reviews = await Review.find({ game: gameId }).sort({ createdAt: -1 }).lean();
  return reviews.map(toReviewDTO);
}

/** Avaliações de um usuário + título do jogo (usado no dashboard privado). */
export async function getReviewsByUser(userId: string) {
  await connectDB();
  const reviews = await Review.find({ user: userId }).sort({ createdAt: -1 }).lean();
  const games = await Game.find({ _id: { $in: reviews.map((r) => r.game) } }).select("title").lean();
  const titles = new Map(games.map((g) => [String(g._id), g.title]));
  return reviews.map((r) => ({ ...toReviewDTO(r), gameTitle: titles.get(String(r.game)) ?? "Jogo removido" }));
}
