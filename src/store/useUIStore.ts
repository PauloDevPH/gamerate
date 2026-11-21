/**
 * ============================================================================
 * [CRITÉRIO 3.3 — GERENCIAMENTO DE ESTADO DE UI COM ZUSTAND]  (0,5 pt)
 * ============================================================================
 * Zustand guarda APENAS estado do CLIENTE (interface): termo de busca, filtro de
 * nota mínima e se o formulário de avaliação está aberto.
 * Os DADOS do servidor (jogos, avaliações) ficam no React Query / Server Components.
 * Separar os dois evita misturar "estado de tela" com "cache de servidor".
 *
 * Performance: cada componente usa um *selector* (ex.: `useUIStore(s => s.searchTerm)`),
 * então só re-renderiza quando AQUELA fatia do estado muda.
 */
import { create } from "zustand";

interface UIState {
  searchTerm: string;
  minRating: number; // 0 = todos
  activeReviewGameId: string | null; // ID do jogo cujo formulário de avaliação está aberto
  setSearchTerm: (term: string) => void;
  setMinRating: (rating: number) => void;
  toggleReviewForm: (gameId: string) => void;
  closeReviewForm: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  searchTerm: "",
  minRating: 0,
  activeReviewGameId: null,
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setMinRating: (minRating) => set({ minRating }),
  toggleReviewForm: (gameId) => set((s) => ({ activeReviewGameId: s.activeReviewGameId === gameId ? null : gameId })),
  closeReviewForm: () => set({ activeReviewGameId: null }),
}));
