/**
 * [CRITÉRIO 1.2 — CRUD de avaliações: Update (PUT) e Delete (DELETE)]
 * [CRITÉRIO 2.2 — Proteção em camadas: além de logado, só o DONO altera a avaliação (403)]
 */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { isValidObjectId } from "mongoose";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { toReviewDTO } from "@/lib/serializers";
import Review from "@/models/Review";

/** Busca a avaliação e confere autenticação + propriedade. Retorna a resposta de erro OU a avaliação. */
async function authorize(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { error: NextResponse.json({ error: "Não autenticado." }, { status: 401 }) };
  if (!isValidObjectId(id)) return { error: NextResponse.json({ error: "ID inválido." }, { status: 400 }) };

  await connectDB();
  const review = await Review.findById(id);
  if (!review) return { error: NextResponse.json({ error: "Avaliação não encontrada." }, { status: 404 }) };
  if (review.user?.toString() !== session.user.id) {
    return { error: NextResponse.json({ error: "Você só pode alterar suas próprias avaliações." }, { status: 403 }) };
  }
  return { review };
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const auth = await authorize(params.id);
  if (auth.error) return auth.error;

  const body = await req.json().catch(() => null);
  const rating = Number(body?.rating);
  const comment = String(body?.comment ?? "").trim();
  if (!(rating >= 1 && rating <= 5) || comment.length < 3) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  auth.review.rating = rating;
  auth.review.comment = comment;
  await auth.review.save();

  revalidatePath("/");
  revalidatePath(`/games/${auth.review.game}`);
  return NextResponse.json(toReviewDTO(auth.review.toObject()));
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const auth = await authorize(params.id);
  if (auth.error) return auth.error;

  await auth.review.deleteOne();
  revalidatePath("/");
  revalidatePath(`/games/${auth.review.game}`);
  revalidatePath("/dashboard");
  return NextResponse.json({ ok: true });
}
