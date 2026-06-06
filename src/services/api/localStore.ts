import { Company, CompanyDashboard } from '../../types';
import { db, auth } from '../../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export const STORE_KEYS = {
  COMPANIES: 'klarity_companies',
  DASHBOARDS: 'klarity_dashboards',
  INTEGRATIONS: 'klarity_integrations',
  ACTIVITY: 'klarity_activity',
  SETTINGS: 'klarity_settings',
};

// Map store keys to Firestore collections for the current user
const getFirestorePath = (key: string, uid: string) => {
  return `user_data/${uid}_${key}`; // Simplification: Since the app stores all settings/companies in big JSON arrays locally, we can store them as single documents per user.
};

// Initialize listeners for real-time sync when user logs in
export const initializeFirestoreSync = (uid: string) => {
  Object.values(STORE_KEYS).forEach(key => {
    onSnapshot(doc(db, 'user_data', `${uid}_${key}`), (docSnap) => {
      if (docSnap.exists()) {
        try {
          localStorage.setItem(key, JSON.stringify(docSnap.data().value));
          // Dispatch a custom event to notify components that local storage was updated from cloud
          window.dispatchEvent(new Event('local-storage'));
        } catch {}
      }
    });
  });
};

export const localStore = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return defaultValue;
      return JSON.parse(stored) as T;
    } catch {
      return defaultValue;
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      // Sync to Firestore in background if logged in
      const uid = auth.currentUser?.uid;
      if (uid) {
        setDoc(doc(db, 'user_data', `${uid}_${key}`), { value, updatedAt: new Date().toISOString() }, { merge: true })
          .catch(err => console.error("Firestore sync error", err));
      }
    } catch {}
  }
};

