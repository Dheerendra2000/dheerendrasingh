import { db } from '@/lib/firebase-admin';
import { defaultHomeContent, type HomeContent } from '@/lib/contentDefaults';

const contentCollection = db.collection('content');

export async function getHomeContent(): Promise<HomeContent> {
  try {
    const doc = await contentCollection.doc('home').get();

    if (!doc.exists) {
      console.log('Home content document not found, creating with default content.');
      // Document doesn't exist, so create it with default content
      await contentCollection.doc('home').set(defaultHomeContent);
      return defaultHomeContent;
    }
    
    // The document exists, return its data
    return doc.data() as HomeContent;
  } catch (error) {
    console.error("Failed to fetch home content from Firestore, falling back to default content. This is likely a server-side permission or configuration issue. Error:", error);
    // On any error (e.g., permissions), fall back to default content for graceful failure
    return defaultHomeContent;
  }
}
