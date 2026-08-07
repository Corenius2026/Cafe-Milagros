import Link from 'next/link';
import { Coffee, Sparkles, ShoppingBag, Store, ShieldCheck, ArrowRight } from 'lucide-react';

/**
 * Página de inicio principal de Café & Milagros
 * Ofrece acceso rápido al Catálogo Público y al Panel POS Protegido de ambas sucursales.
 */
export default function PaginaInicio() {
  return (
    <main className="flex-1 flex flex-col justify-center items-center px-4 py-12 bg-gradient-to-br from-amber-50/50 via-stone-50 to-rose-50/50">
      <div className="max-w-4xl w-full text-center space-y-8">
        
        {/* Encabezado principal */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100/80 text-amber-900 font-medium text-sm border border-amber-200 shadow-sm">
            <Store className="w-4 h-4 text-amber-700" />
            <span>Sistema Micro-ERP & POS en la Nube</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-stone-900">
            Café <span className="text-amber-800">&</span> <span className="text-rose-700">Milagros</span>
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Plataforma integral de gestión multisucursal para <strong>Cafetería</strong> (Caja rápida) y <strong>Tienda de Belleza</strong> (Control de stock y catálogo).
          </p>
        </div>

        {/* Tarjetas de Selección de Módulo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          
          {/* Sucursal 1: Cafetería */}
          <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-amber-200 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between text-left group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Coffee className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-stone-900 mb-2">Sucursal Cafetería</h2>
              <p className="text-stone-600 text-sm mb-6">
                Ventas de caja rápida para bebidas, postres y snacks. Facturación inmediata e inventario especializado de insumos.
              </p>
            </div>
            <div className="space-y-3 pt-4 border-t border-amber-100">
              <Link 
                href="/pos/cafeteria"
                className="w-full py-2.5 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-medium flex items-center justify-between text-sm transition-colors shadow-sm"
              >
                <span>Acceder a POS Cafetería</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/catalogo/cafeteria"
                className="w-full py-2 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-medium flex items-center justify-between text-sm transition-colors"
              >
                <span>Ver Catálogo Público</span>
                <ShoppingBag className="w-4 h-4 text-amber-700" />
              </Link>
            </div>
          </div>

          {/* Sucursal 2: Productos Milagros (Belleza) */}
          <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-rose-200 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between text-left group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-stone-900 mb-2">Tienda de Belleza / Milagros</h2>
              <p className="text-stone-600 text-sm mb-6">
                Ventas por catálogo, control detallado de lotes, marcas de belleza y stock de Productos Milagros.
              </p>
            </div>
            <div className="space-y-3 pt-4 border-t border-rose-100">
              <Link 
                href="/pos/milagros"
                className="w-full py-2.5 px-4 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-medium flex items-center justify-between text-sm transition-colors shadow-sm"
              >
                <span>Acceder a POS Milagros</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/catalogo/belleza"
                className="w-full py-2 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-900 font-medium flex items-center justify-between text-sm transition-colors"
              >
                <span>Ver Catálogo Público</span>
                <ShoppingBag className="w-4 h-4 text-rose-700" />
              </Link>
            </div>
          </div>

        </div>

        {/* Acceso Global y Administración */}
        <div className="pt-6 border-t border-stone-200/80 flex flex-wrap items-center justify-center gap-4 text-sm text-stone-600">
          <Link href="/pos/inventario" className="hover:text-stone-900 font-medium transition-colors">
            Gestión de Inventario
          </Link>
          <span>•</span>
          <Link href="/pos/ventas" className="hover:text-stone-900 font-medium transition-colors">
            Historial de Ventas
          </Link>
          <span>•</span>
          <Link href="/pos/reportes" className="hover:text-stone-900 font-medium transition-colors">
            Reportes & Analítica
          </Link>
          <span>•</span>
          <Link href="/login" className="inline-flex items-center gap-1 text-stone-700 hover:text-stone-900 font-semibold underline underline-offset-4">
            <ShieldCheck className="w-4 h-4" />
            <span>Iniciar Sesión</span>
          </Link>
        </div>

      </div>
    </main>
  );
}
