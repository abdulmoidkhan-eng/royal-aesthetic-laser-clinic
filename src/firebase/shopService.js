import { 
  collection, doc, getDoc, getDocs, setDoc, query, where, addDoc 
} from 'firebase/firestore';
import { db } from './config.js';
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
 * Strictly validate and create customer guest order in Firestore
 * - Enforces clean customer inputs (name, phone, address, city)
 * - Validates each item ID against actual catalog
 * - Authoritatively re-computes line totals and totalAmount from database unit prices
 * - Enforces initial status: "Pending payment verification"
 */
export async function createGuestOrder(orderData) {
  try {
    if (!orderData || typeof orderData !== 'object') {
      throw new Error('Invalid order payload: Order data is required.');
    }

    const { customer, items, paymentMethod, transactionId } = orderData;

    // 1. Validate Customer Object
    if (!customer || typeof customer !== 'object') {
      throw new Error('Customer information is required.');
    }

    const sanitizedName = String(customer.name || '').trim();
    const sanitizedPhone = String(customer.phone || '').trim().replace(/[\s-]/g, '');
    const sanitizedAddress = String(customer.address || '').trim();
    const sanitizedCity = String(customer.city || '').trim();

    if (sanitizedName.length < 2 || sanitizedName.length > 120) {
      throw new Error('Please provide a valid full name (2-120 characters).');
    }

    if (sanitizedPhone.length < 8 || sanitizedPhone.length > 25) {
      throw new Error('Please provide a valid phone/WhatsApp number.');
    }

    if (sanitizedAddress.length < 5 || sanitizedAddress.length > 300) {
      throw new Error('Please provide a complete shipping address (minimum 5 characters).');
    }

    if (sanitizedCity.length < 2 || sanitizedCity.length > 80) {
      throw new Error('Please provide a valid delivery city.');
    }

    // 2. Validate Items & Re-calculate Authoritative Prices
    if (!Array.isArray(items) || items.length === 0 || items.length > 20) {
      throw new Error('Your cart must contain between 1 and 20 items.');
    }

    // Fetch authoritative products catalog
    const allProducts = await getProducts();
    const productCatalogMap = new Map(allProducts.map(p => [p.id, p]));
    // Also merge with SEED_PRODUCTS as baseline guarantee
    SEED_PRODUCTS.forEach(p => {
      if (!productCatalogMap.has(p.id)) {
        productCatalogMap.set(p.id, p);
      }
    });

    const verifiedItems = [];
    let authoritativeTotal = 0;

    for (const item of items) {
      if (!item || !item.id) {
        throw new Error('Invalid item encountered in order.');
      }

      const authoritativeProduct = productCatalogMap.get(item.id);
      if (!authoritativeProduct) {
        throw new Error(`Product "${item.id}" is no longer available in the dispensary catalog.`);
      }

      const rawQty = Number(item.quantity);
      if (!Number.isInteger(rawQty) || rawQty < 1 || rawQty > 50) {
        throw new Error(`Invalid quantity for product ${authoritativeProduct.name?.en || item.id}.`);
      }

      // Enforce authoritative unit price (defaults to 0 if admin pending)
      const unitPrice = typeof authoritativeProduct.price === 'number' && authoritativeProduct.price > 0
        ? authoritativeProduct.price
        : 0;

      const subtotal = unitPrice * rawQty;
      authoritativeTotal += subtotal;

      verifiedItems.push({
        id: authoritativeProduct.id,
        name: authoritativeProduct.name?.en || authoritativeProduct.name,
        price: unitPrice,
        quantity: rawQty,
        size: authoritativeProduct.size || '',
        category: authoritativeProduct.category || ''
      });
    }

    // 3. Validate Payment Method
    const validPaymentMethods = ['easypaisa', 'jazzcash', 'bank'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      throw new Error('Please select a valid payment method (Easypaisa, JazzCash, or Bank Transfer).');
    }

    const sanitizedTxnId = String(transactionId || '').trim();
    if (sanitizedTxnId.length < 3 || sanitizedTxnId.length > 64) {
      throw new Error('Please provide a valid Transaction ID / Reference Number (min 3 characters).');
    }

    // 4. Generate Order Identifier & Construct Strictly Typed Payload
    const uniqueOrderNumber = orderData.orderNumber && orderData.orderNumber.startsWith('ROYAL-')
      ? orderData.orderNumber
      : `ROYAL-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const docRef = doc(db, ORDERS_COLLECTION, uniqueOrderNumber);

    const payload = {
      orderNumber: uniqueOrderNumber,
      customer: {
        name: sanitizedName,
        phone: sanitizedPhone,
        address: sanitizedAddress,
        city: sanitizedCity
      },
      items: verifiedItems,
      totalAmount: authoritativeTotal,
      delivery: "Free delivery all over Pakistan",
      paymentMethod,
      transactionId: sanitizedTxnId,
      screenshotUrl: orderData.screenshotUrl || null,
      status: "Pending payment verification",
      createdAt: new Date().toISOString()
    };

    await setDoc(docRef, payload);
    return payload;
  } catch (error) {
    console.error('[Order Error]', error.message);
    throw error;
  }
}
