import { clienteSupabase } from './supabaseClient';

/**
 * Módulo de servicios de datos para interactuar con la base de datos PostgreSQL de Supabase.
 * Todas las funciones y variables están escritas en español.
 */

/**
 * Obtener las bodegas/sucursales registradas en el sistema.
 */
export async function obtenerBodegas() {
  const { data, error } = await clienteSupabase
    .from('bodegas')
    .select('*')
    .eq('activa', true)
    .order('nombre');

  if (error) {
    console.error('Error al obtener bodegas:', error);
    return [];
  }
  return data || [];
}

/**
 * Obtener una bodega por su tipo ('cafeteria' o 'milagros').
 */
export async function obtenerBodegaPorTipo(tipoBodega) {
  const { data, error } = await clienteSupabase
    .from('bodegas')
    .select('*')
    .eq('tipo', tipoBodega)
    .maybeSingle();

  if (error) {
    console.error(`Error al obtener bodega del tipo ${tipoBodega}:`, error.message || error);
    return null;
  }
  return data;
}

/**
 * Obtener las categorías pertenecientes a una bodega específica.
 */
export async function obtenerCategoriasPorBodega(bodegaId) {
  if (!bodegaId) return [];

  const { data, error } = await clienteSupabase
    .from('categorias')
    .select('*')
    .eq('bodega_id', bodegaId)
    .eq('activa', true)
    .order('nombre');

  if (error) {
    console.error('Error al obtener categorías:', error);
    return [];
  }
  return data || [];
}

/**
 * Obtener los productos e inventario de una bodega específica.
 */
export async function obtenerProductosEInventarioPorBodega(bodegaId) {
  if (!bodegaId) return [];

  const { data, error } = await clienteSupabase
    .from('productos')
    .select(`
      *,
      categorias (id, nombre, icono),
      inventario_bodega (id, stock_actual, stock_minimo, lote, fecha_vencimiento)
    `)
    .eq('bodega_id', bodegaId)
    .eq('activo', true)
    .order('nombre');

  if (error) {
    console.error('Error al obtener productos de la bodega:', error);
    return [];
  }
  return data || [];
}

/**
 * Registrar una venta y actualizar el stock correspondientes en la bodega.
 * @param {Object} datosVenta - Cabecera de la venta (bodega_id, cliente_nombre, metodo_pago, subtotal, impuesto, total, items)
 */
export async function registrarVentaConDetalles(datosVenta) {
  const { bodegaId, clienteNombre, metodoPago, subtotal, impuesto, total, items } = datosVenta;

  // Generar número de factura único basado en timestamp
  const codigoPrefijo = datosVenta.tipoBodega === 'cafeteria' ? 'FAC-CAF' : 'FAC-MIL';
  const numeroFactura = `${codigoPrefijo}-${Date.now().toString().slice(-6)}`;

  // 1. Insertar cabecera de venta
  const { data: ventaCreada, error: errorVenta } = await clienteSupabase
    .from('ventas')
    .insert({
      bodega_id: bodegaId,
      numero_factura: numeroFactura,
      cliente_nombre: clienteNombre || 'Cliente General',
      metodo_pago: metodoPago || 'efectivo',
      subtotal: subtotal,
      impuesto: impuesto,
      total: total,
      estado: 'completada'
    })
    .select()
    .single();

  if (errorVenta) {
    console.error('Error al registrar la cabecera de la venta:', errorVenta);
    throw new Error('No se pudo registrar la venta en Supabase: ' + errorVenta.message);
  }

  // 2. Insertar detalles de la venta y descontar inventario
  const detallesAInsertar = items.map(item => ({
    venta_id: ventaCreada.id,
    producto_id: item.productoId,
    cantidad: item.cantidad,
    precio_unitario: item.precioUnitario,
    subtotal: item.cantidad * item.precioUnitario,
    lote: item.lote || 'GENERAL'
  }));

  const { error: errorDetalles } = await clienteSupabase
    .from('detalles_venta')
    .insert(detallesAInsertar);

  if (errorDetalles) {
    console.error('Error al registrar los detalles de la venta:', errorDetalles);
    throw new Error('Error al registrar detalles de la venta.');
  }

  // 3. Descontar stock de inventario por producto y lote
  for (const item of items) {
    const { data: registroInventario } = await clienteSupabase
      .from('inventario_bodega')
      .select('id, stock_actual')
      .eq('producto_id', item.productoId)
      .maybeSingle();

    if (registroInventario) {
      const nuevoStock = Math.max(0, registroInventario.stock_actual - item.cantidad);
      await clienteSupabase
        .from('inventario_bodega')
        .update({ stock_actual: nuevoStock, ultima_actualizacion: new Date().toISOString() })
        .eq('id', registroInventario.id);
    }
  }

  return ventaCreada;
}

/**
 * Obtener el historial de ventas registradas con soporte de filtro por bodega.
 */
export async function obtenerHistorialVentas(bodegaId = null) {
  let consulta = clienteSupabase
    .from('ventas')
    .select(`
      *,
      bodegas (nombre, tipo),
      detalles_venta (
        id, cantidad, precio_unitario, subtotal,
        productos (nombre)
      )
    `)
    .order('fecha_venta', { ascending: false });

  if (bodegaId) {
    consulta = consulta.eq('bodega_id', bodegaId);
  }

  const { data, error } = await consulta;

  if (error) {
    console.error('Error al consultar historial de ventas:', error);
    return [];
  }
  return data || [];
}

/**
 * Crear un nuevo producto en una bodega dada.
 */
export async function crearProductoNuevo(datosProducto) {
  const { data, error } = await clienteSupabase
    .from('productos')
    .insert(datosProducto)
    .select()
    .single();

  if (error) {
    console.error('Error al crear producto:', error);
    throw error;
  }

  // Crear registro de inventario inicial
  await clienteSupabase.from('inventario_bodega').insert({
    bodega_id: datosProducto.bodega_id,
    producto_id: data.id,
    stock_actual: datosProducto.stock_inicial || 0,
    stock_minimo: datosProducto.stock_minimo || 5,
    lote: datosProducto.lote || 'GENERAL'
  });

  return data;
}

/**
 * Actualizar el stock de un producto existente.
 */
export async function actualizarStockInventario(inventarioId, nuevoStock) {
  const { data, error } = await clienteSupabase
    .from('inventario_bodega')
    .update({
      stock_actual: nuevoStock,
      ultima_actualizacion: new Date().toISOString()
    })
    .eq('id', inventarioId)
    .select()
    .single();

  if (error) {
    console.error('Error al actualizar stock:', error);
    throw error;
  }
  return data;
}
