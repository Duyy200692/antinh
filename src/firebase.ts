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

// Sync dishes with Firestore - Independent collection for Tâm Chay
const DISHES_COLLECTION = 'tam_chay_dishes';
const SHOP_INFO_COLLECTION = 'tam_chay_shop_info';
const SHOP_INFO_DOC = 'main';

// Helper to remove 'undefined' fields before sending to Firestore
function sanitizeData(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}

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
export async function saveDishToFirestore(dish: DishItem): Promise<boolean> {
  try {
    const docRef = doc(db, DISHES_COLLECTION, dish.id);
    const cleanDish = sanitizeData(dish);
    await setDoc(docRef, cleanDish, { merge: true });
    console.log('✅ Đã lưu món vào Firestore:', dish.name, dish.id);
    return true;
  } catch (err) {
    console.error('❌ Lỗi khi lưu món vào Firestore:', err);
    return false;
  }
}

// Delete a Dish from Firestore
export async function deleteDishFromFirestore(dishId: string): Promise<boolean> {
  try {
    const docRef = doc(db, DISHES_COLLECTION, dishId);
    await deleteDoc(docRef);
    console.log('✅ Đã xóa món khỏi Firestore:', dishId);
    return true;
  } catch (err) {
    console.error('❌ Lỗi khi xóa món khỏi Firestore:', err);
    return false;
  }
}

// Seed initial dishes into Firestore if collection is empty
export async function seedInitialDishesToFirestore(dishes: DishItem[]): Promise<void> {
  try {
    const snapshot = await getDocs(collection(db, DISHES_COLLECTION));
    if (snapshot.empty) {
      for (const dish of dishes) {
        const cleanDish = sanitizeData(dish);
        await setDoc(doc(db, DISHES_COLLECTION, dish.id), cleanDish);
      }
      console.log('✅ Đã nạp dữ liệu món ban đầu lên Firestore tam_chay_dishes');
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
export async function saveShopInfoToFirestore(info: ShopInfo): Promise<boolean> {
  try {
    const docRef = doc(db, SHOP_INFO_COLLECTION, SHOP_INFO_DOC);
    const cleanInfo = sanitizeData(info);
    await setDoc(docRef, cleanInfo, { merge: true });
    console.log('✅ Đã lưu thông tin quán vào Firestore tam_chay_shop_info');
    return true;
  } catch (err) {
    console.error('❌ Lỗi khi lưu thông tin quán vào Firestore:', err);
    return false;
  }
}
