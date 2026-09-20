'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { useLiveProducts, type DBProduct } from '@/lib/store';
import { useCart } from '@/lib/cart';

function productUrl(p: DBProduct) {
  return `/shop/${p.slug || p.id}`;
}

export default function ProductSlugPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const { items: products, loading } = useLiveProducts();
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  const product = products.find((p) => p.slug === slug || p.id === slug);

  if (loading) {
    return (
      <div className="px-6 py-24 text-center text-sm text-concrete-muted">
        Loading frame…
      </div>
    );
  }

  if (!product) {
    return (
      <div className="px-6 py-24 max-w-md mx-auto text-center">
        <h1 className="text-4xl font-serif-display font-bold tracking-tight text-obsidian mb-4">
          Frame not found.
        </h1>
        <p className="text-sm text-concrete-muted mb-8">
          This piece may be sold out or the link is old.
        </p>
        <Link
          href="/shop"
          className="uppercase text-[10px] font-medium tracking-widest px-5 py-2.5 rounded bg-obsidian text-concrete hover:bg-obsidian-soft inline-flex items-center gap-2"
        >
          <ArrowLeft size={14} /> Back to Shop
        </Link>
      </div>
    );
  }

  const stock = product.stock || 'In Stock';
  const soldOut = stock === 'Sold Out';
  const specs: [string, string][] = [
    ['Size', product.size || '15×20cm'],
    ['Depth', product.depth || '3CM'],
    ['Material', product.material || 'PLA · HueForge layered'],
    ['Finish', product.finish || 'Matte Black'],
    ['Category', product.category],
  ];

  const related = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return (
    <div className="px-6 py-12 max-w-6xl mx-auto">
      <Link
        href="/shop"
        className="uppercase text-[10px] font-medium tracking-widest text-concrete-muted hover:text-brass transition-colors inline-flex items-center gap-2 mb-8"
      >
        <ArrowLeft size={14} /> All Frames
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-obsidian rounded-lg aspect-square overflow-hidden relative"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.img} alt={product.title} className="w-full h-full object-cover" />
          {product.badge && (
            <div className="absolute top-4 left-4 bg-brass text-obsidian text-[9px] font-bold px-2 py-1 uppercase rounded tracking-wider">
              {product.badge}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-[10px] font-medium tracking-widest uppercase text-brass mb-2">
            {product.category} · {stock}
          </p>
          <h1 className="text-4xl md:text-5xl font-serif-display font-bold tracking-tight text-obsidian mb-3">
            {product.title}
          </h1>
          <p className="text-2xl font-bold text-brass mb-4">{product.price}</p>
          <p className="text-sm text-concrete-muted leading-relaxed mb-4">{product.desc}</p>
          {product.details && (
            <p className="text-sm leading-relaxed mb-6 whitespace-pre-line">{product.details}</p>
          )}

          <div className="border-t border-obsidian/10 pt-4 mb-6">
            {specs.map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-obsidian/10 text-sm">
                <span className="text-[10px] uppercase tracking-widest text-concrete-muted">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-3">
            <div className="flex items-center gap-3 border border-obsidian/20 rounded-full px-4 py-2">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">
                <Minus size={14} />
              </button>
              <span className="text-sm tabular-nums w-4 text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)} aria-label="Increase quantity">
                <Plus size={14} />
              </button>
            </div>
            <button
              onClick={() => !soldOut && add(product, qty)}
              disabled={soldOut}
              className="flex-1 uppercase text-[10px] font-medium tracking-widest px-4 py-2 rounded-full bg-obsidian text-concrete hover:bg-obsidian-soft disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {soldOut ? 'Sold Out' : 'Add To Cart'}
            </button>
          </div>
          <a
            href="https://instagram.com/print_.trek"
            target="_blank"
            rel="noopener noreferrer"
            className="uppercase text-[10px] font-medium tracking-widest text-concrete-muted hover:text-brass transition-colors inline-flex items-center gap-2"
          >
            Questions? DM SHADOW on Instagram <ArrowRight size={12} />
          </a>
        </motion.div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-serif-display font-bold tracking-tight text-obsidian">
              Pairs well with
            </h2>
            <Link
              href="/shop"
              className="uppercase text-[10px] font-medium tracking-widest text-concrete-muted hover:text-brass transition-colors flex items-center gap-2"
            >
              Shop All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((p) => (
              <Link key={p.id} href={productUrl(p)} className="group cursor-pointer">
                <div className="bg-obsidian rounded-lg aspect-square overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                </div>
                <div className="mt-4 flex justify-between font-medium text-sm text-obsidian">
                  <h3 className="tracking-tight">{p.title}</h3>
                  <span className="text-brass">{p.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <p className="text-[11px] text-concrete-muted mt-12 flex items-center gap-1">
        <Check size={12} className="text-brass" /> Printed, finished & QC&apos;d in the Chennai lab · ships worldwide in a hard box.
      </p>
    </div>
  );
}
