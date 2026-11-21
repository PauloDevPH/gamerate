"use client";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/** [CRITÉRIO 1.2 / 1.3 — Delete com React Query] Client Component mínimo (folha): usa useMutation + invalidateQueries + router.refresh(). */
export function DeleteReviewButton({ id }: { id: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const remove = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir avaliação");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      router.refresh(); // re-renderiza o Server Component do dashboard com os dados novos
    },
  });

  return (
    <Button size="sm" variant="destructive" disabled={remove.isPending} onClick={() => remove.mutate()}>
      <Trash2 className="h-3 w-3" /> {remove.isPending ? "Excluindo..." : "Excluir"}
    </Button>
  );
}
