import { db, initError, clientEmail } from '@/lib/firebase-admin';
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
    let errorMessage = "An unknown server error occurred while fetching content.";
    if (error.code === 7) { // PERMISSION_DENIED
        errorMessage = `Firestore Permission Denied. Since you've already set the roles, this is likely a temporary delay. Please wait a moment and refresh. If the problem continues, also ensure the "Cloud Firestore API" is enabled in your Google Cloud Console.`;
    } else if (error.message?.includes('Cloud Firestore API has not been used')) {
        errorMessage = `Action Required: The Firestore database has not been created for this project. Please go to the Firebase Console, find "Firestore Database" in the "Build" menu, and click "Create database".`;
    }
    return { ...defaultAboutContent, error: errorMessage };
  }
}
