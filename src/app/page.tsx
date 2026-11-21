/**
 * [CRITÉRIO 5.2] SERVER COMPONENT (padrão): busca os jogos direto no MongoDB, no servidor.
 * [CRITÉRIO 1.3] Cache do Next.js: `revalidate = 60` guarda a página por 60s; e as API Routes
 * chamam revalidatePath("/") quando uma avaliação muda, atualizando na hora.
 * Só <GameGrid> (filtros interativos) é Client Component.
 */
import { getGames } from "@/lib/data";
import { GameGrid } from "@/components/GameGrid";

export const revalidate = 60;

export default async function HomePage() {
  const games = await getGames();
  return (
    <section>
      <h1 className="mb-3 border-l-4 border-yellow-500 pl-3 text-sm font-bold text-slate-300">Jogos em Destaque</h1>
      <GameGrid games={games} />
    </section>
  );
}
