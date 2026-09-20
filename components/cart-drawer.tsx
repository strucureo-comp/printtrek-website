'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Trash2, Minus, Plus, ArrowRight, Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { push, ref } from 'firebase/database';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';
import { getRTDB, RTDB_NODES } from '@/lib/firebase';

export default function CartDrawer() {
  const { items, count, subtotal, isOpen, setOpen, setQty, remove, clear } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [placed, setPlaced] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function checkout() {
    setError('');
    if (!items.length) return;
    if (!user) {
      setOpen(false);
      router.push('/login');
      return;
    }
    const db = getRTDB();
    if (!db) {
      setError('Checkout is offline — Firebase not configured.');
      return;
    }
    setBusy(true);
    try {
      const summary = items.map((i) => `${i.title} × ${i.qty}`).join(', ');
      const orderRef = await push(ref(db, RTDB_NODES.orders), {
        customer: user.displayName || user.email || 'Website customer',
        contact: user.email || '',
        items: summary,
        amount: subtotal,
        status: 'pending',
        note: `Website checkout · uid ${user.uid}`,
        createdAt: Date.now(),
      });
      clear();
      setPlaced(orderRef.key);
    } catch (e: any) {
      setError(`Order failed: ${e?.message || e}`);
    }
    setBusy(false);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setOpen(false); setPlaced(null); }}
            className="fixed inset-0 z-[70] bg-obsidian/60"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed right-0 top-0 bottom-0 z-[71] w-full max-w-sm bg-concrete flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-obsidian/10">
              <h2 className="font-serif-display font-bold text-xl">
                Cart {count > 0 && <span className="text-brass">({count})</span>}
              </h2>
              <button
                onClick={() => { setOpen(false); setPlaced(null); }}
                className="p-2 border border-obsidian/15 rounded-full hover:border-brass hover:text-brass"
              >
                <X size={16} />
              </button>
            </div>

            {placed ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
                <span className="w-14 h-14 rounded-full bg-brass/15 text-brass flex items-center justify-center">
                  <Check size={26} />
                </span>
                <h3 className="font-serif-display font-bold text-2xl">Order placed.</h3>
                <p className="text-sm text-concrete-muted">
                  Order <code>{placed.slice(-6).toUpperCase()}</code> is pending.
                  We&apos;ll contact you at {user?.email} to confirm.
                </p>
                <button
                  onClick={() => { setOpen(false); setPlaced(null); }}
                  className="uppercase text-[10px] font-medium tracking-widest px-5 py-2.5 rounded bg-obsidian text-concrete hover:bg-obsidian-soft mt-2"
                >
                  Keep Browsing
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-3">
                <p className="font-serif-display font-bold text-xl">Cart is empty.</p>
                <p className="text-sm text-concrete-muted">Shadow frames are waiting.</p>
                <button
                  onClick={() => { setOpen(false); router.push('/shop'); }}
                  className="uppercase text-[10px] font-medium tracking-widest px-5 py-2.5 rounded bg-obsidian text-concrete hover:bg-obsidian-soft mt-2 inline-flex items-center gap-2"
                >
                  Browse Shop <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {items.map((i) => (
                    <div key={i.id} className="flex gap-3 items-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={i.img} alt={i.title} className="w-16 h-16 rounded object-cover bg-obsidian shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{i.title}</p>
                        <p className="text-xs text-brass font-bold">${(i.price * i.qty).toFixed(2)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <button onClick={() => setQty(i.id, i.qty - 1)} className="w-6 h-6 border border-obsidian/15 rounded-full flex items-center justify-center hover:border-brass">
                            <Minus size={12} />
                          </button>
                          <span className="text-xs tabular-nums w-4 text-center">{i.qty}</span>
                          <button onClick={() => setQty(i.id, i.qty + 1)} className="w-6 h-6 border border-obsidian/15 rounded-full flex items-center justify-center hover:border-brass">
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <button onClick={() => remove(i.id)} className="p-2 border border-obsidian/15 rounded-full hover:border-red-500 hover:text-red-500 shrink-0">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="border-t border-obsidian/10 px-6 py-5 space-y-3">
                  {error && <p className="text-xs text-red-500">{error}</p>}
                  <div className="flex justify-between text-sm font-bold">
                    <span>Subtotal</span>
                    <span className="tabular-nums">${subtotal.toFixed(2)}</span>
                  </div>
                  <p className="text-[11px] text-concrete-muted">Shipping calculated at confirmation.</p>
                  <button
                    onClick={checkout}
                    disabled={busy}
                    className="w-full uppercase text-[10px] font-medium tracking-widest px-4 py-3 rounded bg-obsidian text-concrete hover:bg-obsidian-soft disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {busy ? <Loader2 size={14} className="animate-spin" /> : null}
                    {user ? 'Place Order' : 'Sign In to Checkout'}
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
