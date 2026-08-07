'use client';

import { useState, useEffect } from 'react';
import { 
  Sparkles, ShoppingBag, Plus, Minus, Trash2, CreditCard, Banknote, 
  Search, Filter, CheckCircle2, RefreshCw, X, Receipt, Check, Calendar, Tag
} from 'lucide-react';
import { 
  obtenerBodegaPorTipo, 
  obtenerCategoriasPorBodega, 
  obtenerProductosEInventarioPorBodega, 
  registrarVentaConDetalles 
} from '@/lib/serviciosSupabase';

// Datos por defecto de respaldo
const PRODUCTOS_PRUEBA_MILAGROS = [
  { id: 'pm1', nombre: 'Champú Bio-Reparador Milagros 500ml', precio_venta: 45000, categoria_id: 'm1', inventario_bodega: [{ stock_actual: 45, lote: 'LOT-2026-08A', fecha_vencimiento: '2028-08-31' }] },
  { id: 'pm2', nombre: 'Mascarilla de Frutas Nutritiva 300g', precio_venta: 38000, categoria_id: 'm1', inventario_bodega: [{ stock_actual: 30, lote: 'LOT-2026-08B', fecha_vencimiento: '2028-05-15' }] },
  { id: 'pm3', nombre: 'Serum Facial Ácido Hialurónico 50ml', precio_venta: 52000, categoria_id: 'm2', inventario_bodega: [{ stock_actual: 25, lote: 'LOT-2026-09C', fecha_vencimiento: '2029-01-30' }] },
  { id: 'pm4', nombre: 'Kit Cuidado Intensivo Capilar', precio_venta: 89000, categoria_id: 'm3', inventario_bodega: [{ stock_actual: 15, lote: 'LOT-2026-KIT1', fecha_vencimiento: '2028-12-31' }] }
];

const CATEGORIAS_PRUEBA_MILAGROS = [
  { id: 'todas', nombre: 'Todas las Líneas' },
  { id: 'm1', nombre: 'Cuidado Capilar' },
  { id: 'm2', nombre: 'Cuidado Facial' },
  { id: 'm3', nombre: 'Kits & Regalos' }
];

/**
 * Módulo POS de la Tienda de Belleza / Productos Milagros
 */
