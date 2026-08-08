'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShoppingCart, Package, Receipt, BarChart3, ShieldCheck, ArrowRight, Store, 
  CheckCircle2, Zap, Layers, LogOut, Tag, Barcode
} from 'lucide-react';
import { obtenerSesionActiva, cerrarSesionUsuario } from '@/lib/authSession';

/**
 * Página de Inicio Principal para el Minimarket
 * Protegida con guardián de autenticación: si no hay sesión, redirecciona a /login.
 * Si es usuario Cajero -> va directo a /pos/minimarket
 * Si es Admin -> Muestra el panel completo de administración del Minimarket.
 */
export default function PaginaInicio() {
  const router = useRouter();
  const [sesion, setSesion] = useState(null);
  const [comprobandoSesion, setComprobandoSesion] = useState(true);

  useEffect(() => {
    const sesionActual = obtenerSesionActiva();

    if (!sesionActual) {
      // Redireccionar al login si no hay sesión iniciada
      router.push('/login');
    } else if (sesionActual.rol === 'cajero') {
      // Redireccionar directo a la caja del Minimarket
      router.push('/pos/minimarket');
    } else {
      // Rol Admin: Muestra el panel completo
      setSesion(sesionActual);
      setComprobandoSesion(false);
    }
  }, [router]);

  const manejarCerrarSesion = () => {
    cerrarSesionUsuario();
    router.push('/login');
  };

  if (comprobandoSesion) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 antialiased">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-slate-700 font-bold">Verificando acceso a Minimarket...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-emerald-50/70 via-slate-50 to-blue-50/70 antialiased selection:bg-emerald-200">
      
      {/* Barra de Encabezado Superior */}
      <header className="w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-700 flex items-center justify-center shadow-md text-white font-black text-xl">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Minimarket</span> <span className="text-emerald-600 font-extrabold">POS</span>
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">Panel Administrador de Tienda</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Supabase DB Conectado</span>
            </div>

            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-slate-900">{sesion?.nombre || 'Administrador'}</p>
                <p className="text-[10px] text-emerald-700 font-semibold uppercase">Acceso Total</p>
              </div>
              <button
                onClick={manejarCerrarSesion}
                title="Cerrar Sesión"
                className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 transition-colors flex items-center gap-1 text-xs font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Cuerpo Principal */}
      <section className="max-w-5xl mx-auto px-4 py-10 w-full space-y-10 flex-1 flex flex-col justify-center">
        
        {/* Banner Hero Principal */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-100 via-slate-100 to-blue-100 text-slate-800 text-xs font-semibold border border-slate-200/80 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Sistema Integral de Gestión de Minimarket</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Panel de Control <br />
            <span className="text-emerald-600">Tienda Minimarket</span>
          </h2>

          <p className="text-base text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Control de caja registradora, facturación con lector de código de barras, seguimiento de stock e historial de ventas en tiempo real.
          </p>
        </div>

        {/* Tarjeta Principal de Acceso a Caja POS */}
        <div className="relative group bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-emerald-200/80 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden max-w-2xl mx-auto w-full">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform shrink-0">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider inline-block mb-1">
                  Caja Principal POS
                </span>
                <h3 className="text-2xl font-black text-slate-900">Punto de Venta Minimarket</h3>
                <p className="text-slate-500 text-xs mt-1">
                  Cobro ágil, lector de código de barras y emisión inmediata de recibos
                </p>
              </div>
            </div>

            <Link 
              href="/pos/minimarket"
              className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center justify-center gap-2 text-sm transition-all shadow-md group-hover:shadow-lg whitespace-nowrap"
            >
              <span>Abrir POS Minimarket</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Sección de Módulos Operativos (Inventario, Ventas, Reportes) */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h4 className="text-lg font-bold text-slate-900">Gestión de Inventario & Reportes</h4>
              <p className="text-xs text-slate-500">Módulos administrativos en tiempo real</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <Link 
              href="/pos/inventario"
              className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/60 hover:border-emerald-200 transition-all flex items-center gap-4 group"
            >
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 group-hover:scale-105 transition-transform">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-sm">Inventario de Bodega</h5>
                <p className="text-xs text-slate-500">Control de stock y repuestos</p>
              </div>
            </Link>

            <Link 
              href="/pos/ventas"
              className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/60 hover:border-blue-200 transition-all flex items-center gap-4 group"
            >
              <div className="p-3 rounded-xl bg-blue-100 text-blue-800 group-hover:scale-105 transition-transform">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-sm">Historial de Ventas</h5>
                <p className="text-xs text-slate-500">Facturas y recibos emitidos</p>
              </div>
            </Link>

            <Link 
              href="/pos/reportes"
              className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 hover:border-slate-300 transition-all flex items-center gap-4 group"
            >
              <div className="p-3 rounded-xl bg-slate-200 text-slate-800 group-hover:scale-105 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-sm">Reportes & Cierre</h5>
                <p className="text-xs text-slate-500">Arqueo diario e ingresos</p>
              </div>
            </Link>

          </div>
        </div>

      </section>

      {/* Pie de Página */}
      <footer className="w-full border-t border-slate-200/60 bg-white/50 backdrop-blur-sm py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-black text-slate-900">Minimarket POS</span>
            <span>© 2026. Todos los derechos reservados.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <Zap className="w-3.5 h-3.5" />
              Next.js 15 & Supabase DB
            </span>
          </div>
        </div>
      </footer>

    </main>
  );
}
