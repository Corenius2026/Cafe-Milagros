'use client';

import { useState, useEffect } from 'react';
import { 
  Receipt, Calendar, Filter, RefreshCw, Eye, CheckCircle2, XCircle, Search, Store, CreditCard, Banknote
} from 'lucide-react';
import { obtenerHistorialVentas, obtenerBodegas } from '@/lib/serviciosSupabase';

// Datos de demostración
const VENTAS_PRUEBA = [
  {
    id: 'v1',
    numero_factura: 'FAC-CAF-839201',
    bodegas: { nombre: 'Cafetería Central', tipo: 'cafeteria' },
    cliente_nombre: 'Cliente Cafetería',
    metodo_pago: 'efectivo',
    subtotal: 12000,
    impuesto: 960,
    total: 12960,
    estado: 'completada',
    fecha_venta: new Date().toISOString(),
    detalles_venta: [
      { id: 'd1', cantidad: 2, precio_unitario: 4500, subtotal: 9000, productos: { nombre: 'Espresso Doble Especial' } },
      { id: 'd2', cantidad: 1, precio_unitario: 3000, subtotal: 3000, productos: { nombre: 'Agua Manantial' } }
    ]
  },
  {
    id: 'v2',
    numero_factura: 'FAC-MIL-940283',
    bodegas: { nombre: 'Tienda Productos Milagros', tipo: 'milagros' },
    cliente_nombre: 'Cliente Catálogo Belleza',
    metodo_pago: 'tarjeta',
    subtotal: 83000,
    impuesto: 15770,
    total: 98770,
    estado: 'completada',
    fecha_venta: new Date(Date.now() - 3600000).toISOString(),
    detalles_venta: [
      { id: 'd3', cantidad: 1, precio_unitario: 45000, subtotal: 45000, productos: { nombre: 'Champú Bio-Reparador Milagros 500ml' } },
      { id: 'd4', cantidad: 1, precio_unitario: 38000, subtotal: 38000, productos: { nombre: 'Mascarilla de Frutas Nutritiva 300g' } }
    ]
  }
];

/**
 * Módulo de Historial de Ventas y Facturación Multisucursal
 */
export default function PaginaHistorialVentas() {
  const [ventas, setVentas] = useState(VENTAS_PRUEBA);
  const [bodegas, setBodegas] = useState([]);
  const [bodegaFiltro, setBodegaFiltro] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);
  const [ventaDetalle, setVentaDetalle] = useState(null);

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    setCargando(true);
    try {
      const bds = await obtenerBodegas();
      setBodegas(bds);

      const listaVentas = await obtenerHistorialVentas();
      if (listaVentas.length > 0) {
        setVentas(listaVentas);
      }
    } catch (error) {
      console.error('Error al cargar ventas:', error);
    } finally {
      setCargando(false);
    }
  };

  // Filtrado de ventas
  const ventasFiltradas = ventas.filter(v => {
    const coincideBodega = bodegaFiltro === 'todas' || v.bodegas?.tipo === bodegaFiltro || v.bodega_id === bodegaFiltro;
    const coincideBusqueda = v.numero_factura.toLowerCase().includes(busqueda.toLowerCase()) || 
                            (v.cliente_nombre && v.cliente_nombre.toLowerCase().includes(busqueda.toLowerCase()));
    return coincideBodega && coincideBusqueda;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 border-stone-200">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Historial de Ventas & Facturación</h1>
          <p className="text-xs text-stone-500 font-medium">Registro de comprobantes emitidos por sucursal</p>
        </div>

        <button 
          onClick={cargarHistorial}
          className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
          title="Recargar ventas"
        >
          <RefreshCw className={`w-4 h-4 ${cargando ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <input 
            type="text" 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por # Factura o Nombre de Cliente..." 
            className="w-full pl-9 pr-4 py-2 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-semibold">Filtrar Sucursal:</span>
          <select
            value={bodegaFiltro}
            onChange={(e) => setBodegaFiltro(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-800 outline-none"
          >
            <option value="todas">Todas las Sucursales</option>
            <option value="cafeteria">Cafetería</option>
            <option value="milagros">Tienda Productos Milagros</option>
          </select>
        </div>
      </div>

      {/* Tabla de Historial */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                <th className="py-3.5 px-4">Factura / Ticket</th>
                <th className="py-3.5 px-4">Sucursal</th>
                <th className="py-3.5 px-4">Fecha y Hora</th>
                <th className="py-3.5 px-4">Método Pago</th>
                <th className="py-3.5 px-4 text-right">Total</th>
                <th className="py-3.5 px-4 text-center">Estado</th>
                <th className="py-3.5 px-4 text-right">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {ventasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-400">
                    No se encontraron transacciones registradas.
                  </td>
                </tr>
              ) : (
                ventasFiltradas.map(v => {
                  const esCafeteria = v.bodegas?.tipo === 'cafeteria';

                  return (
                    <tr key={v.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-stone-900">
                        {v.numero_factura}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          esCafeteria ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-900'
                        }`}>
                          <Store className="w-3 h-3" />
                          <span>{v.bodegas?.nombre || (esCafeteria ? 'Cafetería' : 'Milagros')}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-stone-500 font-medium">
                        {new Date(v.fecha_venta).toLocaleString('es-CO')}
                      </td>

                      <td className="py-3.5 px-4 capitalize font-semibold text-stone-700">
                        <div className="flex items-center gap-1.5">
                          {v.metodo_pago === 'tarjeta' ? <CreditCard className="w-3.5 h-3.5 text-stone-400" /> : <Banknote className="w-3.5 h-3.5 text-stone-400" />}
                          <span>{v.metodo_pago}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-extrabold text-stone-900 text-sm">
                        ${v.total.toLocaleString('es-CO')}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          Completada
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setVentaDetalle(v)}
                          className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-lg text-xs transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detalle de Factura */}
      {ventaDetalle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-bold text-stone-900 text-lg">Comprobante de Venta</h3>
                <p className="text-xs text-stone-500">{ventaDetalle.numero_factura}</p>
              </div>
              <button onClick={() => setVentaDetalle(null)} className="text-stone-400 hover:text-stone-700">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Sucursal:</span>
                <span className="font-bold text-stone-900">{ventaDetalle.bodegas?.nombre || 'General'}</span>
              </div>
              <div className="flex justify-between">
                <span>Fecha:</span>
                <span>{new Date(ventaDetalle.fecha_venta).toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between">
                <span>Método de Pago:</span>
                <span className="capitalize font-semibold text-stone-800">{ventaDetalle.metodo_pago}</span>
              </div>
            </div>

            <div className="border-t border-b border-stone-200 py-3 space-y-2 text-xs">
              <p className="font-bold text-stone-800 mb-1">Ítems Vendidos:</p>
              {ventaDetalle.detalles_venta?.map((d, idx) => (
                <div key={idx} className="flex justify-between text-stone-700">
                  <span>{d.cantidad}x {d.productos?.nombre || 'Producto'}</span>
                  <span className="font-bold">${d.subtotal.toLocaleString('es-CO')}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${ventaDetalle.subtotal.toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between">
                <span>Impuesto:</span>
                <span>${ventaDetalle.impuesto.toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-stone-900 pt-1 border-t">
                <span>TOTAL:</span>
                <span>${ventaDetalle.total.toLocaleString('es-CO')}</span>
              </div>
            </div>

            <button
              onClick={() => setVentaDetalle(null)}
              className="w-full py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs"
            >
              Cerrar Comprobante
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
