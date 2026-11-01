import { db } from './firebase';
import { collection, doc, setDoc, getDocs, query, limit, getDoc } from 'firebase/firestore';
import { 
  initialApps, 
  initialAds, 
  initialCategories, 
  initialSiteSettings, 
  initialUsers,
  initialReviews
} from '../data/initialData';

export const seedDatabase = async (force: boolean = false) => {
  try {
    console.log('Verifying core collections in Firestore...');

    // 1. Ensure all initial categories exist
    for (const cat of initialCategories) {
      const catRef = doc(db, 'categories', cat.id);
      const catDoc = await getDoc(catRef);
      if (!catDoc.exists()) {
        await setDoc(catRef, cat);
        console.log(`Category ${cat.id} seeded.`);
      }
    }

    let deletedAppIds: string[] = [];
    try {
      const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('rg_deleted_app_ids') : null;
      if (stored) deletedAppIds = JSON.parse(stored);
    } catch (e) {}

    // 2. Ensure all initial apps exist (skip if intentionally deleted unless force is true)
    for (const app of initialApps) {
      if (!force && deletedAppIds.includes(app.id)) continue;
      const appRef = doc(db, 'apps', app.id);
      const appDoc = await getDoc(appRef);
      if (!appDoc.exists()) {
        await setDoc(appRef, { ...app, downloadsCount: 0 });
        console.log(`App ${app.id} seeded.`);
      }
    }

    // 3. Seed Ads (only if needed)
    const adsQuery = query(collection(db, 'ads'), limit(1));
    const adsSnapshot = await getDocs(adsQuery);
    if (adsSnapshot.empty) {
      for (const ad of initialAds) {
        await setDoc(doc(db, 'ads', ad.id), ad);
      }
      console.log('Ads seeded.');
    }

    // 4. Seed Settings
    const settingsDoc = await getDoc(doc(db, 'settings', 'global'));
    if (!settingsDoc.exists()) {
      await setDoc(doc(db, 'settings', 'global'), initialSiteSettings);
      console.log('Settings seeded.');
    }

    console.log('Database seeding verified/completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