export default function PaginaPOSMilagros() {
  const [bodega, setBodega] = useState(null);
  const [categorias, setCategorias] = useState(CATEGORIAS_PRUEBA_MILAGROS);
  const [productos, setProductos] = useState(PRODUCTOS_PRUEBA_MILAGROS);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  
  // Estado de la Orden
  const [orden, setOrden] = useState([]);
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [procesando, setProcesando] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [mensajeExito, setMensajeExito] = useState(null);
  const [facturaGenerada, setFacturaGenerada] = useState(null);

  // Cargar datos de Supabase al montar el componente
  useEffect(() => {
    cargarDatosMilagros();
  }, []);

  const cargarDatosMilagros = async () => {
    setCargandoDatos(true);
    try {
      const bodegaMilagros = await obtenerBodegaPorTipo('milagros');
      if (bodegaMilagros) {
        setBodega(bodegaMilagros);
        const cats = await obtenerCategoriasPorBodega(bodegaMilagros.id);
        if (cats.length > 0) {
          setCategorias([{ id: 'todas', nombre: 'Todas las Líneas' }, ...cats]);
        }
        const prods = await obtenerProductosEInventarioPorBodega(bodegaMilagros.id);
        if (prods.length > 0) {
          setProductos(prods);
        }
      }
    } catch (error) {
      console.error('Error al cargar datos de belleza milagros:', error);
    } finally {
      setCargandoDatos(false);
    }
  };

  // Agregar producto a la orden
  const agregarAOrden = (producto) => {
    const registroInv = producto.inventario_bodega?.[0];
    const stockDisponible = registroInv?.stock_actual ?? 999;
    const loteProd = registroInv?.lote || 'LOT-2026-GENERAL';

    setOrden((ordenActual) => {
      const existe = ordenActual.find(item => item.id === producto.id);
      if (existe) {
        if (existe.cantidad >= stockDisponible) {
          alert(`No hay suficiente stock en bodega para el producto ${producto.nombre}.`);
          return ordenActual;
        }
        return ordenActual.map(item =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...ordenActual, {
        id: producto.id,
        nombre: producto.nombre,
        precio_venta: producto.precio_venta,
        cantidad: 1,
        lote: loteProd
      }];
    });
  };

  // Modificar cantidad en la orden
  const actualizarCantidad = (id, cambio) => {
    setOrden((ordenActual) =>
      ordenActual.map(item => {
        if (item.id === id) {
          const nuevaCantidad = item.cantidad + cambio;
          return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : null;
        }
        return item;
      }).filter(Boolean)
    );
  };

  // Eliminar producto de la orden
  const eliminarDeOrden = (id) => {
    setOrden(ordenActual => ordenActual.filter(item => item.id !== id));
  };

  // Cálculos de la orden
  const subtotal = orden.reduce((sum, item) => sum + (item.precio_venta * item.cantidad), 0);
  const impuesto = Math.round(subtotal * 0.19); // IVA 19% para cosméticos y productos de belleza
  const total = subtotal + impuesto;

  // Procesar venta en Supabase
  const procesarVenta = async () => {
    if (orden.length === 0) return;
    setProcesando(true);
    setMensajeExito(null);

    try {
      const bodegaId = bodega?.id || '22222222-2222-2222-2222-222222222222';
      
      const ventaRealizada = await registrarVentaConDetalles({
        bodegaId: bodegaId,
        tipoBodega: 'milagros',
        clienteNombre: 'Cliente Catálogo Belleza',
        metodoPago: metodoPago,
        subtotal: subtotal,
        impuesto: impuesto,
        total: total,
        items: orden.map(item => ({
          productoId: item.id,
          cantidad: item.cantidad,
          precioUnitario: item.precio_venta,
          lote: item.lote
        }))
      });

      setFacturaGenerada({
        numero: ventaRealizada?.numero_factura || `FAC-MIL-${Date.now().toString().slice(-6)}`,
        fecha: new Date().toLocaleString('es-CO'),
        items: [...orden],
        subtotal,
        impuesto,
        total,
        metodoPago
      });

      setOrden([]);
      setMensajeExito('Venta por catálogo procesada con éxito');
      cargarDatosMilagros();
    } catch (error) {
      console.error('Error al procesar venta de belleza:', error);
      alert('Se generó la factura local. Verifica la conexión a Supabase.');
      setFacturaGenerada({
        numero: `FAC-MIL-${Date.now().toString().slice(-6)}`,
        fecha: new Date().toLocaleString('es-CO'),
        items: [...orden],
        subtotal,
        impuesto,
        total,
        metodoPago
      });
      setOrden([]);
    } finally {
      setProcesando(false);
    }
  };

  // Filtrado de productos
  const productosFiltrados = productos.filter(p => {
    const coincideCategoria = categoriaSeleccionada === 'todas' || p.categoria_id === categoriaSeleccionada;
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Encabezado del POS Belleza */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 border-rose-200/80">
        <div className="flex items-center gap-3 text-rose-950">
          <div className="p-2.5 rounded-2xl bg-rose-700 text-rose-100 shadow-md">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Ventas por Catálogo - Productos Milagros</h1>
            <p className="text-xs text-stone-500 font-medium">
              Bodega Activa: {bodega?.nombre || 'Tienda de Belleza (Sincronizado)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={cargarDatosMilagros} 
            disabled={cargandoDatos}
            className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
            title="Recargar inventario de Supabase"
          >
            <RefreshCw className={`w-4 h-4 ${cargandoDatos ? 'animate-spin' : ''}`} />
          </button>
          <span className="px-3 py-1.5 bg-rose-100/80 text-rose-900 text-xs font-semibold rounded-full border border-rose-300">
            ● Control de Stock & Lotes
          </span>
        </div>
      </div>

      {/* Alerta de éxito */}
      {mensajeExito && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-center justify-between text-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{mensajeExito}</span>
          </div>
          <button onClick={() => setMensajeExito(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Catálogo de Productos de Belleza (8 Columnas) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          
          {/* Búsqueda y Filtros */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-3">
            <div className="relative">
              <input 
                type="text" 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar tratamiento, champú, serum..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-rose-600 focus:bg-white"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>

            {/* Filtro por Líneas/Categorías */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categorias.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoriaSeleccionada(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    categoriaSeleccionada === cat.id
                      ? 'bg-rose-700 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          </div>

          {/* Tarjetas de Productos de Belleza */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {productosFiltrados.map(producto => {
              const regInv = producto.inventario_bodega?.[0];
              const stock = regInv?.stock_actual ?? 0;
              const lote = regInv?.lote || 'N/A';
              const vencimiento = regInv?.fecha_vencimiento || 'N/A';
              const sinStock = stock <= 0;

              return (
                <div
                  key={producto.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between space-y-3 bg-white border-stone-200 transition-all hover:border-rose-300 hover:shadow-md ${
                    sinStock ? 'opacity-70 bg-stone-50' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold tracking-wider uppercase text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-100">
                        {producto.categorias?.nombre || 'Línea Milagros'}
                      </span>
                      <span className="text-[10px] font-medium text-stone-500 flex items-center gap-1">
                        <Tag className="w-3 h-3 text-stone-400" />
                        <span>Lote: {lote}</span>
                      </span>
                    </div>

                    <h3 className="font-bold text-stone-900 text-sm">
                      {producto.nombre}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                      {producto.descripcion || 'Producto de belleza de alta calidad.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-stone-400 font-medium">Precio Venta</p>
                      <p className="font-extrabold text-rose-900 text-base">
                        ${producto.precio_venta.toLocaleString('es-CO')}
                      </p>
                    </div>

                    <button
                      onClick={() => !sinStock && agregarAOrden(producto)}
                      disabled={sinStock}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                        sinStock
                          ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                          : 'bg-rose-700 hover:bg-rose-800 text-white active:scale-95'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      <span>{sinStock ? 'Agotado' : `Agregar (Stock: ${stock})`}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Resumen de la Orden (4 a 5 Columnas) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-2xl border border-stone-200 shadow-lg p-5 flex flex-col justify-between space-y-4">
          
          <div className="space-y-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between border-b pb-3 border-stone-100">
              <div className="flex items-center gap-2 font-bold text-stone-900 text-base">
                <ShoppingBag className="w-5 h-5 text-rose-700" />
                <span>Orden de Productos</span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                {orden.reduce((acc, item) => acc + item.cantidad, 0)} artículos
              </span>
            </div>

            {/* Lista de Ítems */}
            <div className="flex-1 overflow-y-auto max-h-[380px] space-y-3 pr-1">
              {orden.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-stone-400 space-y-2">
                  <Sparkles className="w-10 h-10 text-stone-300" />
                  <p className="text-xs text-center">No hay productos en la orden. Selecciona items del catálogo.</p>
                </div>
              ) : (
                orden.map(item => (
                  <div key={item.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-stone-900 text-xs truncate">{item.nombre}</p>
                      <p className="text-[10px] text-stone-500 font-medium">
                        ${item.precio_venta.toLocaleString('es-CO')} | Lote: {item.lote}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-lg p-1">
                      <button 
                        onClick={() => actualizarCantidad(item.id, -1)}
                        className="p-1 hover:bg-stone-100 rounded text-stone-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-bold text-xs text-stone-800">
                        {item.cantidad}
                      </span>
                      <button 
                        onClick={() => actualizarCantidad(item.id, 1)}
                        className="p-1 hover:bg-stone-100 rounded text-stone-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button 
                      onClick={() => eliminarDeOrden(item.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Resumen Financiero & Método de Pago */}
          <div className="space-y-4 border-t border-stone-200 pt-4">
            
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-stone-800">${subtotal.toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA Productos (19%):</span>
                <span className="font-semibold text-stone-800">${impuesto.toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-rose-950 pt-2 border-t border-stone-100">
                <span>Total a pagar:</span>
                <span>${total.toLocaleString('es-CO')}</span>
              </div>
            </div>

            {/* Selector de Método de Pago */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setMetodoPago('efectivo')}
                className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                  metodoPago === 'efectivo'
                    ? 'bg-rose-100 border-rose-500 text-rose-900 font-bold'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>Efectivo</span>
              </button>

              <button
                onClick={() => setMetodoPago('tarjeta')}
                className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                  metodoPago === 'tarjeta'
                    ? 'bg-rose-100 border-rose-500 text-rose-900 font-bold'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Tarjeta</span>
              </button>
            </div>

            {/* Botón de Procesar Factura */}
            <button
              onClick={procesarVenta}
              disabled={orden.length === 0 || procesando}
              className="w-full py-3.5 rounded-xl bg-rose-700 hover:bg-rose-800 disabled:bg-stone-300 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              {procesando ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Procesando Factura...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Completar Venta (${total.toLocaleString('es-CO')})</span>
                </>
              )}
            </button>

          </div>

        </div>

      </div>

      {/* Modal de Comprobante / Factura */}
      {facturaGenerada && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-stone-200 space-y-4 text-stone-900">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-800 mx-auto flex items-center justify-center mb-2">
                <Receipt className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold">Café & Milagros</h2>
              <p className="text-xs text-rose-700 font-semibold">Factura de Venta - Tienda de Belleza</p>
              <p className="text-[11px] text-stone-400">{facturaGenerada.numero}</p>
            </div>

            <div className="border-t border-b border-dashed border-stone-300 py-3 space-y-2 text-xs">
              <div className="flex justify-between text-stone-500">
                <span>Fecha:</span>
                <span>{facturaGenerada.fecha}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Método de Pago:</span>
                <span className="capitalize font-semibold text-stone-800">{facturaGenerada.metodoPago}</span>
              </div>

              <div className="pt-2 space-y-1">
                {facturaGenerada.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <div>
                      <p>{it.cantidad}x {it.nombre}</p>
                      <span className="text-[10px] text-stone-400">Lote: {it.lote}</span>
                    </div>
                    <span className="font-semibold">${(it.cantidad * it.precio_venta).toLocaleString('es-CO')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${facturaGenerada.subtotal.toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA (19%):</span>
                <span>${facturaGenerada.impuesto.toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-rose-900 pt-1">
                <span>TOTAL:</span>
                <span>${facturaGenerada.total.toLocaleString('es-CO')}</span>
              </div>
            </div>

            <button
              onClick={() => setFacturaGenerada(null)}
              className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition-colors"
            >
              Cerrar Factura
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
