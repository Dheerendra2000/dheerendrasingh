import { db, initError } from '@/lib/firebase-admin';
import { defaultHomeContent, type HomeContent } from '@/lib/contentDefaults';

const contentCollection = db?.collection('content');

export async function getHomeContent(): Promise<HomeContent & { error?: string }> {
  if (initError || !contentCollection) {
    return { ...defaultHomeContent, error: initError };
  }
  
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
  } catch (error: any) {
    console.error("Failed to fetch home content from Firestore, falling back to default content. Error:", error);
    const errorMessage = error.code === 'permission-denied' || error.code === 7
      ? "Firestore permission denied. Please ensure the service account has the 'Cloud Datastore User' or 'Editor' role in your Google Cloud project's IAM settings."
      : "An unknown error occurred while fetching content from Firestore.";
    // On any error, fall back to default content for graceful failure
    return {...defaultHomeContent, error: errorMessage };
  }
}
