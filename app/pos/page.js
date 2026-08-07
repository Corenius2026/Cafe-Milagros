import Link from 'next/link';
import { Coffee, Sparkles, Package, Receipt, BarChart3 } from 'lucide-react';

/**
 * Panel de Inicio del Sistema POS
 */
export default function PaginaPanelPOS() {
  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-3xl font-bold text-stone-900">Panel POS & Micro-ERP</h1>
        <p className="text-stone-600 text-sm">Selecciona la caja o módulo que deseas operar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Caja Cafetería */}
        <Link 
          href="/pos/cafeteria"
          className="bg-amber-800 hover:bg-amber-900 text-white rounded-2xl p-6 shadow-md transition-all flex flex-col justify-between h-48 group"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold bg-amber-900/60 px-3 py-1 rounded-full text-amber-200">
                Caja Rápida
              </span>
              <h2 className="text-2xl font-bold mt-2">Bodega Cafetería</h2>
            </div>
            <Coffee className="w-8 h-8 text-amber-300 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-xs text-amber-100">Facturación rápida de espressos, repostería y consumos inmediatos.</p>
        </Link>

        {/* Caja Productos Milagros */}
        <Link 
          href="/pos/milagros"
          className="bg-rose-700 hover:bg-rose-800 text-white rounded-2xl p-6 shadow-md transition-all flex flex-col justify-between h-48 group"
        >
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold bg-rose-900/60 px-3 py-1 rounded-full text-rose-200">
                Ventas por Catálogo
              </span>
              <h2 className="text-2xl font-bold mt-2">Bodega Productos Milagros</h2>
            </div>
            <Sparkles className="w-8 h-8 text-rose-300 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-xs text-rose-100">Gestión de cosméticos, control de stock y atención por catálogo.</p>
        </Link>

      </div>

      {/* Tarjetas informativas de módulos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        
        <Link href="/pos/inventario" className="bg-white rounded-xl p-5 border border-stone-200 hover:border-stone-300 shadow-sm transition-all">
          <Package className="w-6 h-6 text-stone-700 mb-2" />
          <h3 className="font-semibold text-stone-900">Control de Inventario</h3>
          <p className="text-xs text-stone-500 mt-1">Gestión de insumos y productos por bodega.</p>
        </Link>

        <Link href="/pos/ventas" className="bg-white rounded-xl p-5 border border-stone-200 hover:border-stone-300 shadow-sm transition-all">
          <Receipt className="w-6 h-6 text-stone-700 mb-2" />
          <h3 className="font-semibold text-stone-900">Historial de Ventas</h3>
          <p className="text-xs text-stone-500 mt-1">Consultar facturas emitidas y anulaciones.</p>
        </Link>

        <Link href="/pos/reportes" className="bg-white rounded-xl p-5 border border-stone-200 hover:border-stone-300 shadow-sm transition-all">
          <BarChart3 className="w-6 h-6 text-stone-700 mb-2" />
          <h3 className="font-semibold text-stone-900">Reportes de Cierre</h3>
          <p className="text-xs text-stone-500 mt-1">Ingresos por sucursal y flujo de caja.</p>
        </Link>

      </div>

    </div>
  );
}
