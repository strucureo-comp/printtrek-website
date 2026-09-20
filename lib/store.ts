'use client';

import { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { getRTDB, isFirebaseConfigured, RTDB_NODES } from './firebase';
import type { Product } from './data';

export type DBProduct = Product & { id: string; createdAt?: number };
export type DBTransaction = {
  id: string;
  desc: string;
  amount: number;
  date: string;
  type: 'credit' | 'debit';
  createdAt?: number;
};
export type DBMedia = {
  id: string;
  name: string;
  dataUrl: string;
  bytes: number;
  createdAt?: number;
};

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'printing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type DBOrder = {
  id: string;
  customer: string;
  contact: string;
  items: string;
  amount: number;
  status: OrderStatus;
  note?: string;
  createdAt?: number;
};

export type DBAddress = {
  id: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  pincode: string;
  country: string;
  isDefault: boolean;
  createdAt?: number;
};

export type DBUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  note?: string;
  photo?: string;
  lastLogin?: number;
  createdAt?: number;
  addresses?: Record<string, Omit<DBAddress, 'id'>>;
};

export type DBJournal = {
  id: string;
  cat: string;
  title: string;
  excerpt: string;
  img: string;
  createdAt?: number;
};

/** Generic realtime list hook — Firebase RTDB is the single source of truth. */
function useLiveList<T extends { id: string; createdAt?: number }>(node: string) {
  const [items, setItems] = useState<T[]>([]);
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false);
      return;
    }
    const db = getRTDB();
    if (!db) {
      setLoading(false);
      return;
    }
    const unsub = onValue(
      ref(db, node),
      (snap) => {
        const val = snap.val();
        if (val && typeof val === 'object') {
          const list = Object.entries(val).map(
            ([id, v]: [string, any]) => ({ id, ...v } as T)
          );
          list.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
          setItems(list);
        } else {
          setItems([]);
        }
        setLive(true);
        setLoading(false);
      },
      () => {
        setLive(false);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [node]);

  return { items, live, loading };
}

export const useLiveOrders = () => useLiveList<DBOrder>(RTDB_NODES.orders);
export const useLiveUsers = () => useLiveList<DBUser>(RTDB_NODES.users);
export const useLiveJournal = () => useLiveList<DBJournal>(RTDB_NODES.journal);

// Real data only — Firebase RTDB is the single source of truth.
// Empty array = no rows yet (add them in /admin). No static demo rows.

export function useLiveProducts() {
  const [items, setItems] = useState<DBProduct[]>([]);
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false);
      return;
    }
    const db = getRTDB();
    if (!db) {
      setLoading(false);
      return;
    }
    const unsub = onValue(
      ref(db, RTDB_NODES.products),
      (snap) => {
        const val = snap.val();
        if (val && typeof val === 'object') {
          const list: DBProduct[] = Object.entries(val).map(
            ([id, v]: [string, any]) => ({ id, ...v })
          );
          list.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
          setItems(list);
        } else {
          setItems([]);
        }
        setLive(true);
        setLoading(false);
      },
      () => {
        setLive(false);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return { items, live, loading };
}

export function useLiveTransactions() {
  const [items, setItems] = useState<DBTransaction[]>([]);
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false);
      return;
    }
    const db = getRTDB();
    if (!db) {
      setLoading(false);
      return;
    }
    const unsub = onValue(
      ref(db, RTDB_NODES.transactions),
      (snap) => {
        const val = snap.val();
        if (val && typeof val === 'object') {
          const list: DBTransaction[] = Object.entries(val).map(
            ([id, v]: [string, any]) => ({ id, ...v })
          );
          list.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
          setItems(list);
        } else {
          setItems([]);
        }
        setLive(true);
        setLoading(false);
      },
      () => {
        setLive(false);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return { items, live, loading };
}

export function useLiveMedia() {
  const [items, setItems] = useState<DBMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoading(false);
      return;
    }
    const db = getRTDB();
    if (!db) {
      setLoading(false);
      return;
    }
    const unsub = onValue(
      ref(db, RTDB_NODES.media),
      (snap) => {
        const val = snap.val();
        if (val && typeof val === 'object') {
          const list: DBMedia[] = Object.entries(val).map(
            ([id, v]: [string, any]) => ({ id, ...v })
          );
          list.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
          setItems(list);
        } else {
          setItems([]);
        }
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, []);

  return { items, loading };
}
