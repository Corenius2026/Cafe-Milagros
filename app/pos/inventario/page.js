import { Package, Store, Plus, Search } from 'lucide-react';

/**
 * Gestión de Inventario Multisucursal (Bodega Cafetería y Bodega Productos Milagros)
 */
export default function PaginaInventario() {
  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between border-b pb-4 border-stone-200">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Control de Inventario y Stock</h1>
          <p className="text-xs text-stone-500">Gestión independiente de stock por bodega / sucursal</p>
        </div>

        <button className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-sm font-medium rounded-xl flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Selector de Bodega */}
      <div className="flex gap-4">
        <button className="flex-1 p-4 rounded-xl border-2 border-amber-600 bg-amber-50/50 text-left font-medium text-amber-900">
          <div className="flex items-center gap-2 mb-1">
            <Store className="w-4 h-4 text-amber-700" />
            <span className="font-bold">Bodega Cafetería</span>
          </div>
          <span className="text-xs text-stone-600">Gestión de insumos y consumibles</span>
        </button>

        <button className="flex-1 p-4 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-left font-medium text-stone-700">
          <div className="flex items-center gap-2 mb-1">
            <Store className="w-4 h-4 text-rose-600" />
            <span className="font-bold">Bodega Productos Milagros</span>
          </div>
          <span className="text-xs text-stone-500">Gestión de lotes y cosméticos</span>
        </button>
      </div>

      {/* Tabla de Productos */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-stone-900">Listado de Existencias</h2>
          <div className="relative w-64">
            <input 
              type="text" 
              placeholder="Buscar en el inventario..." 
              className="w-full pl-9 pr-4 py-2 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
          </div>
        </div>

        <div className="p-8 text-center border-2 border-dashed border-stone-200 rounded-xl text-stone-400 text-sm">
          Vista previa del módulo de inventario. Listo para sincronizarse con Supabase.
        </div>
      </div>

    </div>
  );
}
