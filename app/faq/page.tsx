'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { faqs } from '@/lib/data';

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="max-w-4xl mx-auto px-6 py-24 min-h-[70vh]">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-6xl font-serif-display font-bold tracking-tighter leading-none mb-4 text-obsidian"
      >
        Questions
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-concrete-muted mb-16 max-w-lg"
      >
        Short answers. No noise. DM @print_.trek with keyword SHADOW for anything else.
      </motion.p>
      <div className="border-t border-obsidian">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border-b border-obsidian/15 py-6">
            <button
              className="w-full flex justify-between items-center text-left focus:outline-none"
              onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
            >
              <h3 className="text-lg md:text-xl font-serif-display font-bold tracking-tight pr-8 text-obsidian">
                {faq.q}
              </h3>
              {openIndex === idx ? (
                <Minus size={22} className="text-brass shrink-0" />
              ) : (
                <Plus size={22} className="text-concrete-muted shrink-0" />
              )}
            </button>
            <AnimatePresence initial={false}>
              {openIndex === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="text-sm leading-relaxed max-w-2xl mt-6 text-concrete-muted">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
