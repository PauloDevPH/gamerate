"use client";
/** [CRITÉRIO 1.2 — CRUD: Create de jogo] Formulário do painel privado. Usa useMutation e atualiza a home via revalidatePath (no backend). */
import { useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

export function AddGameForm() {
  const [form, setForm] = useState({ title: "", cover: "", trailer: "", description: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const create = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/games", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erro ao cadastrar");
      return data as { id: string };
    },
    onSuccess: () => setForm({ title: "", cover: "", trailer: "", description: "" }),
  });

  return (
    <div className="space-y-3 rounded-xl border border-slate-700 bg-[#171a21] p-4">
      <Input placeholder="Título do jogo" value={form.title} onChange={set("title")} />
      <Input placeholder="URL da capa (https://...)" value={form.cover} onChange={set("cover")} />
      <Input placeholder="Trailer (opcional): https://www.youtube.com/embed/ID" value={form.trailer} onChange={set("trailer")} />
      <Textarea placeholder="Descrição (mín. 10 caracteres)" value={form.description} onChange={set("description")} />
      {create.error && <p className="text-xs text-red-400" role="alert">{create.error.message}</p>}
      {create.isSuccess && <p className="text-xs text-emerald-400">Jogo cadastrado! <Link className="underline" href={`/games/${create.data.id}`}>Ver página</Link></p>}
      <Button variant="success" disabled={create.isPending} onClick={() => create.mutate()}>{create.isPending ? "Salvando..." : "Cadastrar jogo"}</Button>
    </div>
  );
}
