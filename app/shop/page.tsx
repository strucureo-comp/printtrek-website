'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { DBProduct } from '@/lib/store';
import { useLiveProducts } from '@/lib/store';
import { useCart } from '@/lib/cart';

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' as const },
  }),
};

type Filter = 'All' | 'Anime' | 'Movies' | 'Custom';

export default function ShopPage() {
  const [filter, setFilter] = useState<Filter>('All');
  const { items: products, loading } = useLiveProducts();
  const { add } = useCart();

  const filtered = products.filter((p) =>
    filter === 'All' ? true : p.category === filter
  );

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-obsidian/10 pb-8 gap-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-7xl font-serif-display font-bold tracking-tighter leading-none text-obsidian"
        >
          Shadow<br />Frames
        </motion.h1>
        <div className="flex gap-4 items-center">
          {(['All', 'Anime', 'Movies', 'Custom'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs font-medium uppercase tracking-widest pb-1 transition-colors ${
                filter === f
                  ? 'border-b-2 border-brass text-brass'
                  : 'text-concrete-muted hover:text-obsidian'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {!loading && filtered.length === 0 && (
        <div className="border border-dashed border-obsidian/25 rounded-lg p-12 text-center">
          <p className="font-serif-display font-bold text-xl text-obsidian mb-2">
            {products.length === 0 ? 'New drop on the way.' : 'Nothing in this lane.'}
          </p>
          <p className="text-sm text-concrete-muted">
            {products.length === 0
              ? 'Our first real frames are being added — check back soon.'
              : 'Try a different category.'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
        {filtered.map((prod: DBProduct, idx: number) => (
          <motion.div
            key={prod.id}
            custom={idx}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="group flex flex-col gap-4"
          >
            <div className="bg-obsidian rounded-lg aspect-square overflow-hidden relative">
              <Link href={`/shop/${prod.slug || prod.id}`} aria-label={prod.title}>
                <img
                  src={prod.img}
                  alt={prod.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
              </Link>
              {prod.badge && (
                <div className="absolute top-4 left-4 bg-brass text-obsidian text-[9px] font-bold px-2 py-1 uppercase rounded tracking-wider pointer-events-none">
                  {prod.badge}
                </div>
              )}
              <div className="absolute top-4 right-4 bg-concrete text-obsidian text-[9px] font-bold px-2 py-1 uppercase rounded tracking-wider pointer-events-none">
                {prod.stock || 'In Stock'}
              </div>
            </div>
            <div>
              <div className="flex justify-between font-medium text-sm text-obsidian">
                <h3 className="tracking-tight">{prod.title}</h3>
                <span className="text-brass">{prod.price}</span>
              </div>
              <p className="text-sm mt-1 mb-4 text-concrete-muted">{prod.desc}</p>
              <div className="flex gap-2">
                <Link
                  href={`/shop/${prod.slug || prod.id}`}
                  className="flex-1 uppercase text-[10px] font-medium tracking-widest px-4 py-2 rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer border border-obsidian/20 text-obsidian hover:border-obsidian hover:bg-obsidian hover:text-concrete"
                >
                  Details <ArrowRight size={12} />
                </Link>
                <button
                  onClick={() => prod.stock !== 'Sold Out' && add(prod)}
                  disabled={prod.stock === 'Sold Out'}
                  className="flex-1 uppercase text-[10px] font-medium tracking-widest px-4 py-2 rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer bg-obsidian text-concrete hover:bg-obsidian-soft disabled:opacity-40"
                >
                  {prod.stock === 'Sold Out' ? 'Sold Out' : 'Add To Cart'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
