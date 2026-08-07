-- ==============================================================================
-- MIGRACIÓN INICIAL PARA SUPABASE GITHUB INTEGRATION
-- Fecha: 2026-08-07
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
CREATE POLICY "Permitir lectura publica de inventario" ON public.inventario_bodega FOR SELECT USING (true);

-- Políticas completas para usuarios autenticados (Cajeros y Administradores)
CREATE POLICY "Permitir acceso total a bodegas para autenticados" ON public.bodegas FOR ALL TO authenticated USING (true);
CREATE POLICY "Permitir acceso total a categorias para autenticados" ON public.categorias FOR ALL TO authenticated USING (true);
CREATE POLICY "Permitir acceso total a productos para autenticados" ON public.productos FOR ALL TO authenticated USING (true);
CREATE POLICY "Permitir acceso total a inventario para autenticados" ON public.inventario_bodega FOR ALL TO authenticated USING (true);
CREATE POLICY "Permitir acceso total a ventas para autenticados" ON public.ventas FOR ALL TO authenticated USING (true);
CREATE POLICY "Permitir acceso total a detalles de venta para autenticados" ON public.detalles_venta FOR ALL TO authenticated USING (true);

-- ==============================================================================
-- DATOS SEMILLA (SEED DATA)
-- ==============================================================================
INSERT INTO public.bodegas (id, codigo, nombre, tipo, descripcion)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'BOD-CAF-01', 'Cafetería Central', 'cafeteria', 'Sucursal de caja rápida para venta de bebidas, repostería y desayunos'),
    ('22222222-2222-2222-2222-222222222222', 'BOD-MIL-01', 'Tienda Productos Milagros', 'milagros', 'Sucursal para catálogo de cosméticos, tratamiento capilar y belleza')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.categorias (id, bodega_id, nombre, descripcion, icono)
VALUES
    ('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Cafés Calientes', 'Espressos, lattes, capuchinos de especialidad', 'Coffee'),
    ('c2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Bebidas Frías', 'Frappés, tés helados y jugos naturales', 'IceCream'),
    ('c3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Repostería & Postres', 'Croissants, muffins, tartas artesanales', 'Cake'),
    ('m1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Cuidado Capilar Milagros', 'Champús, tratamientos nutritivos y mascarillas', 'Sparkles'),
    ('m2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Cuidado Facial', 'Serums hidratantes, tónicos y cremas antiedad', 'Smile'),
    ('m3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Kits & Regalos', 'Paquetes promocionales de tratamiento completo', 'Gift')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.productos (id, bodega_id, categoria_id, sku, codigo_barras, nombre, descripcion, precio_venta, costo, requiere_lote)
VALUES
    ('p1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'CAF-ESP-01', '7701001001', 'Espresso Doble Especial', 'Café concentrado de grano origen colombiano', 4500.00, 1200.00, false),
    ('p2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'CAF-LAT-02', '7701001002', 'Cappuccino de Almendras', 'Espresso con leche de almendras espumada y canela', 7500.00, 2500.00, false),
    ('p3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222', 'CAF-FRA-03', '7701001003', 'Frappé de Caramelo & Crema', 'Bebida helada a base de café con caramelo artesanal', 9800.00, 3200.00, false),
    ('p4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333', 'POS-CRO-04', '7701001004', 'Croissant de Almendra', 'Masa hojaldrada recién horneada con crema de almendras', 6000.00, 2000.00, false),
    ('pm111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'm1111111-1111-1111-1111-111111111111', 'MIL-CHA-01', '7702002001', 'Champú Bio-Reparador Milagros 500ml', 'Fórmula natural para crecimiento y fortalecimiento capilar', 45000.00, 21000.00, true),
    ('pm222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'm1111111-1111-1111-1111-111111111111', 'MIL-MAS-02', '7702002002', 'Mascarilla de Frutas Nutritiva 300g', 'Tratamiento intensivo con aceites de argán y aguacate', 38000.00, 17500.00, true),
    ('pm333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 'MIL-SER-03', '7702002003', 'Serum Facial Ácido Hialurónico 50ml', 'Hidratación profunda con vitamina C y antioxidantes', 52000.00, 24000.00, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.inventario_bodega (bodega_id, producto_id, stock_actual, stock_minimo, lote, fecha_vencimiento)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 100, 15, 'GENERAL', NULL),
    ('11111111-1111-1111-1111-111111111111', 'p2222222-2222-2222-2222-222222222222', 80, 10, 'GENERAL', NULL),
    ('11111111-1111-1111-1111-111111111111', 'p3333333-3333-3333-3333-333333333333', 60, 10, 'GENERAL', NULL),
    ('11111111-1111-1111-1111-111111111111', 'p4444444-4444-4444-4444-444444444444', 35, 5, 'GENERAL', NULL),
    ('22222222-2222-2222-2222-222222222222', 'pm111111-1111-1111-1111-111111111111', 45, 10, 'LOT-2026-08A', '2028-08-31'),
    ('22222222-2222-2222-2222-222222222222', 'pm222222-2222-2222-2222-222222222222', 30, 8, 'LOT-2026-08B', '2028-05-15'),
    ('22222222-2222-2222-2222-222222222222', 'pm333333-3333-3333-3333-333333333333', 25, 5, 'LOT-2026-09C', '2029-01-30')
ON CONFLICT (producto_id, lote) DO UPDATE SET stock_actual = EXCLUDED.stock_actual;
