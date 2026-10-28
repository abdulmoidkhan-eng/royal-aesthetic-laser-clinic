import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy 
} from 'firebase/firestore';
import { db } from './config.js';
import { handleFirestoreError, OperationType } from './firestoreHandler.js';
import { SEED_SERVICES } from '../data/seedServices.js';
import { SEED_PRODUCTS, DEFAULT_PAYMENT_SETTINGS } from '../data/seedProducts.js';
import { CLINIC_INFO } from '../data/clinicInfo.js';

const SERVICES_COLLECTION = 'services';
const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';
const SETTINGS_COLLECTION = 'settings';

export const AUTHORIZED_ADMIN_EMAIL = 'abdulshalmani123@gmail.com';

/**
 * ============================================================================
 * SERVICES MANAGEMENT
 * ============================================================================
 */

export async function fetchAllServicesAdmin() {
  try {
    const validIds = new Set(SEED_SERVICES.map(s => s.id));
    const colRef = collection(db, SERVICES_COLLECTION);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      return SEED_SERVICES;
    }
    const list = [];
    const seenIds = new Set();
    const seedMap = new Map(SEED_SERVICES.map(s => [s.id, s]));
    snapshot.forEach(docSnap => {
      if (validIds.has(docSnap.id)) {
        seenIds.add(docSnap.id);
        const data = docSnap.data();
        const seed = seedMap.get(docSnap.id);
        list.push({
          id: docSnap.id,
          ...data,
          ...seed,
          image: seed ? seed.image : data.image,
          price: null,
          priceNote: null
        });
      }
    });

    for (const seed of SEED_SERVICES) {
      if (!seenIds.has(seed.id)) {
        list.push(seed);
      }
    }

    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, SERVICES_COLLECTION);
  }
}

export async function saveServiceAdmin(serviceData, isNew = false) {
  try {
    const id = isNew 
      ? (serviceData.id || `service-${Date.now()}`)
      : serviceData.id;
    const docRef = doc(db, SERVICES_COLLECTION, id);

    const payload = {
      ...serviceData,
      id,
      updatedAt: new Date().toISOString()
    };

    await setDoc(docRef, payload, { merge: true });
    return payload;
  } catch (error) {
    handleFirestoreError(error, isNew ? OperationType.CREATE : OperationType.UPDATE, `${SERVICES_COLLECTION}/${serviceData.id}`);
  }
}

export async function toggleServiceActiveAdmin(serviceId, currentActive) {
  try {
    const docRef = doc(db, SERVICES_COLLECTION, serviceId);
    await updateDoc(docRef, {
      active: !currentActive,
      updatedAt: new Date().toISOString()
    });
    return !currentActive;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${SERVICES_COLLECTION}/${serviceId}`);
  }
}

export async function deleteServiceAdmin(serviceId) {
  try {
    const docRef = doc(db, SERVICES_COLLECTION, serviceId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${SERVICES_COLLECTION}/${serviceId}`);
  }
}

/**
 * ============================================================================
 * PRODUCTS MANAGEMENT
 * ============================================================================
 */

export async function fetchAllProductsAdmin() {
  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      return SEED_PRODUCTS;
    }
    const list = [];
    const seedMap = new Map(SEED_PRODUCTS.map(p => [p.id, p]));
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const seed = seedMap.get(docSnap.id);
      list.push({ 
        id: docSnap.id, 
        ...data,
        name: seed?.name || data.name,
        images: seed?.images || data.images
      });
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, PRODUCTS_COLLECTION);
  }
}

export async function saveProductAdmin(productData, isNew = false) {
  try {
    const id = isNew 
      ? (productData.id || `prod-${Date.now()}`)
      : productData.id;
    const docRef = doc(db, PRODUCTS_COLLECTION, id);

    const payload = {
      ...productData,
      id,
      price: Number(productData.price) || 0,
      updatedAt: new Date().toISOString()
    };

    await setDoc(docRef, payload, { merge: true });
    return payload;
  } catch (error) {
    handleFirestoreError(error, isNew ? OperationType.CREATE : OperationType.UPDATE, `${PRODUCTS_COLLECTION}/${productData.id}`);
  }
}

export async function toggleProductStockAdmin(productId, currentInStock) {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(docRef, {
      inStock: !currentInStock,
      updatedAt: new Date().toISOString()
    });
    return !currentInStock;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${PRODUCTS_COLLECTION}/${productId}`);
  }
}

export async function deleteProductAdmin(productId) {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PRODUCTS_COLLECTION}/${productId}`);
  }
}

/**
 * ============================================================================
 * ORDERS MANAGEMENT
 * ============================================================================
 */

export async function fetchAllOrdersAdmin() {
  try {
    const colRef = collection(db, ORDERS_COLLECTION);
    const snapshot = await getDocs(colRef);
    const list = [];
    snapshot.forEach(docSnap => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });
    // Sort descending by creation date
    list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, ORDERS_COLLECTION);
  }
}

export async function updateOrderStatusAdmin(orderId, newStatus) {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      status: newStatus,
      updatedAt: new Date().toISOString()
    });
    return newStatus;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${ORDERS_COLLECTION}/${orderId}`);
  }
}

/**
 * ============================================================================
 * SITE SETTINGS MANAGEMENT
 * ============================================================================
 */

export async function fetchSiteSettingsAdmin() {
  try {
    // 1. Payment methods doc
    const payDocRef = doc(db, SETTINGS_COLLECTION, 'payment_methods');
    const paySnap = await getDoc(payDocRef);
    const paymentMethods = paySnap.exists() ? paySnap.data() : DEFAULT_PAYMENT_SETTINGS;

    // 2. General site doc
    const genDocRef = doc(db, SETTINGS_COLLECTION, 'general');
    const genSnap = await getDoc(genDocRef);
    const general = genSnap.exists() ? genSnap.data() : {
      phone: CLINIC_INFO.phone,
      whatsappNumber: CLINIC_INFO.whatsappNumber,
      email: CLINIC_INFO.email,
      address: CLINIC_INFO.address,
      timings: CLINIC_INFO.timings,
      socials: CLINIC_INFO.socials
    };

    return { paymentMethods, general };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${SETTINGS_COLLECTION}/all`);
  }
}

export async function saveSiteSettingsAdmin(generalData, paymentMethodsData) {
  try {
    const payDocRef = doc(db, SETTINGS_COLLECTION, 'payment_methods');
    await setDoc(payDocRef, {
      ...paymentMethodsData,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    const genDocRef = doc(db, SETTINGS_COLLECTION, 'general');
    await setDoc(genDocRef, {
      ...generalData,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return { generalData, paymentMethodsData };
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${SETTINGS_COLLECTION}`);
  }
}
