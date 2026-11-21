/** [CRITÉRIO 3.1 — LAYOUT ANINHADO] Encaixa dentro do layout raiz e vale só para /dashboard/*. */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-1 border-l-4 border-yellow-500 pl-3 text-lg font-bold text-white">Meu Painel</h1>
      <p className="mb-6 pl-4 text-xs text-slate-400">Área privada: suas avaliações e cadastro de jogos.</p>
      {children}
    </div>
  );
}
