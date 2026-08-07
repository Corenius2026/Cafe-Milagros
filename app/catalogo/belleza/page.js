'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Search, Tag } from 'lucide-react';
import { obtenerBodegaPorTipo, obtenerCategoriasPorBodega, obtenerProductosEInventarioPorBodega } from '@/lib/serviciosSupabase';

// Respaldo de productos
const PRODUCTOS_MILAGROS = [
  { id: 'pm1', nombre: 'Champú Bio-Reparador Milagros 500ml', descripcion: 'Fórmula natural para crecimiento y fortalecimiento capilar', precio_venta: 45000, categoria_id: 'm1' },
  { id: 'pm2', nombre: 'Mascarilla de Frutas Nutritiva 300g', descripcion: 'Tratamiento intensivo con aceites de argán y aguacate', precio_venta: 38000, categoria_id: 'm1' },
  { id: 'pm3', nombre: 'Serum Facial Ácido Hialurónico 50ml', descripcion: 'Hidratación profunda con vitamina C y antioxidantes', precio_venta: 52000, categoria_id: 'm2' }
];

/**
 * Catálogo Público de Productos de Belleza Milagros
 */
export default function PaginaCatalogoBelleza() {
  const [productos, setProductos] = useState(PRODUCTOS_MILAGROS);
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
      const bodega = await obtenerBodegaPorTipo('milagros');
      if (bodega) {
        const cats = await obtenerCategoriasPorBodega(bodega.id);
        setCategorias(cats);
        const prods = await obtenerProductosEInventarioPorBodega(bodega.id);
        if (prods.length > 0) setProductos(prods);
      }
    } catch (error) {
      console.error('Error al cargar catálogo de milagros:', error);
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
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 border-rose-200">
        <div className="flex items-center gap-3">
          <Link href="/catalogo" className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2.5 text-rose-800">
            <Sparkles className="w-7 h-7" />
            <div>
              <h1 className="text-2xl font-bold text-stone-900">Productos de Belleza Milagros</h1>
              <p className="text-xs text-stone-500">Cuidado capilar, facial y cosmética natural</p>
            </div>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <input 
            type="text" 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por tratamiento..." 
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
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
              categoriaSel === 'todas' ? 'bg-rose-700 text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Todas las Líneas
          </button>
          {categorias.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoriaSel(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                categoriaSel === cat.id ? 'bg-rose-700 text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      )}

      {/* Grid de Productos de Belleza */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productosFiltrados.map(p => (
          <div key={p.id} className="bg-white rounded-2xl p-5 border border-rose-200/80 shadow-md hover:shadow-lg transition-all flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-100">
                {p.categorias?.nombre || 'Línea Milagros'}
              </span>
              <h3 className="font-bold text-stone-900 text-lg mt-2">{p.nombre}</h3>
              <p className="text-xs text-stone-500 mt-1 line-clamp-2">{p.descripcion}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-100">
              <span className="font-extrabold text-rose-900 text-xl">
                ${p.precio_venta.toLocaleString('es-CO')}
              </span>
              <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                Catálogo Disponible
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
