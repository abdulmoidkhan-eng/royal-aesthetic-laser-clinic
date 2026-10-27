import { 
  collection, doc, getDoc, getDocs, setDoc, query, where, addDoc 
} from 'firebase/firestore';
import { db } from './config.js';
import { handleFirestoreError, OperationType } from './errorHandler.js';
import { SEED_PRODUCTS, DEFAULT_PAYMENT_SETTINGS } from '../data/seedProducts.js';

const PRODUCTS_COLLECTION = 'products';
const SETTINGS_COLLECTION = 'settings';
const ORDERS_COLLECTION = 'orders';

/**
 * Seed initial products if collection is empty
 */
export async function seedProductsIfNeeded() {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(productsRef);

    if (snapshot.empty) {
      console.log('Seeding initial skincare products into Firestore...');
      for (const prod of SEED_PRODUCTS) {
        await setDoc(doc(db, PRODUCTS_COLLECTION, prod.id), {
          ...prod,
          updatedAt: new Date().toISOString()
        });
      }
      console.log('Products seeded successfully.');
      return SEED_PRODUCTS;
    } else {
      const prods = [];
      snapshot.forEach(docSnap => prods.push({ id: docSnap.id, ...docSnap.data() }));
      return prods;
    }
  } catch (error) {
    console.warn('Could not seed/fetch Firestore products, returning seed fallback:', error);
    return SEED_PRODUCTS;
  }
}

/**
 * Seed and get payment settings (Easypaisa, JazzCash, Bank details)
 */
export async function getPaymentSettings() {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, 'payment_methods');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Seed default settings into Firestore
      await setDoc(docRef, {
        ...DEFAULT_PAYMENT_SETTINGS,
        updatedAt: new Date().toISOString()
      });
      return DEFAULT_PAYMENT_SETTINGS;
    }
  } catch (error) {
    console.warn('Could not load payment settings from Firestore, using defaults:', error);
    return DEFAULT_PAYMENT_SETTINGS;
  }
}

/**
 * Fetch all products from Firestore
 */
export async function getProducts() {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(productsRef);

    if (snapshot.empty) {
      return await seedProductsIfNeeded();
    }

    const prods = [];
    const seedMap = new Map(SEED_PRODUCTS.map(p => [p.id, p]));

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const seedProd = seedMap.get(docSnap.id);
      const images = (seedProd && seedProd.images) ? seedProd.images : data.images;

      // Sync fresh canonical images to Firestore if changed
      if (seedProd && JSON.stringify(data.images) !== JSON.stringify(seedProd.images)) {
        setDoc(doc(db, PRODUCTS_COLLECTION, docSnap.id), {
          ...data,
          name: seedProd.name,
          images: seedProd.images,
          size: seedProd.size || data.size,
          updatedAt: new Date().toISOString()
        }, { merge: true }).catch(() => {});
      }

      prods.push({
        id: docSnap.id,
        ...data,
        name: seedProd?.name || data.name,
        images
      });
    });
    return prods;
  } catch (error) {
    console.warn('Firestore getProducts failed, falling back to local dataset:', error);
    return SEED_PRODUCTS;
  }
}

/**
 * Fetch a single product by ID
 */
export async function getProductById(id) {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    const seedProd = SEED_PRODUCTS.find(p => p.id === id);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        name: seedProd?.name || data.name,
        images: seedProd ? seedProd.images : data.images
      };
    }
    return seedProd || null;
  } catch (error) {
    console.warn(`Firestore getProductById (${id}) failed:`, error);
    return SEED_PRODUCTS.find(p => p.id === id) || null;
  }
}

/**
 * Save customer guest order in Firestore
 * Status strictly: "Pending payment verification"
 */
export async function createGuestOrder(orderData) {
  try {
    const orderDocId = orderData.orderNumber || `ROYAL-${Math.floor(100000 + Math.random() * 900000)}`;
    const docRef = doc(db, ORDERS_COLLECTION, orderDocId);

    const payload = {
      orderNumber: orderDocId,
      customer: orderData.customer,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      delivery: "Free delivery all over Pakistan",
      paymentMethod: orderData.paymentMethod,
      transactionId: orderData.transactionId,
      screenshotUrl: orderData.screenshotUrl || null,
      status: "Pending payment verification",
      createdAt: new Date().toISOString()
    };

    await setDoc(docRef, payload);
    return payload;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, ORDERS_COLLECTION);
  }
}
