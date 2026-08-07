-- ==============================================================================
-- DATOS SEMILLA (SEED DATA) PARA CAFÉ & MILAGROS
-- ==============================================================================

-- 1. Insertar Bodegas Principales
INSERT INTO public.bodegas (id, codigo, nombre, tipo, descripcion)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'BOD-CAF-01', 'Cafetería Central', 'cafeteria', 'Sucursal de caja rápida para venta de bebidas, repostería y desayunos'),
    ('22222222-2222-2222-2222-222222222222', 'BOD-MIL-01', 'Tienda Productos Milagros', 'milagros', 'Sucursal para catálogo de cosméticos, tratamiento capilar y belleza')
ON CONFLICT (id) DO NOTHING;

-- 2. Insertar Categorías de la Cafetería
INSERT INTO public.categorias (id, bodega_id, nombre, descripcion, icono)
VALUES
    ('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Cafés Calientes', 'Espressos, lattes, capuchinos de especialidad', 'Coffee'),
    ('c2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Bebidas Frías', 'Frappés, tés helados y jugos naturales', 'IceCream'),
    ('c3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Repostería & Postres', 'Croissants, muffins, tartas artesanales', 'Cake')
ON CONFLICT (id) DO NOTHING;

-- 3. Insertar Categorías de Productos Milagros
INSERT INTO public.categorias (id, bodega_id, nombre, descripcion, icono)
VALUES
    ('m1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Cuidado Capilar Milagros', 'Champús, tratamientos nutritivos y mascarillas', 'Sparkles'),
    ('m2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Cuidado Facial', 'Serums hidratantes, tónicos y cremas antiedad', 'Smile'),
    ('m3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Kits & Regalos', 'Paquetes promocionales de tratamiento completo', 'Gift')
ON CONFLICT (id) DO NOTHING;

-- 4. Insertar Productos de Cafetería
INSERT INTO public.productos (id, bodega_id, categoria_id, sku, codigo_barras, nombre, descripcion, precio_venta, costo, requiere_lote)
VALUES
    ('p1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'CAF-ESP-01', '7701001001', 'Espresso Doble Especial', 'Café concentrado de grano origen colombiano', 4500.00, 1200.00, false),
    ('p2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'CAF-LAT-02', '7701001002', 'Cappuccino de Almedras', 'Espresso con leche de almendras espumada y canela', 7500.00, 2500.00, false),
    ('p3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222', 'CAF-FRA-03', '7701001003', 'Frappé de Caramelo & Crema', 'Bebida helada a base de café con caramelo artesanal', 9800.00, 3200.00, false),
    ('p4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333', 'POS-CRO-04', '7701001004', 'Croissant de Almendra', 'Masa hojaldrada recién horneada con crema de almendras', 6000.00, 2000.00, false)
ON CONFLICT (id) DO NOTHING;

-- 5. Insertar Productos de Tienda de Belleza Milagros
INSERT INTO public.productos (id, bodega_id, categoria_id, sku, codigo_barras, nombre, descripcion, precio_venta, costo, requiere_lote)
VALUES
    ('pm111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'm1111111-1111-1111-1111-111111111111', 'MIL-CHA-01', '7702002001', 'Champú Bio-Reparador Milagros 500ml', 'Fórmula natural para crecimiento y fortalecimiento capilar', 45000.00, 21000.00, true),
    ('pm222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'm1111111-1111-1111-1111-111111111111', 'MIL-MAS-02', '7702002002', 'Mascarilla de Frutas Nutritiva 300g', 'Tratamiento intensivo con aceites de argán y aguacate', 38000.00, 17500.00, true),
    ('pm333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'm2222222-2222-2222-2222-222222222222', 'MIL-SER-03', '7702002003', 'Serum Facial Ácido Hialurónico 50ml', 'Hidratación profunda con vitamina C y antioxidantes', 52000.00, 24000.00, true)
ON CONFLICT (id) DO NOTHING;

-- 6. Insertar Stock e Inventario por Bodega
INSERT INTO public.inventario_bodega (bodega_id, producto_id, stock_actual, stock_minimo, lote, fecha_vencimiento)
VALUES
    -- Stock Cafetería
    ('11111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 100, 15, 'GENERAL', NULL),
    ('11111111-1111-1111-1111-111111111111', 'p2222222-2222-2222-2222-222222222222', 80, 10, 'GENERAL', NULL),
    ('11111111-1111-1111-1111-111111111111', 'p3333333-3333-3333-3333-333333333333', 60, 10, 'GENERAL', NULL),
    ('11111111-1111-1111-1111-111111111111', 'p4444444-4444-4444-4444-444444444444', 35, 5, 'GENERAL', NULL),
    -- Stock Tienda de Belleza Milagros (Con control de lote)
    ('22222222-2222-2222-2222-222222222222', 'pm111111-1111-1111-1111-111111111111', 45, 10, 'LOT-2026-08A', '2028-08-31'),
    ('22222222-2222-2222-2222-222222222222', 'pm222222-2222-2222-2222-222222222222', 30, 8, 'LOT-2026-08B', '2028-05-15'),
    ('22222222-2222-2222-2222-222222222222', 'pm333333-3333-3333-3333-333333333333', 25, 5, 'LOT-2026-09C', '2029-01-30')
ON CONFLICT (producto_id, lote) DO UPDATE SET stock_actual = EXCLUDED.stock_actual;
