import { 
  collection, doc, getDoc, getDocs, setDoc, query, where, getDocFromServer 
} from 'firebase/firestore';
import { db } from './config.js';
import { SEED_SERVICES } from '../data/seedServices.js';

const SERVICES_COLLECTION = 'services';

// Validate connection per skill
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore client is offline or initializing.");
    }
  }
}

// Seed services into Firestore if not present
export async function seedServicesIfNeeded() {
  try {
    const servicesRef = collection(db, SERVICES_COLLECTION);
    const snapshot = await getDocs(servicesRef);

    const existingMap = new Map();
    snapshot.forEach(docSnap => {
      existingMap.set(docSnap.id, { id: docSnap.id, ...docSnap.data() });
    });

    for (const service of SEED_SERVICES) {
      if (!existingMap.has(service.id)) {
        await setDoc(doc(db, SERVICES_COLLECTION, service.id), {
          ...service,
          updatedAt: new Date().toISOString()
        });
        existingMap.set(service.id, service);
      }
    }

    return Array.from(existingMap.values());
  } catch (error) {
    console.error('Error seeding services:', error);
    return SEED_SERVICES;
  }
}

// Get all active services
export async function getActiveServices() {
  try {
    const validIds = new Set(SEED_SERVICES.map(s => s.id));
    const servicesRef = collection(db, SERVICES_COLLECTION);
    const q = query(servicesRef, where('active', '==', true));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return await seedServicesIfNeeded();
    }

    const services = [];
    const seenIds = new Set();
    const seedMap = new Map(SEED_SERVICES.map(s => [s.id, s]));

    snapshot.forEach(docSnap => {
      // Only include approved aesthetic procedures
      if (validIds.has(docSnap.id)) {
        seenIds.add(docSnap.id);
        const data = docSnap.data();
        const seedService = seedMap.get(docSnap.id);
        const image = (seedService && seedService.image) ? seedService.image : data.image;

        // Sync fresh canonical image to Firestore if needed
        if (seedService && data.image !== seedService.image) {
          setDoc(doc(db, SERVICES_COLLECTION, docSnap.id), {
            ...data,
            ...seedService,
            image: seedService.image,
            price: null,
            priceNote: null,
            updatedAt: new Date().toISOString()
          }, { merge: true }).catch(() => {});
        }

        services.push({
          id: docSnap.id,
          ...data,
          ...seedService,
          image,
          price: null,
          priceNote: null
        });
      }
    });

    // If any active seed services are missing from Firestore, include them and sync to Firestore
    const missingSeedServices = SEED_SERVICES.filter(s => s.active && !seenIds.has(s.id));
    if (missingSeedServices.length > 0) {
      for (const missing of missingSeedServices) {
        services.push(missing);
        setDoc(doc(db, SERVICES_COLLECTION, missing.id), {
          ...missing,
          updatedAt: new Date().toISOString()
        }).catch(err => console.warn('Could not sync missing service to Firestore:', err));
      }
    }

    return services;
  } catch (error) {
    console.warn('Firestore query failed, using local active service dataset:', error);
    return SEED_SERVICES.filter(s => s.active);
  }
}

// Get service by ID
export async function getServiceById(id) {
  try {
    const docRef = doc(db, SERVICES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    const seedService = SEED_SERVICES.find(s => s.id === id);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        ...seedService,
        image: seedService ? seedService.image : data.image,
        price: null,
        priceNote: null
      };
    }
    // Fallback to local
    return seedService || null;
  } catch (error) {
    console.warn(`Firestore getDoc for service ${id} failed, using local dataset:`, error);
    return SEED_SERVICES.find(s => s.id === id) || null;
  }
}
