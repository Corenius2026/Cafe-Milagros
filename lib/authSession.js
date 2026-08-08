/**
 * Módulo de gestión de sesiones locales y roles para la plataforma Minimarket POS & ERP
 * Roles soportados:
 *  - 'admin': Administrador General (Acceso total a Inicio, POS Minimarket, Inventario, Ventas y Reportes)
 *  - 'cajero': Cajero Minimarket (Acceso directo a la caja registradora del Minimarket)
 */

export const PERFILES_PREDETERMINADOS = [
  {
    rol: 'admin',
    nombre: 'Administrador General',
    correo: 'admin@minimarket.com',
    icono: 'ShieldCheck',
    color: 'emerald',
    rutaDestino: '/'
  },
  {
    rol: 'cajero',
    nombre: 'Cajero Minimarket',
    correo: 'cajero@minimarket.com',
    icono: 'ShoppingCart',
    color: 'blue',
    rutaDestino: '/pos/minimarket'
  }
];

const CLAVE_SESION_LOCAL = 'sesion_minimarket';

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
