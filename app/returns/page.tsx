'use client';

import { motion } from 'framer-motion';

const rows: [string, string][] = [
  [
    'Damaged in transit? We replace it.',
    'If your frame arrives broken, cracked or warped, send a photo to hello@printtrek.store within 7 days of delivery and a replacement ships free — no return needed for damaged pieces.',
  ],
  [
    'Wrong or defective item',
    'Received the wrong design or a piece with a print defect? Same deal: photo within 7 days, free replacement or full refund — your choice.',
  ],
  [
    'Change of mind',
    'Unopened frames in original packaging can be returned within 7 days of delivery for store credit. Return shipping is on you; write to us first and we\u2019ll share the return address in Chennai.',
  ],
  [
    'Custom Lab pieces',
    'Custom frames are made for you alone and can\u2019t be resold — so they\u2019re final sale unless they arrive damaged or defective, in which case the replacement promise above applies in full.',
  ],
  [
    'How refunds land',
    'Approved refunds go back to your original payment method within 5–7 working days, or as instant store credit if you prefer.',
  ],
];

export default function ReturnsPage() {
  return (
    <div className="px-6 py-12 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="text-[10px] font-medium tracking-widest uppercase text-brass mb-2">
          Support
        </p>
        <h1 className="text-5xl md:text-6xl font-serif-display font-bold tracking-tight text-obsidian mb-4">
          Returns & Refunds
        </h1>
        <p className="text-sm text-concrete-muted mb-12">
          Wall art you can buy with confidence.
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