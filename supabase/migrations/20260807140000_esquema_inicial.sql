-- ==============================================================================
-- MIGRACIÓN INICIAL PARA MINIMARKET POS & MICRO-ERP
-- Proyecto: Minimarket POS
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLA BODEGAS / TIENDAS
CREATE TABLE IF NOT EXISTS public.bodegas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(30) CHECK (tipo IN ('minimarket', 'cafeteria', 'milagros')) NOT NULL DEFAULT 'minimarket',
    descripcion TEXT,
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABLA CATEGORÍAS DE PRODUCTO
CREATE TABLE IF NOT EXISTS public.categorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bodega_id UUID REFERENCES public.bodegas(id) ON DELETE CASCADE,
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

-- POLÍTICAS DE LECTURA PÚBLICA
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

-- DATOS INICIALES DEL MINIMARKET
INSERT INTO public.bodegas (id, codigo, nombre, tipo, descripcion)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'BOD-MINI-01', 'Minimarket Principal', 'minimarket', 'Punto de venta y bodega principal de minimarket')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.categorias (id, bodega_id, nombre, descripcion, icono)
VALUES
    ('31111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Lácteos & Huevos', 'Leche, quesos, yogures y derivados', 'Milk'),
    ('32222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Bebidas & Jugos', 'Gaseosas, jugos, agua mineral y bebidas heladas', 'Coffee'),
    ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Abarrotes & Despensa', 'Arroz, aceite, azúcar, granos y enlatados', 'Package'),
    ('34444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Snacks & Papas', 'Papas fritas, galletas y pasabocas', 'Smile')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.productos (id, bodega_id, categoria_id, sku, codigo_barras, nombre, descripcion, precio_venta, costo, requiere_lote)
VALUES
    ('51111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', '31111111-1111-1111-1111-111111111111', 'MINI-LAC-01', '7701001', 'Leche Entera 1 Litro', 'Leche pasteurizada de bolsa 100% pura', 4200.00, 3100.00, false),
    ('52222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '32222222-2222-2222-2222-222222222222', 'MINI-BEB-02', '7701002', 'Gaseosa Coca-Cola 1.5L', 'Bebida refrescante en botella no retornable', 5800.00, 4200.00, false),
    ('53333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'MINI-ABA-03', '7701003', 'Arroz Diana Roa 1kg', 'Arroz blanco grano seleccionado 1000g', 4600.00, 3400.00, false),
    ('54444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', '34444444-4444-4444-4444-444444444444', 'MINI-SNA-04', '7701004', 'Papas Margarita Limón 110g', 'Papas fritas crujientes sabor a limón', 3800.00, 2600.00, false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.inventario_bodega (bodega_id, producto_id, stock_actual, stock_minimo, lote, fecha_vencimiento)
VALUES
    ('11111111-1111-1111-1111-111111111111', '51111111-1111-1111-1111-111111111111', 150, 20, 'GENERAL', NULL),
    ('11111111-1111-1111-1111-111111111111', '52222222-2222-2222-2222-222222222222', 90, 15, 'GENERAL', NULL),
    ('11111111-1111-1111-1111-111111111111', '53333333-3333-3333-3333-333333333333', 200, 25, 'GENERAL', NULL),
    ('11111111-1111-1111-1111-111111111111', '54444444-4444-4444-4444-444444444444', 80, 15, 'GENERAL', NULL)
ON CONFLICT (producto_id, lote) DO UPDATE SET stock_actual = EXCLUDED.stock_actual;
