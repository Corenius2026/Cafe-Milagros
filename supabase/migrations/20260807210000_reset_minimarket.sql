-- ==============================================================================
-- MIGRACIÓN DE REINICIO TOTAL Y PURGA DE DATOS OBSOLETOS (FIX CONSTRAINTS)
-- ==============================================================================

-- 1. DESACTIVAR RESTRICCIÓN DE CHECK EN BODEGAS Y USUARIOS PARA INCLUIR 'minimarket' Y 'cajero'
ALTER TABLE public.bodegas DROP CONSTRAINT IF EXISTS bodegas_tipo_check;
ALTER TABLE public.bodegas ADD CONSTRAINT bodegas_tipo_check CHECK (tipo IN ('minimarket', 'cafeteria', 'milagros'));

ALTER TABLE public.usuarios DROP CONSTRAINT IF EXISTS usuarios_rol_check;
ALTER TABLE public.usuarios ADD CONSTRAINT usuarios_rol_check CHECK (rol IN ('admin', 'cajero', 'nutella', 'milagros'));

-- 2. PURGA Y RESTRUCTURACIÓN DE TABLAS
TRUNCATE TABLE public.detalles_venta CASCADE;
TRUNCATE TABLE public.ventas CASCADE;
TRUNCATE TABLE public.inventario_bodega CASCADE;
TRUNCATE TABLE public.productos CASCADE;
TRUNCATE TABLE public.categorias CASCADE;
TRUNCATE TABLE public.bodegas CASCADE;
TRUNCATE TABLE public.usuarios CASCADE;

-- 3. BODEGA ÚNICA MINIMARKET
INSERT INTO public.bodegas (id, codigo, nombre, tipo, descripcion, activa)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'BOD-MINI-01', 'Minimarket Principal', 'minimarket', 'Punto de Venta y Bodega Principal de Minimarket', true);

-- 4. CATEGORÍAS DE MINIMARKET
INSERT INTO public.categorias (id, bodega_id, nombre, descripcion, icono)
VALUES
    ('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Lácteos & Huevos', 'Leche, yogures, quesos y huevos frescos', 'Milk'),
    ('c2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Bebidas & Jugos', 'Gaseosas, jugos, agua mineral y cervezas', 'Coffee'),
    ('c3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Abarrotes & Despensa', 'Arroz, aceite, azúcar, café, enlatados y granos', 'Package'),
    ('c4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Snacks & Papas', 'Papas fritas, galletas, chocolates y pasabocas', 'Smile'),
    ('c5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'Panadería', 'Pan tajado, ponqués y dulcería', 'Store'),
    ('c6666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'Aseo & Hogar', 'Detergentes, jabones y artículos de aseo', 'Zap');

-- 5. PRODUCTOS DE MINIMARKET
INSERT INTO public.productos (id, bodega_id, categoria_id, sku, codigo_barras, nombre, descripcion, precio_venta, costo)
VALUES
    ('p1010101-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'MINI-LAC-01', '7702001001', 'Leche Entera Alquería 1L', 'Bolsa de leche entera 1000ml pasteurizada', 4300.00, 3200.00),
    ('p1010102-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'MINI-HUE-02', '7702001002', 'Cubeta de Huevos AA x30', 'Huevos frescos categoría AA paquete x30 unidades', 18500.00, 14800.00),
    ('p2020201-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222', 'MINI-BEB-01', '7702002001', 'Gaseosa Coca-Cola 1.5L', 'Botella PET no retornable 1500ml', 5800.00, 4200.00),
    ('p2020202-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222', 'MINI-AGU-02', '7702002002', 'Agua Mineral Manantial 600ml', 'Agua pura sin gas en botella personal', 2500.00, 1500.00),
    ('p3030301-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333', 'MINI-ARR-01', '7702003001', 'Arroz Diana Roa 1kg', 'Arroz blanco entero seleccionado 1000g', 4600.00, 3400.00),
    ('p3030302-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'c3333333-3333-3333-3333-333333333333', 'MINI-ACE-02', '7702003002', 'Aceite de Girasol Gourmet 900ml', 'Aceite vegetal puro de girasol para cocinar', 14500.00, 11200.00),
    ('p4040401-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'c4444444-4444-4444-4444-444444444444', 'MINI-PAP-01', '7702004001', 'Papas Margarita Limón 110g', 'Papas fritas sabor a limón paquete mediano', 3800.00, 2600.00),
    ('p5050501-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'c5555555-5555-5555-5555-555555555555', 'MINI-PAN-01', '7702005001', 'Pan Tajado Bimbo Artesano', 'Pan blanco molde blando estilo artesanal 500g', 7500.00, 5400.00),
    ('p6060601-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'c6666666-6666-6666-6666-666666666666', 'MINI-JAB-01', '7702006001', 'Jabón Rey Multiusos 300g', 'Barra tradicional de jabón azul para lavar', 2900.00, 1900.00);

-- 6. INVENTARIO PARA LOS PRODUCTOS
INSERT INTO public.inventario_bodega (bodega_id, producto_id, stock_actual, stock_minimo, lote)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'p1010101-1111-1111-1111-111111111111', 120, 20, 'GENERAL'),
    ('11111111-1111-1111-1111-111111111111', 'p1010102-1111-1111-1111-111111111111', 45, 10, 'GENERAL'),
    ('11111111-1111-1111-1111-111111111111', 'p2020201-2222-2222-2222-222222222222', 90, 15, 'GENERAL'),
    ('11111111-1111-1111-1111-111111111111', 'p2020202-2222-2222-2222-222222222222', 150, 25, 'GENERAL'),
    ('11111111-1111-1111-1111-111111111111', 'p3030301-3333-3333-3333-333333333333', 200, 30, 'GENERAL'),
    ('11111111-1111-1111-1111-111111111111', 'p3030302-3333-3333-3333-333333333333', 60, 10, 'GENERAL'),
    ('11111111-1111-1111-1111-111111111111', 'p4040401-4444-4444-4444-444444444444', 8, 15, 'GENERAL'),
    ('11111111-1111-1111-1111-111111111111', 'p5050501-5555-5555-5555-555555555555', 40, 10, 'GENERAL'),
    ('11111111-1111-1111-1111-111111111111', 'p6060601-6666-6666-6666-666666666666', 100, 15, 'GENERAL');

-- 7. USUARIOS
INSERT INTO public.usuarios (id, correo, nombre, rol, clave_pin)
VALUES
    ('99999999-9999-9999-9999-999999999999', 'admin@minimarket.com', 'Administrador General', 'admin', '1234'),
    ('88888888-8888-8888-8888-888888888888', 'cajero@minimarket.com', 'Cajero Minimarket', 'cajero', '1234');
