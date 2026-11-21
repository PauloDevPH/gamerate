/**
 * [CRITÉRIO 5.2 — ESCOPOS] SERVER COMPONENT (sem 'use client'): só exibe estrelas,
 * não tem estado nem eventos, então não precisa enviar JavaScript ao navegador.
 */
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`Nota ${value} de 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={cn("h-3.5 w-3.5", i <= Math.round(value) ? "fill-yellow-500 text-yellow-500" : "text-slate-600")} />
      ))}
    </span>
  );
}
