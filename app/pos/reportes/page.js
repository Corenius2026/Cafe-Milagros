'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, DollarSign, Store, RefreshCw, ShoppingCart, Zap, CreditCard, Banknote
} from 'lucide-react';
import { obtenerHistorialVentas } from '@/lib/serviciosSupabase';

/**
 * Módulo de Reportes y Cierre Diario de Minimarket
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
      if (listaVentas && listaVentas.length > 0) {
        setVentas(listaVentas);
      } else {
        // Datos demostrativos de ventas de prueba
        setVentas([
          { total: 10800, metodo_pago: 'efectivo' },
          { total: 26244, metodo_pago: 'tarjeta' },
          { total: 15400, metodo_pago: 'efectivo' },
          { total: 8900, metodo_pago: 'transferencia' }
        ]);
      }
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    } finally {
      setCargando(false);
    }
  };

  // Cálculos de métricas
  const totalVentasGeneral = ventas.reduce((acc, v) => acc + (v.total || 0), 0);
  const totalEfectivo = ventas.filter(v => v.metodo_pago === 'efectivo').reduce((acc, v) => acc + (v.total || 0), 0);
  const totalTarjeta = ventas.filter(v => v.metodo_pago === 'tarjeta').reduce((acc, v) => acc + (v.total || 0), 0);
  const totalTransferencia = ventas.filter(v => v.metodo_pago === 'transferencia').reduce((acc, v) => acc + (v.total || 0), 0);

  const numTransacciones = ventas.length;
  const ticketPromedio = numTransacciones > 0 ? Math.round(totalVentasGeneral / numTransacciones) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto antialiased">
      
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-600" />
            <span>Reportes & Cierre Diario — Minimarket</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">Consolidado general de ingresos y arqueo de caja</p>
        </div>

        <button 
          onClick={cargarReportes}
          className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-xs font-bold"
          title="Recargar métricas"
        >
          <RefreshCw className={`w-4 h-4 ${cargando ? 'animate-spin text-emerald-600' : ''}`} />
          <span>Actualizar Métricas</span>
        </button>
      </div>

      {/* Tarjetas Principales de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Ingresos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Ventas Totales</p>
            <h3 className="text-2xl font-black text-slate-900">${totalVentasGeneral.toLocaleString('es-CO')}</h3>
          </div>
        </div>

        {/* Transacciones */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-800 rounded-2xl">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">N° de Facturas</p>
            <h3 className="text-2xl font-black text-slate-900">{numTransacciones}</h3>
          </div>
        </div>

        {/* Ticket Promedio */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Ticket Promedio</p>
            <h3 className="text-2xl font-black text-slate-900">${ticketPromedio.toLocaleString('es-CO')}</h3>
          </div>
        </div>

        {/* Estado Caja */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-teal-100 text-teal-800 rounded-2xl">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Estado de Caja</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              Abierta / Operativa
            </span>
          </div>
        </div>

      </div>

      {/* Desglose por Método de Pago */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-black text-slate-900">Arqueo por Método de Pago</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Banknote className="w-5 h-5 text-emerald-700" />
              <div>
                <p className="text-xs font-bold text-emerald-900">Efectivo en Caja</p>
                <p className="text-lg font-black text-emerald-950">${totalEfectivo.toLocaleString('es-CO')}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-blue-700" />
              <div>
                <p className="text-xs font-bold text-blue-900">Datáfono / Tarjetas</p>
                <p className="text-lg font-black text-blue-950">${totalTarjeta.toLocaleString('es-CO')}</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-purple-700" />
              <div>
                <p className="text-xs font-bold text-purple-900">Transferencias</p>
                <p className="text-lg font-black text-purple-950">${totalTransferencia.toLocaleString('es-CO')}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
