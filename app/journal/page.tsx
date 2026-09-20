'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLiveJournal, type DBJournal } from '@/lib/store';

function HeroCard({ post }: { post: DBJournal }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative rounded-lg overflow-hidden aspect-square md:aspect-auto md:h-[600px] group cursor-pointer bg-obsidian"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={post.img}
        alt={post.title}
        className="w-full h-full object-cover opacity-70 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />
      <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between">
        <span className="text-[10px] font-medium tracking-widest uppercase text-brass">
          {post.cat}
        </span>
        <div>
          <h3 className="text-concrete text-2xl md:text-4xl font-serif-display font-bold tracking-tight leading-[0.95] max-w-xl mb-3">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-concrete/70 text-sm max-w-lg mb-6">{post.excerpt}</p>
          )}
          <button className="uppercase text-[10px] font-medium tracking-widest px-4 py-2 rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer bg-transparent text-concrete border border-concrete/40 hover:bg-concrete hover:text-obsidian w-fit">
            Read Lab Notes <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function SmallCard({ post, index }: { post: DBJournal; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className="relative rounded-lg overflow-hidden group cursor-pointer bg-obsidian min-h-[280px]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={post.img}
        alt={post.title}
        className="w-full h-full object-cover opacity-70 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700 absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent" />
      <div className="absolute inset-0 p-8 flex flex-col justify-between">
        <span className="text-brass text-[10px] font-medium tracking-widest uppercase">
          {post.cat}
        </span>
        <h3 className="text-concrete text-xl font-medium leading-tight max-w-sm">
          {post.title}
        </h3>
      </div>
    </motion.div>
  );
}

export default function JournalPage() {
  const { items: posts, loading, live } = useLiveJournal();
  const [hero, ...rest] = posts;
  const side = rest.slice(0, 2);
  const grid = rest.slice(2);

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-7xl font-serif-display font-bold tracking-tighter leading-none text-obsidian"
        >
          The Lab<br />Journal
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs font-medium uppercase tracking-widest max-w-xs text-right text-concrete-muted"
        >
          Process notes from the Chennai lab. Depth, craft, and shadows.
          {!loading && live && posts.length > 0 && ` · ${posts.length} live`}
        </motion.p>
      </div>

      {loading ? (
        <p className="text-sm text-concrete-muted">Loading lab notes…</p>
      ) : posts.length === 0 ? (
        <div className="border border-dashed border-obsidian/25 rounded-lg p-12 text-center">
          <p className="font-serif-display font-bold text-xl text-obsidian mb-2">
            Fresh notes brewing.
          </p>
          <p className="text-sm text-concrete-muted mb-4">
            The lab hasn&apos;t published anything yet — check back soon.
          </p>
          <Link
            href="/shop"
            className="uppercase text-[10px] font-medium tracking-widest text-brass hover:text-obsidian transition-colors inline-flex items-center gap-2"
          >
            Browse The Shop <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {hero && <HeroCard post={hero} />}
            <div className="grid grid-rows-2 gap-4 md:h-[600px]">
              {side.map((post, idx) => (
                <SmallCard key={post.id} post={post} index={idx} />
              ))}
            </div>
          </div>

          {grid.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {grid.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, duration: 0.5 }}
                  className="relative rounded-lg overflow-hidden h-[400px] group cursor-pointer bg-obsidian"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-85 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-between">
                    <span className="text-brass text-[10px] font-medium tracking-widest uppercase">
                      {post.cat}
                    </span>
                    <h3 className="text-concrete text-xl font-medium leading-tight max-w-sm">
                      {post.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
