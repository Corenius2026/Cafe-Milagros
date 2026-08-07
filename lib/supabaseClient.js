import { createClient } from '@supabase/supabase-js';

// URL y Clave Anónima de Supabase tomadas de las variables de entorno locales
const urlSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const claveAnonimaSupabase = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Instancia global del cliente de Supabase para interactuar con la base de datos PostgreSQL y la autenticación.
 */
export const clienteSupabase = createClient(urlSupabase, claveAnonimaSupabase);

/**
 * Función de utilidad para comprobar si las credenciales de Supabase han sido configuradas en el entorno local.
 * @returns {boolean} Verdadero si ambas variables de entorno están presentes.
 */
export function estaConfiguradoSupabase() {
  return (
    Boolean(urlSupabase) &&
    urlSupabase !== 'https://tu-proyecto-id.supabase.co' &&
    Boolean(claveAnonimaSupabase) &&
    claveAnonimaSupabase !== 'tu-clave-anonima-aqui'
  );
}
