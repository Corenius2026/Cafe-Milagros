'use client';

import { useState, useEffect } from 'react';
import { 
  Coffee, ShoppingCart, Plus, Minus, Trash2, CreditCard, Banknote, 
  Search, CheckCircle2, AlertCircle, RefreshCw, X, Receipt, Check
} from 'lucide-react';
import { 
  obtenerBodegaPorTipo, 
  obtenerCategoriasPorBodega, 
  obtenerProductosEInventarioPorBodega, 
  registrarVentaConDetalles 
} from '@/lib/serviciosSupabase';

// Datos de prueba por defecto en caso de no tener respuesta inicial de la base de datos
const PRODUCTOS_PRUEBA_CAFETERIA = [
  { id: 'p1', nombre: 'Café Nutella', precio_venta: 5500, categoria_id: 'c1', inventario_bodega: [{ stock_actual: 100 }] },
  { id: 'p2', nombre: 'Cappuccino de Almendras', precio_venta: 7500, categoria_id: 'c1', inventario_bodega: [{ stock_actual: 80 }] },
  { id: 'p3', nombre: 'Frappé de Caramelo & Crema', precio_venta: 9800, categoria_id: 'c2', inventario_bodega: [{ stock_actual: 60 }] },
  { id: 'p4', nombre: 'Croissant de Almendra', precio_venta: 6000, categoria_id: 'c3', inventario_bodega: [{ stock_actual: 35 }] },
  { id: 'p5', nombre: 'Muffin de Arándanos Orgánico', precio_venta: 5500, categoria_id: 'c3', inventario_bodega: [{ stock_actual: 40 }] },
  { id: 'p6', nombre: 'Té Chai Latte Helado', precio_venta: 8200, categoria_id: 'c2', inventario_bodega: [{ stock_actual: 50 }] }
];

const CATEGORIAS_PRUEBA_CAFETERIA = [
  { id: 'todas', nombre: 'Todas las Categorías' },
  { id: 'c1', nombre: 'Cafés Calientes' },
  { id: 'c2', nombre: 'Bebidas Frías' },
  { id: 'c3', nombre: 'Repostería' }
];

/**
 * Módulo POS de la Sucursal Cafetería (Caja Rápida)
 */
