-- ==============================================================================
-- MIGRACIÓN INICIAL AUTOMÁTICA PARA SUPABASE GITHUB INTEGRATION
-- Proyecto: Café & Milagros (Micro-ERP y POS Multisucursal)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLA BODEGAS
CREATE TABLE IF NOT EXISTS public.bodegas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(30) CHECK (tipo IN ('cafeteria', 'milagros')) NOT NULL,
    descripcion TEXT,
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABLA CATEGORÍAS
CREATE TABLE IF NOT EXISTS public.categorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bodega_id UUID NOT NULL REFERENCES public.bodegas(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(50) DEFAULT 'Package',
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLA PRODUCTOS
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

-- 4. TABLA INVENTARIO BODEGA
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

-- 5. TABLA VENTAS
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

-- 6. TABLA DETALLES DE VENTA
CREATE TABLE IF NOT EXISTS public.detalles_venta (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venta_id UUID NOT NULL REFERENCES public.ventas(id) ON DELETE CASCADE,
    producto_id UUID NOT NULL REFERENCES public.productos(id) ON DELETE RESTRICT,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(12, 2) NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL,
    lote VARCHAR(50)
);

-- HABILITAR SEGURIDAD RLS
ALTER TABLE public.bodegas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventario_bodega ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detalles_venta ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE LECTURA PÚBLICA (Evitar errores si ya existen)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Permitir lectura publica de bodegas') THEN
        CREATE POLICY "Permitir lectura publica de bodegas" ON public.bodegas FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Permitir lectura publica de categorias') THEN
        CREATE POLICY "Permitir lectura publica de categorias" ON public.categorias FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Permitir lectura publica de productos') THEN
        CREATE POLICY "Permitir lectura publica de productos" ON public.productos FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Permitir lectura publica de inventario') THEN
        CREATE POLICY "Permitir lectura publica de inventario" ON public.inventario_bodega FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Permitir acceso total a ventas') THEN
        CREATE POLICY "Permitir acceso total a ventas" ON public.ventas FOR ALL USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Permitir acceso total a detalles') THEN
        CREATE POLICY "Permitir acceso total a detalles" ON public.detalles_venta FOR ALL USING (true);
    END IF;
END $$;

-- DATOS INICIALES
INSERT INTO public.bodegas (id, codigo, nombre, tipo, descripcion)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'BOD-CAF-01', 'Cafetería Central', 'cafeteria', 'Sucursal de caja rápida para venta de bebidas, repostería y desayunos'),
    ('22222222-2222-2222-2222-222222222222', 'BOD-MIL-01', 'Tienda Productos Milagros', 'milagros', 'Sucursal para catálogo de cosméticos, tratamiento capilar y belleza')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.categorias (id, bodega_id, nombre, descripcion, icono)
VALUES
    ('31111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Cafés Calientes', 'Espressos, lattes, capuchinos de especialidad', 'Coffee'),
    ('32222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Bebidas Frías', 'Frappés, tés helados y jugos naturales', 'IceCream'),
    ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Repostería & Postres', 'Croissants, muffins, tartas artesanales', 'Cake'),
    ('41111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Cuidado Capilar Milagros', 'Champús, tratamientos nutritivos y mascarillas', 'Sparkles'),
    ('42222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Cuidado Facial', 'Serums hidratantes, tónicos y cremas antiedad', 'Smile')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.productos (id, bodega_id, categoria_id, sku, codigo_barras, nombre, descripcion, precio_venta, costo, requiere_lote)
VALUES
    ('51111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '31111111-1111-1111-1111-111111111111', 'CAF-ESP-01', '7701001001', 'Café Nutella', 'Café especial con crema de hazelnut y Nutella artesanal', 5500.00, 1800.00, false),
    ('52222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '31111111-1111-1111-1111-111111111111', 'CAF-LAT-02', '7701001002', 'Cappuccino de Almendras', 'Espresso con leche de almendras espumada y canela', 7500.00, 2500.00, false),
    ('53333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '32222222-2222-2222-2222-222222222222', 'CAF-FRA-03', '7701001003', 'Frappé de Caramelo & Crema', 'Bebida helada a base de café con caramelo artesanal', 9800.00, 3200.00, false),
    ('61111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '41111111-1111-1111-1111-111111111111', 'MIL-CHA-01', '7702002001', 'Champú Bio-Reparador Milagros 500ml', 'Fórmula natural para crecimiento capilar', 45000.00, 21000.00, true),
    ('62222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '41111111-1111-1111-1111-111111111111', 'MIL-MAS-02', '7702002002', 'Mascarilla de Frutas Nutritiva 300g', 'Tratamiento intensivo con aceites', 38000.00, 17500.00, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.inventario_bodega (bodega_id, producto_id, stock_actual, stock_minimo, lote, fecha_vencimiento)
VALUES
    ('11111111-1111-1111-1111-111111111111', '51111111-1111-1111-1111-111111111111', 100, 15, 'GENERAL', NULL),
    ('11111111-1111-1111-1111-111111111111', '52222222-2222-2222-2222-222222222222', 80, 10, 'GENERAL', NULL),
    ('11111111-1111-1111-1111-111111111111', '53333333-3333-3333-3333-333333333333', 60, 10, 'GENERAL', NULL),
    ('22222222-2222-2222-2222-222222222222', '61111111-1111-1111-1111-111111111111', 45, 10, 'LOT-2026-08A', '2028-08-31'),
    ('22222222-2222-2222-2222-222222222222', '62222222-2222-2222-2222-222222222222', 30, 8, 'LOT-2026-08B', '2028-05-15')
ON CONFLICT (producto_id, lote) DO UPDATE SET stock_actual = EXCLUDED.stock_actual;
