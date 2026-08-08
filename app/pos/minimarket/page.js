'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingCart, Plus, Minus, Trash2, CreditCard, Banknote, 
  Search, CheckCircle2, AlertCircle, RefreshCw, X, Receipt, Check,
  Barcode, Store, PackageCheck, Zap
} from 'lucide-react';
import { 
  obtenerBodegaPorTipo, 
  obtenerCategoriasPorBodega, 
  obtenerProductosEInventarioPorBodega, 
  registrarVentaConDetalles 
} from '@/lib/serviciosSupabase';

// Productos de prueba predeterminados para el Minimarket
const PRODUCTOS_PRUEBA_MINIMARKET = [
  { id: 'p1', sku: 'MINI-LAC-01', codigo_barras: '7701001', nombre: 'Leche Entera 1 Litro', precio_venta: 4200, categoria_id: 'c1', inventario_bodega: [{ stock_actual: 150 }] },
  { id: 'p2', sku: 'MINI-BEB-02', codigo_barras: '7701002', nombre: 'Gaseosa Coca-Cola 1.5L', precio_venta: 5800, categoria_id: 'c2', inventario_bodega: [{ stock_actual: 90 }] },
  { id: 'p3', sku: 'MINI-ABA-03', codigo_barras: '7701003', nombre: 'Arroz Diana Roa 1kg', precio_venta: 4600, categoria_id: 'c3', inventario_bodega: [{ stock_actual: 200 }] },
  { id: 'p4', sku: 'MINI-SNA-04', codigo_barras: '7701004', nombre: 'Papas Margarita Limón 110g', precio_venta: 3800, categoria_id: 'c4', inventario_bodega: [{ stock_actual: 80 }] },
  { id: 'p5', sku: 'MINI-PAN-05', codigo_barras: '7701005', nombre: 'Pan Tajado Bimbo Artesano', precio_venta: 7200, categoria_id: 'c5', inventario_bodega: [{ stock_actual: 45 }] },
  { id: 'p6', sku: 'MINI-ASE-06', codigo_barras: '7701006', nombre: 'Jabón Rey Multiusos 300g', precio_venta: 2900, categoria_id: 'c6', inventario_bodega: [{ stock_actual: 120 }] },
  { id: 'p7', sku: 'MINI-BEB-07', codigo_barras: '7701007', nombre: 'Agua Mineral Manantial 600ml', precio_venta: 2500, categoria_id: 'c2', inventario_bodega: [{ stock_actual: 180 }] },
  { id: 'p8', sku: 'MINI-ABA-08', codigo_barras: '7701008', nombre: 'Aceite de Girasol Gourmet 900ml', precio_venta: 14500, categoria_id: 'c3', inventario_bodega: [{ stock_actual: 60 }] }
];

const CATEGORIAS_PRUEBA_MINIMARKET = [
  { id: 'todas', nombre: 'Todas las Categorías' },
  { id: 'c1', nombre: 'Lácteos & Huevos' },
  { id: 'c2', nombre: 'Bebidas & Jugos' },
  { id: 'c3', nombre: 'Abarrotes & Despensa' },
  { id: 'c4', nombre: 'Snacks & Papas' },
  { id: 'c5', nombre: 'Panadería' },
  { id: 'c6', nombre: 'Aseo & Hogar' }
];

/**
 * Módulo POS de Punto de Venta para Tienda Minimarket
 */
