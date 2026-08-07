/**
 * Módulo de gestión de sesiones locales y roles para Café & Milagros
 * Roles soportados:
 *  - 'admin': Administrador (acceso total a Inicio, POS Cafetería, POS Milagros, Inventario, Ventas, Reportes)
 *  - 'nutella': Cajero Cafetería (acceso directo y exclusivo al POS Cafetería)
 *  - 'milagros': Cajero Productos Milagros (acceso directo y exclusivo al POS Milagros)
 */

export const PERFILES_PREDETERMINADOS = [
  {
    rol: 'admin',
    nombre: 'Administrador General',
    correo: 'admin@cafeymilagros.com',
    icono: 'ShieldCheck',
    color: 'stone',
    rutaDestino: '/'
  },
  {
    rol: 'nutella',
    nombre: 'Cajero Nutella / Cafetería',
    correo: 'nutella@cafeymilagros.com',
    icono: 'Coffee',
    color: 'amber',
    rutaDestino: '/pos/cafeteria'
  },
  {
    rol: 'milagros',
    nombre: 'Cajero Productos Milagros',
    correo: 'milagros@cafeymilagros.com',
    icono: 'Sparkles',
    color: 'rose',
    rutaDestino: '/pos/milagros'
  }
];

const CLAVE_SESION_LOCAL = 'sesion_cafe_milagros';

/**
 * Iniciar sesión guardando el usuario en localStorage
 */
export function iniciarSesionUsuario(perfilUsuario) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CLAVE_SESION_LOCAL, JSON.stringify({
      ...perfilUsuario,
      fechaInicio: new Date().toISOString()
    }));
  }
}

/**
 * Obtener el usuario de la sesión activa
 */
export function obtenerSesionActiva() {
  if (typeof window !== 'undefined') {
    const sesionGuardada = localStorage.getItem(CLAVE_SESION_LOCAL);
    if (sesionGuardada) {
      try {
        return JSON.parse(sesionGuardada);
      } catch (e) {
        console.error('Error al parsear sesión local:', e);
      }
    }
  }
  return null;
}

/**
 * Cerrar sesión activa
 */
export function cerrarSesionUsuario() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CLAVE_SESION_LOCAL);
  }
}
