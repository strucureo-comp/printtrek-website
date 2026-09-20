'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLiveProducts } from '@/lib/store';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export default function HomePage() {
  const { items: products, loading } = useLiveProducts();
  // Admin "Show on home page" select controls this section.
  // Falls back to latest 3 so the section never looks broken.
  const featured = products.filter((p) => p.featured);
  const showcase = (featured.length > 0 ? featured : products).slice(0, 3);
  return (
    <>
      {/* Hero */}
      <section className="px-6 py-4">
        <motion.div
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative rounded-lg overflow-hidden h-[75vh] flex items-center bg-obsidian"
        >
          <img
            src="https://images.pexels.com/photos/30720501/pexels-photo-30720501.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
            alt="3D printer in neon light"
            className="absolute inset-0 w-full h-full object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/60 to-transparent" />
          <div className="relative z-10 p-6 md:p-12 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block border border-brass/40 rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-brass mb-6"
            >
              Precision 3D Lab · Chennai
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl md:text-7xl font-serif-display font-bold text-concrete leading-[0.95] tracking-tight mb-6"
            >
              Built to cast<br />shadows.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-sm md:text-base text-concrete-dim max-w-md mb-8 leading-relaxed"
            >
              3CM deep matte black shadow frames for anime walls.
              HueForge layered. Gallery finish. No gloss, no gimmicks.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                href="/shop"
                className="uppercase text-[10px] font-medium tracking-widest px-5 py-2.5 rounded inline-flex items-center gap-2 transition-colors cursor-pointer bg-brass text-obsidian hover:bg-brass/80"
              >
                View Shadow Sets <ArrowRight size={14} />
              </Link>
              <Link
                href="/about"
                className="uppercase text-[10px] font-medium tracking-widest px-5 py-2.5 rounded inline-flex items-center gap-2 transition-colors cursor-pointer border border-concrete/30 text-concrete-dim hover:border-brass hover:text-brass"
              >
                The Lab Story
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Manifesto */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-serif-display font-normal leading-snug tracking-tight text-obsidian"
        >
          Flat posters die in flat light. We build wall art with real physical
          depth — <span className="text-brass">3CM of shadow</span> that moves
          when your room light shifts. Matte black. No reflections. Just depth.
        </motion.p>
      </section>

      {/* Values Grid */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Depth Over Flat', desc: '3CM real shadow, not flat poster. Light hits it, shadows move.' },
            { title: 'Matte Over Gloss', desc: 'Gallery finish. No reflections from your monitor or LED strips.' },
            { title: 'Precision Over Speed', desc: "0.16mm layer height. Sanded edges. Every frame is QC'd by hand." },
            { title: 'Room Over Shelf', desc: 'Built for walls, not for shelves. 15x20cm. Ready to hang.' },
          ].map((v, idx) => (
            <motion.div
              key={v.title}
              custom={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="border border-obsidian/10 rounded-lg p-8 hover:border-brass/30 transition-colors bg-concrete"
            >
              <h3 className="text-lg font-serif-display font-bold text-obsidian mb-2">
                {v.title}
              </h3>
              <p className="text-sm text-concrete-muted leading-relaxed">
                {v.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-6 py-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl md:text-3xl font-serif-display font-bold tracking-tight text-obsidian">
            Shadow Sets
          </h2>
          <Link
            href="/shop"
            className="uppercase text-[10px] font-medium tracking-widest text-concrete-muted hover:text-brass transition-colors flex items-center gap-2"
          >
            Shop All <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-concrete-muted">Loading the drop…</p>
        ) : products.length === 0 ? (
          <div className="border border-dashed border-obsidian/25 rounded-lg p-10 text-center">
            <p className="font-serif-display font-bold text-xl text-obsidian mb-2">
              First drop loading.
            </p>
            <p className="text-sm text-concrete-muted mb-4">
              Real frames are being added to the lab — check back soon.
            </p>
            <Link
              href="/shop"
              className="uppercase text-[10px] font-medium tracking-widest text-brass hover:text-obsidian transition-colors inline-flex items-center gap-2"
            >
              Check The Shop <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {showcase.map((prod, idx) => (
            <motion.div
              key={prod.id}
              custom={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="group cursor-pointer"
            >
              <Link href={`/shop/${prod.slug || prod.id}`} aria-label={prod.title}>
                <div className="bg-obsidian rounded-lg aspect-square overflow-hidden relative">
                  <img
                    src={prod.img}
                    alt={prod.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  {prod.badge && (
                    <div className="absolute top-4 left-4 bg-brass text-obsidian text-[9px] font-bold px-2 py-1 uppercase rounded tracking-wider">
                      {prod.badge}
                    </div>
                  )}
                </div>
              </Link>
              <div className="mt-4">
                <div className="flex justify-between font-medium text-sm text-obsidian">
                  <Link href={`/shop/${prod.slug || prod.id}`} className="tracking-tight hover:text-brass transition-colors">
                    <h3>{prod.title}</h3>
                  </Link>
                  <span className="text-brass">{prod.price}</span>
                </div>
                <p className="text-sm mt-1 text-concrete-muted">{prod.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </section>

      {/* Split Section */}
      <section className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-obsidian rounded-lg p-12 flex items-center justify-center min-h-[350px] relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-15">
            <img
              src="https://images.pexels.com/photos/19588204/pexels-photo-19588204.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
              alt="3D printer head"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 text-center">
            <div className="text-6xl md:text-7xl font-serif-display font-bold tracking-tighter text-brass leading-[0.85]">
              3CM
            </div>
            <p className="text-xs font-medium uppercase tracking-widest text-concrete-dim mt-4">
              Real Physical Depth
            </p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-concrete-mid rounded-lg p-8 md:p-12 flex flex-col justify-center border border-obsidian/10"
        >
          <p className="text-[10px] font-medium tracking-widest uppercase text-brass mb-6">
            Chennai Lab · Worldwide
          </p>
          <h3 className="text-2xl md:text-3xl font-serif-display font-bold tracking-tight mb-6 max-w-md text-obsidian">
            $29, not $80.
          </h3>
          <p className="text-sm leading-relaxed mb-6 max-w-md text-concrete-muted">
            Chennai lab cost means we ship worldwide at a price that makes sense.
            Same 3CM depth. Same matte black. Same HueForge layers. Half the Etsy
            price. Every frame is printed, finished, and QC&apos;d in our lab,
            then shipped in a hard box.
          </p>
          <Link
            href="/shop"
            className="uppercase text-[10px] font-medium tracking-widest text-brass hover:text-obsidian transition-colors flex items-center gap-2 w-fit"
          >
            See The Frames <ArrowRight size={14} />
          </Link>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-serif-display font-bold tracking-tight text-obsidian mb-6">
            Your wall is flat.<br />Fix that.
          </h2>
          <p className="text-sm text-concrete-muted mb-8 max-w-lg mx-auto">
            DM us on Instagram with the keyword SHADOW for the full catalog.
            Or browse the shop.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/shop"
              className="uppercase text-[10px] font-medium tracking-widest px-5 py-2.5 rounded inline-flex items-center gap-2 transition-colors cursor-pointer bg-obsidian text-concrete hover:bg-obsidian-soft"
            >
              Browse Shadow Sets <ArrowRight size={14} />
            </Link>
            <a
              href="https://instagram.com/print_.trek"
              className="uppercase text-[10px] font-medium tracking-widest px-5 py-2.5 rounded inline-flex items-center gap-2 transition-colors cursor-pointer border border-obsidian/20 text-concrete-muted hover:border-brass hover:text-brass"
            >
              @print_.trek
            </a>
          </div>
        </motion.div>
      </section>
    </>
  );
}
