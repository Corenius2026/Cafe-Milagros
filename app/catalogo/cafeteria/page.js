'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Coffee, ArrowLeft, Search, CheckCircle2, ShoppingBag } from 'lucide-react';
import { obtenerBodegaPorTipo, obtenerCategoriasPorBodega, obtenerProductosEInventarioPorBodega } from '@/lib/serviciosSupabase';

// Respaldo de productos
const PRODUCTOS_CAFETERIA = [
  { id: 'p1', nombre: 'Café Nutella', descripcion: 'Café especial con crema de hazelnut y Nutella artesanal', precio_venta: 5500, categoria_id: 'c1' },
  { id: 'p2', nombre: 'Cappuccino de Almendras', descripcion: 'Espresso con leche de almendras espumada y canela', precio_venta: 7500, categoria_id: 'c1' },
  { id: 'p3', nombre: 'Frappé de Caramelo & Crema', descripcion: 'Bebida helada a base de café con caramelo artesanal', precio_venta: 9800, categoria_id: 'c2' },
  { id: 'p4', nombre: 'Croissant de Almendra', descripcion: 'Masa hojaldrada recién horneada con crema de almendras', precio_venta: 6000, categoria_id: 'c3' }
];

/**
 * Catálogo Público del Menú de Cafetería
 */
export default function PaginaCatalogoCafeteria() {
  const [productos, setProductos] = useState(PRODUCTOS_CAFETERIA);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSel, setCategoriaSel] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarCatalogo();
  }, []);

  const cargarCatalogo = async () => {
    setCargando(true);
    try {
      const bodega = await obtenerBodegaPorTipo('cafeteria');
      if (bodega) {
        const cats = await obtenerCategoriasPorBodega(bodega.id);
        setCategorias(cats);
        const prods = await obtenerProductosEInventarioPorBodega(bodega.id);
        if (prods.length > 0) setProductos(prods);
      }
    } catch (error) {
      console.error('Error al cargar catálogo de cafetería:', error);
    } finally {
      setCargando(false);
    }
  };

  const productosFiltrados = productos.filter(p => {
    const coincideCat = categoriaSel === 'todas' || p.categoria_id === categoriaSel;
    const coincideBusq = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCat && coincideBusq;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 border-amber-200">
        <div className="flex items-center gap-3">
          <Link href="/catalogo" className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2.5 text-amber-900">
            <Coffee className="w-7 h-7" />
            <div>
              <h1 className="text-2xl font-bold text-stone-900">Menú Cafetería</h1>
              <p className="text-xs text-stone-500">Cafés de especialidad y repostería recién hecha</p>
            </div>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <input 
            type="text" 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar en el menú..." 
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Selector de Categorías */}
      {categorias.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setCategoriaSel('todas')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              categoriaSel === 'todas' ? 'bg-amber-800 text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Todos
          </button>
          {categorias.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoriaSel(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                categoriaSel === cat.id ? 'bg-amber-800 text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      )}

      {/* Grid de Productos del Menú */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productosFiltrados.map(p => (
          <div key={p.id} className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-md hover:shadow-lg transition-all flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-100">
                {p.categorias?.nombre || 'Cafetería'}
              </span>
              <h3 className="font-bold text-stone-900 text-lg mt-2">{p.nombre}</h3>
              <p className="text-xs text-stone-500 mt-1 line-clamp-2">{p.descripcion}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-100">
              <span className="font-extrabold text-amber-900 text-xl">
                ${p.precio_venta.toLocaleString('es-CO')}
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Disponible
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
