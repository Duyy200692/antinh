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

// Sync dishes with Firestore - Independent collection for Tâm Chay & Settings Document Sync
const DISHES_COLLECTION = 'tam_chay_dishes';
const SHOP_INFO_COLLECTION = 'tam_chay_shop_info';
const SHOP_INFO_DOC = 'main';

// Settings collection docs for compatibility with Firebase UI
const SETTINGS_COLLECTION = 'settings';
const MENU_DISHES_DOC = 'menu_dishes_list';
const SHOP_INFO_SETTINGS_DOC = 'shop_info';

// Helper to remove 'undefined' fields before sending to Firestore
function sanitizeData(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}

// Helper to update the settings/menu_dishes_list document so it's visible in settings view
async function syncToSettingsDocument(dishes: DishItem[]) {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, MENU_DISHES_DOC);
    await setDoc(docRef, {
      list: sanitizeData(dishes),
      updatedAt: new Date().toISOString(),
    });
    console.log('✅ Đã đồng bộ danh sách món sang settings/menu_dishes_list');
  } catch (err) {
    console.warn('Cảnh báo đồng bộ settings/menu_dishes_list:', err);
  }
}

// Subscribe to real-time dishes updates from Firestore
export function subscribeToDishes(
  onSuccess: (dishes: DishItem[]) => void,
  onError?: (err: unknown) => void
) {
  const colRef = collection(db, DISHES_COLLECTION);
  const settingsDocRef = doc(db, SETTINGS_COLLECTION, MENU_DISHES_DOC);

  let loadedFromCollection = false;

  const unsubCol = onSnapshot(
    colRef,
    (snapshot) => {
      if (!snapshot.empty) {
        loadedFromCollection = true;
        const loaded: DishItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as DishItem;
          loaded.push({ ...data, id: docSnap.id });
        });
        onSuccess(loaded);
      } else if (!loadedFromCollection) {
        onSuccess([]);
      }
    },
    (err) => {
      console.warn('Firestore dishes subscription error:', err);
      if (onError) onError(err);
    }
  );

  const unsubSettings = onSnapshot(
    settingsDocRef,
    (docSnap) => {
      if (docSnap.exists() && !loadedFromCollection) {
        const data = docSnap.data();
        const list = data.list || data.dishes || data.items;
        if (Array.isArray(list) && list.length > 0) {
          onSuccess(list as DishItem[]);
        }
      }
    },
    () => {}
  );

  return () => {
    unsubCol();
    unsubSettings();
  };
}

// Save or Update a Dish in Firestore
export async function saveDishToFirestore(dish: DishItem): Promise<{ success: boolean; isQuotaExceeded?: boolean }> {
  try {
    const cleanDish = sanitizeData(dish);
    // Single write to primary collection to minimize quota usage
    await setDoc(doc(db, DISHES_COLLECTION, dish.id), cleanDish, { merge: true });
    console.log('✅ Đã lưu món vào Firestore:', dish.name, dish.id);
    return { success: true };
  } catch (err: any) {
    console.warn('⚠️ Lỗi khi lưu món vào Firestore:', err?.code || err?.message || err);
    const isQuota = err?.code === 'resource-exhausted' || err?.message?.includes('Quota limit exceeded');
    return { success: false, isQuotaExceeded: isQuota };
  }
}

// Delete a Dish from Firestore
export async function deleteDishFromFirestore(dishId: string): Promise<{ success: boolean; isQuotaExceeded?: boolean }> {
  try {
    await deleteDoc(doc(db, DISHES_COLLECTION, dishId));
    console.log('✅ Đã xóa món khỏi Firestore:', dishId);
    return { success: true };
  } catch (err: any) {
    console.warn('⚠️ Lỗi khi xóa món khỏi Firestore:', err?.code || err?.message || err);
    const isQuota = err?.code === 'resource-exhausted' || err?.message?.includes('Quota limit exceeded');
    return { success: false, isQuotaExceeded: isQuota };
  }
}

// Force sync all dishes to Firestore using a single settings document to conserve write quota
export async function syncAllDishesToFirestore(dishes: DishItem[]): Promise<{ success: boolean; isQuotaExceeded?: boolean }> {
  try {
    const cleanDishes = sanitizeData(dishes);
    // Write as a single document to settings/menu_dishes_list (1 write instead of 70+ writes!)
    await setDoc(doc(db, SETTINGS_COLLECTION, MENU_DISHES_DOC), {
      list: cleanDishes,
      updatedAt: new Date().toISOString()
    });
    console.log('✅ Đã đồng bộ tất cả', dishes.length, 'món lên Firestore dạng gói 1 write!');
    return { success: true };
  } catch (err: any) {
    console.warn('⚠️ Lỗi đồng bộ tất cả món lên Firestore:', err?.code || err?.message || err);
    const isQuota = err?.code === 'resource-exhausted' || err?.message?.includes('Quota limit exceeded');
    return { success: false, isQuotaExceeded: isQuota };
  }
}

