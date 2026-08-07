import Link from 'next/link';
import { Coffee, Sparkles, Package, Receipt, BarChart3, Home, LogOut } from 'lucide-react';

/**
 * Layout protegido para el panel POS y administración multisucursal.
 */
export default function DisenoPanelPOS({ children }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-stone-100">
      
      {/* Barra de Navegación Lateral (Sidebar) */}
      <aside className="w-full md:w-64 bg-stone-900 text-stone-300 p-4 flex flex-col justify-between border-r border-stone-800">
        <div className="space-y-6">
          
          {/* Marca / Logotipo */}
          <div className="px-2 py-3 border-b border-stone-800 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-white text-lg">Café & Milagros</h2>
              <p className="text-xs text-amber-500 font-medium">Panel POS & Micro-ERP</p>
            </div>
            <Link href="/" title="Volver al inicio" className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors">
              <Home className="w-4 h-4" />
            </Link>
          </div>

          {/* Menú de Navegación */}
          <nav className="space-y-1 text-sm font-medium">
            
            <div className="px-2 py-1.5 text-xs uppercase tracking-wider text-stone-500 font-semibold">
              Cajas Registradoras
            </div>
            
            <Link href="/pos/cafeteria" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-900/40 hover:text-amber-300 transition-colors">
              <Coffee className="w-4 h-4 text-amber-500" />
              <span>POS Cafetería</span>
            </Link>

            <Link href="/pos/milagros" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-900/40 hover:text-rose-300 transition-colors">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span>POS Productos Milagros</span>
            </Link>

            <div className="pt-4 px-2 py-1.5 text-xs uppercase tracking-wider text-stone-500 font-semibold">
              Gestión & Reportes
            </div>

            <Link href="/pos/inventario" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-800 hover:text-white transition-colors">
              <Package className="w-4 h-4 text-stone-400" />
              <span>Inventario Bodegas</span>
            </Link>

            <Link href="/pos/ventas" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-800 hover:text-white transition-colors">
              <Receipt className="w-4 h-4 text-stone-400" />
              <span>Historial de Ventas</span>
            </Link>

            <Link href="/pos/reportes" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-800 hover:text-white transition-colors">
              <BarChart3 className="w-4 h-4 text-stone-400" />
              <span>Reportes & Cierre</span>
            </Link>

          </nav>
        </div>

        {/* Footer del usuario */}
        <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
          <div>
            <p className="font-semibold text-stone-200">Cajero Activo</p>
            <p>sucursal@cafeymilagros.com</p>
          </div>
          <Link href="/login" className="p-2 rounded-lg hover:bg-stone-800 hover:text-rose-400 transition-colors">
            <LogOut className="w-4 h-4" />
          </Link>
        </div>

      </aside>

      {/* Área de Contenido Principal */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {children}
      </main>

    </div>
  );
}
