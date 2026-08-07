'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, DollarSign, Store, Coffee, Sparkles, RefreshCw, Calendar, ArrowUpRight
} from 'lucide-react';
import { obtenerHistorialVentas } from '@/lib/serviciosSupabase';

/**
 * Módulo de Reportes y Analítica de Cierre por Sucursal
 */
export default function PaginaReportes() {
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    setCargando(true);
    try {
      const listaVentas = await obtenerHistorialVentas();
      setVentas(listaVentas);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    } finally {
      setCargando(false);
    }
  };

  // Cálculos de analítica
  const totalVentasGeneral = ventas.reduce((acc, v) => acc + (v.total || 0), 0);
  
  const ventasCafeteria = ventas.filter(v => v.bodegas?.tipo === 'cafeteria' || v.numero_factura.includes('CAF'));
  const totalCafeteria = ventasCafeteria.reduce((acc, v) => acc + (v.total || 0), 0);

  const ventasMilagros = ventas.filter(v => v.bodegas?.tipo === 'milagros' || v.numero_factura.includes('MIL'));
  const totalMilagros = ventasMilagros.reduce((acc, v) => acc + (v.total || 0), 0);

  const numTransacciones = ventas.length;
  const ticketPromedio = numTransacciones > 0 ? Math.round(totalVentasGeneral / numTransacciones) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 border-stone-200">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Reportes & Analítica de Cierre</h1>
          <p className="text-xs text-stone-500 font-medium">Consolidado de ingresos multisucursal</p>
        </div>

        <button 
          onClick={cargarReportes}
          className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
          title="Recargar métricas"
        >
          <RefreshCw className={`w-4 h-4 ${cargando ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tarjetas Principales de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total General */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-stone-500 font-bold uppercase tracking-wider">Ingresos Totales</p>
            <p className="text-2xl font-extrabold text-stone-900 mt-0.5">
              ${totalVentasGeneral.toLocaleString('es-CO')}
            </p>
          </div>
        </div>

        {/* Cafetería */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-gradient-to-br from-white to-amber-50/40 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-800 text-amber-100 rounded-2xl">
            <Coffee className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-amber-900 font-bold uppercase tracking-wider">Ventas Cafetería</p>
            <p className="text-2xl font-extrabold text-amber-950 mt-0.5">
              ${totalCafeteria.toLocaleString('es-CO')}
            </p>
          </div>
        </div>

        {/* Productos Milagros */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200 bg-gradient-to-br from-white to-rose-50/40 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-700 text-rose-100 rounded-2xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-rose-900 font-bold uppercase tracking-wider">Ventas Milagros</p>
            <p className="text-2xl font-extrabold text-rose-950 mt-0.5">
              ${totalMilagros.toLocaleString('es-CO')}
            </p>
          </div>
        </div>

        {/* Ticket Promedio */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-stone-900 text-white rounded-2xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-stone-500 font-bold uppercase tracking-wider">Ticket Promedio</p>
            <p className="text-2xl font-extrabold text-stone-900 mt-0.5">
              ${ticketPromedio.toLocaleString('es-CO')}
            </p>
          </div>
        </div>

      </div>

      {/* Desglose Comparativo por Sucursal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Desglose Cafetería */}
        <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-amber-100">
            <div className="flex items-center gap-2">
              <Coffee className="w-5 h-5 text-amber-800" />
              <h2 className="font-bold text-stone-900">Rendimiento Sucursal Cafetería</h2>
            </div>
            <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
              Caja Rápida
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-600">Número de Tickets Emitidos:</span>
              <span className="font-bold text-stone-900">{ventasCafeteria.length} transacciones</span>
            </div>
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-600">Porcentaje sobre ventas totales:</span>
              <span className="font-bold text-amber-900">
                {totalVentasGeneral > 0 ? Math.round((totalCafeteria / totalVentasGeneral) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between py-2 font-extrabold text-stone-900 text-sm">
              <span>Total Recaudado Cafetería:</span>
              <span className="text-amber-900">${totalCafeteria.toLocaleString('es-CO')}</span>
            </div>
          </div>
        </div>

        {/* Desglose Productos Milagros */}
        <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3 border-rose-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-700" />
              <h2 className="font-bold text-stone-900">Rendimiento Productos Milagros</h2>
            </div>
            <span className="text-xs font-bold text-rose-900 bg-rose-100 px-2.5 py-0.5 rounded-full">
              Venta por Catálogo
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-600">Número de Órdenes Procesadas:</span>
              <span className="font-bold text-stone-900">{ventasMilagros.length} transacciones</span>
            </div>
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-600">Porcentaje sobre ventas totales:</span>
              <span className="font-bold text-rose-900">
                {totalVentasGeneral > 0 ? Math.round((totalMilagros / totalVentasGeneral) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between py-2 font-extrabold text-stone-900 text-sm">
              <span>Total Recaudado Milagros:</span>
              <span className="text-rose-900">${totalMilagros.toLocaleString('es-CO')}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
