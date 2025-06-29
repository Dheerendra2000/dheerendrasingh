import { db } from '@/lib/firebase-admin';
import { defaultAboutContent, type AboutContent } from '@/lib/contentDefaults';

const contentCollection = db.collection('content');

export async function getAboutContent(): Promise<AboutContent> {
  try {
    const doc = await contentCollection.doc('about').get();

    if (!doc.exists) {
      console.log('About content document not found, creating with default content.');
      // Document doesn't exist, so create it with default content
      await contentCollection.doc('about').set(defaultAboutContent);
      return defaultAboutContent;
    }
    
    // The document exists, return its data
    return doc.data() as AboutContent;
  } catch (error) {
    console.error("Failed to fetch about content from Firestore, falling back to default content. This is likely a server-side permission or configuration issue. Error:", error);
    // On any error (e.g., permissions), fall back to default content for graceful failure
    return defaultAboutContent;
  }
}
