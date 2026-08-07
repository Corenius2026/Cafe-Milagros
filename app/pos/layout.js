'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Coffee, Sparkles, Package, Receipt, BarChart3, Home, LogOut, ShieldCheck, User
} from 'lucide-react';
import { obtenerSesionActiva, cerrarSesionUsuario } from '@/lib/authSession';

/**
 * Layout protegido para el panel POS y administración multisucursal con filtrado por Rol.
 */
export default function DisenoPanelPOS({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sesion, setSesion] = useState(null);

  useEffect(() => {
    const sesionActual = obtenerSesionActiva();
    setSesion(sesionActual);
  }, [pathname]);

  const manejarCerrarSesion = () => {
    cerrarSesionUsuario();
    router.push('/login');
  };

  const esAdmin = !sesion || sesion.rol === 'admin';
  const esNutella = sesion?.rol === 'nutella';
  const esMilagros = sesion?.rol === 'milagros';

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-stone-100 antialiased selection:bg-amber-200">
      
      {/* Barra de Navegación Lateral (Sidebar) */}
      <aside className="w-full md:w-64 bg-stone-900 text-stone-300 p-4 flex flex-col justify-between border-r border-stone-800 shrink-0">
        <div className="space-y-6">
          
          {/* Marca / Logotipo */}
          <div className="px-2 py-3 border-b border-stone-800 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg"><span className="text-amber-500">Café</span> <span className="text-white">&</span> <span className="text-rose-400">Milagros</span></h2>
              <p className="text-xs text-stone-400 font-medium flex items-center gap-1 mt-0.5">
                {esAdmin && <span className="px-2 py-0.5 rounded-full bg-stone-800 text-amber-400 font-semibold text-[10px] border border-amber-500/30">👑 Admin</span>}
                {esNutella && <span className="px-2 py-0.5 rounded-full bg-amber-900/60 text-amber-300 font-semibold text-[10px] border border-amber-500/30">☕ Caja Nutella</span>}
                {esMilagros && <span className="px-2 py-0.5 rounded-full bg-rose-900/60 text-rose-300 font-semibold text-[10px] border border-rose-500/30">🌸 Caja Milagros</span>}
              </p>
            </div>
            {esAdmin && (
              <Link href="/" title="Volver al inicio" className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors">
                <Home className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Menú de Navegación según Rol */}
          <nav className="space-y-1 text-sm font-medium">
            
            <div className="px-2 py-1.5 text-xs uppercase tracking-wider text-stone-500 font-semibold">
              Cajas Registradoras
            </div>
            
            {(esAdmin || esNutella) && (
              <Link 
                href="/pos/cafeteria" 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                  pathname === '/pos/cafeteria' 
                    ? 'bg-amber-950/80 text-amber-300 font-bold border border-amber-800/50' 
                    : 'hover:bg-amber-900/40 hover:text-amber-300'
                }`}
              >
                <Coffee className="w-4 h-4 text-amber-500" />
                <span>POS Cafetería (Nutella)</span>
              </Link>
            )}

            {(esAdmin || esMilagros) && (
              <Link 
                href="/pos/milagros" 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                  pathname === '/pos/milagros' 
                    ? 'bg-rose-950/80 text-rose-300 font-bold border border-rose-800/50' 
                    : 'hover:bg-rose-900/40 hover:text-rose-300'
                }`}
              >
                <Sparkles className="w-4 h-4 text-rose-400" />
                <span>POS Productos Milagros</span>
              </Link>
            )}

            {esAdmin && (
              <>
                <div className="pt-4 px-2 py-1.5 text-xs uppercase tracking-wider text-stone-500 font-semibold">
                  Gestión & Reportes
                </div>

                <Link 
                  href="/pos/inventario" 
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    pathname === '/pos/inventario' 
                      ? 'bg-stone-800 text-white font-bold' 
                      : 'hover:bg-stone-800 hover:text-white'
                  }`}
                >
                  <Package className="w-4 h-4 text-stone-400" />
                  <span>Inventario Bodegas</span>
                </Link>

                <Link 
                  href="/pos/ventas" 
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    pathname === '/pos/ventas' 
                      ? 'bg-stone-800 text-white font-bold' 
                      : 'hover:bg-stone-800 hover:text-white'
                  }`}
                >
                  <Receipt className="w-4 h-4 text-stone-400" />
                  <span>Historial de Ventas</span>
                </Link>

                <Link 
                  href="/pos/reportes" 
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    pathname === '/pos/reportes' 
                      ? 'bg-stone-800 text-white font-bold' 
                      : 'hover:bg-stone-800 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-stone-400" />
                  <span>Reportes & Cierre</span>
                </Link>
              </>
            )}

          </nav>
        </div>

        {/* Footer del usuario e Iniciar/Cerrar Sesión */}
        <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
          <div>
            <p className="font-bold text-stone-200">{sesion?.nombre || 'Administrador General'}</p>
            <p className="text-[11px] text-stone-500">{sesion?.correo || 'admin@cafeymilagros.com'}</p>
          </div>
          <button 
            onClick={manejarCerrarSesion}
            title="Cerrar Sesión" 
            className="p-2 rounded-xl bg-stone-800 hover:bg-rose-950 hover:text-rose-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </aside>

      {/* Área de Contenido Principal */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {children}
      </main>

    </div>
  );
}
