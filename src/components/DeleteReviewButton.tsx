"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/** [CRITÉRIO 1.2 — Delete] Client Component mínimo (folha): só ele precisa de onClick. */
export function DeleteReviewButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <Button size="sm" variant="destructive" disabled={busy} onClick={async () => {
      setBusy(true);
      await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      router.refresh(); // re-renderiza o Server Component do dashboard com os dados novos
    }}>
      <Trash2 className="h-3 w-3" /> {busy ? "Excluindo..." : "Excluir"}
    </Button>
  );
}
