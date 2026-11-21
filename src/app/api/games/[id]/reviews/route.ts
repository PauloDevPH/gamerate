/**
 * [CRITÉRIO 1.2 — CRUD de avaliações: Read (GET) e Create (POST)]
 */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { isValidObjectId } from "mongoose";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { getReviewsByGame } from "@/lib/data";
import { toReviewDTO } from "@/lib/serializers";
import Game from "@/models/Game";
import Review from "@/models/Review";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json(await getReviewsByGame(params.id));
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  // [CRITÉRIO 2.2] Proteção no backend.
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Faça login para avaliar." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const rating = Number(body?.rating);
  const comment = String(body?.comment ?? "").trim();
  if (!(rating >= 1 && rating <= 5) || comment.length < 3) {
    return NextResponse.json({ error: "Escolha de 1 a 5 estrelas e escreva um comentário." }, { status: 400 });
  }

  await connectDB();
  if (!isValidObjectId(params.id) || !(await Game.exists({ _id: params.id }))) {
    return NextResponse.json({ error: "Jogo não encontrado." }, { status: 404 });
  }

  try {
    const review = await Review.create({
      game: params.id,
      user: session.user.id,
      author: session.user.name ?? "Anônimo",
      rating,
      comment,
    });
    // [CRITÉRIO 1.3] Revalida as páginas que mostram a média/contagem (cache do Next.js).
    revalidatePath("/");
    revalidatePath(`/games/${params.id}`);
    return NextResponse.json(toReviewDTO(review.toObject()), { status: 201 });
  } catch (e: unknown) {
    // 11000 = violação do índice único (game+user): o usuário já avaliou este jogo.
    if ((e as { code?: number }).code === 11000) {
      return NextResponse.json({ error: "Você já avaliou este jogo. Edite sua avaliação." }, { status: 409 });
    }
    throw e;
  }
}
