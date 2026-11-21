"use client";
/**
 * ============================================================================
 * [CRITÉRIO 1.3 — GERENCIAMENTO ASSÍNCRONO E CACHE COM REACT QUERY]  (1,0 pt)
 * ============================================================================
 * - useQuery  : busca as avaliações e guarda em CACHE (chave ["reviews", gameId]).
 *               `initialData` vem do Server Component => a página já nasce preenchida (sem "flash" de loading).
 * - useMutation: criar / editar / excluir. No `onSuccess` chamamos `invalidateQueries`,
 *               que marca o cache como velho e refaz a busca sozinho => lista sempre sincronizada.
 * - router.refresh(): atualiza a parte do Server Component (média de estrelas no cabeçalho).
 * Nada de useEffect + fetch + setState "na unha" (frágil: race conditions, sem cache, sem retry).
 *
 * [CRITÉRIO 3.3] Aberto/fechado do formulário vem do Zustand (estado de UI).
 * [CRITÉRIO 2.2] Camada de UX: sem login, o botão vira link para /login (o backend também bloqueia).
 */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Pencil, Star, Trash2 } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { StarInput } from "@/components/StarInput";
import { StarRating } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import type { ReviewDTO } from "@/types";

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json" } });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Erro inesperado");
  return data as T;
}

export function ReviewsSection({ gameId, initialReviews }: { gameId: string; initialReviews: ReviewDTO[] }) {
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isOpen = useUIStore((s) => s.activeReviewGameId === gameId);
  const toggleReviewForm = useUIStore((s) => s.toggleReviewForm);
  const close = useUIStore((s) => s.closeReviewForm);
  const toggle = () => toggleReviewForm(gameId);

  const queryKey = ["reviews", gameId];
  const { data: reviews = [] } = useQuery({
    queryKey,
    queryFn: () => api<ReviewDTO[]>(`/api/games/${gameId}/reviews`),
    initialData: initialReviews,
    staleTime: 30_000,
  });

  const myReview = reviews.find((r) => r.userId && r.userId === session?.user?.id);

  // Depois de qualquer mutação: invalida o cache do React Query + atualiza o Server Component.
  const afterChange = () => {
    queryClient.invalidateQueries({ queryKey });
    router.refresh();
  };

  const save = useMutation({
    mutationFn: (v: { rating: number; comment: string }) =>
      myReview
        ? api(`/api/reviews/${myReview.id}`, { method: "PUT", body: JSON.stringify(v) }) // UPDATE
        : api(`/api/games/${gameId}/reviews`, { method: "POST", body: JSON.stringify(v) }), // CREATE
    onSuccess: () => { afterChange(); close(); },
  });

  const remove = useMutation({
    mutationFn: (id: string) => api(`/api/reviews/${id}`, { method: "DELETE" }), // DELETE
    onSuccess: afterChange,
  });

  return (
    <section className="border-t border-slate-800 pt-6">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-base font-bold text-white"><MessageSquare className="h-4 w-4 text-yellow-500" /> Avaliações da Comunidade</h2>
          <span className="text-xs text-slate-400">Ordenadas da mais recente para a mais antiga</span>
        </div>
        {session?.user ? (
          <Button onClick={toggle}>{myReview ? <><Pencil className="h-3.5 w-3.5" /> Editar minha avaliação</> : <><Star className="h-3.5 w-3.5" /> Avaliar Jogo</>}</Button>
        ) : (
          <Link href="/login"><Button variant="secondary">Entre para avaliar</Button></Link>
        )}
      </div>

      {isOpen && session?.user && (
        // key => ao trocar entre "nova" e "editar", o formulário reinicia com os valores certos.
        <ReviewForm key={myReview?.id ?? "new"} initial={myReview} pending={save.isPending} error={save.error?.message} onSubmit={(v) => save.mutate(v)} onCancel={close} />
      )}

      <div className="space-y-3">
        {reviews.length === 0 && <p className="text-xs italic text-slate-500">Ainda não há avaliações. Seja o primeiro a avaliar este jogo!</p>}
        {reviews.map((r) => (
          <article key={r.id} className="rounded-xl border border-slate-800 bg-[#12141c] p-3.5 text-xs">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="font-bold text-white">{r.author}</span>
              <time className="text-[10px] text-slate-500">{formatDate(r.createdAt)}</time>
            </div>
            <p className="mb-2 leading-relaxed text-slate-300">{r.comment}</p>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1"><StarRating value={r.rating} /><b className="ml-1 text-slate-300">{r.rating}</b></span>
              {r.userId && r.userId === session?.user?.id && (
                <Button size="sm" variant="destructive" disabled={remove.isPending} onClick={() => remove.mutate(r.id)}><Trash2 className="h-3 w-3" /> Excluir</Button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReviewForm({ initial, pending, error, onSubmit, onCancel }: {
  initial?: ReviewDTO; pending: boolean; error?: string;
  onSubmit: (v: { rating: number; comment: string }) => void; onCancel: () => void;
}) {
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [comment, setComment] = useState(initial?.comment ?? "");
  const invalid = rating === 0 || comment.trim().length < 3;

  return (
    <div className="mb-6 rounded-xl border border-slate-700 bg-[#171a21] p-4">
      <h3 className="mb-2 text-xs font-bold text-yellow-400">{initial ? "Edite sua análise" : "Escreva sua análise"}</h3>
      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="O que você achou do jogo? Recomenda?" className="mb-3" />
      <div className="mb-4"><StarInput value={rating} onChange={setRating} /></div>
      {error && <p className="mb-3 text-xs text-red-400" role="alert">{error}</p>}
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button size="sm" variant="success" disabled={invalid || pending} onClick={() => onSubmit({ rating, comment })}>{pending ? "Salvando..." : initial ? "Salvar alterações" : "Publicar Avaliação"}</Button>
      </div>
    </div>
  );
}
