-- ==============================================================================
-- ESQUEMA DE BASE DE DATOS POSTGRESQL PARA SUPABASE
-- Proyecto: Café & Milagros (Micro-ERP y Sistema POS Multisucursal)
-- ==============================================================================

-- 1. Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- TABLA: BODEGAS / SUCURSALES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.bodegas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(30) CHECK (tipo IN ('cafeteria', 'milagros')) NOT NULL,
    descripcion TEXT,
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- TABLA: CATEGORÍAS DE PRODUCTOS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.categorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bodega_id UUID NOT NULL REFERENCES public.bodegas(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(50) DEFAULT 'Package',
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- TABLA: PRODUCTOS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.productos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bodega_id UUID NOT NULL REFERENCES public.bodegas(id) ON DELETE CASCADE,
    categoria_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL,
    sku VARCHAR(50),
    codigo_barras VARCHAR(100),
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio_venta NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    costo NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    imagen_url TEXT,
    requiere_lote BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- TABLA: INVENTARIO DE BODEGA (STOCK Y CONTROL DE LOTES)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.inventario_bodega (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bodega_id UUID NOT NULL REFERENCES public.bodegas(id) ON DELETE CASCADE,
    producto_id UUID NOT NULL REFERENCES public.productos(id) ON DELETE CASCADE,
    stock_actual INT NOT NULL DEFAULT 0,
    stock_minimo INT NOT NULL DEFAULT 5,
    lote VARCHAR(50),
    fecha_vencimiento DATE,
    ultima_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT uq_producto_lote UNIQUE (producto_id, lote)
);

-- ==============================================================================
-- TABLA: VENTAS (CABECERA DE FACTURA / TICKET)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.ventas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bodega_id UUID NOT NULL REFERENCES public.bodegas(id) ON DELETE CASCADE,
    numero_factura VARCHAR(50) UNIQUE NOT NULL,
    cliente_nombre VARCHAR(150) DEFAULT 'Cliente General',
    metodo_pago VARCHAR(30) CHECK (metodo_pago IN ('efectivo', 'tarjeta', 'transferencia', 'mixto')) DEFAULT 'efectivo',
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    impuesto NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    estado VARCHAR(20) CHECK (estado IN ('completada', 'anulada')) DEFAULT 'completada',
    cajero_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    fecha_venta TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- TABLA: DETALLES DE VENTA (LÍNEAS DE PRODUCTO VENDIDAS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.detalles_venta (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venta_id UUID NOT NULL REFERENCES public.ventas(id) ON DELETE CASCADE,
    producto_id UUID NOT NULL REFERENCES public.productos(id) ON DELETE RESTRICT,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(12, 2) NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL,
    lote VARCHAR(50)
);

-- ==============================================================================
-- SEGURIDAD A NIVEL DE FILAS (ROW LEVEL SECURITY - RLS)
-- ==============================================================================
ALTER TABLE public.bodegas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventario_bodega ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detalles_venta ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública para el Catálogo (lectura libre)
CREATE POLICY "Permitir lectura publica de bodegas" ON public.bodegas FOR SELECT USING (true);
CREATE POLICY "Permitir lectura publica de categorias" ON public.categorias FOR SELECT USING (true);
CREATE POLICY "Permitir lectura publica de productos" ON public.productos FOR SELECT USING (true);

-- Políticas completas para usuarios autenticados (Cajeros y Administradores)
CREATE POLICY "Permitir acceso total a bodegas para autenticados" ON public.bodegas FOR ALL TO authenticated USING (true);
CREATE POLICY "Permitir acceso total a categorias para autenticados" ON public.categorias FOR ALL TO authenticated USING (true);
CREATE POLICY "Permitir acceso total a productos para autenticados" ON public.productos FOR ALL TO authenticated USING (true);
CREATE POLICY "Permitir acceso total a inventario para autenticados" ON public.inventario_bodega FOR ALL TO authenticated USING (true);
CREATE POLICY "Permitir acceso total a ventas para autenticados" ON public.ventas FOR ALL TO authenticated USING (true);
CREATE POLICY "Permitir acceso total a detalles de venta para autenticados" ON public.detalles_venta FOR ALL TO authenticated USING (true);

-- Política de lectura anonima para inventario (necesaria para mostrar disponibilidad en catálogo)
CREATE POLICY "Permitir lectura publica de inventario" ON public.inventario_bodega FOR SELECT USING (true);
