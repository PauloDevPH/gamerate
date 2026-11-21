/**
 * ============================================================================
 * [CRITÉRIO 2.1 — AUTENTICAÇÃO COM NEXTAUTH.JS]  (0,5 pt)
 * ============================================================================
 * - Provider "Credentials": login com e-mail + senha.
 * - session.strategy = "jwt": a sessão fica num TOKEN JWT assinado (NEXTAUTH_SECRET)
 *   guardado em cookie httpOnly. Não precisa de tabela de sessões no banco.
 * - Logout: `signOut()` do next-auth/react apaga esse cookie (ver Navbar).
 */
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 }, // sessão dura 7 dias
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" }, // usa a nossa tela de login em vez da padrão do NextAuth
  providers: [
    CredentialsProvider({
      name: "E-mail e senha",
      credentials: { email: { label: "E-mail", type: "email" }, password: { label: "Senha", type: "password" } },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        await connectDB();

        // +password: a senha tem select:false no model, então pedimos explicitamente aqui.
        const user = await User.findOne({ email: credentials.email.toLowerCase() }).select("+password");
        if (!user) return null;

        // [CRITÉRIO 2.3] bcrypt.compare compara a senha digitada com o HASH salvo.
        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok) return null;

        return { id: user._id.toString(), name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    // 1) No login, copiamos o id do usuário para dentro do JWT...
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    // 2) ...e a cada leitura de sessão, expomos esse id em `session.user.id`.
    async session({ session, token }) {
      if (session.user && token.id) session.user.id = token.id;
      return session;
    },
  },
};
