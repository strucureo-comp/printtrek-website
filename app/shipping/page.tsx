'use client';

import { motion } from 'framer-motion';

const rows: [string, string][] = [
  [
    'Made to order in Chennai',
    'Every frame is printed, hand-finished and quality-checked in our Chennai, Tamil Nadu lab before it ships. Made-to-order pieces leave the lab within 2–4 working days; ready pieces within 24 hours.',
  ],
  [
    'India delivery',
    '3–5 working days from dispatch, tracked door-to-door. Every frame travels in a hard protective box — never a soft envelope.',
  ],
  [
    'International delivery',
    '7–14 working days depending on destination, fully tracked. Duties or import taxes, where applicable, are set by your country and are not included at checkout.',
  ],
  [
    'Custom frames',
    'Custom Lab pieces are designed, printed and dispatched within 24 hours of artwork approval, then follow the same tracked timelines above.',
  ],
  [
    'Track your order',
    'Your tracking link is emailed the moment your frame leaves the lab. Anything looks stuck? Write to hello@printtrek.store with your order number.',
  ],
];

export default function ShippingPage() {
  return (
    <div className="px-6 py-12 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="text-[10px] font-medium tracking-widest uppercase text-brass mb-2">
          Support
        </p>
        <h1 className="text-5xl md:text-6xl font-serif-display font-bold tracking-tight text-obsidian mb-4">
          Shipping Policy
        </h1>
        <p className="text-sm text-concrete-muted mb-12">
          From the Chennai lab to your wall — tracked, boxed hard, worldwide.
        </p>
      </motion.div>
      <div className="border-t border-obsidian">
        {rows.map(([title, body], idx) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06, duration: 0.4 }}
            className="border-b border-obsidian/10 py-6"
          >
            <h2 className="font-serif-display font-bold text-lg text-obsidian mb-2">{title}</h2>
            <p className="text-sm text-concrete-muted leading-relaxed">{body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}