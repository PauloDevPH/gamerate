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

  if (confirming) {
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-red-500/40 bg-red-950/30 px-2.5 py-1.5 text-xs">
        <span className="font-medium text-red-200">Deseja realmente excluir o comentário?</span>
        <Button size="sm" variant="secondary" disabled={remove.isPending} onClick={() => setConfirming(false)}>
          Cancelar
        </Button>
        <Button size="sm" variant="destructive" disabled={remove.isPending} onClick={() => remove.mutate()}>
          <Trash2 className="h-3 w-3" /> {remove.isPending ? "Excluindo..." : "Excluir"}
        </Button>
      </div>
    );
  }

  return (
    <Button size="sm" variant="destructive" onClick={() => setConfirming(true)}>
      <Trash2 className="h-3 w-3" /> Excluir
    </Button>
  );
}
