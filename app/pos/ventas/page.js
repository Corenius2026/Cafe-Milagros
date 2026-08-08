'use client';

import { useState, useEffect } from 'react';
import { 
  Receipt, RefreshCw, Eye, CheckCircle2, Search, Store, CreditCard, Banknote, Zap, X
} from 'lucide-react';
import { obtenerHistorialVentas } from '@/lib/serviciosSupabase';

// Historial de prueba por defecto
const VENTAS_MINIMARKET_PRUEBA = [
  {
    id: 'v1',
    numero_factura: 'FAC-MINI-001024',
    cliente_nombre: 'Cliente Minimarket',
    metodo_pago: 'efectivo',
    subtotal: 10000,
    impuesto: 800,
    total: 10800,
    estado: 'completada',
    fecha_venta: new Date().toISOString(),
    detalles_venta: [
      { id: 'd1', cantidad: 2, precio_unitario: 4200, subtotal: 8400, productos: { nombre: 'Leche Entera 1 Litro' } },
      { id: 'd2', cantidad: 1, precio_unitario: 2400, subtotal: 2400, productos: { nombre: 'Pan Tajado Bimbo' } }
    ]
  },
  {
    id: 'v2',
    numero_factura: 'FAC-MINI-001025',
    cliente_nombre: 'Cliente Minimarket',
    metodo_pago: 'tarjeta',
    subtotal: 24300,
    impuesto: 1944,
    total: 26244,
    estado: 'completada',
    fecha_venta: new Date(Date.now() - 3600000).toISOString(),
    detalles_venta: [
      { id: 'd3', cantidad: 2, precio_unitario: 5800, subtotal: 11600, productos: { nombre: 'Gaseosa Coca-Cola 1.5L' } },
      { id: 'd4', cantidad: 1, precio_unitario: 14500, subtotal: 14500, productos: { nombre: 'Aceite de Girasol Gourmet 900ml' } }
    ]
  }
];

/**
 * Módulo de Historial de Ventas y Facturación de Minimarket
 */
export default function PaginaHistorialVentas() {
  const [ventas, setVentas] = useState(VENTAS_MINIMARKET_PRUEBA);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [ventaDetalle, setVentaDetalle] = useState(null);

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    setCargando(true);
    try {
      const listaVentas = await obtenerHistorialVentas();
      if (listaVentas && listaVentas.length > 0) {
        setVentas(listaVentas);
      }
    } catch (error) {
      console.error('Error al cargar ventas:', error);
    } finally {
      setCargando(false);
    }
  };

  // Filtrado por número de factura o cliente
  const ventasFiltradas = ventas.filter(v => {
    const busq = busqueda.toLowerCase().trim();
    return !busq || 
      v.numero_factura.toLowerCase().includes(busq) || 
      (v.cliente_nombre && v.cliente_nombre.toLowerCase().includes(busq));
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto antialiased">
      
      {/* Encabezado Principal */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-emerald-600" />
            <span>Historial de Ventas — Minimarket</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">Registro general de facturación y recibos emitidos</p>
        </div>

        <button
          onClick={cargarHistorial}
          disabled={cargando}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-semibold flex items-center gap-1.5"
        >
          <RefreshCw className={`w-4 h-4 ${cargando ? 'animate-spin text-emerald-600' : ''}`} />
          <span>Actualizar</span>
        </button>
      </div>

      {/* Barra de Búsqueda */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por número de factura o cliente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
          />
        </div>
      </div>

      {/* Tabla de Ventas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Factura N°</th>
                <th className="py-3 px-4">Fecha & Hora</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Método de Pago</th>
                <th className="py-3 px-4 text-right">Total ($)</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {ventasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    No se encontraron facturas registradas.
                  </td>
                </tr>
              ) : (
                ventasFiltradas.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                      {v.numero_factura}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(v.fecha_venta).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="py-3 px-4">
                      {v.cliente_nombre || 'Cliente Minimarket'}
                    </td>
                    <td className="py-3 px-4 uppercase text-[11px] font-bold text-slate-600">
                      {v.metodo_pago}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-slate-900">
                      ${v.total?.toLocaleString('es-CO')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Completada
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setVentaDetalle(v)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-semibold inline-flex items-center gap-1 text-[11px]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver Factura</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detalle de Factura */}
      {ventaDetalle && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Detalle de Factura</h3>
              <button onClick={() => setVentaDetalle(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1 font-mono text-xs text-slate-600">
              <p className="font-bold text-slate-900">{ventaDetalle.numero_factura}</p>
              <p>Fecha: {new Date(ventaDetalle.fecha_venta).toLocaleString()}</p>
              <p>Pago: <span className="uppercase font-bold">{ventaDetalle.metodo_pago}</span></p>
            </div>

            <div className="border-t border-b border-slate-100 py-2 space-y-1 text-xs">
              {ventaDetalle.detalles_venta?.map((it, idx) => (
                <div key={idx} className="flex justify-between text-slate-700">
                  <span>{it.cantidad}x {it.productos?.nombre || 'Producto'}</span>
                  <span className="font-bold">${it.subtotal?.toLocaleString('es-CO')}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-sm font-black text-slate-900 pt-1">
              <span>TOTAL FACTURA:</span>
              <span className="text-emerald-700">${ventaDetalle.total?.toLocaleString('es-CO')}</span>
            </div>

            <button
              onClick={() => setVentaDetalle(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
