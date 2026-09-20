import './globals.css';
import type { Metadata } from 'next';
import Navbar, { Footer } from '@/components/layout';
import BrandConsole from '@/components/brand-console';
import CartDrawer from '@/components/cart-drawer';
import { AuthProvider } from '@/lib/auth';
import { CartProvider } from '@/lib/cart';

export const metadata: Metadata = {
  title: 'Print Trek — Precision 3D Lab · Chennai · Worldwide',
  description:
    'Precision 3D lab building 3CM matte black shadow frames for anime walls. Chennai factory, ships worldwide.',
  authors: [{ name: 'Strucureo', url: 'https://strucureo.com' }],
  icons: { icon: '/logo.svg' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-concrete text-obsidian">
        <AuthProvider>
          <CartProvider>
            <BrandConsole />
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
            <CartDrawer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
