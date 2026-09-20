'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { navLinks } from '@/lib/data';
import { useAuth } from '@/lib/auth';
import { useCart } from '@/lib/cart';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { count, setOpen } = useCart();
  const accountHref = user ? '/profile' : '/login';
  const accountLabel = user
    ? (user.displayName?.split(' ')[0] || 'Account')
    : 'Sign In';

  return (
    <>
      <div className="bg-obsidian text-concrete text-[10px] uppercase font-medium tracking-widest py-1.5 text-center px-4">
        Chennai Lab — Worldwide Shipping · Tracked
      </div>

      <nav className="flex items-center justify-between px-6 py-4 border-b border-obsidian/10 sticky top-0 bg-concrete z-50">
        <div className="flex-1 flex items-center gap-4">
          <Link
            href="/"
            className="hover:opacity-80 transition-opacity flex items-center"
            aria-label="Print Trek home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Print Trek" className="h-8 md:h-9 w-auto" />
          </Link>
        </div>

        <div className="hidden md:flex flex-1 justify-center gap-8 text-xs font-medium uppercase tracking-wider">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-brass ${pathname === link.href ? 'text-brass' : 'text-concrete-muted'
                }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex-1 flex justify-end gap-2 md:gap-4 items-center">
          <Link
            href={accountHref}
            className={`hidden md:flex border rounded-full px-4 py-1.5 items-center gap-2 text-[10px] font-medium uppercase tracking-wider transition-colors ${pathname === '/profile' || pathname === '/login'
              ? 'border-brass text-brass'
              : 'border-obsidian/20 text-concrete-muted hover:border-brass hover:text-brass'
              }`}
          >
            {accountLabel}
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="border border-obsidian/20 rounded-full px-3 md:px-4 py-1.5 flex items-center gap-2 text-[10px] md:text-xs font-medium uppercase tracking-wider hover:border-brass hover:text-brass transition-colors"
          >
            Cart <ShoppingBag size={14} />
            <span className="bg-obsidian text-concrete rounded-full min-w-4 h-4 px-1 flex items-center justify-center text-[10px] tabular-nums">
              {count}
            </span>
          </button>

          <button
            className="md:hidden p-1.5 border border-obsidian/20 rounded-full"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-concrete z-40 px-6 py-6 flex flex-col gap-6 text-xl font-serif-display font-bold tracking-tight border-b border-obsidian/10 overflow-hidden"
          >
            <Link href="/" className="text-left border-b border-obsidian/10 pb-4" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-left border-b border-obsidian/10 pb-4 text-concrete-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href={accountHref} className="text-left text-concrete-muted" onClick={() => setMobileMenuOpen(false)}>
              {accountLabel}
            </Link>
            <Link href="/balance" className="text-left text-concrete-muted" onClick={() => setMobileMenuOpen(false)}>
              Balance
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-obsidian/10 px-6 pt-16 pb-8 mt-16 bg-concrete">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-footer.png" alt="Print Trek — Precision 3D Lab" className="h-24 w-auto mb-6" />
            <p className="text-xs uppercase tracking-widest leading-loose text-concrete-muted">
              Print Trek. A precision 3D lab in Chennai building shadow frames
              for the world. Built to cast shadows, not just hang.
            </p>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-medium text-xs uppercase mb-4 text-brass tracking-wider">
                Explore
              </h4>
              <ul className="space-y-2 text-xs text-concrete-muted">
                <li><Link href="/shop" className="hover:text-brass transition-colors">Shop All</Link></li>
                <li><Link href="/journal" className="hover:text-brass transition-colors">Journal</Link></li>
                <li><Link href="/about" className="hover:text-brass transition-colors">About</Link></li>
                <li><Link href="/faq" className="hover:text-brass transition-colors">FAQ</Link></li>
                <li><Link href="/admin" className="hover:text-brass transition-colors">Admin</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-xs uppercase mb-4 text-brass tracking-wider">
                Connect
              </h4>
              <ul className="space-y-2 text-xs text-concrete-muted">
                <li><a href="https://instagram.com/print_.trek" className="hover:text-brass transition-colors">@print_.trek</a></li>
                <li><a href="mailto:hello@printtrek.store" className="hover:text-brass transition-colors">hello@printtrek.store</a></li>
                <li><a href="https://printtrek.store" className="hover:text-brass transition-colors">printtrek.store</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-xs uppercase mb-4 text-brass tracking-wider">
                Support
              </h4>
              <ul className="space-y-2 text-xs text-concrete-muted">
                <li><Link href="/shipping" className="hover:text-brass transition-colors">Shipping Policy</Link></li>
                <li><Link href="/returns" className="hover:text-brass transition-colors">Returns & Refunds</Link></li>
                <li><Link href="/terms" className="hover:text-brass transition-colors">Terms of Service</Link></li>
                <li><Link href="/faq" className="hover:text-brass transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-xs uppercase mb-4 text-brass tracking-wider">
                Lab
              </h4>
              <ul className="space-y-2 text-xs text-concrete-muted">
                <li>Chennai, Tamil Nadu, India</li>
                <li>0.16mm Layer Height</li>
                <li>3CM Depth Standard</li>
                <li>Matte Black Finish</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-start md:justify-end">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Print Trek — Precision 3D Lab" className="h-24 w-auto mb-6" />
        </div>

        <div className="border-t border-obsidian/10 mt-12 pt-6">
          <p className="text-[10px] text-concrete-muted text-center tracking-wider">
            © 2026 Print Trek. Built to cast shadows. · Developed by{' '}
            <a
              href="https://strucureo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brass transition-colors"
            >
              Strucureo
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
