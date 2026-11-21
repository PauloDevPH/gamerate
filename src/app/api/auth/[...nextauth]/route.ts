import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// [CRITÉRIO 2.1] Rota catch-all do NextAuth: atende /api/auth/signin, /signout, /session, /csrf...
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
