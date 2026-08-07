import { Receipt, Calendar, Filter } from 'lucide-react';

/**
 * Historial de Ventas y Facturación por Sucursal
 */
export default function PaginaHistorialVentas() {
  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between border-b pb-4 border-stone-200">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Historial de Ventas</h1>
          <p className="text-xs text-stone-500">Registro completo de transacciones y tickets emitidos</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-2 bg-white border border-stone-300 text-stone-700 text-xs font-medium rounded-xl flex items-center gap-1.5 hover:bg-stone-50">
            <Calendar className="w-3.5 h-3.5" />
            <span>Filtrar Fecha</span>
          </button>
          <button className="px-3 py-2 bg-white border border-stone-300 text-stone-700 text-xs font-medium rounded-xl flex items-center gap-1.5 hover:bg-stone-50">
            <Filter className="w-3.5 h-3.5" />
            <span>Sucursal: Todas</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
        <div className="p-8 text-center border-2 border-dashed border-stone-200 rounded-xl text-stone-400 text-sm">
          Módulo de historial de ventas. Conectado próximamente a las tablas de transacciones en Supabase.
        </div>
      </div>

    </div>
  );
}
