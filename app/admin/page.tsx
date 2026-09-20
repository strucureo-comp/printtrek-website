'use client';

import { useEffect, useRef, useState } from 'react';
import { push, ref, remove, set, update } from 'firebase/database';
import {
  fileToBase64Resized,
  formatBytes,
  getRTDB,
  isFirebaseConfigured,
  RTDB_NODES,
} from '@/lib/firebase';
import {
  useLiveJournal,
  useLiveOrders,
  useLiveProducts,
  useLiveUsers,
  type DBJournal,
  type DBOrder,
  type DBProduct,
  type DBUser,
  type OrderStatus,
} from '@/lib/store';
import { ArrowLeft, ImagePlus, Loader2, Trash2, Pencil, Check, X } from 'lucide-react';
import Link from 'next/link';

type Tab = 'products' | 'orders' | 'users' | 'journal';

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || 'printtrek-admin-2026';
const configured = isFirebaseConfigured();

const input =
  'w-full border border-obsidian/15 rounded px-3 py-2 text-sm bg-concrete focus:outline-none focus:border-brass';

const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'printing',
  'shipped',
  'delivered',
  'cancelled',
];

const statusStyle: Record<OrderStatus, string> = {
  pending: 'bg-concrete-mid text-obsidian',
  confirmed: 'bg-brass/20 text-brass',
  printing: 'bg-brass/20 text-brass',
  shipped: 'bg-obsidian text-concrete',
  delivered: 'bg-green-900 text-green-100',
  cancelled: 'bg-red-900/15 text-red-500',
};

