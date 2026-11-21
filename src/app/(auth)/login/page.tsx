import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Entrar" };

// useSearchParams (usado no form) exige <Suspense> para o build estático do Next.
export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
