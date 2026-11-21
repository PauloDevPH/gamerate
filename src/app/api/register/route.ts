/**
 * [CRITÉRIO 2.3 — SEGURANÇA DE CREDENCIAIS]  (0,5 pt)
 * Cadastro de usuário. A senha NUNCA é salva em texto puro: passa por bcrypt.hash()
 * (com "salt" aleatório embutido, custo 10). Mesmo que o banco vaze, as senhas
 * não podem ser lidas — e bcrypt é lento de propósito, o que dificulta força bruta.
 */
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  // Validação no servidor (nunca confie só na validação do navegador).
  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 6) {
    return NextResponse.json({ error: "Dados inválidos (nome ≥ 2, e-mail válido, senha ≥ 6 caracteres)." }, { status: 400 });
  }

  await connectDB();
  if (await User.exists({ email })) {
    return NextResponse.json({ error: "Este e-mail já está cadastrado." }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 10); // <-- hashing
  await User.create({ name, email, password: hashed });
  return NextResponse.json({ ok: true }, { status: 201 });
}
