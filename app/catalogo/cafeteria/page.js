import Link from 'next/link';
import { Coffee, ArrowLeft, Search } from 'lucide-react';

/**
 * Catálogo Público de la Cafetería
 */
export default function PaginaCatalogoCafeteria() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between border-b pb-4 border-stone-200">
        <div className="flex items-center gap-3">
          <Link href="/catalogo" className="p-2 rounded-lg hover:bg-stone-200 transition-colors">
            <ArrowLeft className="w-5 h-5 text-stone-700" />
          </Link>
          <div className="flex items-center gap-2 text-amber-800">
            <Coffee className="w-6 h-6" />
            <h1 className="text-2xl font-bold text-stone-900">Menú Cafetería</h1>
          </div>
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Buscar café, postre..." 
            className="pl-9 pr-4 py-2 rounded-xl border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
        </div>
      </div>

      <div className="bg-amber-50/60 rounded-2xl p-6 border border-amber-200 text-center">
        <p className="text-amber-900 font-medium">Estructura lista para conectar con la tabla de productos de Supabase (Categoría: Cafetería).</p>
      </div>
    </div>
  );
}
