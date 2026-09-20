'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Plus, Gift, Package } from 'lucide-react';
import { push, ref } from 'firebase/database';
import { getRTDB, RTDB_NODES } from '@/lib/firebase';
import { useLiveTransactions } from '@/lib/store';

export default function BalancePage() {
  const [showAll, setShowAll] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const { items: transactions, loading } = useLiveTransactions();

  const balance = useMemo(
    () => transactions.reduce((s, t) => s + Number(t.amount || 0), 0),
    [transactions]
  );
  const lifetimeCredit = useMemo(
    () => transactions.filter((t) => t.type === 'credit').reduce((s, t) => s + Number(t.amount || 0), 0),
    [transactions]
  );
  const lifetimeSpent = useMemo(
    () => transactions.filter((t) => t.type === 'debit').reduce((s, t) => s + Math.abs(Number(t.amount || 0)), 0),
    [transactions]
  );

  const visible = showAll ? transactions : transactions.slice(0, 3);

  async function writeEntry(desc: string, value: number, type: 'credit' | 'debit') {
    const db = getRTDB();
    if (!db) {
      setMsg("Couldn't reach the server. Please try again.");
      return false;
    }
    await push(ref(db, RTDB_NODES.transactions), {
      desc,
      amount: type === 'credit' ? Math.abs(value) : -Math.abs(value),
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
      type,
      createdAt: Date.now(),
    });
    return true;
  }

  async function topUp() {
    const val = Number(amount);
    if (!val || val <= 0) return setMsg('Enter an amount greater than 0.');
    setBusy(true);
    const ok = await writeEntry(`Top-up — store credit`, val, 'credit');
    setBusy(false);
    if (ok) {
      setMsg(`+$${val.toFixed(2)} added to your balance.`);
      setAmount('');
      setTopUpOpen(false);
    }
  }

  async function redeem() {
    if (!code.trim()) return setMsg('Enter a redeem code.');
    setBusy(true);
    // Free-tier friendly: fixed demo codes. Manage real codes in /admin → Balance.
    const table: Record<string, number> = { SHADOW10: 10, WELCOME12: 12, LAB25: 25 };
    const value = table[code.trim().toUpperCase()];
    if (!value) {
      setBusy(false);
      return setMsg('Invalid code. Try SHADOW10.');
    }
    const ok = await writeEntry(`Redeem code — ${code.trim().toUpperCase()}`, value, 'credit');
    setBusy(false);
    if (ok) {
      setMsg(`Code applied: +$${value.toFixed(2)}.`);
      setCode('');
      setRedeemOpen(false);
    }
  }

  return (
    <div className="px-6 py-12 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6"
      >
        <div>
          <p className="text-[10px] font-medium tracking-widest uppercase text-brass mb-2">
            Lab Account
          </p>
          <h1 className="text-5xl md:text-7xl font-serif-display font-bold tracking-tighter leading-none text-obsidian">
            Your<br />Balance
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setTopUpOpen(!topUpOpen); setRedeemOpen(false); setMsg(''); }}
            className="uppercase text-[10px] font-medium tracking-widest px-4 py-2 rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer bg-obsidian text-concrete hover:bg-obsidian-soft"
          >
            <Plus size={12} /> Top Up
          </button>
          <button
            onClick={() => { setRedeemOpen(!redeemOpen); setTopUpOpen(false); setMsg(''); }}
            className="uppercase text-[10px] font-medium tracking-widest px-4 py-2 rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer border border-obsidian/20 text-obsidian hover:border-brass hover:text-brass"
          >
            <Gift size={12} /> Redeem Code
          </button>
        </div>
      </motion.div>

      {msg && (
        <div className="border border-brass/40 bg-brass/10 rounded-lg px-4 py-3 text-xs mb-6">
          {msg}
        </div>
      )}

      {(topUpOpen || redeemOpen) && (
        <div className="border border-obsidian/10 rounded-lg p-6 mb-8 bg-concrete-mid">
          {topUpOpen && (
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount — e.g. 25.00"
                inputMode="decimal"
                className="flex-1 border border-obsidian/15 rounded px-4 py-2 text-sm bg-concrete focus:outline-none focus:border-brass"
              />
              <button
                onClick={topUp}
                disabled={busy}
                className="uppercase text-[10px] font-medium tracking-widest px-5 py-2 rounded bg-obsidian text-concrete hover:bg-obsidian-soft disabled:opacity-50"
              >
                {busy ? 'Adding…' : 'Confirm top-up'}
              </button>
            </div>
          )}
          {redeemOpen && (
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Code — try SHADOW10"
                className="flex-1 border border-obsidian/15 rounded px-4 py-2 text-sm bg-concrete uppercase placeholder:normal-case focus:outline-none focus:border-brass"
              />
              <button
                onClick={redeem}
                disabled={busy}
                className="uppercase text-[10px] font-medium tracking-widest px-5 py-2 rounded bg-brass text-obsidian hover:bg-brass/80 disabled:opacity-50"
              >
                {busy ? 'Checking…' : 'Apply code'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-obsidian text-concrete rounded-lg p-8 md:p-12 mb-12 relative overflow-hidden"
      >
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full border border-brass/15" />
        <div className="absolute -right-4 -bottom-20 w-64 h-64 rounded-full border border-concrete/5" />
        <div className="relative z-10">
          <p className="text-[10px] font-medium tracking-widest uppercase text-concrete-dim mb-4">
            Available Store Credit{loading ? '…' : ''}
          </p>
          <div className="flex items-end gap-2 mb-8">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-serif-display font-bold tracking-tighter leading-none"
            >
              ${balance.toFixed(2)}
            </motion.span>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
            <div>
              <p className="text-[10px] font-medium tracking-widest uppercase text-concrete/40 mb-1">
                Lifetime Credit
              </p>
              <p className="text-xl font-bold tracking-tight">${lifetimeCredit.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-widest uppercase text-concrete/40 mb-1">
                Lifetime Spent
              </p>
              <p className="text-xl font-bold tracking-tight">${lifetimeSpent.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-widest uppercase text-concrete/40 mb-1">
                Member Since
              </p>
              <p className="text-xl font-bold tracking-tight">2025</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {[
          { label: 'Orders Placed', value: String(transactions.filter((t) => t.type === 'debit').length), icon: Package },
          { label: 'Active Vouchers', value: '2', icon: Gift },
          { label: 'Reward Tier', value: balance >= 100 ? 'Shadow+' : 'Shadow', icon: ArrowUpRight },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            className="border border-obsidian/10 rounded-lg p-6 flex items-center justify-between bg-concrete"
          >
            <div>
              <p className="text-[10px] font-medium tracking-widest uppercase text-concrete-muted mb-1">
                {stat.label}
              </p>
              <p className="text-lg font-bold tracking-tight text-obsidian">{stat.value}</p>
            </div>
            <stat.icon size={20} className="text-brass" />
          </motion.div>
        ))}
      </div>

      {/* Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-serif-display font-bold tracking-tight text-obsidian">
            Transaction History
          </h2>
          <button
            onClick={() => setShowAll(!showAll)}
            className="uppercase text-[10px] font-medium tracking-widest text-concrete-muted hover:text-brass transition-colors"
          >
            {showAll ? 'Show Less' : 'View All'}
          </button>
        </div>

        <div className="border-t border-obsidian">
          {visible.map((tx, idx) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.08 }}
              className="border-b border-obsidian/10 py-5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    tx.type === 'credit'
                      ? 'bg-brass/15 text-brass'
                      : 'bg-obsidian/8 text-obsidian'
                  }`}
                >
                  {tx.type === 'credit' ? (
                    <ArrowUpRight size={18} />
                  ) : (
                    <ArrowDownRight size={18} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate text-obsidian">{tx.desc}</p>
                  <p className="text-xs text-concrete-muted">
                    {tx.date} · {tx.id.slice(0, 14)}
                  </p>
                </div>
              </div>
              <span
                className={`font-bold text-sm tabular-nums shrink-0 ${
                  tx.type === 'credit' ? 'text-brass' : 'text-obsidian'
                }`}
              >
                {tx.type === 'credit' ? '+' : ''}${Math.abs(Number(tx.amount)).toFixed(2)}
              </span>
            </motion.div>
          ))}
          {!visible.length && (
            <p className="text-sm text-concrete-muted py-8 text-center">
              No transactions yet — top up or redeem a code to start.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
