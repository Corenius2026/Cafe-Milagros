import { BarChart3, TrendingUp, DollarSign, Store } from 'lucide-react';

/**
 * Reportes y Analítica de Cierre de Caja
 */
export default function PaginaReportes() {
  return (
    <div className="space-y-6">
      
      <div className="border-b pb-4 border-stone-200">
        <h1 className="text-2xl font-bold text-stone-900">Reportes & Cierre de Caja</h1>
        <p className="text-xs text-stone-500">Métricas de ingresos desglosadas por sucursal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">Ventas totales del día</p>
            <p className="text-2xl font-bold text-stone-900">$0.00</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-xl">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">Ventas Cafetería</p>
            <p className="text-2xl font-bold text-stone-900">$0.00</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-100 text-rose-800 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-medium">Ventas Productos Milagros</p>
            <p className="text-2xl font-bold text-stone-900">$0.00</p>
          </div>
        </div>

      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
        <div className="p-8 text-center border-2 border-dashed border-stone-200 rounded-xl text-stone-400 text-sm">
          Gráficos y reportes comparativos listos para vincular con las funciones PostgreSQL de Supabase.
        </div>
      </div>

    </div>
  );
}
