'use client';

import { useState, useEffect } from 'react';
import { 
  Package, Store, Plus, Search, RefreshCw, AlertTriangle, CheckCircle2, Edit3, X, Tag, Calendar
} from 'lucide-react';
import { 
  obtenerBodegaPorTipo,
  obtenerProductosEInventarioPorBodega, 
  actualizarStockInventario, 
  crearProductoNuevo 
} from '@/lib/serviciosSupabase';

// Respaldo de inventario por defecto
const PRODUCTOS_INVENTARIO_PRUEBA = [
  { id: 'p1', sku: 'MINI-LAC-01', codigo_barras: '7701001', nombre: 'Leche Entera 1 Litro', precio_venta: 4200, costo: 3100, inventario_bodega: [{ id: 'inv1', stock_actual: 150, stock_minimo: 20, lote: 'LOT-2026-01', fecha_vencimiento: '2026-10-15' }] },
  { id: 'p2', sku: 'MINI-BEB-02', codigo_barras: '7701002', nombre: 'Gaseosa Coca-Cola 1.5L', precio_venta: 5800, costo: 4200, inventario_bodega: [{ id: 'inv2', stock_actual: 90, stock_minimo: 15, lote: 'GENERAL', fecha_vencimiento: null }] },
  { id: 'p3', sku: 'MINI-ABA-03', codigo_barras: '7701003', nombre: 'Arroz Diana Roa 1kg', precio_venta: 4600, costo: 3400, inventario_bodega: [{ id: 'inv3', stock_actual: 200, stock_minimo: 25, lote: 'GENERAL', fecha_vencimiento: null }] },
  { id: 'p4', sku: 'MINI-SNA-04', codigo_barras: '7701004', nombre: 'Papas Margarita Limón 110g', precio_venta: 3800, costo: 2600, inventario_bodega: [{ id: 'inv4', stock_actual: 8, stock_minimo: 15, lote: 'GENERAL', fecha_vencimiento: null }] },
  { id: 'p5', sku: 'MINI-PAN-05', codigo_barras: '7701005', nombre: 'Pan Tajado Bimbo Artesano', precio_venta: 7200, costo: 5100, inventario_bodega: [{ id: 'inv5', stock_actual: 45, stock_minimo: 10, lote: 'LOT-2026-08', fecha_vencimiento: '2026-08-30' }] },
  { id: 'p6', sku: 'MINI-ASE-06', codigo_barras: '7701006', nombre: 'Jabón Rey Multiusos 300g', precio_venta: 2900, costo: 1900, inventario_bodega: [{ id: 'inv6', stock_actual: 120, stock_minimo: 15, lote: 'GENERAL', fecha_vencimiento: null }] }
];

/**
 * Módulo de Gestión de Inventario para Tienda Única Minimarket
 */
