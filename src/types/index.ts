/**
 * [CRITÉRIO 3.2 — Tipagem consistente]
 * DTOs ("Data Transfer Objects"): versões SERIALIZÁVEIS (só string/number) dos documentos
 * do Mongo. Server Components só podem passar dados simples para Client Components,
 * então convertemos ObjectId -> string e Date -> string ISO.
 */
export interface MediaDTO {
  type: "image" | "video";
  url: string;
}

export interface GameDTO {
  id: string;
  title: string;
  cover: string;
  description: string;
  media: MediaDTO[];
  avgRating: number; // média calculada no servidor
  reviewCount: number;
}

export interface ReviewDTO {
  id: string;
  gameId: string;
  userId: string | null;
  author: string;
  rating: number;
  comment: string;
  createdAt: string; // ISO
}
