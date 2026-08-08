import Link from 'next/link';
import { Store, ArrowLeft } from 'lucide-react';

/**
 * Página 404 No Encontrado personalizada para App Router
 */
export default function PaginaNoEncontrada() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-12 antialiased">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center font-bold">
          <Store className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">Página No Encontrada</h1>
        <p className="text-xs text-slate-500">
          La ruta a la que intentas acceder no existe o fue movida.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Inicio</span>
        </Link>
      </div>
    </div>
  );
}
