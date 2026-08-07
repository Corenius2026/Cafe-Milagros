import Link from 'next/link';
import { 
  Coffee, Sparkles, Package, Receipt, BarChart3, ShieldCheck, ArrowRight, Store, 
  CheckCircle2, Clock, Zap, HeartHandshake, Layers
} from 'lucide-react';

/**
 * Página de Inicio Principal de Café & Milagros
 * Diseño personalizado con la identidad visual de la marca (Café de especialidad & Belleza Milagros).
 */
export default function PaginaInicio() {
  return (
    <main className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-amber-50/80 via-stone-50 to-rose-50/80 antialiased selection:bg-amber-200">
      
      {/* Barra de Encabezado Superior */}
      <header className="w-full border-b border-stone-200/60 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-800 to-rose-600 flex items-center justify-center shadow-md text-white font-black text-xl">
              CM
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                <span className="text-amber-800 font-extrabold">Café</span> <span className="text-stone-900 font-black">&</span> <span className="text-rose-700 font-extrabold">Milagros</span>
              </h1>
              <p className="text-[11px] text-stone-500 font-medium">Sistema Micro-ERP & POS Multisucursal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Supabase Conectado</span>
            </div>
            <Link 
              href="/pos/cafeteria" 
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-all shadow-sm hover:shadow"
            >
              Ir a POS
            </Link>
          </div>
        </div>
      </header>

      {/* Cuerpo Principal */}
      <section className="max-w-6xl mx-auto px-4 py-10 w-full space-y-12 flex-1 flex flex-col justify-center">
        
        {/* Banner Hero Principal */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-100 via-stone-100 to-rose-100 text-stone-800 text-xs font-semibold border border-stone-200/80 shadow-sm">
            <Store className="w-4 h-4 text-amber-700" />
            <span>Gestión Integral Multisucursal en la Nube</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-stone-900 leading-tight">
            Bienvenido a <br className="sm:hidden" />
            <span className="text-amber-800">Café</span> <span className="text-stone-900">&</span> <span className="text-rose-700">Milagros</span>
          </h2>

          <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Plataforma unificada para la administración de caja rápida en <strong>Cafetería</strong> y el control especializado de inventario y lotes en la <strong>Tienda de Belleza Milagros</strong>.
          </p>
        </div>

        {/* Módulos Principales de Sucursal (Cajas POS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Tarjeta Sucursal 1: Cafetería */}
          <div className="relative group bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-amber-200/80 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-800 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Coffee className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
                  Caja Rápida POS
                </span>
              </div>

              <h3 className="text-2xl font-bold text-stone-900 mb-2">Sucursal Cafetería</h3>
              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                Cobro ágil para menú de cafés de especialidad (incluyendo nuestro reconocido <strong>Café Nutella</strong>), bebidas frías, frappés y repostería artesanal.
              </p>

              <div className="space-y-2 mb-8">
                <div className="flex items-center gap-2 text-xs font-medium text-amber-900/80">
                  <CheckCircle2 className="w-4 h-4 text-amber-700" />
                  <span>Facturación y emisión inmediata de recibos</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-amber-900/80">
                  <CheckCircle2 className="w-4 h-4 text-amber-700" />
                  <span>Descuento en tiempo real de insumos de barra</span>
                </div>
              </div>
            </div>

            <Link 
              href="/pos/cafeteria"
              className="w-full py-3.5 px-5 rounded-2xl bg-amber-800 hover:bg-amber-900 text-white font-semibold flex items-center justify-between text-sm transition-all shadow-md group-hover:shadow-lg"
            >
              <span>Abrir POS Cafetería</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Tarjeta Sucursal 2: Tienda de Belleza Milagros */}
          <div className="relative group bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-rose-200/80 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all"></div>
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-rose-700 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Sparkles className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-bold uppercase tracking-wider">
                  Control de Lotes & Belleza
                </span>
              </div>

              <h3 className="text-2xl font-bold text-stone-900 mb-2">Tienda de Belleza / Milagros</h3>
              <p className="text-stone-600 text-sm leading-relaxed mb-6">
                Venta por catálogo de cosmética, tratamientos capilares, cuidado facial y kits con control detallado de números de lote y vencimientos.
              </p>

              <div className="space-y-2 mb-8">
                <div className="flex items-center gap-2 text-xs font-medium text-rose-900/80">
                  <CheckCircle2 className="w-4 h-4 text-rose-600" />
                  <span>Seguimiento de lotes y fechas de vencimiento</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-rose-900/80">
                  <CheckCircle2 className="w-4 h-4 text-rose-600" />
                  <span>Filtro por líneas capilares y faciales</span>
                </div>
              </div>
            </div>

            <Link 
              href="/pos/milagros"
              className="w-full py-3.5 px-5 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white font-semibold flex items-center justify-between text-sm transition-all shadow-md group-hover:shadow-lg"
            >
              <span>Abrir POS Productos Milagros</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>

        {/* Sección de Módulos Operativos (Inventario, Ventas, Reportes) */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h4 className="text-lg font-bold text-stone-900">Módulos Administrativos & Operaciones</h4>
              <p className="text-xs text-stone-500">Gestión unificada multisucursal en tiempo real</p>
            </div>
            <div className="p-2 rounded-xl bg-stone-100 text-stone-700">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <Link 
              href="/pos/inventario"
              className="p-4 rounded-2xl bg-stone-50 hover:bg-amber-50/60 border border-stone-200/60 hover:border-amber-200 transition-all flex items-center gap-4 group"
            >
              <div className="p-3 rounded-xl bg-amber-100 text-amber-800 group-hover:scale-105 transition-transform">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-bold text-stone-900 text-sm">Inventario de Bodegas</h5>
                <p className="text-xs text-stone-500">Control de stock y alertas</p>
              </div>
            </Link>

            <Link 
              href="/pos/ventas"
              className="p-4 rounded-2xl bg-stone-50 hover:bg-rose-50/60 border border-stone-200/60 hover:border-rose-200 transition-all flex items-center gap-4 group"
            >
              <div className="p-3 rounded-xl bg-rose-100 text-rose-800 group-hover:scale-105 transition-transform">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-bold text-stone-900 text-sm">Historial de Ventas</h5>
                <p className="text-xs text-stone-500">Facturación y recibos</p>
              </div>
            </Link>

            <Link 
              href="/pos/reportes"
              className="p-4 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200/60 hover:border-stone-300 transition-all flex items-center gap-4 group"
            >
              <div className="p-3 rounded-xl bg-stone-200 text-stone-800 group-hover:scale-105 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-bold text-stone-900 text-sm">Reportes & Cierre</h5>
                <p className="text-xs text-stone-500">Arqueo diario y métricas</p>
              </div>
            </Link>

          </div>
        </div>

      </section>

      {/* Pie de Página */}
      <footer className="w-full border-t border-stone-200/60 bg-white/50 backdrop-blur-sm py-6">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-800">Café</span>
            <span className="font-black text-stone-900">&</span>
            <span className="font-bold text-rose-700">Milagros</span>
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
