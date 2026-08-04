import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { DishItem, ShopInfo } from './types';

// Initialize Firebase App if not initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Export Firestore Instance
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

// Test connection on boot according to skill guidelines
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, '_connection_check', 'ping'));
    return true;
  } catch (error) {
    console.warn('Firestore connection warning:', error);
    return false;
  }
}

// Sync dishes with Firestore
const DISHES_COLLECTION = 'dishes';
const SHOP_INFO_COLLECTION = 'shopInfo';
const SHOP_INFO_DOC = 'main';

// Subscribe to real-time dishes updates from Firestore
export function subscribeToDishes(
  onSuccess: (dishes: DishItem[]) => void,
  onError?: (err: unknown) => void
) {
  const colRef = collection(db, DISHES_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onSuccess([]);
        return;
      }
      const loaded: DishItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as DishItem;
        loaded.push({ ...data, id: docSnap.id });
      });
      onSuccess(loaded);
    },
    (err) => {
      console.warn('Firestore dishes subscription error:', err);
      if (onError) onError(err);
    }
  );
}

// Save or Update a Dish in Firestore
export async function saveDishToFirestore(dish: DishItem): Promise<void> {
  try {
    const docRef = doc(db, DISHES_COLLECTION, dish.id);
    await setDoc(docRef, dish, { merge: true });
  } catch (err) {
    console.error('Error saving dish to Firestore:', err);
  }
}

// Delete a Dish from Firestore
export async function deleteDishFromFirestore(dishId: string): Promise<void> {
  try {
    const docRef = doc(db, DISHES_COLLECTION, dishId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting dish from Firestore:', err);
  }
}

// Seed initial dishes into Firestore if collection is empty
export async function seedInitialDishesToFirestore(dishes: DishItem[]): Promise<void> {
  try {
    const snapshot = await getDocs(collection(db, DISHES_COLLECTION));
    if (snapshot.empty) {
      for (const dish of dishes) {
        await setDoc(doc(db, DISHES_COLLECTION, dish.id), dish);
      }
    }
  } catch (err) {
    console.error('Error seeding dishes to Firestore:', err);
  }
}

// Subscribe to Shop Info in Firestore
export function subscribeToShopInfo(
  onSuccess: (info: ShopInfo) => void,
  onError?: (err: unknown) => void
) {
  const docRef = doc(db, SHOP_INFO_COLLECTION, SHOP_INFO_DOC);
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        onSuccess(docSnap.data() as ShopInfo);
      }
    },
    (err) => {
      console.warn('Firestore shopInfo subscription error:', err);
      if (onError) onError(err);
    }
  );
}

// Save Shop Info to Firestore
export async function saveShopInfoToFirestore(info: ShopInfo): Promise<void> {
  try {
    const docRef = doc(db, SHOP_INFO_COLLECTION, SHOP_INFO_DOC);
    await setDoc(docRef, info, { merge: true });
  } catch (err) {
    console.error('Error saving shop info to Firestore:', err);
  }
}
