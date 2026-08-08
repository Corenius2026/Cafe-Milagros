'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  ShoppingCart, Package, Receipt, BarChart3, Home, LogOut, Store
} from 'lucide-react';
import { obtenerSesionActiva, cerrarSesionUsuario } from '@/lib/authSession';

/**
 * Layout protegido para el panel POS y administración del Minimarket.
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
  const esCajero = sesion?.rol === 'cajero';

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-100 antialiased selection:bg-emerald-200">
      
      {/* Barra de Navegación Lateral (Sidebar) */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 p-4 flex flex-col justify-between border-r border-slate-800 shrink-0">
        <div className="space-y-6">
          
          {/* Marca / Logotipo */}
          <div className="px-2 py-3 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="font-black text-lg text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-emerald-500" />
                <span>Minimarket POS</span>
              </h2>
              <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                {esAdmin && <span className="px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 font-semibold text-[10px] border border-emerald-500/30">👑 Admin</span>}
                {esCajero && <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-semibold text-[10px] border border-emerald-500/30">🛒 Caja Minimarket</span>}
              </p>
            </div>
            {esAdmin && (
              <Link href="/" title="Volver al inicio" className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                <Home className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Menú de Navegación */}
          <nav className="space-y-1 text-sm font-medium">
            
            <div className="px-2 py-1.5 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              Caja Registradora
            </div>
            
            <Link 
              href="/pos/minimarket" 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                pathname === '/pos/minimarket' || pathname === '/pos'
                  ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800/50' 
                  : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ShoppingCart className="w-4 h-4 text-emerald-500" />
              <span>POS Minimarket</span>
            </Link>

            {esAdmin && (
              <>
                <div className="pt-4 px-2 py-1.5 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  Gestión & Reportes
                </div>

                <Link 
                  href="/pos/inventario" 
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    pathname === '/pos/inventario' 
                      ? 'bg-slate-800 text-white font-bold' 
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Package className="w-4 h-4 text-slate-400" />
                  <span>Inventario Bodega</span>
                </Link>

                <Link 
                  href="/pos/ventas" 
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    pathname === '/pos/ventas' 
                      ? 'bg-slate-800 text-white font-bold' 
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Receipt className="w-4 h-4 text-slate-400" />
                  <span>Historial de Ventas</span>
                </Link>

                <Link 
                  href="/pos/reportes" 
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    pathname === '/pos/reportes' 
                      ? 'bg-slate-800 text-white font-bold' 
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-slate-400" />
                  <span>Reportes & Cierre</span>
                </Link>
              </>
            )}

          </nav>
        </div>

        {/* Footer del usuario e Iniciar/Cerrar Sesión */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            <p className="font-bold text-slate-200">{sesion?.nombre || 'Administrador General'}</p>
            <p className="text-[11px] text-slate-500">{sesion?.correo || 'admin@minimarket.com'}</p>
          </div>
          <button 
            onClick={manejarCerrarSesion}
            title="Cerrar Sesión" 
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-400 transition-colors"
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
