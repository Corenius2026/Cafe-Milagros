'use client';

import { Coffee, ShoppingCart, Plus, Minus, Trash2, CreditCard, Banknote } from 'lucide-react';
import { useState } from 'react';

/**
 * Punto de Venta (POS) - Sucursal Cafetería (Caja Rápida)
 */
export default function PaginaPOSCafeteria() {
  const [carrito, setCarrito] = useState([]);

  return (
    <div className="space-y-6">
      
      {/* Encabezado */}
      <div className="flex items-center justify-between border-b pb-4 border-stone-200">
        <div className="flex items-center gap-3 text-amber-800">
          <Coffee className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Caja Rápida - Cafetería</h1>
            <p className="text-xs text-stone-500">Bodega activa: Cafetería Central</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-semibold rounded-full border border-amber-200">
          Modo Rápido Activo
        </span>
      </div>

      {/* Grid de POS: Catálogo a la izquierda, Carrito a la derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Productos de la Cafetería */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <h2 className="font-semibold text-stone-800 text-sm border-b pb-2">Menú Rápido</h2>
          
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-amber-900 text-sm text-center">
            Estructura base lista para consumir productos de la bodega <strong>Cafetería</strong> vía Supabase PostgreSQL.
          </div>
        </div>

        {/* Carrito de Compra / Ticket de Venta */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2 font-semibold text-stone-800">
                <ShoppingCart className="w-5 h-5 text-amber-700" />
                <span>Ticket de Venta</span>
              </div>
              <span className="text-xs text-stone-500">0 ítems</span>
            </div>

            <div className="py-8 text-center text-stone-400 text-xs">
              El ticket se encuentra vacío. Haz clic en un producto para agregarlo.
            </div>
          </div>

          <div className="space-y-3 border-t pt-4 border-stone-100">
            <div className="flex justify-between font-bold text-stone-900 text-lg">
              <span>Total a pagar:</span>
              <span>$0.00</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button className="py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors">
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
