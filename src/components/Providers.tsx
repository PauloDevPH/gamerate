"use client";
/**
 * [CRITÉRIO 1.3 / 2.1] Providers globais (precisam ser Client Components):
 * - SessionProvider  => disponibiliza useSession() (NextAuth)
 * - QueryClientProvider => disponibiliza o cache do React Query
 */
import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: { children: React.ReactNode }) {
  // useState garante UM QueryClient por navegador (não recria a cada render).
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } }));
  return (
    <SessionProvider>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </SessionProvider>
  );
}
