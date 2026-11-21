"use client"; // error.tsx PRECISA ser Client Component (recebe `reset`, uma função)
/** [CRITÉRIO 3.4 — RESILIÊNCIA/UX] Error Boundary: captura erros de renderização/dados desta rota e oferece "tentar de novo". */
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="py-20 text-center" role="alert">
      <h2 className="mb-2 text-lg font-bold text-red-400">Algo deu errado</h2>
      <p className="mb-4 text-sm text-slate-400">{error.message || "Não foi possível carregar os dados."}</p>
      <Button onClick={reset}>Tentar novamente</Button>
    </div>
  );
}
