"use client";
/** [CRITÉRIO 2.1 — fluxo de login] signIn("credentials") chama authorize() em lib/auth.ts; se der certo o NextAuth grava o cookie com o JWT. */
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) return setError("E-mail ou senha inválidos.");
    router.push(params.get("callbackUrl") ?? "/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h1 className="text-lg font-bold text-white">Entrar</h1>
      <Input type="email" required placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input type="password" required placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="text-xs text-red-400" role="alert">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</Button>
      <p className="text-center text-xs text-slate-400">Não tem conta? <Link href="/register" className="text-yellow-400 underline">Cadastre-se</Link></p>
    </form>
  );
}
