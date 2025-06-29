'use server'

import { db, initError } from '@/lib/firebase-admin';
import { defaultTestimonialsContent, type TestimonialsContent } from '@/lib/contentDefaults';

const contentCollection = db?.collection('content');

export async function getTestimonialsContent(): Promise<TestimonialsContent & { error?: string }> {
  if (initError || !contentCollection) {
    return { ...defaultTestimonialsContent, error: initError };
  }
  
  try {
    const doc = await contentCollection.doc('testimonials').get();

    if (!doc.exists) {
      console.log('Testimonials content document not found, creating with default content.');
      await contentCollection.doc('testimonials').set(defaultTestimonialsContent);
      return defaultTestimonialsContent;
    }
    
    return doc.data() as TestimonialsContent;
  } catch (error: any) {
    console.error("Failed to fetch testimonials content from Firestore, falling back to default content. Error:", error);
    let errorMessage = "An unknown server error occurred while fetching content.";
    if (error.code === 7) { // PERMISSION_DENIED
        errorMessage = `Firestore Permission Denied. Since you've already set the roles, this is likely a temporary delay. Please wait a moment and refresh. If the problem continues, also ensure the "Cloud Firestore API" is enabled in your Google Cloud Console.`;
    } else if (error.message?.includes('Cloud Firestore API has not been used')) {
        errorMessage = `Action Required: The Firestore database has not been created for this project. Please go to the Firebase Console, find "Firestore Database" in the "Build" menu, and click "Create database".`;
    }
    return { ...defaultTestimonialsContent, error: errorMessage };
  }
}
