/**
 * [CRITÉRIO 1.2 — CRUD de jogos: Read (GET) e Create (POST)]
 * [CRITÉRIO 2.2 — PROTEÇÃO NO BACKEND: o POST exige sessão válida]
 */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { getGames } from "@/lib/data";
import Game from "@/models/Game";

export async function GET() {
  return NextResponse.json(await getGames());
}

export async function POST(req: Request) {
  // Camada de BACKEND: mesmo que alguém burle a interface, sem sessão recebe 401.
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const title = String(body?.title ?? "").trim();
  const cover = String(body?.cover ?? "").trim();
  const description = String(body?.description ?? "").trim();
  const trailer = String(body?.trailer ?? "").trim(); // URL "embed" do YouTube (opcional)

  if (title.length < 2 || description.length < 10 || !/^https?:\/\//.test(cover)) {
    return NextResponse.json({ error: "Informe título, descrição (≥10) e uma URL de capa válida." }, { status: 400 });
  }

  const media = [
    ...(trailer.startsWith("https://www.youtube.com/embed/") ? [{ type: "video" as const, url: trailer }] : []),
    { type: "image" as const, url: cover },
  ];

  await connectDB();
  const game = await Game.create({ title, cover, description, media, createdBy: session.user.id });

  // [CRITÉRIO 1.3] Invalida o cache da home para o novo jogo aparecer imediatamente.
  revalidatePath("/");
  return NextResponse.json({ id: game._id.toString() }, { status: 201 });
}
