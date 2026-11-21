"use client";
/** [CRITÉRIO 2.3] Cadastro: envia para /api/register (que aplica bcrypt) e já faz login em seguida. */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (!res.ok) {
      setLoading(false);
      return setError((await res.json()).error ?? "Erro ao cadastrar.");
    }
    await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h1 className="text-lg font-bold text-white">Criar conta</h1>
      <Input required placeholder="Nome" value={form.name} onChange={set("name")} />
      <Input type="email" required placeholder="E-mail" value={form.email} onChange={set("email")} />
      <Input type="password" required minLength={6} placeholder="Senha (mín. 6 caracteres)" value={form.password} onChange={set("password")} />
      {error && <p className="text-xs text-red-400" role="alert">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Criando..." : "Cadastrar"}</Button>
      <p className="text-center text-xs text-slate-400">Já tem conta? <Link href="/login" className="text-yellow-400 underline">Entrar</Link></p>
    </form>
  );
}
