import Link from 'next/link';
import { Coffee, Sparkles, ShoppingBag } from 'lucide-react';

/**
 * Vista general del Catálogo Público de Productos.
 */
export default function PaginaCatalogoGeneral() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-stone-900">Catálogo Digital de Productos</h1>
        <p className="text-stone-600">Explora la variedad de nuestros menús de Cafetería y Productos de Belleza Milagros.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          href="/catalogo/cafeteria"
          className="p-8 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-md hover:shadow-xl transition-all group"
        >
          <Coffee className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
          <h2 className="text-2xl font-bold mb-2">Menú de Cafetería</h2>
          <p className="text-amber-100 text-sm">Cafés de especialidad, bebidas frías, postres y repostería recién horneada.</p>
        </Link>

        <Link 
          href="/catalogo/belleza"
          className="p-8 rounded-2xl bg-gradient-to-br from-rose-600 to-pink-700 text-white shadow-md hover:shadow-xl transition-all group"
        >
          <Sparkles className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
          <h2 className="text-2xl font-bold mb-2">Productos de Belleza Milagros</h2>
          <p className="text-rose-100 text-sm">Cuidado capilar, tratamientos faciales, cosméticos y líneas naturales.</p>
        </Link>
      </div>
    </div>
  );
}
