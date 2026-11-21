/** [CRITÉRIO 3.1] Layout aninhado do grupo `(auth)`: o parêntese NÃO vira parte da URL (/login, /register), só agrupa e compartilha este layout (card centralizado). */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto mt-8 w-full max-w-sm rounded-2xl border border-slate-700 bg-[#1b2838] p-6 shadow-2xl">
      {children}
    </div>
  );
}
