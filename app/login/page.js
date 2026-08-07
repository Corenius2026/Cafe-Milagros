'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, Coffee, Sparkles, ArrowLeft, Lock, UserCheck, 
  CheckCircle2, KeyRound, ArrowRight, Store
} from 'lucide-react';
import { PERFILES_PREDETERMINADOS, iniciarSesionUsuario } from '@/lib/authSession';

/**
 * Página de Inicio de Sesión Multi-rol
 * Soporta login de Administrador, Sucursal Nutella y Sucursal Milagros.
 */
export default function PaginaInicioSesion() {
  const router = useRouter();
  
  // Perfil seleccionado (predeterminado: admin)
  const [rolSeleccionado, setRolSeleccionado] = useState('admin');
  const [correo, setCorreo] = useState('admin@cafeymilagros.com');
  const [clave, setClave] = useState('1234');
  const [cargando, setCargando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  // Cambiar de perfil seleccionado
  const seleccionarPerfil = (perfil) => {
    setRolSeleccionado(perfil.rol);
    setCorreo(perfil.correo);
    setClave('1234');
  };

  // Manejar submit de Inicio de Sesión
  const manejarLogin = (e) => {
    e.preventDefault();
    setCargando(true);

    // Buscar perfil configurado
    const perfilActual = PERFILES_PREDETERMINADOS.find(p => p.rol === rolSeleccionado) || {
      rol: rolSeleccionado,
      nombre: rolSeleccionado === 'nutella' ? 'Cajero Nutella' : rolSeleccionado === 'milagros' ? 'Cajero Milagros' : 'Administrador',
      correo: correo,
      rutaDestino: rolSeleccionado === 'nutella' ? '/pos/cafeteria' : rolSeleccionado === 'milagros' ? '/pos/milagros' : '/'
    };

    // Guardar sesión en localStorage
    iniciarSesionUsuario(perfilActual);

    setMensajeExito(`¡Bienvenido! Redireccionando a ${perfilActual.nombre}...`);

    setTimeout(() => {
      router.push(perfilActual.rutaDestino);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50/80 via-stone-100 to-rose-50/80 px-4 py-12 antialiased">
      <div className="max-w-xl w-full space-y-6">
        
        {/* Enlace Volver */}
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-stone-700 text-xs font-semibold border border-stone-200 shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Inicio</span>
          </Link>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-900 text-white shadow-sm flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5" />
            Autenticación Multi-Sucursal
          </span>
        </div>

        {/* Tarjeta de Formulario Principal */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200/80 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-800 to-rose-600 text-white mx-auto flex items-center justify-center shadow-lg font-black text-2xl">
              CM
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Acceso a <span className="text-amber-800">Café</span> & <span className="text-rose-700">Milagros</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">
              Selecciona tu tipo de cuenta para ingresar directamente a tu pantalla asignada
            </p>
          </div>

          {/* Selector Rápido de Perfil / Rol */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
              1. Selecciona el Tipo de Usuario
            </label>
            <div className="grid grid-cols-3 gap-2">
              
              {/* Opción 1: Admin */}
              <button
                type="button"
                onClick={() => seleccionarPerfil(PERFILES_PREDETERMINADOS[0])}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  rolSeleccionado === 'admin'
                    ? 'border-stone-900 bg-stone-900 text-white shadow-md scale-[1.02]'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <ShieldCheck className={`w-5 h-5 mb-2 ${rolSeleccionado === 'admin' ? 'text-amber-400' : 'text-stone-700'}`} />
                <div>
                  <div className="font-bold text-xs">Administrador</div>
                  <div className="text-[10px] opacity-80">Acceso Total</div>
                </div>
              </button>

              {/* Opción 2: Nutella */}
              <button
                type="button"
                onClick={() => seleccionarPerfil(PERFILES_PREDETERMINADOS[1])}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  rolSeleccionado === 'nutella'
                    ? 'border-amber-800 bg-amber-800 text-white shadow-md scale-[1.02]'
                    : 'border-stone-200 bg-amber-50/50 hover:bg-amber-100/60 text-amber-900'
                }`}
              >
                <Coffee className={`w-5 h-5 mb-2 ${rolSeleccionado === 'nutella' ? 'text-amber-200' : 'text-amber-800'}`} />
                <div>
                  <div className="font-bold text-xs">POS Nutella</div>
                  <div className="text-[10px] opacity-80">Cafetería</div>
                </div>
              </button>

              {/* Opción 3: Milagros */}
              <button
                type="button"
                onClick={() => seleccionarPerfil(PERFILES_PREDETERMINADOS[2])}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  rolSeleccionado === 'milagros'
                    ? 'border-rose-700 bg-rose-700 text-white shadow-md scale-[1.02]'
                    : 'border-stone-200 bg-rose-50/50 hover:bg-rose-100/60 text-rose-900'
                }`}
              >
                <Sparkles className={`w-5 h-5 mb-2 ${rolSeleccionado === 'milagros' ? 'text-rose-200' : 'text-rose-700'}`} />
                <div>
                  <div className="font-bold text-xs">POS Milagros</div>
                  <div className="text-[10px] opacity-80">Tienda Belleza</div>
                </div>
              </button>

            </div>
          </div>

          {/* Formulario de Credenciales */}
          <form onSubmit={manejarLogin} className="space-y-4 pt-2 border-t border-stone-100">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Correo Autorizado
              </label>
              <input 
                type="email" 
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-sm bg-stone-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Contraseña / PIN
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  required
                  placeholder="••••"
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
              className={`w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                rolSeleccionado === 'nutella'
                  ? 'bg-amber-800 hover:bg-amber-900'
                  : rolSeleccionado === 'milagros'
                  ? 'bg-rose-700 hover:bg-rose-800'
                  : 'bg-stone-900 hover:bg-black'
              }`}
            >
              <span>{cargando ? 'Ingresando...' : `Iniciar Sesión (${rolSeleccionado === 'admin' ? 'Administrador' : rolSeleccionado === 'nutella' ? 'Ir a POS Nutella' : 'Ir a POS Milagros'})`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Pie informativo */}
          <div className="pt-2 text-center text-[11px] text-stone-400">
            PIN de prueba predeterminado: <strong className="text-stone-600">1234</strong>
          </div>

        </div>

      </div>
    </div>
  );
}
