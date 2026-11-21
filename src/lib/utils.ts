import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Utilitário padrão do ShadCN/UI: junta classes Tailwind resolvendo conflitos. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Data em pt-BR com fuso fixo, para servidor e navegador renderizarem igual (evita erro de hidratação). */
export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
}
