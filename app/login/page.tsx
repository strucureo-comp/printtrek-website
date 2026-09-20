'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { friendlyAuthError, useAuth } from '@/lib/auth';

export default function LoginPage() {
  const { user, loading, signIn, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState<'form' | 'google' | null>(null);
  const [error, setError] = useState('');

  if (!loading && user) {
    router.replace('/profile');
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setBusy('form');
    try {
      await signIn(email.trim(), password);
      router.push('/profile');
    } catch (err: any) {
      setError(err?.code ? friendlyAuthError(err.code) : err?.message || 'Login failed.');
    }
    setBusy(null);
  }

  async function onGoogle() {
    setError('');
    setBusy('google');
    try {
      await signInWithGoogle();
      router.push('/profile');
    } catch (err: any) {
      setError(err?.code ? friendlyAuthError(err.code) : err?.message || 'Google sign-in failed.');
    }
    setBusy(null);
  }

  const input =
    'w-full border border-obsidian/15 rounded px-4 py-2.5 text-sm bg-concrete focus:outline-none focus:border-brass';

  return (
    <div className="px-6 py-16 max-w-md mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="text-[10px] font-medium tracking-widest uppercase text-brass mb-2">
          Lab Account
        </p>
        <h1 className="text-4xl md:text-5xl font-serif-display font-bold tracking-tight text-obsidian mb-3">
          Welcome back.
        </h1>
        <p className="text-sm text-concrete-muted mb-8">
          Sign in to track orders, balance and saved addresses.
        </p>

        {error && (
          <div className="border border-brass/40 bg-brass/10 rounded-lg px-4 py-3 text-xs mb-6">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3 mb-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className={input}
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={input}
          />
          <button
            type="submit"
            disabled={busy !== null}
            className="w-full uppercase text-[10px] font-medium tracking-widest px-4 py-3 rounded bg-obsidian text-concrete hover:bg-obsidian-soft disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {busy === 'form' && <Loader2 size={14} className="animate-spin" />}
            Sign In
          </button>
        </form>

        <button
          onClick={onGoogle}
          disabled={busy !== null}
          className="w-full uppercase text-[10px] font-medium tracking-widest px-4 py-3 rounded border border-obsidian/20 hover:border-brass hover:text-brass disabled:opacity-50 flex items-center justify-center gap-2 mb-8"
        >
          {busy === 'google' && <Loader2 size={14} className="animate-spin" />}
          Continue with Google
        </button>

        <p className="text-sm text-concrete-muted text-center">
          New to the lab?{' '}
          <Link href="/signup" className="text-brass hover:text-obsidian transition-colors font-medium">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