export default function PaginaPOSCafeteria() {
  const [bodega, setBodega] = useState(null);
  const [categorias, setCategorias] = useState(CATEGORIAS_PRUEBA_CAFETERIA);
  const [productos, setProductos] = useState(PRODUCTOS_PRUEBA_CAFETERIA);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  
  // Estado del Carrito
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [procesando, setProcesando] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [mensajeExito, setMensajeExito] = useState(null);
  const [facturaGenerada, setFacturaGenerada] = useState(null);

  // Cargar datos de Supabase al montar el componente
  useEffect(() => {
    cargarDatosCafeteria();
  }, []);

  const cargarDatosCafeteria = async () => {
    setCargandoDatos(true);
    try {
      const bodegaCafeteria = await obtenerBodegaPorTipo('cafeteria');
      if (bodegaCafeteria) {
        setBodega(bodegaCafeteria);
        const cats = await obtenerCategoriasPorBodega(bodegaCafeteria.id);
        if (cats.length > 0) {
          setCategorias([{ id: 'todas', nombre: 'Todas las Categorías' }, ...cats]);
        }
        const prods = await obtenerProductosEInventarioPorBodega(bodegaCafeteria.id);
        if (prods.length > 0) {
          setProductos(prods);
        }
      }
    } catch (error) {
      console.error('Error al cargar datos de cafetería:', error);
    } finally {
      setCargandoDatos(false);
    }
  };

  // Agregar producto al ticket de venta
  const agregarAlCarrito = (producto) => {
    const stockDisponible = producto.inventario_bodega?.[0]?.stock_actual ?? 999;
    
    setCarrito((carritoActual) => {
      const existe = carritoActual.find(item => item.id === producto.id);
      if (existe) {
        if (existe.cantidad >= stockDisponible) {
          alert(`No hay suficiente stock en bodega para ${producto.nombre}.`);
          return carritoActual;
        }
        return carritoActual.map(item =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...carritoActual, {
        id: producto.id,
        nombre: producto.nombre,
        precio_venta: producto.precio_venta,
        cantidad: 1,
        lote: 'GENERAL'
      }];
    });
  };

  // Modificar cantidad en carrito
  const actualizarCantidad = (id, cambio) => {
    setCarrito((carritoActual) =>
      carritoActual.map(item => {
        if (item.id === id) {
          const nuevaCantidad = item.cantidad + cambio;
          return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : null;
        }
        return item;
      }).filter(Boolean)
    );
  };

  // Eliminar producto del carrito
  const eliminarDelCarrito = (id) => {
    setCarrito(carritoActual => carritoActual.filter(item => item.id !== id));
  };

  // Cálculos del ticket
  const subtotal = carrito.reduce((sum, item) => sum + (item.precio_venta * item.cantidad), 0);
  const impuesto = Math.round(subtotal * 0.08); // Impuesto al consumo / IVA estimado 8%
  const total = subtotal + impuesto;

  // Procesar venta en Supabase
  const procesarVenta = async () => {
    if (carrito.length === 0) return;
    setProcesando(true);
    setMensajeExito(null);

    try {
      const bodegaId = bodega?.id || '11111111-1111-1111-1111-111111111111';
      
      const ventaRealizada = await registrarVentaConDetalles({
        bodegaId: bodegaId,
        tipoBodega: 'cafeteria',
        clienteNombre: 'Cliente Cafetería',
        metodoPago: metodoPago,
        subtotal: subtotal,
        impuesto: impuesto,
        total: total,
        items: carrito.map(item => ({
          productoId: item.id,
          cantidad: item.cantidad,
          precioUnitario: item.precio_venta,
          lote: item.lote
        }))
      });

      setFacturaGenerada({
        numero: ventaRealizada?.numero_factura || `FAC-CAF-${Date.now().toString().slice(-6)}`,
        fecha: new Date().toLocaleString('es-CO'),
        items: [...carrito],
        subtotal,
        impuesto,
        total,
        metodoPago
      });

      setCarrito([]);
      setMensajeExito('Venta registrada con éxito');
      cargarDatosCafeteria();
    } catch (error) {
      console.error('Error al procesar la venta:', error);
      alert('Se generó un ticket local. Revisa la consola o conexión de Supabase.');
      setFacturaGenerada({
        numero: `FAC-CAF-${Date.now().toString().slice(-6)}`,
        fecha: new Date().toLocaleString('es-CO'),
        items: [...carrito],
        subtotal,
        impuesto,
        total,
        metodoPago
      });
      setCarrito([]);
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
      
      {/* Encabezado del POS */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 border-amber-200/80">
        <div className="flex items-center gap-3 text-amber-900">
          <div className="p-2.5 rounded-2xl bg-amber-800 text-amber-100 shadow-md">
            <Coffee className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Caja Rápida - Cafetería</h1>
            <p className="text-xs text-stone-500 font-medium">
              Bodega Activa: {bodega?.nombre || 'Cafetería Central (Sincronizado)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={cargarDatosCafeteria} 
            disabled={cargandoDatos}
            className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
            title="Recargar productos de Supabase"
          >
            <RefreshCw className={`w-4 h-4 ${cargandoDatos ? 'animate-spin' : ''}`} />
          </button>
          <span className="px-3 py-1.5 bg-amber-100/80 text-amber-900 text-xs font-semibold rounded-full border border-amber-300">
            ● Caja Rápida Activa
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

      {/* Layout Principal: 2 Columnas (Menú de Productos a la izquierda, Carrito/Ticket a la derecha) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Catálogo Rápido de Cafetería (8 Columnas) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          
          {/* Barra de Búsqueda y Filtro de Categorías */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-3">
            <div className="relative">
              <input 
                type="text" 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar café, cappuccino, postre..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 focus:bg-white"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            </div>

            {/* Categorías */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categorias.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoriaSeleccionada(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    categoriaSeleccionada === cat.id
                      ? 'bg-amber-800 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de Productos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {productosFiltrados.map(producto => {
              const stock = producto.inventario_bodega?.[0]?.stock_actual ?? 0;
              const sinStock = stock <= 0;

              return (
                <button
                  key={producto.id}
                  onClick={() => !sinStock && agregarAlCarrito(producto)}
                  disabled={sinStock}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-36 transition-all group relative overflow-hidden ${
                    sinStock 
                      ? 'bg-stone-100 border-stone-200 opacity-60 cursor-not-allowed'
                      : 'bg-white border-stone-200 hover:border-amber-500 hover:shadow-md active:scale-95'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                      {producto.categorias?.nombre || 'Cafetería'}
                    </span>
                    <h3 className="font-bold text-stone-900 text-sm mt-1.5 line-clamp-2 group-hover:text-amber-900">
                      {producto.nombre}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between border-t border-stone-100 pt-2 mt-2">
                    <span className="font-extrabold text-amber-900 text-base">
                      ${producto.precio_venta.toLocaleString('es-CO')}
                    </span>
                    <span className={`text-[11px] font-semibold ${stock <= 5 ? 'text-rose-600' : 'text-stone-400'}`}>
                      {sinStock ? 'Agotado' : `Stock: ${stock}`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* Carrito de Compra & Cobro (4 a 5 Columnas) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-2xl border border-stone-200 shadow-lg p-5 flex flex-col justify-between space-y-4">
          
          <div className="space-y-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between border-b pb-3 border-stone-100">
              <div className="flex items-center gap-2 font-bold text-stone-900 text-base">
                <ShoppingCart className="w-5 h-5 text-amber-800" />
                <span>Ticket de Venta</span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600">
                {carrito.reduce((acc, item) => acc + item.cantidad, 0)} ítems
              </span>
            </div>

            {/* Ítems del Carrito */}
            <div className="flex-1 overflow-y-auto max-h-[380px] space-y-3 pr-1">
              {carrito.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-stone-400 space-y-2">
                  <Coffee className="w-10 h-10 text-stone-300" />
                  <p className="text-xs text-center">El ticket está vacío. Haz clic en un producto para comenzar.</p>
                </div>
              ) : (
                carrito.map(item => (
                  <div key={item.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-stone-900 text-xs truncate">{item.nombre}</p>
                      <p className="text-xs text-stone-500 font-medium">
                        ${item.precio_venta.toLocaleString('es-CO')} c/u
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
                      onClick={() => eliminarDelCarrito(item.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                      title="Eliminar"
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
                <span>Impuesto (8%):</span>
                <span className="font-semibold text-stone-800">${impuesto.toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-amber-950 pt-2 border-t border-stone-100">
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
                    ? 'bg-amber-100 border-amber-500 text-amber-900 font-bold'
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
                    ? 'bg-amber-100 border-amber-500 text-amber-900 font-bold'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Tarjeta</span>
              </button>
            </div>

            {/* Botón de Cobro Rápido */}
            <button
              onClick={procesarVenta}
              disabled={carrito.length === 0 || procesando}
              className="w-full py-3.5 rounded-xl bg-amber-800 hover:bg-amber-900 disabled:bg-stone-300 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              {procesando ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Registrando en Supabase...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Cobrar Ticket (${total.toLocaleString('es-CO')})</span>
                </>
              )}
            </button>

          </div>

        </div>

      </div>

      {/* Modal de Ticket / Factura Generada */}
      {facturaGenerada && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-stone-200 space-y-4 text-stone-900">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-900 mx-auto flex items-center justify-center mb-2">
                <Receipt className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold">Café & Milagros</h2>
              <p className="text-xs text-amber-800 font-semibold">Comprobante de Venta - Cafetería</p>
              <p className="text-[11px] text-stone-400">{facturaGenerada.numero}</p>
            </div>

            <div className="border-t border-b border-dashed border-stone-300 py-3 space-y-2 text-xs">
              <div className="flex justify-between text-stone-500">
                <span>Fecha:</span>
                <span>{facturaGenerada.fecha}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Pago con:</span>
                <span className="capitalize font-semibold text-stone-800">{facturaGenerada.metodoPago}</span>
              </div>

              <div className="pt-2 space-y-1">
                {facturaGenerada.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{it.cantidad}x {it.nombre}</span>
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
                <span>Impuesto:</span>
                <span>${facturaGenerada.impuesto.toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-amber-900 pt-1">
                <span>TOTAL:</span>
                <span>${facturaGenerada.total.toLocaleString('es-CO')}</span>
              </div>
            </div>

            <button
              onClick={() => setFacturaGenerada(null)}
              className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold transition-colors"
            >
              Cerrar e Imprimir
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
