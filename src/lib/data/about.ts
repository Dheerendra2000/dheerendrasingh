import { db, initError } from '@/lib/firebase-admin';
import { defaultAboutContent, type AboutContent } from '@/lib/contentDefaults';

const contentCollection = db?.collection('content');

export async function getAboutContent(): Promise<AboutContent & { error?: string }> {
  if (initError || !contentCollection) {
    return { ...defaultAboutContent, error: initError };
  }
  
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
  } catch (error: any) {
    console.error("Failed to fetch about content from Firestore, falling back to default content. Error:", error);
    const errorMessage = error.code === 'permission-denied'
      ? "Firestore permission denied. Please check your project's security rules."
      : "An unknown error occurred while fetching content from Firestore.";
    // On any error (e.g., permissions), fall back to default content for graceful failure
    return { ...defaultAboutContent, error: errorMessage };
  }
}
