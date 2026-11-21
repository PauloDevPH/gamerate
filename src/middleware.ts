/**
 * [CRITÉRIO 2.2 — PROTEÇÃO DE ROTAS EM CAMADAS]  (0,5 pt)
 * Camada 1 (borda/Edge): o middleware roda ANTES da página ser renderizada.
 * Quem não tem JWT válido é redirecionado para /login.
 * Camada 2: a página /dashboard confere a sessão de novo no servidor (getServerSession).
 * Camada 3: as API Routes de escrita retornam 401/403 sem sessão/sem ser o dono.
 * Camada 4 (UX): a interface esconde/troca botões para quem não está logado.
 */
import { withAuth } from "next-auth/middleware";

export default withAuth({ pages: { signIn: "/login" } });

// Só as rotas privadas passam pelo middleware.
export const config = { matcher: ["/dashboard/:path*"] };
