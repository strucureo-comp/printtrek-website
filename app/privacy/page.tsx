'use client';

import { motion } from 'framer-motion';

const rows: [string, string][] = [
  [
    'The lab & this policy',
    'Print Trek (printtrek.store) is operated from Chennai, Tamil Nadu, India. This page explains what we collect when you shop with us and how to reach us about it: hello@printtrek.store.',
  ],
  [
    'Accounts',
    'If you sign up, we store your name and email so you can sign in, track orders and keep store credit. Google sign-in shares the name, email and photo your Google account provides — nothing more.',
  ],
  [
    'Orders',
    'When you check out we keep your name, contact details, the items you ordered and the amount, so the lab can confirm, print and ship your frames and support you afterwards.',
  ],
  [
    'What we never do',
    'We never sell your details, never share them for advertising, and never ask for card or banking details by email or Instagram DM — payment details stay with the checkout step only.',
  ],
  [
    'Storage & security',
    'Account and order data is stored with our authentication and database provider (Firebase) with access limited to the lab team that fulfils orders. If that ever changes, this page will say so.',
  ],
  [
    'Your control',
    'Write to hello@printtrek.store from your account email to see, correct or delete your details. Deleting your account removes your profile; order records needed for warranties and refunds are kept to the minimum the law requires.',
  ],
];

export default function PrivacyPage() {
  return (
    <div className="px-6 py-12 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="text-[10px] font-medium tracking-widest uppercase text-brass mb-2">
          Support
        </p>
        <h1 className="text-5xl md:text-6xl font-serif-display font-bold tracking-tight text-obsidian mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm text-concrete-muted mb-12">
          Plain words on your data — what the lab keeps, and why.
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
