import { 
  collection, doc, getDoc, getDocs, setDoc, deleteDoc, updateDoc, query, orderBy 
} from 'firebase/firestore';
import { db } from './config.js';
import { handleFirestoreError, OperationType } from './firestoreHandler.js';
import { GALLERY_ITEMS, REVIEWS } from '../data/reviewsData.js';

export const BANNER_COLLECTION = 'banners';
export const BANNER_DOC_ID = 'current';
export const GALLERY_COLLECTION = 'gallery';
export const REVIEWS_COLLECTION = 'reviews';

export const DEFAULT_BANNER = {
  active: true,
  textEn: "50% Discount on all Skin Procedure + Free Doctor Consultation for Limited Time",
  textUr: "محدود وقت کے لیے تمام اسکن پروسیجرز پر 50% رعایت + ڈاکٹر کا مفت معائنہ",
  endDate: "", // e.g. "2026-12-31" or empty
  link: "whatsapp",
  linkTextEn: "Avail 50% Off + Free Consultation",
  linkTextUr: "50% رعایت اور مفت معائنہ حاصل کریں"
};

/**
 * ============================================================================
 * 1. OFFERS BANNER
 * ============================================================================
 */

export async function getOffersBanner() {
  try {
    const docRef = doc(db, BANNER_COLLECTION, BANNER_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      // If previous banner contained the old placeholder, update to user's new copy
      if (!data.textEn || data.textEn.includes("Avail the 50% offers on all aesthetic procedure")) {
        const updated = {
          ...data,
          textEn: DEFAULT_BANNER.textEn,
          textUr: DEFAULT_BANNER.textUr,
          linkTextEn: DEFAULT_BANNER.linkTextEn,
          linkTextUr: DEFAULT_BANNER.linkTextUr
        };
        setDoc(docRef, updated, { merge: true }).catch(() => {});
        return { id: snap.id, ...updated };
      }
      return { id: snap.id, ...data };
    }
    return DEFAULT_BANNER;
  } catch (error) {
    console.warn('Could not fetch banner from Firestore, using default:', error);
    return DEFAULT_BANNER;
  }
}

export async function saveOffersBanner(bannerData) {
  try {
    const docRef = doc(db, BANNER_COLLECTION, BANNER_DOC_ID);
    const payload = {
      ...bannerData,
      updatedAt: new Date().toISOString()
    };
    await setDoc(docRef, payload, { merge: true });
    return payload;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${BANNER_COLLECTION}/${BANNER_DOC_ID}`);
  }
}

/**
 * ============================================================================
 * 2. BEFORE & AFTER GALLERY
 * ============================================================================
 */

export async function seedGalleryIfNeeded() {
  try {
    const colRef = collection(db, GALLERY_COLLECTION);
    const snap = await getDocs(colRef);
    if (snap.empty) {
      console.log('Seeding initial clinical gallery items...');
      for (const item of GALLERY_ITEMS) {
        await setDoc(doc(db, GALLERY_COLLECTION, item.id), {
          ...item,
          captionEn: item.title?.en || item.captionEn || '',
          captionUr: item.title?.ur || item.captionUr || '',
          relatedService: item.service?.en || item.relatedService || '',
          createdAt: new Date().toISOString()
        });
      }
      return GALLERY_ITEMS;
    }
    const list = [];
    snap.forEach(d => list.push({ id: d.id, ...d.data() }));
    return list;
  } catch (e) {
    console.warn('Gallery seed check fallback:', e);
    return GALLERY_ITEMS;
  }
}

export async function getGalleryItems() {
  try {
    const colRef = collection(db, GALLERY_COLLECTION);
    const snap = await getDocs(colRef);
    if (snap.empty) {
      return await seedGalleryIfNeeded();
    }
    const list = [];
    snap.forEach(d => list.push({ id: d.id, ...d.data() }));
    // Sort newest first
    list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return list;
  } catch (error) {
    console.warn('Fetching gallery failed, returning default items:', error);
    return GALLERY_ITEMS;
  }
}

export async function saveGalleryItem(itemData, isNew = false) {
  try {
    const id = isNew 
      ? (itemData.id || `gal-${Date.now()}`)
      : itemData.id;
    const docRef = doc(db, GALLERY_COLLECTION, id);

    const payload = {
      ...itemData,
      id,
      updatedAt: new Date().toISOString(),
      createdAt: itemData.createdAt || new Date().toISOString()
    };

    await setDoc(docRef, payload, { merge: true });
    return payload;
  } catch (error) {
    handleFirestoreError(error, isNew ? OperationType.CREATE : OperationType.UPDATE, `${GALLERY_COLLECTION}/${itemData.id}`);
  }
}

export async function deleteGalleryItem(itemId) {
  try {
    const docRef = doc(db, GALLERY_COLLECTION, itemId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${GALLERY_COLLECTION}/${itemId}`);
  }
}

/**
 * ============================================================================
 * 3. REVIEWS & TESTIMONIALS (Admin-only creation)
 * ============================================================================
 */

export async function seedReviewsIfNeeded() {
  try {
    const colRef = collection(db, REVIEWS_COLLECTION);
    const snap = await getDocs(colRef);
    if (snap.empty) {
      console.log('Seeding initial patient reviews...');
      for (const rev of REVIEWS) {
        await setDoc(doc(db, REVIEWS_COLLECTION, rev.id), {
          ...rev,
          textEn: rev.comment?.en || rev.textEn || '',
          textUr: rev.comment?.ur || rev.textUr || '',
          serviceNameEn: rev.treatment?.en || rev.serviceNameEn || '',
          serviceNameUr: rev.treatment?.ur || rev.serviceNameUr || '',
          createdAt: new Date().toISOString()
        });
      }
      return REVIEWS;
    }
    const list = [];
    snap.forEach(d => list.push({ id: d.id, ...d.data() }));
    return list;
  } catch (e) {
    console.warn('Reviews seed check fallback:', e);
    return REVIEWS;
  }
}

export async function getReviews() {
  try {
    const colRef = collection(db, REVIEWS_COLLECTION);
    const snap = await getDocs(colRef);
    if (snap.empty) {
      return await seedReviewsIfNeeded();
    }
    const list = [];
    snap.forEach(d => list.push({ id: d.id, ...d.data() }));
    // Sort newest first
    list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return list;
  } catch (error) {
    console.warn('Fetching reviews failed, returning default reviews:', error);
    return REVIEWS;
  }
}

export async function saveReview(reviewData, isNew = false) {
  try {
    const id = isNew 
      ? (reviewData.id || `rev-${Date.now()}`)
      : reviewData.id;
    const docRef = doc(db, REVIEWS_COLLECTION, id);

    const payload = {
      ...reviewData,
      id,
      rating: Number(reviewData.rating) || 5,
      updatedAt: new Date().toISOString(),
      createdAt: reviewData.createdAt || new Date().toISOString()
    };

    await setDoc(docRef, payload, { merge: true });
    return payload;
  } catch (error) {
    handleFirestoreError(error, isNew ? OperationType.CREATE : OperationType.UPDATE, `${REVIEWS_COLLECTION}/${reviewData.id}`);
  }
}

export async function deleteReview(reviewId) {
  try {
    const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${REVIEWS_COLLECTION}/${reviewId}`);
  }
}
