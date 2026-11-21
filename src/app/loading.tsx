/** [CRITÉRIO 3.4 — RESILIÊNCIA/UX] Mostrado automaticamente (Suspense) enquanto a página busca dados. */
export default function Loading() {
  return (
    <div className="grid animate-pulse grid-cols-2 gap-3 md:grid-cols-4" aria-busy="true" aria-label="Carregando">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="aspect-[2/3] rounded-xl bg-slate-800" />
      ))}
    </div>
  );
}
