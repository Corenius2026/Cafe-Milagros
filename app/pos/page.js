'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirección automática de /pos a /pos/minimarket
 */
export default function PaginaPanelPOS() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/pos/minimarket');
  }, [router]);

  return (
    <div className="flex items-center justify-center p-12 text-center text-slate-500">
      <p className="text-xs font-semibold">Cargando POS Minimarket...</p>
    </div>
  );
}
