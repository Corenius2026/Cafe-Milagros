import './globals.css';

export const metadata = {
  title: 'Café & Milagros | Micro-ERP y POS',
  description: 'Plataforma de gestión de inventario y punto de venta para Cafetería y Productos Milagros',
};

/**
 * Diseño principal (RootLayout) de la aplicación.
 */
export default function DisenoPrincipal({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col bg-stone-50 text-stone-900 antialiased">
        {children}
      </body>
    </html>
  );
}
