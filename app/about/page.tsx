'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-[10px] font-medium tracking-widest uppercase text-brass mb-4">
          About Print Trek
        </p>
        <h1 className="text-4xl md:text-6xl font-serif-display font-bold tracking-tighter leading-none mb-16 text-obsidian">
          We are not<br />a print shop.<br />We are a lab.
        </h1>
      </motion.div>

      <div className="space-y-12 max-w-2xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-lg leading-relaxed text-obsidian"
        >
          Print Trek started in a small room in Chennai with one Bambu Lab
          printer and a lot of failed prints.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg leading-relaxed text-concrete-muted"
        >
          We didn&apos;t want to print another keychain. We wanted to build
          something we&apos;d actually hang in our own room — deep, matte,
          shadows that move with light.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-lg leading-relaxed text-concrete-muted"
        >
          So we built Shadow Frames. 3CM deep. HueForge layered. Matte black. No
          gloss, no extra text, no gimmicks.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg leading-relaxed text-concrete-muted"
        >
          Chennai is our factory. The world is our wall. Every frame is printed,
          finished, and QC&apos;d in our Chennai lab, then shipped worldwide in a
          hard box.
        </motion.p>
      </div>

      {/* Values */}
      <div className="mt-24">
        <h2 className="text-2xl font-serif-display font-bold tracking-tight mb-8 text-obsidian">
          What We Believe
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Depth Over Flat', desc: '3CM real shadow, not flat poster.' },
            { title: 'Matte Over Gloss', desc: 'Gallery finish, no reflections.' },
            { title: 'Precision Over Speed', desc: '0.16mm layer, sanded edges, QC.' },
            { title: 'Room Over Shelf', desc: 'Built for walls, not for shelves.' },
          ].map((v, idx) => (
            <motion.div
              key={v.title}
              custom={idx}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="border border-obsidian/10 rounded-lg p-6 bg-concrete"
            >
              <h3 className="font-serif-display font-bold text-obsidian mb-1">
                {v.title}
              </h3>
              <p className="text-sm text-concrete-muted">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="mt-24 border-t border-obsidian/10 pt-12">
        <h2 className="text-2xl font-serif-display font-bold tracking-tight mb-8 text-obsidian">
          Contact
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-[10px] font-medium tracking-widest uppercase text-brass mb-2">
              Instagram
            </p>
            <a href="https://instagram.com/print_.trek" className="text-sm hover:text-brass transition-colors">
              @print_.trek
            </a>
          </div>
          <div>
            <p className="text-[10px] font-medium tracking-widest uppercase text-brass mb-2">
              Store
            </p>
            <a href="https://printtrek.store" className="text-sm hover:text-brass transition-colors">
              printtrek.store
            </a>
          </div>
          <div>
            <p className="text-[10px] font-medium tracking-widest uppercase text-brass mb-2">
              Email
            </p>
            <a href="mailto:hello@printtrek.store" className="text-sm hover:text-brass transition-colors">
              hello@printtrek.store
            </a>
          </div>
        </div>
        <div className="mt-8">
          <p className="text-sm text-concrete-muted mb-4">
            For custom pieces, message us on Instagram — one idea, one frame, one day.
          </p>
          <Link
            href="/shop"
            className="uppercase text-[10px] font-medium tracking-widest px-5 py-2.5 rounded inline-flex items-center gap-2 transition-colors cursor-pointer bg-obsidian text-concrete hover:bg-obsidian-soft"
          >
            Browse Shadow Sets <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