// Seed initial dishes into Firestore if collection is empty (Single doc write to save quota)
export async function seedInitialDishesToFirestore(dishes: DishItem[]): Promise<void> {
  try {
    const docSnap = await getDocFromServer(doc(db, SETTINGS_COLLECTION, MENU_DISHES_DOC)).catch(() => null);
    if (!docSnap || !docSnap.exists()) {
      await setDoc(doc(db, SETTINGS_COLLECTION, MENU_DISHES_DOC), {
        list: sanitizeData(dishes),
        updatedAt: new Date().toISOString()
      });
      console.log('✅ Đã nạp dữ liệu món ban đầu lên Firestore settings/menu_dishes_list');
    }
  } catch (err: any) {
    console.warn('Cảnh báo nạp dữ liệu ban đầu Firestore (Quota):', err?.code || err?.message || err);
  }
}

// Subscribe to Shop Info in Firestore (Listens to tam_chay_shop_info and settings/shop_info)
export function subscribeToShopInfo(
  onSuccess: (info: ShopInfo) => void,
  onError?: (err: unknown) => void
) {
  const docRefMain = doc(db, SHOP_INFO_COLLECTION, SHOP_INFO_DOC);
  const docRefSettings = doc(db, SETTINGS_COLLECTION, SHOP_INFO_SETTINGS_DOC);

  // Subscribe to main
  const unsubMain = onSnapshot(
    docRefMain,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // If data is stored flat
        if (data.name) {
          onSuccess(data as ShopInfo);
        } else if (data.shopInfo) {
          onSuccess(data.shopInfo as ShopInfo);
        }
      }
    },
    (err) => {
      console.warn('Firestore shopInfo subscription error:', err);
      if (onError) onError(err);
    }
  );

  // Also subscribe to settings/shop_info in case manual edit happened in console
  const unsubSettings = onSnapshot(
    docRefSettings,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.shopInfo && data.shopInfo.name) {
          onSuccess(data.shopInfo as ShopInfo);
        } else if (data.name) {
          onSuccess(data as ShopInfo);
        }
      }
    },
    (err) => {
      // Silently ignore settings doc missing
    }
  );

  return () => {
    unsubMain();
    unsubSettings();
  };
}

// Save Shop Info to Firestore
export async function saveShopInfoToFirestore(info: ShopInfo): Promise<{ success: boolean; isQuotaExceeded?: boolean }> {
  try {
    const docRef = doc(db, SHOP_INFO_COLLECTION, SHOP_INFO_DOC);
    const cleanInfo = sanitizeData(info);
    await setDoc(docRef, cleanInfo, { merge: true });
    console.log('✅ Đã lưu thông tin quán vào Firestore tam_chay_shop_info');
    return { success: true };
  } catch (err: any) {
    console.warn('⚠️ Lỗi khi lưu thông tin quán vào Firestore:', err?.code || err?.message || err);
    const isQuota = err?.code === 'resource-exhausted' || err?.message?.includes('Quota limit exceeded');
    return { success: false, isQuotaExceeded: isQuota };
  }
}

// -------------------------------------------------------------
// Admin PIN Security & Management
// -------------------------------------------------------------
const ADMIN_CONFIG_DOC = 'admin_security';

export function subscribeToAdminPin(
  onSuccess: (pin: string) => void
): () => void {
  const docRef = doc(db, SETTINGS_COLLECTION, ADMIN_CONFIG_DOC);
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data?.pin) {
          onSuccess(String(data.pin));
        }
      }
    },
    (err) => {
      console.warn('Admin PIN subscription warning:', err);
    }
  );
}

export async function saveAdminPinToFirestore(newPin: string): Promise<{ success: boolean; isQuotaExceeded?: boolean }> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, ADMIN_CONFIG_DOC);
    await setDoc(docRef, {
      pin: newPin.trim(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    console.log('✅ Đã lưu mã PIN mới vào Firestore settings/admin_security');
    return { success: true };
  } catch (err: any) {
    console.warn('⚠️ Lỗi khi lưu mã PIN mới vào Firestore:', err);
    const isQuota = err?.code === 'resource-exhausted' || err?.message?.includes('Quota limit exceeded');
    return { success: false, isQuotaExceeded: isQuota };
  }
}

