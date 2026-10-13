import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, Firestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, FirebaseStorage } from 'firebase/storage';
import { PortfolioData } from '../types/portfolio';

// Firebase configuration from Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Verify if required credentials are provided
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.storageBucket &&
  !firebaseConfig.apiKey.includes('YOUR_')
);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    console.info('🚀 Firebase initialized successfully with project:', firebaseConfig.projectId);
  } catch (err) {
    console.error('❌ Failed to initialize Firebase:', err);
  }
}

export { app, db, storage };

const PORTFOLIO_COLLECTION = 'portfolio';
const PORTFOLIO_DOC_ID = 'data';

/**
 * Fetch portfolio data from Firestore cloud database
 */
export async function fetchPortfolioFromCloud(): Promise<PortfolioData | null> {
  if (!db || !isFirebaseConfigured) return null;

  try {
    const docRef = doc(db, PORTFOLIO_COLLECTION, PORTFOLIO_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as PortfolioData;
    }
  } catch (err) {
    console.error('Failed to fetch portfolio from Firestore:', err);
  }
  return null;
}

/**
 * Save complete portfolio data to Firestore cloud database
 */
export async function savePortfolioToCloud(data: PortfolioData): Promise<boolean> {
  if (!db || !isFirebaseConfigured) return false;

  try {
    const docRef = doc(db, PORTFOLIO_COLLECTION, PORTFOLIO_DOC_ID);
    await setDoc(docRef, data, { merge: true });
    return true;
  } catch (err) {
    console.error('Failed to save portfolio to Firestore:', err);
    return false;
  }
}

/**
 * Upload an image Blob/File or Data URL directly to Firebase Cloud Storage.
 * Returns the public HTTPS download URL.
 */
export async function uploadImageToCloud(
  fileOrBlob: Blob | File,
  storagePath: string
): Promise<string> {
  if (!storage || !isFirebaseConfigured) {
    throw new Error('Firebase Storage is not configured.');
  }

  const storageRef = ref(storage, storagePath);
  const snapshot = await uploadBytes(storageRef, fileOrBlob, {
    contentType: fileOrBlob.type || 'image/jpeg',
  });
  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
}

/**
 * Helper to upload a base64 data URL to Firebase Cloud Storage
 */
export async function uploadBase64ToCloud(
  dataUrl: string,
  storagePath: string
): Promise<string> {
  if (!storage || !isFirebaseConfigured) {
    throw new Error('Firebase Storage is not configured.');
  }

  // Convert base64 data URL to Blob
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return uploadImageToCloud(blob, storagePath);
}
