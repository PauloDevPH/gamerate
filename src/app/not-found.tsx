import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h2 className="mb-2 text-lg font-bold text-white">Página não encontrada</h2>
      <Link href="/" className="text-sm text-yellow-400 underline">Voltar para a home</Link>
    </div>
  );
}
