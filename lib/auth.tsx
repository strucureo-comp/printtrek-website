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
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { ref, update } from 'firebase/database';
import {
  getFirebaseAuth,
  getGoogleProvider,
  getRTDB,
  RTDB_NODES,
} from './firebase';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  saveDisplayName: (name: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function friendlyAuthError(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'That email is already registered — try signing in instead.';
    case 'auth/invalid-email':
      return 'That email address looks invalid.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Wrong email or password. Try again.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is off. Enable it in Firebase console → Authentication → Sign-in method.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized. Add it in Firebase console → Authentication → Settings → Authorized domains.';
    case 'auth/popup-closed-by-user':
      return 'Google popup was closed before finishing.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

/** Mirror a minimal profile into RTDB users/{uid} so the admin Users tab sees everyone. */
async function syncUserRecord(user: User, name?: string) {
  const db = getRTDB();
  if (!db) return;
  try {
    await update(ref(db, `${RTDB_NODES.users}/${user.uid}`), {
      name: name ?? user.displayName ?? '',
      email: user.email ?? '',
      photo: user.photoURL ?? '',
      lastLogin: Date.now(),
    });
  } catch {
    // RTDB rules may restrict writes — auth still works, admin list just won't include them.
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error('Firebase not configured. Fill .env.local first.');
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name.trim()) {
      await updateProfile(cred.user, { displayName: name.trim() });
    }
    await syncUserRecord(cred.user, name.trim());
    setUser({ ...cred.user, displayName: name.trim() || cred.user.displayName });
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error('Firebase not configured. Fill .env.local first.');
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await syncUserRecord(cred.user);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error('Firebase not configured. Fill .env.local first.');
    const cred = await signInWithPopup(auth, getGoogleProvider());
    await syncUserRecord(cred.user);
  }, []);

  const signOut = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    await firebaseSignOut(auth);
  }, []);

  const saveDisplayName = useCallback(async (name: string) => {
    const auth = getFirebaseAuth();
    if (!auth?.currentUser) return;
    await updateProfile(auth.currentUser, { displayName: name.trim() });
    await syncUserRecord(auth.currentUser, name.trim());
    setUser({ ...auth.currentUser });
  }, []);

  const value = useMemo(
    () => ({ user, loading, signUp, signIn, signInWithGoogle, signOut, saveDisplayName }),
    [user, loading, signUp, signIn, signInWithGoogle, signOut, saveDisplayName]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
