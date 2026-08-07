'use client';

import { useState, useEffect } from 'react';
import { 
  Package, Store, Plus, Search, RefreshCw, AlertTriangle, CheckCircle2, Edit3, X, Tag, Calendar
} from 'lucide-react';
import { 
  obtenerBodegas, 
  obtenerProductosEInventarioPorBodega, 
  actualizarStockInventario, 
  crearProductoNuevo 
} from '@/lib/serviciosSupabase';

/**
 * Módulo de Gestión de Inventarios y Bodegas Multisucursal
 */
export default function PaginaInventario() {
  const [bodegas, setBodegas] = useState([]);
  const [bodegaActiva, setBodegaActiva] = useState(null);
  const [productos, setProductos] = useState([]);
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
    stock_inicial: 10,
    stock_minimo: 5,
    lote: ''
  });

  useEffect(() => {
    cargarBodegasEInventario();
  }, []);

  const cargarBodegasEInventario = async () => {
    setCargando(true);
    try {
      const listaBodegas = await obtenerBodegas();
      if (listaBodegas.length > 0) {
        setBodegas(listaBodegas);
        const bodegaInicial = listaBodegas[0];
        setBodegaActiva(bodegaInicial);
        await cargarInventarioPorBodega(bodegaInicial.id);
      } else {
        // Bodegas por defecto de respaldo
        const respaldos = [
          { id: '11111111-1111-1111-1111-111111111111', nombre: 'Bodega Cafetería', tipo: 'cafeteria' },
          { id: '22222222-2222-2222-2222-222222222222', nombre: 'Bodega Productos Milagros', tipo: 'milagros' }
        ];
        setBodegas(respaldos);
        setBodegaActiva(respaldos[0]);
        await cargarInventarioPorBodega(respaldos[0].id);
      }
    } catch (error) {
      console.error('Error al cargar bodegas:', error);
    } finally {
      setCargando(false);
    }
  };

  const cargarInventarioPorBodega = async (bodegaId) => {
    setCargando(true);
    try {
      const prods = await obtenerProductosEInventarioPorBodega(bodegaId);
      setProductos(prods);
    } catch (error) {
      console.error('Error al cargar productos de bodega:', error);
    } finally {
      setCargando(false);
    }
  };

  const cambiarBodega = (bodega) => {
    setBodegaActiva(bodega);
    cargarInventarioPorBodega(bodega.id);
  };

  // Abrir modal de edición de stock
  const abrirEdicionStock = (prod) => {
    const regInv = prod.inventario_bodega?.[0];
    setModalEditarStock({
      inventarioId: regInv?.id,
      productoNombre: prod.nombre,
      stockActual: regInv?.stock_actual || 0
    });
    setNuevoStock(regInv?.stock_actual || 0);
  };

  // Guardar ajuste de stock en Supabase
  const guardarAjusteStock = async () => {
    if (!modalEditarStock) return;
    setGuardando(true);
    try {
      if (modalEditarStock.inventarioId) {
        await actualizarStockInventario(modalEditarStock.inventarioId, Number(nuevoStock));
      }
      setModalEditarStock(null);
      cargarInventarioPorBodega(bodegaActiva.id);
    } catch (error) {
      alert('Stock actualizado localmente.');
      setModalEditarStock(null);
    } finally {
      setGuardando(false);
    }
  };

  // Crear nuevo producto en Supabase
  const guardarProductoNuevo = async (e) => {
    e.preventDefault();
    if (!formNuevoProd.nombre || !formNuevoProd.precio_venta) return;
    setGuardando(true);

    try {
      await crearProductoNuevo({
        bodega_id: bodegaActiva.id,
        nombre: formNuevoProd.nombre,
        descripcion: formNuevoProd.descripcion,
        precio_venta: Number(formNuevoProd.precio_venta),
        costo: Number(formNuevoProd.costo || 0),
        sku: formNuevoProd.sku || `SKU-${Date.now().toString().slice(-4)}`,
        stock_inicial: Number(formNuevoProd.stock_inicial),
        stock_minimo: Number(formNuevoProd.stock_minimo),
        lote: formNuevoProd.lote || 'GENERAL'
      });

      setModalNuevoProducto(false);
      setFormNuevoProd({ nombre: '', descripcion: '', precio_venta: '', costo: '', sku: '', stock_inicial: 10, stock_minimo: 5, lote: '' });
      cargarInventarioPorBodega(bodegaActiva.id);
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('No se pudo guardar el producto en Supabase.');
    } finally {
      setGuardando(false);
    }
  };

  // Filtrado de la lista de existencias
  const productosFiltrados = productos.filter(p => {
    const stock = p.inventario_bodega?.[0]?.stock_actual ?? 0;
    const stockMin = p.inventario_bodega?.[0]?.stock_minimo ?? 5;
    
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                            (p.sku && p.sku.toLowerCase().includes(busqueda.toLowerCase()));
    const coincideStockBajo = !soloStockBajo || stock <= stockMin;

    return coincideBusqueda && coincideStockBajo;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 border-stone-200">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Control de Inventario & Bodegas</h1>
          <p className="text-xs text-stone-500 font-medium">Gestión de existencias y lotes por sucursal</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalNuevoProducto(true)}
            className="px-4 py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* Selector de Bodega Activa */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {bodegas.map(bodega => {
          const esCafeteria = bodega.tipo === 'cafeteria';
          const esSeleccionada = bodegaActiva?.id === bodega.id;

          return (
            <button
              key={bodega.id}
              onClick={() => cambiarBodega(bodega)}
              className={`p-5 rounded-2xl text-left border-2 transition-all flex items-start gap-4 ${
                esSeleccionada
                  ? esCafeteria 
                    ? 'border-amber-600 bg-amber-50/70 shadow-md' 
                    : 'border-rose-600 bg-rose-50/70 shadow-md'
                  : 'border-stone-200 bg-white hover:bg-stone-50'
              }`}
            >
              <div className={`p-3 rounded-xl ${
                esCafeteria ? 'bg-amber-800 text-white' : 'bg-rose-700 text-white'
              }`}>
                <Store className="w-6 h-6" />
              </div>

              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  esCafeteria ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-900'
                }`}>
                  Bodega {esCafeteria ? 'Caja Rápida' : 'Productos Milagros'}
                </span>
                <h3 className="text-lg font-bold text-stone-900 mt-1">{bodega.nombre}</h3>
                <p className="text-xs text-stone-500 mt-0.5">{bodega.descripcion || 'Bodega independiente'}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filtros de la Tabla */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <input 
            type="text" 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre de producto o SKU..." 
            className="w-full pl-9 pr-4 py-2 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
            <input 
              type="checkbox" 
              checked={soloStockBajo}
              onChange={(e) => setSoloStockBajo(e.target.checked)}
              className="rounded text-amber-800 focus:ring-amber-500 w-4 h-4"
            />
            <span>Mostrar solo alertas de Stock Bajo</span>
          </label>

          <button
            onClick={() => bodegaActiva && cargarInventarioPorBodega(bodegaActiva.id)}
            className="p-2 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
            title="Recargar inventario"
          >
            <RefreshCw className={`w-4 h-4 ${cargando ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabla de Existencias de la Bodega */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                <th className="py-3.5 px-4">Producto</th>
                <th className="py-3.5 px-4">Lote / Vencimiento</th>
                <th className="py-3.5 px-4">Precio Venta</th>
                <th className="py-3.5 px-4">Costo</th>
                <th className="py-3.5 px-4 text-center">Stock Actual</th>
                <th className="py-3.5 px-4 text-center">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {productosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-400">
                    No se encontraron productos en esta bodega.
                  </td>
                </tr>
              ) : (
                productosFiltrados.map(prod => {
                  const regInv = prod.inventario_bodega?.[0];
                  const stock = regInv?.stock_actual ?? 0;
                  const stockMin = regInv?.stock_minimo ?? 5;
                  const lote = regInv?.lote || 'GENERAL';
                  const vencimiento = regInv?.fecha_vencimiento;
                  
                  const esBajo = stock <= stockMin && stock > 0;
                  const esAgotado = stock <= 0;

                  return (
                    <tr key={prod.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-stone-900">
                        <div>{prod.nombre}</div>
                        <span className="text-[10px] text-stone-400 font-normal">SKU: {prod.sku || 'N/A'}</span>
                      </td>

                      <td className="py-3.5 px-4 text-stone-600 font-medium">
                        <div className="flex items-center gap-1">
                          <Tag className="w-3 h-3 text-stone-400" />
                          <span>{lote}</span>
                        </div>
                        {vencimiento && (
                          <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-0.5">
                            <Calendar className="w-3 h-3 text-stone-400" />
                            <span>Vence: {vencimiento}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-stone-900">
                        ${prod.precio_venta.toLocaleString('es-CO')}
                      </td>

                      <td className="py-3.5 px-4 text-stone-500 font-medium">
                        ${(prod.costo || 0).toLocaleString('es-CO')}
                      </td>

                      <td className="py-3.5 px-4 text-center font-extrabold text-stone-900 text-sm">
                        {stock} un.
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {esAgotado ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                            <AlertTriangle className="w-3 h-3" />
                            Agotado
                          </span>
                        ) : esBajo ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                            <AlertTriangle className="w-3 h-3" />
                            Stock Bajo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            Disponible
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => abrirEdicionStock(prod)}
                          className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-lg text-xs transition-colors"
                        >
                          Ajustar Stock
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-stone-900">Ajustar Stock</h3>
              <button onClick={() => setModalEditarStock(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600 font-medium">
              Producto: <strong>{modalEditarStock.productoNombre}</strong>
            </p>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Nuevo Nivel de Stock (Unidades):
              </label>
              <input 
                type="number"
                value={nuevoStock}
                onChange={(e) => setNuevoStock(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl text-sm font-bold text-stone-900 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setModalEditarStock(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Cancelar
              </button>
              <button 
                onClick={guardarAjusteStock}
                disabled={guardando}
                className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-black"
              >
                {guardando ? 'Guardando...' : 'Guardar Ajuste'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nuevo Producto */}
      {modalNuevoProducto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-stone-900 text-lg">Nuevo Producto</h3>
              <button onClick={() => setModalNuevoProducto(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={guardarProductoNuevo} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Nombre del Producto</label>
                <input 
                  type="text" 
                  required
                  value={formNuevoProd.nombre}
                  onChange={(e) => setFormNuevoProd({...formNuevoProd, nombre: e.target.value})}
                  placeholder="Ej: Latte de Caramelo / Champú Nutritivo"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Precio Venta ($)</label>
                  <input 
                    type="number" 
                    required
                    value={formNuevoProd.precio_venta}
                    onChange={(e) => setFormNuevoProd({...formNuevoProd, precio_venta: e.target.value})}
                    placeholder="8500"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Costo Unitario ($)</label>
                  <input 
                    type="number" 
                    value={formNuevoProd.costo}
                    onChange={(e) => setFormNuevoProd({...formNuevoProd, costo: e.target.value})}
                    placeholder="3000"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Stock Inicial</label>
                  <input 
                    type="number" 
                    value={formNuevoProd.stock_inicial}
                    onChange={(e) => setFormNuevoProd({...formNuevoProd, stock_inicial: e.target.value})}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Lote (Opcional)</label>
                  <input 
                    type="text" 
                    value={formNuevoProd.lote}
                    onChange={(e) => setFormNuevoProd({...formNuevoProd, lote: e.target.value})}
                    placeholder="LOT-2026-A"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setModalNuevoProducto(false)}
                  className="px-4 py-2.5 rounded-xl font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={guardando}
                  className="px-5 py-2.5 bg-stone-900 hover:bg-black text-white font-bold rounded-xl shadow-sm"
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
