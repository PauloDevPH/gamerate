/** [CRITÉRIO 3.4] Skeleton específico da página de detalhes. */
export default function Loading() {
  return (
    <div className="animate-pulse space-y-4 rounded-2xl border border-slate-700 bg-[#1b2838] p-6" aria-busy="true">
      <div className="h-8 w-1/2 rounded bg-slate-700" />
      <div className="aspect-video rounded-lg bg-slate-800" />
      <div className="h-24 rounded bg-slate-800" />
    </div>
  );
}