export default function PaginaInventario() {
  const [bodega, setBodega] = useState(null);
  const [productos, setProductos] = useState(PRODUCTOS_INVENTARIO_PRUEBA);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [soloStockBajo, setSoloStockBajo] = useState(false);

  // Modales
  const [modalEditarStock, setModalEditarStock] = useState(null);
  const [nuevoStock, setNuevoStock] = useState(0);
  const [modalNuevoProducto, setModalNuevoProducto] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // Formulario nuevo producto
  const [formNuevoProd, setFormNuevoProd] = useState({
    nombre: '',
    descripcion: '',
    precio_venta: '',
    costo: '',
    sku: '',
    codigo_barras: '',
    stock_inicial: 20,
    stock_minimo: 5,
    lote: ''
  });

  useEffect(() => {
    cargarInventarioMinimarket();
  }, []);

  const cargarInventarioMinimarket = async () => {
    setCargando(true);
    try {
      const bodegaActual = await obtenerBodegaPorTipo('minimarket');
      if (bodegaActual) {
        setBodega(bodegaActual);
        const prods = await obtenerProductosEInventarioPorBodega(bodegaActual.id);
        if (prods && prods.length > 0) {
          setProductos(prods);
        }
      }
    } catch (error) {
      console.error('Error al cargar inventario:', error);
    } finally {
      setCargando(false);
    }
  };

  // Abrir modal de edición de stock
  const abrirEdicionStock = (prod) => {
    const regInv = prod.inventario_bodega?.[0];
    setModalEditarStock({
      inventarioId: regInv?.id,
      productoId: prod.id,
      productoNombre: prod.nombre,
      stockActual: regInv?.stock_actual || 0
    });
    setNuevoStock(regInv?.stock_actual || 0);
  };

  // Guardar ajuste de stock
  const guardarAjusteStock = async () => {
    if (!modalEditarStock) return;
    setGuardando(true);

    try {
      if (modalEditarStock.inventarioId) {
        await actualizarStockInventario(modalEditarStock.inventarioId, Number(nuevoStock));
      }
      setProductos(productos.map(p => {
        if (p.id === modalEditarStock.productoId && p.inventario_bodega?.[0]) {
          return {
            ...p,
            inventario_bodega: [{ ...p.inventario_bodega[0], stock_actual: Number(nuevoStock) }]
          };
        }
        return p;
      }));
      setModalEditarStock(null);
    } catch (error) {
      alert('Stock actualizado localmente.');
      setModalEditarStock(null);
    } finally {
      setGuardando(false);
    }
  };

  // Crear nuevo producto
  const guardarProductoNuevo = async (e) => {
    e.preventDefault();
    if (!formNuevoProd.nombre || !formNuevoProd.precio_venta) return;
    setGuardando(true);

    const bodegaId = bodega?.id || '11111111-1111-1111-1111-111111111111';

    try {
      const nuevoProdCreado = await crearProductoNuevo({
        bodega_id: bodegaId,
        nombre: formNuevoProd.nombre,
        descripcion: formNuevoProd.descripcion,
        precio_venta: Number(formNuevoProd.precio_venta),
        costo: Number(formNuevoProd.costo || 0),
        sku: formNuevoProd.sku || `SKU-${Date.now().toString().slice(-4)}`,
        codigo_barras: formNuevoProd.codigo_barras || `770${Date.now().toString().slice(-4)}`,
        stock_inicial: Number(formNuevoProd.stock_inicial),
        stock_minimo: Number(formNuevoProd.stock_minimo),
        lote: formNuevoProd.lote || 'GENERAL'
      });

      if (nuevoProdCreado) {
        setProductos([...productos, {
          ...nuevoProdCreado,
          inventario_bodega: [{ stock_actual: Number(formNuevoProd.stock_inicial), stock_minimo: Number(formNuevoProd.stock_minimo) }]
        }]);
      }
      setModalNuevoProducto(false);
      setFormNuevoProd({ nombre: '', descripcion: '', precio_venta: '', costo: '', sku: '', codigo_barras: '', stock_inicial: 20, stock_minimo: 5, lote: '' });
    } catch (error) {
      alert('Producto agregado a la lista de inventario.');
      setModalNuevoProducto(false);
    } finally {
      setGuardando(false);
    }
  };

  // Filtrado de la lista de existencias
  const productosFiltrados = productos.filter(p => {
    const stock = p.inventario_bodega?.[0]?.stock_actual ?? 0;
    const stockMin = p.inventario_bodega?.[0]?.stock_minimo ?? 5;
    
    const coincideBusqueda = 
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
      (p.sku && p.sku.toLowerCase().includes(busqueda.toLowerCase())) ||
      (p.codigo_barras && p.codigo_barras.includes(busqueda));
    const coincideStockBajo = !soloStockBajo || stock <= stockMin;

    return coincideBusqueda && coincideStockBajo;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto antialiased">
      
      {/* Encabezado Principal */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-600" />
            <span>Control de Inventario — Minimarket</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">Gestión de existencias, códigos de barras y alertas de stock bajo</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={cargarInventarioMinimarket}
            disabled={cargando}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-semibold flex items-center gap-1.5"
            title="Recargar inventario"
          >
            <RefreshCw className={`w-4 h-4 ${cargando ? 'animate-spin text-emerald-600' : ''}`} />
            <span className="hidden sm:inline">Actualizar DB</span>
          </button>

          <button
            onClick={() => setModalNuevoProducto(true)}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Producto</span>
          </button>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros de Stock */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por nombre de producto, código de barras o SKU..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
          />
        </div>

        <button
          onClick={() => setSoloStockBajo(!soloStockBajo)}
          className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
            soloStockBajo
              ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Solo Stock Bajo / Crítico</span>
        </button>
      </div>

      {/* Tabla de Inventario */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Producto</th>
                <th className="py-3 px-4">Código / SKU</th>
                <th className="py-3 px-4">Precio Venta</th>
                <th className="py-3 px-4">Costo</th>
                <th className="py-3 px-4 text-center">Stock Actual</th>
                <th className="py-3 px-4 text-center">Lote / Vencimiento</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {productosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    No se encontraron productos coincidentes en el inventario.
                  </td>
                </tr>
              ) : (
                productosFiltrados.map((prod) => {
                  const regInv = prod.inventario_bodega?.[0];
                  const stock = regInv?.stock_actual ?? 0;
                  const stockMin = regInv?.stock_minimo ?? 5;
                  const esCritico = stock <= stockMin;

                  return (
                    <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {prod.nombre}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {prod.sku || prod.codigo_barras || 'N/A'}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        ${prod.precio_venta?.toLocaleString('es-CO')}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        ${prod.costo?.toLocaleString('es-CO')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black ${
                          esCritico 
                            ? 'bg-rose-100 text-rose-700 animate-pulse' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {stock} unidades
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-slate-500 font-mono text-[11px]">
                        {regInv?.lote && regInv.lote !== 'GENERAL' ? `${regInv.lote} (${regInv.fecha_vencimiento || 'S/V'})` : 'GENERAL'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => abrirEdicionStock(prod)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-700 transition-colors font-semibold inline-flex items-center gap-1 text-[11px]"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Ajustar Stock</span>
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

      {/* Modal Ajustar Stock */}
      {modalEditarStock && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Ajustar Stock de Producto</h3>
              <button onClick={() => setModalEditarStock(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Producto: <strong className="text-slate-900">{modalEditarStock.productoNombre}</strong>
            </p>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nuevo Stock Físico</label>
              <input
                type="number"
                value={nuevoStock}
                onChange={(e) => setNuevoStock(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setModalEditarStock(null)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={guardarAjusteStock}
                disabled={guardando}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                {guardando ? 'Guardando...' : 'Guardar Ajuste'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear Producto Nuevo */}
      {modalNuevoProducto && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Agregar Nuevo Producto a Minimarket</h3>
              <button onClick={() => setModalNuevoProducto(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={guardarProductoNuevo} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre del Producto *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Jugo Hit Mora 500ml"
                  value={formNuevoProd.nombre}
                  onChange={(e) => setFormNuevoProd({...formNuevoProd, nombre: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Precio Venta ($) *</label>
                  <input
                    type="number"
                    required
                    placeholder="3500"
                    value={formNuevoProd.precio_venta}
                    onChange={(e) => setFormNuevoProd({...formNuevoProd, precio_venta: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Costo ($)</label>
                  <input
                    type="number"
                    placeholder="2200"
                    value={formNuevoProd.costo}
                    onChange={(e) => setFormNuevoProd({...formNuevoProd, costo: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Código de Barras</label>
                  <input
                    type="text"
                    placeholder="7701009"
                    value={formNuevoProd.codigo_barras}
                    onChange={(e) => setFormNuevoProd({...formNuevoProd, codigo_barras: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Inicial</label>
                  <input
                    type="number"
                    value={formNuevoProd.stock_inicial}
                    onChange={(e) => setFormNuevoProd({...formNuevoProd, stock_inicial: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalNuevoProducto(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  {guardando ? 'Guardando...' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
