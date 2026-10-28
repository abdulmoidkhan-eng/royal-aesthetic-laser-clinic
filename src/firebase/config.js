import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: Must pass databaseId (firebaseConfig.firestoreDatabaseId)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Lazy auth instance to decouple firebase/auth from critical public client bundle
let _auth = null;
export const setAuthInstance = (instance) => { _auth = instance; };
export const auth = {
  get currentUser() {
    return _auth?.currentUser || null;
  }
};

export default app;
