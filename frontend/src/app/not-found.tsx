import { SearchX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
     <SearchX size={100} />
      <h1 className="text-5xl font-bold text-red-500">404</h1>
      <p>Recurso não encontrado</p>
      <Link href="/" className="text-blue-500 hover:underline">Voltar para Home</Link>
    </div>
  );
}
