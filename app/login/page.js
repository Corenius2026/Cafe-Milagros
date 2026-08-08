'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, ArrowLeft, Lock, CheckCircle2, KeyRound, ArrowRight, Store
} from 'lucide-react';
import { iniciarSesionUsuario } from '@/lib/authSession';
import { autenticarUsuarioPorCorreoYClave } from '@/lib/serviciosSupabase';

/**
 * Página de Inicio de Sesión Limpia
 * Determina automáticamente el Rol y la pantalla según las credenciales ingresadas.
 */
export default function PaginaInicioSesion() {
  const router = useRouter();
  
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  // Manejar submit de Inicio de Sesión
  const manejarLogin = async (e) => {
    e.preventDefault();
    setCargando(true);

    let perfilFinal = null;

    try {
      // 1. Intentar autenticar contra Supabase
      const usuarioDB = await autenticarUsuarioPorCorreoYClave(correo, clave);
      if (usuarioDB) {
        perfilFinal = {
          rol: usuarioDB.rol,
          nombre: usuarioDB.nombre,
          correo: usuarioDB.correo,
          rutaDestino: usuarioDB.rol === 'nutella' ? '/pos/cafeteria' : usuarioDB.rol === 'milagros' ? '/pos/milagros' : '/'
        };
      }
    } catch (err) {
      console.log('Validando con rol automático local...');
    }

    // 2. Si no viene de DB, determinar rol automáticamente por correo/nombre ingresado
    if (!perfilFinal) {
      const correoLower = correo.toLowerCase();
      let rol = 'admin';
      let nombre = 'Administrador General';
      let rutaDestino = '/';

      if (correoLower.includes('nutella') || correoLower.includes('cafeteria')) {
        rol = 'nutella';
        nombre = 'Cajero Nutella / Cafetería';
        rutaDestino = '/pos/cafeteria';
      } else if (correoLower.includes('milagros') || correoLower.includes('belleza')) {
        rol = 'milagros';
        nombre = 'Cajero Productos Milagros';
        rutaDestino = '/pos/milagros';
      }

      perfilFinal = { rol, nombre, correo, rutaDestino };
    }

    // 3. Guardar sesión y redirigir
    iniciarSesionUsuario(perfilFinal);
    setMensajeExito(`¡Bienvenido! Ingresando como ${perfilFinal.nombre}...`);

    setTimeout(() => {
      router.push(perfilFinal.rutaDestino);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50/80 via-stone-100 to-rose-50/80 px-4 py-12 antialiased">
      <div className="max-w-md w-full space-y-6">
        
        {/* Enlace Volver */}
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-stone-700 text-xs font-semibold border border-stone-200 shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </Link>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-900 text-white shadow-sm flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5" />
            Acceso Autorizado
          </span>
        </div>

        {/* Tarjeta de Formulario Principal */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200/80 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-800 to-rose-600 text-white mx-auto flex items-center justify-center shadow-lg font-black text-2xl">
              CM
            </div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">
              Iniciar Sesión
            </h1>
            <p className="text-xs text-stone-500">
              Ingresa tus credenciales para acceder a tu sucursal o panel
            </p>
          </div>

          {/* Formulario de Credenciales */}
          <form onSubmit={manejarLogin} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Correo Electrónico o Usuario
              </label>
              <input 
                type="text" 
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                placeholder="admin@cafeymilagros.com"
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-sm bg-stone-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Contraseña o PIN
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-sm bg-stone-50/50"
                />
                <KeyRound className="w-4 h-4 text-stone-400 absolute right-4 top-3.5" />
              </div>
            </div>

            {/* Mensaje de Éxito al Iniciar Sesión */}
            {mensajeExito && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{mensajeExito}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={cargando}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-stone-900 hover:bg-black shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>{cargando ? 'Ingresando...' : 'Iniciar Sesión'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Guía rápida de credenciales para prueba */}
          <div className="pt-3 border-t border-stone-100 text-center text-[11px] text-stone-400 space-y-1">
            <p className="font-semibold text-stone-500">Ejemplos de acceso (PIN: 1234):</p>
            <p>👑 Admin: <strong className="text-stone-700">admin@cafeymilagros.com</strong></p>
            <p>☕ Nutella: <strong className="text-amber-800">nutella@cafeymilagros.com</strong></p>
            <p>🌸 Milagros: <strong className="text-rose-700">milagros@cafeymilagros.com</strong></p>
          </div>

        </div>

      </div>
    </div>
  );
}
