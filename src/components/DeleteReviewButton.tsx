"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/** [CRITÉRIO 1.2 / 1.3 — Delete com React Query] Client Component mínimo (folha): usa useMutation + invalidateQueries + router.refresh(). */
export function DeleteReviewButton({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [confirming, setConfirming] = useState(false);

  const remove = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir avaliação");
    },
    onSuccess: () => {
      setConfirming(false);
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      router.refresh(); // re-renderiza o Server Component do dashboard com os dados novos
    },
  });

  return (
    <>
      <Button size="sm" variant="destructive" onClick={() => setConfirming(true)}>
        <Trash2 className="h-3 w-3" /> Excluir
      </Button>

      {confirming && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => !remove.isPending && setConfirming(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-slate-700 bg-[#1b2838] p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 text-sm font-bold text-white">Confirmar exclusão</h3>
            <p className="mb-5 text-xs text-slate-300">Deseja realmente excluir o comentário?</p>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="secondary" disabled={remove.isPending} onClick={() => setConfirming(false)}>
                Cancelar
              </Button>
              <Button size="sm" variant="destructive" disabled={remove.isPending} onClick={() => remove.mutate()}>
                <Trash2 className="h-3 w-3" /> {remove.isPending ? "Excluindo..." : "Excluir"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
