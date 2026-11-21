"use client";
/** Galeria de mídia (vídeo do YouTube + screenshots). Client Component porque tem estado local do slide atual. */
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MediaDTO } from "@/types";

function thumb(m: MediaDTO) {
  return m.type === "video" ? `https://img.youtube.com/vi/${m.url.split("/embed/")[1]?.split("?")[0]}/hqdefault.jpg` : m.url;
}

export function MediaGallery({ media, title }: { media: MediaDTO[]; title: string }) {
  const [index, setIndex] = useState(0);
  if (media.length === 0) return null;
  const current = media[index];
  const go = (d: number) => setIndex((i) => (i + d + media.length) % media.length);

  return (
    <div>
      <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-lg bg-black shadow-2xl">
        {current.type === "video" ? (
          <iframe src={current.url} title={`Trailer de ${title}`} className="h-full w-full border-0" allowFullScreen allow="autoplay; encrypted-media" />
        ) : (
          <Image src={current.url} alt={`Imagem de ${title}`} fill sizes="(max-width: 1024px) 100vw, 900px" className="object-cover" />
        )}
        <button onClick={() => go(-1)} aria-label="Mídia anterior" className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/90"><ChevronLeft className="h-4 w-4" /></button>
        <button onClick={() => go(1)} aria-label="Próxima mídia" className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/90"><ChevronRight className="h-4 w-4" /></button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {media.map((m, i) => (
          <button key={i} onClick={() => setIndex(i)} aria-label={`Mídia ${i + 1}`} className={cn("relative h-16 w-24 flex-shrink-0 overflow-hidden rounded border-2 transition-all", i === index ? "scale-105 border-yellow-400" : "border-transparent opacity-50 hover:opacity-100")}>
            <Image src={thumb(m)} alt="" fill sizes="96px" className="object-cover" />
            {m.type === "video" && <span className="absolute inset-0 flex items-center justify-center bg-black/40"><Play className="h-3 w-3 text-white" /></span>}
          </button>
        ))}
      </div>
    </div>
  );
}
