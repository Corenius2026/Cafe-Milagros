import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock } from 'lucide-react';

/**
 * Página de inicio de sesión para administradores y cajeros.
 */
export default function PaginaInicioSesion() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl border border-stone-200 space-y-6">
        
        <div className="flex items-center justify-between">
          <Link href="/" className="p-2 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
            Acceso Administrador / POS
          </span>
        </div>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 mx-auto flex items-center justify-center mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900">Acceso al Sistema POS</h1>
          <p className="text-xs text-stone-500">Ingresa tus credenciales autorizadas</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Correo Electrónico
            </label>
            <input 
              type="email" 
              placeholder="cajero@cafeymilagros.com"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Contraseña
            </label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-600 text-sm"
            />
          </div>

          <button 
            type="button" 
            className="w-full py-3 rounded-xl bg-stone-900 hover:bg-black text-white font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Iniciar Sesión</span>
          </button>
        </form>

        <p className="text-xs text-center text-stone-400">
          Autenticación asegurada con Supabase Auth.
        </p>

      </div>
    </div>
  );
}
