'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Loader2,
  LogOut,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { onValue, push, ref, remove, set } from 'firebase/database';
import { getRTDB, RTDB_NODES } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';
import type { DBAddress } from '@/lib/store';

export type Address = DBAddress;

const emptyAddress = {
  label: 'Home',
  name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
  isDefault: false,
};

const input =
  'w-full border border-obsidian/15 rounded px-3 py-2 text-sm bg-concrete focus:outline-none focus:border-brass';

export default function ProfilePage() {
  const { user, loading, signOut, saveDisplayName } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addrLoading, setAddrLoading] = useState(true);
  const [form, setForm] = useState(emptyAddress);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [name, setName] = useState('');
  const [nameSaved, setNameSaved] = useState(false);

  useEffect(() => {
    if (user?.displayName) setName(user.displayName);
  }, [user?.displayName]);

  useEffect(() => {
    if (loading || !user) {
      setAddrLoading(false);
      return;
    }
    const db = getRTDB();
    if (!db) {
      setAddrLoading(false);
      return;
    }
    const unsub = onValue(
      ref(db, `${RTDB_NODES.users}/${user.uid}/addresses`),
      (snap) => {
        const val = snap.val();
        if (val && typeof val === 'object') {
          const list: Address[] = Object.entries(val).map(([id, v]: [string, any]) => ({
            id,
            ...v,
          }));
          list.sort((a, b) => Number(b.isDefault) - Number(a.isDefault) || (b.createdAt ?? 0) - (a.createdAt ?? 0));
          setAddresses(list);
        } else {
          setAddresses([]);
        }
        setAddrLoading(false);
      },
      () => setAddrLoading(false)
    );
    return () => unsub();
  }, [loading, user]);

  function flash(text: string) {
    setMsg(text);
    window.setTimeout(() => setMsg(''), 3500);
  }

  if (loading) {
    return (
      <div className="px-6 py-24 text-center text-sm text-concrete-muted">
        Loading your account…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-6 py-24 max-w-md mx-auto text-center">
        <p className="text-[10px] font-medium tracking-widest uppercase text-brass mb-2">
          Lab Account
        </p>
        <h1 className="text-4xl font-serif-display font-bold tracking-tight text-obsidian mb-4">
          Sign in required.
        </h1>
        <p className="text-sm text-concrete-muted mb-8">
          Your profile, orders and address book live behind a login.
        </p>
        <div className="flex gap-2 justify-center">
          <Link
            href="/login"
            className="uppercase text-[10px] font-medium tracking-widest px-5 py-2.5 rounded bg-obsidian text-concrete hover:bg-obsidian-soft"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="uppercase text-[10px] font-medium tracking-widest px-5 py-2.5 rounded border border-obsidian/20 hover:border-brass hover:text-brass"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  async function saveName() {
    if (!name.trim()) return;
    setBusy(true);
    try {
      await saveDisplayName(name);
      setNameSaved(true);
      window.setTimeout(() => setNameSaved(false), 2500);
    } catch {
      flash('Could not save name.');
    }
    setBusy(false);
  }

  async function saveAddress() {
    const db = getRTDB();
    if (!db) return flash('Firebase not configured.');
    if (!user) return;
    if (!form.name.trim() || !form.line1.trim() || !form.city.trim() || !form.pincode.trim()) {
      return flash('Name, street, city and pincode are required.');
    }
    setBusy(true);
    try {
      const payload = {
        label: form.label || 'Home',
        name: form.name.trim(),
        phone: form.phone.trim(),
        line1: form.line1.trim(),
        line2: form.line2.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
        country: form.country.trim() || 'India',
        isDefault: form.isDefault || addresses.length === 0,
        createdAt: Date.now(),
      };
      const node = `${RTDB_NODES.users}/${user.uid}/addresses`;
      if (editingId) {
        await set(ref(db, `${node}/${editingId}`), payload);
        flash('Address updated.');
      } else {
        await push(ref(db, node), payload);
        flash('Address saved.');
      }
      // Only one default
      if (payload.isDefault) {
        const others = addresses.filter((a) => a.id !== editingId && a.isDefault);
        for (const o of others) {
          await set(ref(db, `${node}/${o.id}/isDefault`), false);
        }
      }
      setForm(emptyAddress);
      setEditingId(null);
      setFormOpen(false);
    } catch (e: any) {
      flash(`Save failed: ${e?.message || e}`);
    }
    setBusy(false);
  }

  async function delAddress(id: string) {
    if (!confirm('Delete this address?')) return;
    const db = getRTDB();
    if (!db || !user) return;
    await remove(ref(db, `${RTDB_NODES.users}/${user.uid}/addresses/${id}`));
    flash('Address deleted.');
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
          <h1 className="text-5xl md:text-6xl font-serif-display font-bold tracking-tight text-obsidian">
            Your Profile
          </h1>
          <p className="text-xs text-concrete-muted mt-2">{user.email}</p>
        </div>
        <button
          onClick={() => signOut()}
          className="uppercase text-[10px] font-medium tracking-widest px-4 py-2 rounded-full border border-obsidian/20 hover:border-red-500 hover:text-red-500 flex items-center gap-2"
        >
          <LogOut size={12} /> Sign Out
        </button>
      </motion.div>

      {msg && (
        <div className="border border-brass/40 bg-brass/10 rounded-lg px-4 py-3 text-xs mb-6">
          {msg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Profile + shortcuts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-obsidian/10 rounded-lg p-6 bg-concrete">
            <h2 className="font-serif-display font-bold text-lg mb-4">Profile</h2>
            <label className="text-[10px] uppercase tracking-widest text-concrete-muted">Display name</label>
            <div className="flex gap-2 mt-1">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={input} />
              <button
                onClick={saveName}
                disabled={busy}
                className="px-4 py-2 rounded bg-obsidian text-concrete hover:bg-obsidian-soft disabled:opacity-50 flex items-center gap-1"
                title="Save name"
              >
                {nameSaved ? <Check size={14} className="text-brass" /> : <Check size={14} />}
              </button>
            </div>
            <label className="text-[10px] uppercase tracking-widest text-concrete-muted block mt-4">Email</label>
            <p className="text-sm mt-1">{user.email}</p>
          </div>

          <div className="border border-obsidian/10 rounded-lg p-6 bg-obsidian text-concrete">
            <h2 className="font-serif-display font-bold text-lg mb-4">Shortcuts</h2>
            <div className="space-y-2">
              <Link href="/balance" className="flex items-center justify-between text-sm hover:text-brass transition-colors py-1">
                Store balance & history <ArrowRight size={14} />
              </Link>
              <Link href="/shop" className="flex items-center justify-between text-sm hover:text-brass transition-colors py-1">
                Continue shopping <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Address book */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif-display font-bold text-lg flex items-center gap-2">
              <MapPin size={18} className="text-brass" /> Address Book
            </h2>
            <button
              onClick={() => {
                setFormOpen(!formOpen);
                setEditingId(null);
                setForm({ ...emptyAddress, name: user.displayName ?? '' });
              }}
              className="uppercase text-[10px] font-medium tracking-widest px-4 py-2 rounded-full bg-obsidian text-concrete hover:bg-obsidian-soft flex items-center gap-2"
            >
              <Plus size={12} /> {formOpen ? 'Close' : 'New Address'}
            </button>
          </div>

          {formOpen && (
            <div className="border border-obsidian/10 rounded-lg p-6 bg-concrete-mid mb-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <select value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className={input}>
                  <option>Home</option>
                  <option>Work</option>
                  <option>Other</option>
                </select>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className={input} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name *" className={input} />
                <input value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} placeholder="Street / flat *" className={input} />
              </div>
              <input value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} placeholder="Landmark (optional)" className={input} />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City *" className={input} />
                <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="State" className={input} />
                <input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} placeholder="Pincode *" className={input} />
                <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="Country" className={input} />
              </div>
              <label className="flex items-center gap-2 text-xs text-concrete-muted">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                />
                Use as default shipping address
              </label>
              <div className="flex gap-2">
                <button
                  onClick={saveAddress}
                  disabled={busy}
                  className="flex-1 uppercase text-[10px] font-medium tracking-widest px-4 py-2.5 rounded bg-obsidian text-concrete hover:bg-obsidian-soft disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {busy ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  {editingId ? 'Update Address' : 'Save Address'}
                </button>
                {editingId && (
                  <button
                    onClick={() => { setEditingId(null); setForm(emptyAddress); setFormOpen(false); }}
                    className="px-4 py-2.5 rounded border border-obsidian/20"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          )}

          {addrLoading ? (
            <p className="text-sm text-concrete-muted">Loading addresses…</p>
          ) : addresses.length === 0 ? (
            <div className="border border-dashed border-obsidian/25 rounded-lg p-8 text-center">
              <p className="font-medium text-sm mb-1">No saved addresses yet.</p>
              <p className="text-xs text-concrete-muted">Add one for faster checkout.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((a) => (
                <div key={a.id} className="border border-obsidian/10 rounded-lg p-4 bg-concrete flex gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium flex items-center gap-2">
                      {a.label}
                      {a.isDefault && (
                        <span className="text-[9px] uppercase tracking-widest bg-brass/20 text-brass px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </p>
                    <p className="text-sm mt-1">{a.name}{a.phone ? ` · ${a.phone}` : ''}</p>
                    <p className="text-xs text-concrete-muted">
                      {a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city}{a.state ? `, ${a.state}` : ''} — {a.pincode}, {a.country}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setEditingId(a.id);
                        setForm({
                          label: a.label, name: a.name, phone: a.phone,
                          line1: a.line1, line2: a.line2 || '', city: a.city,
                          state: a.state || '', pincode: a.pincode,
                          country: a.country || 'India', isDefault: a.isDefault,
                        });
                        setFormOpen(true);
                      }}
                      className="p-2 border border-obsidian/15 rounded-full hover:border-brass hover:text-brass"
                      title="Edit"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => delAddress(a.id)}
                      className="p-2 border border-obsidian/15 rounded-full hover:border-red-500 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
