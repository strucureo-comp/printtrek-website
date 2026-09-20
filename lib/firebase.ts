import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getDatabase, type Database } from 'firebase/database';
import {
  getAuth,
  GoogleAuthProvider,
  type Auth,
} from 'firebase/auth';

// All values come from .env.local (NEXT_PUBLIC_*). See .env.example.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let db: Database | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.databaseURL &&
      firebaseConfig.appId
  );
}

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0]!;
  }
  return app;
}

export function getRTDB(): Database | null {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  if (!db) db = getDatabase(firebaseApp);
  return db;
}

/** Firebase Auth (free tier). Requires Email/Password and/or Google
 *  providers enabled in Firebase console → Authentication → Sign-in method,
 *  plus your domains in Settings → Authorized domains. */
export function getFirebaseAuth(): Auth | null {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  if (!auth) auth = getAuth(firebaseApp);
  return auth;
}

export function getGoogleProvider(): GoogleAuthProvider {
  if (!googleProvider) googleProvider = new GoogleAuthProvider();
  return googleProvider;
}

// RTDB node names (single source of truth)
export const RTDB_NODES = {
  products: 'products',
  orders: 'orders',
  users: 'users',
  journal: 'journal',
  transactions: 'transactions',
  media: 'media',
  meta: 'meta',
} as const;

/**
 * Convert an image File -> resized base64 data-URL.
 * Free-tier friendly: max dimension 800px, JPEG quality 0.72.
 * RTDB free tier is 1GB stored + 10GB/mo download — keep each image < ~400KB.
 */
export function fileToBase64Resized(
  file: File,
  maxDim = 800,
  quality = 0.72
): Promise<{ dataUrl: string; bytes: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Not a valid image file'));
      img.onload = () => {
        const scale = Math.min(
          1,
          maxDim / Math.max(img.width, img.height)
        );
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas not supported'));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        // JPEG for photos (small); fall back to PNG if transparency needed
        const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mime, quality);
        const bytes = Math.round((dataUrl.length * 3) / 4);
        resolve({ dataUrl, bytes });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
