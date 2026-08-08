-- ==============================================================================
-- MIGRACIÓN PARA CREAR LA TABLA DE USUARIOS Y ROLES MINIMARKET
-- ==============================================================================

-- 1. CREAR TABLA DE USUARIOS
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    correo VARCHAR(150) UNIQUE NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    rol VARCHAR(30) CHECK (rol IN ('admin', 'cajero', 'nutella', 'milagros')) NOT NULL DEFAULT 'admin',
    clave_pin VARCHAR(50) DEFAULT '1234',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. HABILITAR SEGURIDAD RLS
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICA DE LECTURA PÚBLICA
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Permitir lectura publica de usuarios') THEN
        CREATE POLICY "Permitir lectura publica de usuarios" ON public.usuarios FOR SELECT USING (true);
    END IF;
END $$;

-- 4. INSERTAR USUARIOS DE PRUEBA / ADMIN MINIMARKET
INSERT INTO public.usuarios (id, correo, nombre, rol, clave_pin)
VALUES
    ('99999999-9999-9999-9999-999999999999', 'admin@minimarket.com', 'Administrador General', 'admin', '1234'),
    ('88888888-8888-8888-8888-888888888888', 'cajero@minimarket.com', 'Cajero Minimarket', 'cajero', '1234')
ON CONFLICT (id) DO NOTHING;