export default function PaginaPOSMinimarket() {
  const [bodega, setBodega] = useState(null);
  const [categorias, setCategorias] = useState(CATEGORIAS_PRUEBA_MINIMARKET);
  const [productos, setProductos] = useState(PRODUCTOS_PRUEBA_MINIMARKET);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  
  // Estado del Carrito de Compras
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [procesando, setProcesando] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [mensajeExito, setMensajeExito] = useState(null);
  const [facturaGenerada, setFacturaGenerada] = useState(null);

  // Cargar datos de Supabase al iniciar
  useEffect(() => {
    cargarDatosMinimarket();
  }, []);

  const cargarDatosMinimarket = async () => {
    setCargandoDatos(true);
    try {
      const bodegaMinimarket = await obtenerBodegaPorTipo('minimarket') || await obtenerBodegaPorTipo('cafeteria');
      if (bodegaMinimarket) {
        setBodega(bodegaMinimarket);
        const catsBD = await obtenerCategoriasPorBodega(bodegaMinimarket.id);
        if (catsBD && catsBD.length > 0) {
          setCategorias([{ id: 'todas', nombre: 'Todas las Categorías' }, ...catsBD]);
        }
        const prodsBD = await obtenerProductosEInventarioPorBodega(bodegaMinimarket.id);
        if (prodsBD && prodsBD.length > 0) {
          setProductos(prodsBD);
        }
      }
    } catch (error) {
      console.error('Error al cargar datos del minimarket:', error);
    } finally {
      setCargandoDatos(false);
    }
  };

  // Agregar producto al carrito
  const agregarAlCarrito = (producto) => {
    const itemExistente = carrito.find(item => item.id === producto.id);
    const stockDisponible = producto.inventario_bodega?.[0]?.stock_actual ?? 99;

    if (itemExistente) {
      if (itemExistente.cantidad >= stockDisponible) {
        alert(`¡Stock máximo alcanzado! Solo hay ${stockDisponible} unidades de ${producto.nombre}.`);
        return;
      }
      setCarrito(carrito.map(item => 
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      if (stockDisponible <= 0) {
        alert(`¡Producto sin stock disponible!`);
        return;
      }
      setCarrito([...carrito, { 
        id: producto.id, 
        nombre: producto.nombre, 
        precio: producto.precio_venta, 
        cantidad: 1,
        sku: producto.sku
      }]);
    }
  };

  // Modificar cantidad en carrito
  const cambiarCantidad = (id, delta) => {
    setCarrito(carrito.map(item => {
      if (item.id === id) {
        const nuevaCantidad = item.cantidad + delta;
        return nuevaCantidad > 0 ? { ...item, cantidad: nuevaCantidad } : item;
      }
      return item;
    }));
  };

  // Eliminar producto del carrito
  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  // Cálculos totales
  const subtotalTotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const impuestoTotal = Math.round(subtotalTotal * 0.08); // IVA de consumo 8% o sugerido
  const totalPagar = subtotalTotal + impuestoTotal;

  // Finalizar cobro y registrar venta
  const procesarCobroVenta = async () => {
    if (carrito.length === 0) return;
    setProcesando(true);
    setMensajeExito(null);

    try {
      const datosVenta = {
        bodegaId: bodega?.id || '11111111-1111-1111-1111-111111111111',
        tipoBodega: 'minimarket',
        clienteNombre: 'Cliente Minimarket',
        metodoPago: metodoPago,
        subtotal: subtotalTotal,
        impuesto: impuestoTotal,
        total: totalPagar,
        items: carrito.map(i => ({
          productoId: i.id,
          cantidad: i.cantidad,
          precioUnitario: i.precio,
          subtotal: i.precio * i.cantidad
        }))
      };

      let facturaNum = `FAC-MINI-${Date.now().toString().slice(-6)}`;
      try {
        const ventaRegistrada = await registrarVentaConDetalles(datosVenta);
        if (ventaRegistrada?.numero_factura) {
          facturaNum = ventaRegistrada.numero_factura;
        }
      } catch (err) {
        console.log('Registrando venta localmente...');
      }

      // Actualizar stock localmente
      setProductos(productos.map(prod => {
        const itemComprado = carrito.find(item => item.id === prod.id);
        if (itemComprado && prod.inventario_bodega?.[0]) {
          const nuevoStock = Math.max(0, prod.inventario_bodega[0].stock_actual - itemComprado.cantidad);
          return {
            ...prod,
            inventario_bodega: [{ ...prod.inventario_bodega[0], stock_actual: nuevoStock }]
          };
        }
        return prod;
      }));

      // Guardar factura para modal
      setFacturaGenerada({
        numero: facturaNum,
        fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        items: [...carrito],
        subtotal: subtotalTotal,
        impuesto: impuestoTotal,
        total: totalPagar,
        metodoPago: metodoPago
      });

      setMensajeExito('¡Venta registrada con éxito!');
      setCarrito([]);
    } catch (error) {
      alert('Ocurrió un error al procesar la venta.');
    } finally {
      setProcesando(false);
    }
  };

  // Filtrado de productos por búsqueda o código de barras
  const productosFiltrados = productos.filter(p => {
    const coincideCat = categoriaSeleccionada === 'todas' || p.categoria_id === categoriaSeleccionada;
    const busqLower = busqueda.toLowerCase().trim();
    const coincideBusq = 
      !busqLower || 
      p.nombre.toLowerCase().includes(busqLower) || 
      (p.codigo_barras && p.codigo_barras.includes(busqLower)) ||
      (p.sku && p.sku.toLowerCase().includes(busqLower));
    return coincideCat && coincideBusq;
  });

  return (
    <div className="space-y-6 antialiased">
      
      {/* Encabezado Superior del POS Minimarket */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-md">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Caja Registradora POS — Minimarket</h1>
            <p className="text-xs text-slate-500">Facturación ágil, código de barras y control de stock</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={cargarDatosMinimarket}
            disabled={cargandoDatos}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-semibold flex items-center gap-1.5"
            title="Recargar inventario de Supabase"
          >
            <RefreshCw className={`w-4 h-4 ${cargandoDatos ? 'animate-spin text-emerald-600' : ''}`} />
            <span className="hidden sm:inline">Sincronizar DB</span>
          </button>
        </div>
      </div>

      {/* Rejilla Principal: Productos (Izquierda) + Carrito de Cobro (Derecha) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SECCIÓN IZQUIERDA: Catálogo de Productos y Filtros (8 Columnas) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          
          {/* Barra de Búsqueda y Código de Barras */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input 
                type="text"
                placeholder="Buscar por nombre, código de barras o SKU..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm shadow-sm"
              />
              {busqueda && (
                <button onClick={() => setBusqueda('')} className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filtro por Categorías */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categorias.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoriaSeleccionada(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  categoriaSeleccionada === cat.id
                    ? 'bg-emerald-700 text-white shadow-md scale-[1.02]'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>

          {/* Grilla de Productos */}
          {productosFiltrados.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-600">No se encontraron productos coincidentes.</p>
              <button onClick={() => { setBusqueda(''); setCategoriaSeleccionada('todas'); }} className="text-xs text-emerald-700 font-bold underline">
                Ver todos los productos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {productosFiltrados.map(prod => {
                const stock = prod.inventario_bodega?.[0]?.stock_actual ?? 99;
                const sinStock = stock <= 0;

                return (
                  <div
                    key={prod.id}
                    onClick={() => !sinStock && agregarAlCarrito(prod)}
                    className={`group bg-white rounded-2xl p-4 border transition-all flex flex-col justify-between cursor-pointer select-none relative overflow-hidden ${
                      sinStock 
                        ? 'opacity-60 border-slate-200 cursor-not-allowed bg-slate-50' 
                        : 'border-slate-200 hover:border-emerald-500 hover:shadow-lg active:scale-[0.98]'
                    }`}
                  >
                    <div>
                      {/* Badge de Stock */}
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          sinStock 
                            ? 'bg-rose-100 text-rose-700' 
                            : stock < 10 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {sinStock ? 'Agotado' : `Stock: ${stock}`}
                        </span>

                        {prod.codigo_barras && (
                          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-0.5">
                            <Barcode className="w-3 h-3" />
                            {prod.codigo_barras}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1 group-hover:text-emerald-700 transition-colors line-clamp-2">
                        {prod.nombre}
                      </h3>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-base font-black text-slate-900">
                        ${prod.precio_venta?.toLocaleString('es-CO')}
                      </span>
                      
                      <button
                        disabled={sinStock}
                        className={`p-2 rounded-xl text-white transition-colors ${
                          sinStock ? 'bg-slate-300' : 'bg-emerald-600 group-hover:bg-emerald-700 shadow-sm'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* SECCIÓN DERECHA: Carrito de Venta y Facturación (4 Columnas) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl flex flex-col justify-between min-h-[560px] sticky top-6">
            
            <div className="space-y-4">
              
              {/* Encabezado del Carrito */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-emerald-600" />
                  <h2 className="font-bold text-slate-900 text-base">Orden de Venta</h2>
                </div>
                {carrito.length > 0 && (
                  <button 
                    onClick={() => setCarrito([])}
                    className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Vaciar</span>
                  </button>
                )}
              </div>

              {/* Lista de Ítems en el Carrito */}
              {carrito.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-500">El carrito de compra está vacío</p>
                  <p className="text-xs text-slate-400">Selecciona o busca productos para agregar</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                  {carrito.map(item => (
                    <div key={item.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-xs truncate">{item.nombre}</h4>
                        <p className="text-[11px] text-slate-500">${item.precio.toLocaleString('es-CO')} c/u</p>
                      </div>

                      {/* Control de Cantidad */}
                      <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-200 p-1">
                        <button 
                          onClick={() => cambiarCantidad(item.id, -1)}
                          className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-bold text-xs text-slate-900">{item.cantidad}</span>
                        <button 
                          onClick={() => cambiarCantidad(item.id, 1)}
                          className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-xs text-slate-900 block">
                          ${(item.precio * item.cantidad).toLocaleString('es-CO')}
                        </span>
                        <button 
                          onClick={() => eliminarDelCarrito(item.id)}
                          className="text-[10px] text-rose-500 hover:text-rose-700"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Totalizadores y Método de Pago */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              
              {/* Selección Método de Pago */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Método de Pago
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMetodoPago('efectivo')}
                    className={`p-2 rounded-xl border text-center text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      metodoPago === 'efectivo' 
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span>Efectivo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMetodoPago('tarjeta')}
                    className={`p-2 rounded-xl border text-center text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      metodoPago === 'tarjeta' 
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Tarjeta</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMetodoPago('transferencia')}
                    className={`p-2 rounded-xl border text-center text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      metodoPago === 'transferencia' 
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>Transfer.</span>
                  </button>
                </div>
              </div>

              {/* Totales */}
              <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${subtotalTotal.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Impuesto (8%):</span>
                  <span className="font-semibold">${impuestoTotal.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>TOTAL A PAGAR:</span>
                  <span className="text-emerald-700">${totalPagar.toLocaleString('es-CO')}</span>
                </div>
              </div>

              {/* Botón de Finalizar Venta */}
              <button
                onClick={procesarCobroVenta}
                disabled={carrito.length === 0 || procesando}
                className={`w-full py-4 rounded-2xl font-black text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                  carrito.length === 0 || procesando
                    ? 'bg-slate-300 cursor-not-allowed shadow-none'
                    : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-600/20'
                }`}
              >
                {procesando ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Procesando Pago...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>COBRAR Y REGISTRAR VENTA</span>
                  </>
                )}
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* Modal Recibo / Factura de Venta Generada */}
      {facturaGenerada && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-200 space-y-6">
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-slate-900">¡Venta Exitosa!</h3>
              <p className="text-xs text-slate-500 font-mono">{facturaGenerada.numero}</p>
            </div>

            <div className="border-t border-b border-dashed border-slate-200 py-3 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-500">
                <span>Fecha: {facturaGenerada.fecha}</span>
                <span className="uppercase">{facturaGenerada.metodoPago}</span>
              </div>
              <div className="space-y-1 pt-1">
                {facturaGenerada.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{it.cantidad}x {it.nombre.slice(0, 18)}...</span>
                    <span>${(it.precio * it.cantidad).toLocaleString('es-CO')}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-200 font-bold text-slate-900 flex justify-between text-sm">
                <span>TOTAL:</span>
                <span>${facturaGenerada.total.toLocaleString('es-CO')}</span>
              </div>
            </div>

            <button
              onClick={() => setFacturaGenerada(null)}
              className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition-colors shadow-md"
            >
              Cerrar e Iniciar Nueva Venta
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
