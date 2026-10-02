import './globals.css';
import type { Metadata } from 'next';
import Navbar, { Footer } from '@/components/layout';
import BrandConsole from '@/components/brand-console';
import CartDrawer from '@/components/cart-drawer';
import { AuthProvider } from '@/lib/auth';
import { CartProvider } from '@/lib/cart';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.printtrek.store'),
  title: 'Print Trek — Precision 3D Lab · Chennai · Worldwide',
  description:
    'Precision 3D lab in Chennai building 3CM matte black shadow frames for anime walls. Hand-finished, gallery matte, ships worldwide tracked.',
  authors: [{ name: 'Strucureo', url: 'https://strucureo.com' }],
  icons: { icon: '/logo.png' },
  alternates: { canonical: '/' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.printtrek.store/#organization',
      name: 'Print Trek',
      url: 'https://www.printtrek.store/',
      logo: 'https://www.printtrek.store/logo.png',
      email: 'hello@printtrek.store',
      sameAs: ['https://instagram.com/print_.trek'],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.printtrek.store/#website',
      name: 'Print Trek',
      url: 'https://www.printtrek.store/',
      publisher: { '@id': 'https://www.printtrek.store/#organization' },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-concrete text-obsidian">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-obsidian focus:text-concrete focus:px-4 focus:py-2 focus:text-xs focus:uppercase focus:tracking-widest"
        >
          Skip to content
        </a>
        <AuthProvider>
          <CartProvider>
            <BrandConsole />
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main id="main-content" className="flex-grow">{children}</main>
              <Footer />
            </div>
            <CartDrawer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
