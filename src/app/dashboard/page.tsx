/**
 * [CRITÉRIO 2.2 — PROTEÇÃO EM CAMADAS] Rota PRIVADA.
 * Camada 1: middleware.ts já barrou quem não tem JWT.
 * Camada 2 (aqui): conferimos a sessão NO SERVIDOR de novo (defesa em profundidade) e
 * só então lemos dados do usuário. Server Component => nada disso vai para o navegador.
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getReviewsByUser } from "@/lib/data";
import { StarRating } from "@/components/StarRating";
import { AddGameForm } from "@/components/AddGameForm";
import { DeleteReviewButton } from "@/components/DeleteReviewButton";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Meu Painel" };

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/dashboard");

  const reviews = await getReviewsByUser(session.user.id);

  return (
    <div className="space-y-10">
      <section>
        <h2 className="mb-3 text-sm font-bold text-slate-300">Minhas avaliações ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p className="text-xs italic text-slate-500">Você ainda não avaliou nenhum jogo. <Link href="/" className="text-yellow-400 underline">Ver jogos</Link></p>
        ) : (
          <ul className="space-y-3">
            {reviews.map((r) => (
              <li key={r.id} className="flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-[#12141c] p-3.5 text-xs">
                <div>
                  <Link href={`/games/${r.gameId}`} className="font-bold text-yellow-400 hover:underline">{r.gameTitle}</Link>
                  <div className="my-1 flex items-center gap-2"><StarRating value={r.rating} /><time className="text-[10px] text-slate-500">{formatDate(r.createdAt)}</time></div>
                  <p className="text-slate-300">{r.comment}</p>
                </div>
                <DeleteReviewButton id={r.id} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold text-slate-300">Cadastrar novo jogo</h2>
        <AddGameForm />
      </section>
    </div>
  );
}
