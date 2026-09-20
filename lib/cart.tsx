'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { DBProduct } from './store';

export type CartItem = {
  id: string;
  title: string;
  price: number;
  priceLabel: string;
  img: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  add: (p: DBProduct, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'pt-cart';

export function parsePrice(label: string): number {
  const n = Number(String(label).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch {
        // storage full / private mode — cart just won't persist
      }
    }
  }, [items, hydrated]);

  const add = useCallback((p: DBProduct, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === p.id);
      if (found) {
        return prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + qty } : i));
      }
      return [
        ...prev,
        {
          id: p.id,
          title: p.title,
          price: parsePrice(p.price),
          priceLabel: p.price,
          img: p.img,
          qty,
        },
      ];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, qty } : i))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const { count, subtotal } = useMemo(() => {
    return {
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal: items.reduce((s, i) => s + i.qty * i.price, 0),
    };
  }, [items]);

  const value = useMemo(
    () => ({ items, count, subtotal, isOpen, setOpen, add, remove, setQty, clear }),
    [items, count, subtotal, isOpen, add, remove, setQty, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    // Defensive fallback: never crash the navbar if the provider tree
    // is mid-update (e.g. Fast Refresh applying files in stages).
    return {
      items: [],
      count: 0,
      subtotal: 0,
      isOpen: false,
      setOpen: () => {},
      add: () => {},
      remove: () => {},
      setQty: () => {},
      clear: () => {},
    };
  }
  return ctx;
}