export default function AdminPage() {
  // Always start logged-out so server HTML matches first client render.
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem('pt-admin') === '1') setAuthed(true);
  }, []);
  const [pin, setPin] = useState('');
  const [tab, setTab] = useState<Tab>('products');
  const [msg, setMsg] = useState('');

  const { items: products, live, loading: productsLoading } = useLiveProducts();
  const { items: orders } = useLiveOrders();
  const { items: users } = useLiveUsers();
  const { items: posts } = useLiveJournal();

  function flash(text: string) {
    setMsg(text);
    window.setTimeout(() => setMsg(''), 3500);
  }

  function login() {
    if (pin === ADMIN_KEY) {
      sessionStorage.setItem('pt-admin', '1');
      setAuthed(true);
      setMsg('');
    } else {
      flash('Wrong admin key. Check .env.local → NEXT_PUBLIC_ADMIN_KEY.');
    }
  }

  if (!authed) {
    return (
      <div className="px-6 py-24 max-w-md mx-auto text-center">
        <p className="text-[10px] font-medium tracking-widest uppercase text-brass mb-2">
          Print Trek · Internal
        </p>
        <h1 className="text-4xl font-serif-display font-bold tracking-tight text-obsidian mb-4">
          Admin Panel
        </h1>
        <p className="text-sm text-concrete-muted mb-8">
          Enter the admin key from <code>.env.local</code> (
          <code>NEXT_PUBLIC_ADMIN_KEY</code>) to manage products, orders, users
          and journal posts in Firebase RTDB.
        </p>
        <div className="flex gap-2">
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && login()}
            placeholder="Admin key"
            className="flex-1 border border-obsidian/15 rounded px-4 py-2 text-sm focus:outline-none focus:border-brass bg-concrete"
          />
          <button
            onClick={login}
            className="uppercase text-[10px] font-medium tracking-widest px-5 py-2.5 rounded bg-obsidian text-concrete hover:bg-obsidian-soft"
          >
            Unlock
          </button>
        </div>
        {msg && <p className="text-xs text-brass mt-4">{msg}</p>}
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-concrete-muted hover:text-brass mt-8">
          <ArrowLeft size={14} /> Back to site
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-12 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-end mb-8">
        <div>
          <p className="text-[10px] font-medium tracking-widest uppercase text-brass mb-2">
            Print Trek · Admin {configured ? '' : '· Firebase missing'}
          </p>
          <h1 className="text-4xl md:text-5xl font-serif-display font-bold tracking-tight text-obsidian">
            Control Room
          </h1>
          <p className="text-xs text-concrete-muted mt-2">
            {live ? '● connected to Firebase' : '○ not connected'} ·{' '}
            {productsLoading ? 'syncing…' : `${products.length} products`} ·{' '}
            {orders.length} orders · {users.length} users · {posts.length} posts
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              sessionStorage.removeItem('pt-admin');
              setAuthed(false);
            }}
            className="uppercase text-[10px] font-medium tracking-widest px-4 py-2 rounded bg-obsidian text-concrete hover:bg-obsidian-soft"
          >
            Lock
          </button>
        </div>
      </div>

      {!configured && (
        <div className="border border-brass/40 bg-brass/10 rounded-lg p-4 text-xs mb-8">
          Firebase env vars are missing. Create <code>.env.local</code> from{' '}
          <code>.env.example</code> with your apiKey / databaseURL / appId, then
          restart <code>npm run dev</code>.
        </div>
      )}

      {msg && (
        <div className="border border-obsidian/15 rounded-lg p-3 text-xs mb-6 bg-concrete-mid">
          {msg}
        </div>
      )}

      <div className="flex gap-2 mb-8 flex-wrap">
        {(['products', 'orders', 'users', 'journal'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`uppercase text-[10px] font-medium tracking-widest px-4 py-2 rounded-full border transition-colors ${
              tab === t
                ? 'bg-obsidian text-concrete border-obsidian'
                : 'border-obsidian/20 text-concrete-muted hover:border-brass hover:text-brass'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'products' && <ProductManager onFlash={flash} products={products} />}
      {tab === 'orders' && <OrderManager onFlash={flash} orders={orders} />}
      {tab === 'users' && <UserManager onFlash={flash} users={users} />}
      {tab === 'journal' && <JournalManager onFlash={flash} posts={posts} />}
    </div>
  );
}

/* ---------------- Shared bits ---------------- */

function RowButtons({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <>
      <button onClick={onEdit} className="p-2 border border-obsidian/15 rounded-full hover:border-brass hover:text-brass shrink-0" title="Edit">
        <Pencil size={14} />
      </button>
      <button onClick={onDelete} className="p-2 border border-obsidian/15 rounded-full hover:border-red-500 hover:text-red-500 shrink-0" title="Delete">
        <Trash2 size={14} />
      </button>
    </>
  );
}

function EmptyNote({ text }: { text: string }) {
  return (
    <p className="text-xs text-concrete-muted border border-dashed border-obsidian/25 rounded-lg p-6 text-center">
      {text}
    </p>
  );
}

function SaveButton({ busy, editing }: { busy: boolean; editing: boolean }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="flex-1 uppercase text-[10px] font-medium tracking-widest px-4 py-2.5 rounded bg-obsidian text-concrete hover:bg-obsidian-soft disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {busy ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}{' '}
      {editing ? 'Update' : 'Add'}
    </button>
  );
}

/** URL input + base64 file upload with preview. Shared by products & journal. */
/** Interactive 1:1 cropper — drag to position, slider to zoom, outputs 800×800 base64. */
function SquareCropper({
  src,
  onConfirm,
  onCancel,
}: {
  src: string;
  onConfirm: (dataUrl: string, bytes: number) => void;
  onCancel: () => void;
}) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ u: 0.5, v: 0.5 });
  const [box, setBox] = useState(0);
  const viewRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; u: number; v: number } | null>(null);

  useEffect(() => {
    const im = new Image();
    im.onload = () => setImg(im);
    im.src = src;
  }, [src]);

  useEffect(() => {
    const measure = () => {
      if (viewRef.current) setBox(viewRef.current.clientWidth);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Cover-fit geometry in display px
  const V = box;
  const s0 = img && V ? V / Math.min(img.width, img.height) : 0;
  const s = s0 * zoom;
  const dw = img ? img.width * s : 0;
  const dh = img ? img.height * s : 0;
  const left = -(pan.u * Math.max(0, dw - V));
  const top = -(pan.v * Math.max(0, dh - V));

  function onPointerDown(e: React.PointerEvent) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, u: pan.u, v: pan.v };
  }
  function onPointerMove(e: React.PointerEvent) {
    const d = drag.current;
    if (!d || !V) return;
    const runX = Math.max(1, dw - V);
    const runY = Math.max(1, dh - V);
    const clamp = (n: number) => Math.min(1, Math.max(0, n));
    setPan({
      u: clamp(d.u - (e.clientX - d.x) / runX),
      v: clamp(d.v - (e.clientY - d.y) / runY),
    });
  }
  function onPointerUp() {
    drag.current = null;
  }

  function confirm() {
    if (!img || !s) return;
    const n = V / s; // crop square in natural px
    const x = pan.u * (img.width - n);
    const y = pan.v * (img.height - n);
    const OUT = 800;
    const canvas = document.createElement('canvas');
    canvas.width = OUT;
    canvas.height = OUT;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(img, x, y, n, n, 0, 0, OUT, OUT);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
    onConfirm(dataUrl, Math.round((dataUrl.length * 3) / 4));
  }

  return (
    <div className="fixed inset-0 z-[60] bg-obsidian/70 flex items-center justify-center p-4">
      <div className="bg-concrete rounded-lg p-5 w-full max-w-sm">
        <p className="text-[10px] uppercase tracking-widest text-brass mb-1">Crop 1:1</p>
        <h3 className="font-serif-display font-bold text-lg mb-4">Frame the square</h3>
        <div
          ref={viewRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className="relative w-full aspect-square overflow-hidden rounded-lg bg-obsidian cursor-grab active:cursor-grabbing touch-none select-none"
        >
          {img && V > 0 && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt="crop"
              draggable={false}
              className="absolute max-w-none"
              style={{ width: dw, height: dh, left, top }}
            />
          )}
          <div className="absolute inset-0 pointer-events-none border-2 border-brass/70 rounded-lg" />
        </div>
        <div className="flex items-center gap-3 mt-4">
          <span className="text-[10px] uppercase tracking-widest text-concrete-muted">Zoom</span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => { setZoom(1); setPan({ u: 0.5, v: 0.5 }); }}
            className="text-[10px] uppercase tracking-widest text-concrete-muted hover:text-brass"
          >
            Reset
          </button>
        </div>
        <p className="text-[11px] text-concrete-muted mt-2 mb-4">
          Drag to position · outputs 800×800 for uniform 1:1 cards.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={confirm}
            className="flex-1 uppercase text-[10px] font-medium tracking-widest px-4 py-2.5 rounded bg-obsidian text-concrete hover:bg-obsidian-soft"
          >
            Use This Crop
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded border border-obsidian/20 text-sm"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ImageField({
  value,
  onChange,
  onFlash,
  squareCrop,
}: {
  value: string;
  onChange: (v: string) => void;
  onFlash: (m: string) => void;
  squareCrop?: boolean;
}) {
  const [bytes, setBytes] = useState<number | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  function readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onerror = () => reject(new Error('Could not read file'));
      r.onload = () => resolve(r.result as string);
      r.readAsDataURL(file);
    });
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (squareCrop) {
        // Open the 1:1 cropper — output replaces the image on confirm.
        setCropSrc(await readFile(file));
      } else {
        const { dataUrl, bytes: b } = await fileToBase64Resized(file);
        setBytes(b);
        if (b > 500 * 1024) {
          onFlash('Image is large for RTDB free tier — it will save, but smaller photos are safer.');
        }
        onChange(dataUrl);
      }
    } catch (err: any) {
      onFlash(`Upload failed: ${err?.message || err}`);
    }
    e.target.value = '';
  }

  function onCropConfirm(dataUrl: string, b: number) {
    setBytes(b);
    if (b > 500 * 1024) {
      onFlash('Cropped image is large for RTDB free tier — consider a smaller zoom.');
    }
    onChange(dataUrl);
    setCropSrc(null);
  }

  const isBase64 = value.startsWith('data:');

  return (
    <>
      <input
        value={isBase64 ? '' : value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Image URL — or upload below"
        className={input}
      />
      <label className="flex items-center gap-2 border border-dashed border-obsidian/25 rounded-lg p-4 cursor-pointer hover:border-brass text-xs text-concrete-muted">
        <ImagePlus size={16} className="text-brass shrink-0" />
        {isBase64
          ? `Base64 ready${bytes ? ` (${formatBytes(bytes)})` : ''} — click to replace`
          : 'Upload photo → stored as base64 in RTDB (free tier)'}
        <input type="file" accept="image/*" className="hidden" onChange={onFile} />
      </label>
      {squareCrop && isBase64 && (
        <button
          type="button"
          onClick={() => setCropSrc(value)}
          className="w-full uppercase text-[10px] font-medium tracking-widest px-4 py-2 rounded-full border border-obsidian/20 hover:border-brass hover:text-brass"
        >
          Crop 1:1 Again
        </button>
      )}
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt="preview"
          className={`w-full ${squareCrop ? 'aspect-square' : 'aspect-[4/3]'} object-cover rounded-lg bg-obsidian`}
        />
      )}
      {cropSrc && (
        <SquareCropper
          src={cropSrc}
          onConfirm={onCropConfirm}
          onCancel={() => setCropSrc(null)}
        />
      )}
    </>
  );
}

function CancelEdit({ onCancel }: { onCancel: () => void }) {
  return (
    <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded border border-obsidian/20" title="Cancel">
      <X size={14} />
    </button>
  );
}

/* ---------------- Products ---------------- */

const emptyProduct = {
  title: '',
  price: '$29',
  desc: '',
  img: '',
  category: 'Anime' as DBProduct['category'],
  badge: '',
  featured: false,
  slug: '',
  details: '',
  size: '15×20cm',
  depth: '3CM',
  material: 'PLA · HueForge layered',
  finish: 'Matte Black',
  stock: 'In Stock' as NonNullable<DBProduct['stock']>,
};

const STOCK_OPTIONS = ['In Stock', 'Made to Order', 'Sold Out'] as const;

function slugify(t: string) {
  return (
    t
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'frame'
  );
}

function ProductManager({
  onFlash,
  products,
}: {
  onFlash: (m: string) => void;
  products: DBProduct[];
}) {
  const [form, setForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const db = getRTDB();
    if (!db) return onFlash('Firebase not configured.');
    if (!form.title || !form.img) return onFlash('Title + image are required.');
    setBusy(true);
    try {
      const payload = {
        title: form.title,
        price: form.price,
        desc: form.desc,
        img: form.img,
        category: form.category,
        badge: form.badge || '',
        featured: form.featured,
        slug: form.slug.trim() || slugify(form.title),
        details: form.details.trim(),
        size: form.size.trim() || '15×20cm',
        depth: form.depth.trim() || '3CM',
        material: form.material.trim(),
        finish: form.finish.trim(),
        stock: form.stock,
        createdAt: Date.now(),
      };
      if (editingId) {
        await set(ref(db, `${RTDB_NODES.products}/${editingId}`), payload);
        onFlash('Product updated.');
      } else {
        await push(ref(db, RTDB_NODES.products), payload);
        onFlash('Product added.');
      }
      setForm(emptyProduct);
      setEditingId(null);
    } catch (err: any) {
      onFlash(`Save failed: ${err?.message || err}. Check RTDB Rules allow write.`);
    }
    setBusy(false);
  }

  async function del(id: string) {
    if (!confirm('Delete this product?')) return;
    const db = getRTDB();
    if (!db) return;
    await remove(ref(db, `${RTDB_NODES.products}/${id}`));
    onFlash('Product deleted.');
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <form onSubmit={save} className="lg:col-span-2 border border-obsidian/10 rounded-lg p-6 bg-concrete h-fit">
        <h2 className="font-serif-display font-bold text-lg mb-4">
          {editingId ? 'Edit product' : 'New product'}
        </h2>
        <div className="space-y-3">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title — Shadow Set 04" className={input} />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="$29" className={input} />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as any })} className={input}>
              <option>Anime</option>
              <option>Movies</option>
              <option>Custom</option>
            </select>
          </div>
          <textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="Short description" rows={3} className={input} />
          <textarea value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} placeholder="Long description for the slug page — story, process, what's in the box…" rows={4} className={input} />
          <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="URL slug — auto from title if empty (e.g. shadow-set-04)" className={input} />
          <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="Badge (optional) — Best Seller" className={input} />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="Size — 15×20cm" className={input} />
            <input value={form.depth} onChange={(e) => setForm({ ...form, depth: e.target.value })} placeholder="Depth — 3CM" className={input} />
            <input value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} placeholder="Material" className={input} />
            <input value={form.finish} onChange={(e) => setForm({ ...form, finish: e.target.value })} placeholder="Finish" className={input} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[10px] uppercase tracking-widest text-concrete-muted">Stock</span>
              <select
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value as any })}
                className={`${input} mt-1`}
              >
                {STOCK_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-widest text-concrete-muted">Show on home page</span>
            <select
              value={form.featured ? 'yes' : 'no'}
              onChange={(e) => setForm({ ...form, featured: e.target.value === 'yes' })}
              className={`${input} mt-1`}
            >
              <option value="no">No — shop only</option>
              <option value="yes">Yes — feature on home page</option>
            </select>
          </label>
          </div>
          <ImageField value={form.img} onChange={(v) => setForm({ ...form, img: v })} onFlash={onFlash} squareCrop />
          <div className="flex gap-2">
            <SaveButton busy={busy} editing={!!editingId} />
            {editingId && <CancelEdit onCancel={() => { setEditingId(null); setForm(emptyProduct); }} />}
          </div>
        </div>
      </form>

      <div className="lg:col-span-3 space-y-3">
        {!products.length && <EmptyNote text="No products yet — add your first real frame with the form." />}
        {products.map((p) => (
          <div key={p.id} className="border border-obsidian/10 rounded-lg p-4 flex gap-3 items-center bg-concrete">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.img} alt={p.title} className="w-16 h-16 rounded object-cover bg-obsidian shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm truncate">
                {p.featured && <span className="text-brass mr-1">★</span>}{p.title}
              </p>
              <p className="text-xs text-concrete-muted truncate">{p.category} · {p.price} {p.badge ? `· ${p.badge}` : ''}</p>
              <p className="text-[11px] text-concrete-muted truncate">/{p.slug || p.id} · {p.stock || 'In Stock'}</p>
            </div>
            <RowButtons
              onEdit={() => { setEditingId(p.id); setForm({ title: p.title, price: p.price, desc: p.desc, img: p.img, category: p.category, badge: p.badge || '', featured: !!p.featured, slug: p.slug || '', details: p.details || '', size: p.size || '15×20cm', depth: p.depth || '3CM', material: p.material || '', finish: p.finish || '', stock: p.stock || 'In Stock' }); }}
              onDelete={() => del(p.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Orders ---------------- */

const emptyOrder = {
  customer: '',
  contact: '',
  items: '',
  amount: '',
  status: 'pending' as OrderStatus,
  note: '',
};

function OrderManager({
  onFlash,
  orders,
}: {
  onFlash: (m: string) => void;
  orders: DBOrder[];
}) {
  const [form, setForm] = useState(emptyOrder);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');

  const visible = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const db = getRTDB();
    if (!db) return onFlash('Firebase not configured.');
    const amount = Number(form.amount);
    if (!form.customer.trim() || !form.items.trim() || !amount) {
      return onFlash('Customer + items + amount are required.');
    }
    setBusy(true);
    try {
      const payload = {
        customer: form.customer.trim(),
        contact: form.contact.trim(),
        items: form.items.trim(),
        amount,
        status: form.status,
        note: form.note.trim(),
        createdAt: Date.now(),
      };
      if (editingId) {
        await set(ref(db, `${RTDB_NODES.orders}/${editingId}`), payload);
        onFlash('Order updated.');
      } else {
        await push(ref(db, RTDB_NODES.orders), payload);
        onFlash('Order added.');
      }
      setForm(emptyOrder);
      setEditingId(null);
    } catch (err: any) {
      onFlash(`Save failed: ${err?.message || err}`);
    }
    setBusy(false);
  }

  async function setStatus(o: DBOrder, status: OrderStatus) {
    const db = getRTDB();
    if (!db) return;
    await update(ref(db, `${RTDB_NODES.orders}/${o.id}`), { status });
    onFlash(`Order → ${status}.`);
  }

  async function del(id: string) {
    if (!confirm('Delete this order?')) return;
    const db = getRTDB();
    if (!db) return;
    await remove(ref(db, `${RTDB_NODES.orders}/${id}`));
    onFlash('Order deleted.');
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <form onSubmit={save} className="lg:col-span-2 border border-obsidian/10 rounded-lg p-6 bg-concrete h-fit">
        <h2 className="font-serif-display font-bold text-lg mb-4">
          {editingId ? 'Edit order' : 'New order'}
        </h2>
        <div className="space-y-3">
          <input value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} placeholder="Customer name" className={input} />
          <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="Phone / email" className={input} />
          <textarea value={form.items} onChange={(e) => setForm({ ...form, items: e.target.value })} placeholder="Items — Shadow Set 01 × 2" rows={2} className={input} />
          <div className="grid grid-cols-2 gap-3">
            <input value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Amount — 58" inputMode="decimal" className={input} />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as OrderStatus })} className={input}>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Note (optional)" rows={2} className={input} />
          <div className="flex gap-2">
            <SaveButton busy={busy} editing={!!editingId} />
            {editingId && <CancelEdit onCancel={() => { setEditingId(null); setForm(emptyOrder); }} />}
          </div>
        </div>
      </form>

      <div className="lg:col-span-3 space-y-3">
        <div className="flex gap-2 flex-wrap">
          {(['all', ...ORDER_STATUSES] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border transition-colors ${
                filter === s ? 'bg-obsidian text-concrete border-obsidian' : 'border-obsidian/20 text-concrete-muted hover:border-brass'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {!visible.length && <EmptyNote text={orders.length ? 'No orders with this status.' : 'No orders yet — add the first one with the form.'} />}
        {visible.map((o) => (
          <div key={o.id} className="border border-obsidian/10 rounded-lg p-4 bg-concrete">
            <div className="flex gap-3 items-start">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate">{o.customer} <span className="text-concrete-muted font-normal">· ${Number(o.amount).toFixed(2)}</span></p>
                <p className="text-xs text-concrete-muted truncate">{o.items}</p>
                {o.contact && <p className="text-[11px] text-concrete-muted truncate">{o.contact}</p>}
                {o.note && <p className="text-[11px] text-concrete-muted italic truncate">“{o.note}”</p>}
              </div>
              <RowButtons
                onEdit={() => { setEditingId(o.id); setForm({ customer: o.customer, contact: o.contact || '', items: o.items, amount: String(o.amount), status: o.status, note: o.note || '' }); }}
                onDelete={() => del(o.id)}
              />
            </div>
            <div className="flex gap-1.5 mt-3 flex-wrap">
              {ORDER_STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(o, s)}
                  className={`text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full transition-opacity ${
                    o.status === s ? statusStyle[s] : 'border border-obsidian/15 text-concrete-muted opacity-60 hover:opacity-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Users ---------------- */

const emptyUser = { name: '', email: '', phone: '', address: '', note: '' };

function UserManager({
  onFlash,
  users,
}: {
  onFlash: (m: string) => void;
  users: DBUser[];
}) {
  const [form, setForm] = useState(emptyUser);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = query
    ? users.filter((u) =>
        `${u.name} ${u.email} ${u.phone || ''}`.toLowerCase().includes(query.toLowerCase())
      )
    : users;

  function addressList(u: DBUser) {
    if (!u.addresses || typeof u.addresses !== 'object') return [];
    return Object.entries(u.addresses).map(([id, a]) => ({ id, ...a }));
  }

  function fmtDate(ts?: number) {
    if (!ts) return '—';
    return new Date(ts).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const db = getRTDB();
    if (!db) return onFlash('Firebase not configured.');
    if (!form.name.trim() || !form.email.trim()) return onFlash('Name + email are required.');
    setBusy(true);
    try {
      // update() — never wipes sub-nodes like addresses on auth-synced records.
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        note: form.note.trim(),
        createdAt: Date.now(),
      };
      if (editingId) {
        await update(ref(db, `${RTDB_NODES.users}/${editingId}`), payload);
        onFlash('User updated.');
      } else {
        await push(ref(db, RTDB_NODES.users), payload);
        onFlash('User added.');
      }
      setForm(emptyUser);
      setEditingId(null);
    } catch (err: any) {
      onFlash(`Save failed: ${err?.message || err}`);
    }
    setBusy(false);
  }

  async function del(id: string) {
    if (!confirm('Delete this user and all their data (incl. addresses)?')) return;
    const db = getRTDB();
    if (!db) return;
    await remove(ref(db, `${RTDB_NODES.users}/${id}`));
    onFlash('User deleted.');
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <form onSubmit={save} className="lg:col-span-2 border border-obsidian/10 rounded-lg p-6 bg-concrete h-fit">
        <h2 className="font-serif-display font-bold text-lg mb-4">
          {editingId ? 'Edit user' : 'New user'}
        </h2>
        <div className="space-y-3">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className={input} />
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" type="email" className={input} />
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone (optional)" className={input} />
          <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Address (optional)" rows={2} className={input} />
          <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Note (optional)" rows={2} className={input} />
          <div className="flex gap-2">
            <SaveButton busy={busy} editing={!!editingId} />
            {editingId && <CancelEdit onCancel={() => { setEditingId(null); setForm(emptyUser); }} />}
          </div>
        </div>
        <p className="text-[11px] text-concrete-muted mt-4">
          Signed-up customers appear here automatically via login/signup.
        </p>
      </form>

      <div className="lg:col-span-3 space-y-3">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name / email / phone…" className={`${input} max-w-sm`} />
        {!visible.length && <EmptyNote text={users.length ? 'No users match this search.' : 'No users yet — signups appear here automatically.'} />}
        {visible.map((u) => {
          const addrs = addressList(u);
          const open = openId === u.id;
          return (
            <div key={u.id} className="border border-obsidian/10 rounded-lg p-4 bg-concrete">
              <div className="flex gap-3 items-center">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : u.id)}
                  className="w-10 h-10 rounded-full bg-obsidian text-concrete flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden relative"
                  title={open ? 'Collapse' : 'Expand full record'}
                >
                  <span>{(u.name || u.email || '?').charAt(0).toUpperCase()}</span>
                  {u.photo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={u.photo}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  )}
                </button>
                <button type="button" onClick={() => setOpenId(open ? null : u.id)} className="min-w-0 flex-1 text-left">
                  <p className="font-medium text-sm truncate">
                    {u.name || '(no name)'}{' '}
                    <span className="font-normal text-[10px] uppercase tracking-widest text-concrete-muted">
                      {addrs.length > 0 && `${addrs.length} addr`}
                    </span>
                  </p>
                  <p className="text-xs text-concrete-muted truncate">{u.email}{u.phone ? ` · ${u.phone}` : ''}</p>
                  {u.address && <p className="text-[11px] text-concrete-muted truncate">{u.address}</p>}
                </button>
                <span className="text-concrete-muted text-xs shrink-0">{open ? '▴' : '▾'}</span>
                <RowButtons
                  onEdit={() => { setEditingId(u.id); setForm({ name: u.name || '', email: u.email || '', phone: u.phone || '', address: u.address || '', note: u.note || '' }); }}
                  onDelete={() => del(u.id)}
                />
              </div>

              {open && (
                <div className="mt-3 pt-3 border-t border-obsidian/10 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-concrete-muted">
                    <p><span className="uppercase tracking-widest text-[10px]">Phone:</span> {u.phone || '—'}</p>
                    <p><span className="uppercase tracking-widest text-[10px]">Note:</span> {u.note || '—'}</p>
                    <p><span className="uppercase tracking-widest text-[10px]">Last login:</span> {fmtDate(u.lastLogin)}</p>
                    <p><span className="uppercase tracking-widest text-[10px]">Joined:</span> {fmtDate(u.createdAt)}</p>
                  </div>
                  <p className="uppercase tracking-widest text-[10px] text-concrete-muted break-all">UID: {u.id}</p>

                  <div>
                    <p className="uppercase tracking-widest text-[10px] text-brass mb-2">
                      Address book ({addrs.length})
                    </p>
                    {!addrs.length ? (
                      <p className="text-concrete-muted">No saved addresses — customer adds them in /profile.</p>
                    ) : (
                      <div className="space-y-2">
                        {addrs.map((a) => (
                          <div key={a.id} className="border border-obsidian/10 rounded-lg p-3 bg-concrete-mid">
                            <p className="font-medium text-sm flex items-center gap-2">
                              {a.label}
                              {a.isDefault && (
                                <span className="text-[9px] uppercase tracking-widest bg-brass/20 text-brass px-2 py-0.5 rounded-full">
                                  Default
                                </span>
                              )}
                            </p>
                            <p className="mt-1">{a.name}{a.phone ? ` · ${a.phone}` : ''}</p>
                            <p className="text-concrete-muted">
                              {a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city}
                              {a.state ? `, ${a.state}` : ''} — {a.pincode}, {a.country}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Journal ---------------- */

const emptyPost = { cat: '', title: '', excerpt: '', img: '' };

function JournalManager({
  onFlash,
  posts,
}: {
  onFlash: (m: string) => void;
  posts: DBJournal[];
}) {
  const [form, setForm] = useState(emptyPost);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const db = getRTDB();
    if (!db) return onFlash('Firebase not configured.');
    if (!form.title.trim() || !form.img) return onFlash('Title + cover image are required.');
    setBusy(true);
    try {
      const payload = {
        cat: form.cat.trim() || 'Lab Notes',
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        img: form.img,
        createdAt: Date.now(),
      };
      if (editingId) {
        await set(ref(db, `${RTDB_NODES.journal}/${editingId}`), payload);
        onFlash('Post updated.');
      } else {
        await push(ref(db, RTDB_NODES.journal), payload);
        onFlash('Post published.');
      }
      setForm(emptyPost);
      setEditingId(null);
    } catch (err: any) {
      onFlash(`Save failed: ${err?.message || err}`);
    }
    setBusy(false);
  }

  async function del(id: string) {
    if (!confirm('Delete this post?')) return;
    const db = getRTDB();
    if (!db) return;
    await remove(ref(db, `${RTDB_NODES.journal}/${id}`));
    onFlash('Post deleted.');
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <form onSubmit={save} className="lg:col-span-2 border border-obsidian/10 rounded-lg p-6 bg-concrete h-fit">
        <h2 className="font-serif-display font-bold text-lg mb-4">
          {editingId ? 'Edit post' : 'New post'}
        </h2>
        <div className="space-y-3">
          <input value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })} placeholder="Category — Process, Lab" className={input} />
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Post title" className={input} />
          <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Excerpt (optional)" rows={3} className={input} />
          <ImageField value={form.img} onChange={(v) => setForm({ ...form, img: v })} onFlash={onFlash} />
          <div className="flex gap-2">
            <SaveButton busy={busy} editing={!!editingId} />
            {editingId && <CancelEdit onCancel={() => { setEditingId(null); setForm(emptyPost); }} />}
          </div>
        </div>
      </form>

      <div className="lg:col-span-3 space-y-3">
        {!posts.length && <EmptyNote text="No journal posts yet — publish the first one with the form." />}
        {posts.map((p) => (
          <div key={p.id} className="border border-obsidian/10 rounded-lg p-4 flex gap-3 items-center bg-concrete">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.img} alt={p.title} className="w-16 h-16 rounded object-cover bg-obsidian shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-widest text-brass">{p.cat}</p>
              <p className="font-medium text-sm truncate">{p.title}</p>
              {p.excerpt && <p className="text-xs text-concrete-muted truncate">{p.excerpt}</p>}
            </div>
            <RowButtons
              onEdit={() => { setEditingId(p.id); setForm({ cat: p.cat, title: p.title, excerpt: p.excerpt || '', img: p.img }); }}
              onDelete={() => del(p.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
