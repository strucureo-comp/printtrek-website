'use client';

import { motion } from 'framer-motion';

const rows: [string, string][] = [
  [
    'The lab & the store',
    'Print Trek (printtrek.store) is operated from Chennai, Tamil Nadu, India. By placing an order you agree to these terms and to being contacted about your order at the details you provide.',
  ],
  [
    'Products',
    'All frames are original Print Trek designs — 3D-printed relief wall art, 15×20cm unless stated otherwise. Colours and shadows vary slightly with room light; that is the nature of physical depth, not a defect.',
  ],
  [
    'Pricing & payment',
    'Prices are shown at checkout and charged in full when you order. We may correct obvious pricing errors before dispatch and will always confirm with you first.',
  ],
  [
    'Custom artwork',
    'Custom Lab frames are produced from artwork you own or have rights to use. You keep ownership of your art; we keep the right to show the finished piece in our portfolio unless you ask us not to.',
  ],
  [
    'Intellectual property',
    'Site content, photography and frame designs belong to Print Trek. Anime-inspired silhouettes are original interpretations, not licensed merchandise.',
  ],
  [
    'Accounts & store credit',
    'Store balance and redeem codes hold no cash value, can\u2019t be transferred, and are redeemed only on printtrek.store.',
  ],
  [
    'Contact',
    'Questions about anything above? hello@printtrek.store — a human in the lab replies.',
  ],
];

export default function TermsPage() {
  return (
    <div className="px-6 py-12 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="text-[10px] font-medium tracking-widest uppercase text-brass mb-2">
          Support
        </p>
        <h1 className="text-5xl md:text-6xl font-serif-display font-bold tracking-tight text-obsidian mb-4">
          Terms of Service
        </h1>
        <p className="text-sm text-concrete-muted mb-12">
          Plain terms, no fine-print games. Last updated September 2026.
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