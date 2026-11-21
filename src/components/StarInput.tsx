"use client";
/**
 * [CRITÉRIO 5.2 — ESCOPOS] CLIENT COMPONENT "folha": precisa de hover/click, então
 * usa 'use client'. É pequeno e fica no fim da árvore, não contamina a página inteira.
 * [CRITÉRIO 4.2] Feedback visual imediato: as estrelas pintam ao passar o mouse.
 */
import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((i) => (
          <button key={i} type="button" aria-label={`${i} estrelas`} onMouseEnter={() => setHover(i)} onClick={() => onChange(i)}>
            <Star className={cn("h-6 w-6 transition-colors", i <= shown ? "fill-yellow-400 text-yellow-400" : "text-slate-600")} />
          </button>
        ))}
      </div>
      <span className="text-xs font-bold text-slate-300">{shown.toFixed(1)} / 5.0</span>
    </div>
  );
}
