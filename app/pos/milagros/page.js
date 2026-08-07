'use client';

import { Sparkles, ShoppingBag, Search, Filter, CreditCard, Banknote } from 'lucide-react';
import { useState } from 'react';

/**
 * Punto de Venta (POS) - Sucursal Tienda de Belleza / Productos Milagros
 */
export default function PaginaPOSMilagros() {
  const [busqueda, setBusqueda] = useState('');

  return (
    <div className="space-y-6">
      
      {/* Encabezado */}
      <div className="flex items-center justify-between border-b pb-4 border-stone-200">
        <div className="flex items-center gap-3 text-rose-700">
          <Sparkles className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Ventas por Catálogo - Productos Milagros</h1>
            <p className="text-xs text-stone-500">Bodega activa: Tienda de Belleza / Productos Milagros</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-rose-100 text-rose-900 text-xs font-semibold rounded-full border border-rose-200">
          Control de Stock de Lotes
        </span>
      </div>

      {/* Grid de POS: Catálogo de belleza a la izquierda, Orden a la derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Catálogo y Filtros */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input 
                type="text" 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre, código de barras o línea..." 
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
            <button className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 text-sm flex items-center gap-2 hover:bg-stone-50">
              <Filter className="w-4 h-4" />
              <span>Categorías</span>
            </button>
          </div>

          <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 text-rose-900 text-sm text-center">
            Estructura base lista para consumir productos de la bodega <strong>Productos Milagros</strong> vía Supabase PostgreSQL.
          </div>
        </div>

        {/* Resumen de Pedido */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2 font-semibold text-stone-800">
                <ShoppingBag className="w-5 h-5 text-rose-600" />
                <span>Orden de Productos</span>
              </div>
              <span className="text-xs text-stone-500">0 ítems</span>
            </div>

            <div className="py-8 text-center text-stone-400 text-xs">
              No se han agregado productos a la orden.
            </div>
          </div>

          <div className="space-y-3 border-t pt-4 border-stone-100">
            <div className="flex justify-between font-bold text-stone-900 text-lg">
              <span>Total a pagar:</span>
              <span>$0.00</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button className="py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors">
                <Banknote className="w-4 h-4" />
                <span>Efectivo</span>
              </button>
              <button className="py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors">
                <CreditCard className="w-4 h-4" />
                <span>Tarjeta</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
