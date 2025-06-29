'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { db, initError, clientEmail } from '@/lib/firebase-admin'

const homeContentSchema = z.object({
  heroTitle: z.string().min(1, { message: 'Hero title is required.' }),
  heroTagline: z.string().min(1, { message: 'Hero tagline is required.' }),
  videoUrl: z.string().url({ message: 'Please enter a valid URL for the video.' }),
})

// This function is designed to be used in a useActionState hook.
export async function updateHomeContent(prevState: any, formData: FormData) {
  if (initError || !db) {
    return { 
        success: false,
        message: 'Failed to save: Database not connected.',
        errors: null,
        error: initError || "Database not initialized.",
    }
  }

  const data = {
    heroTitle: formData.get('heroTitle'),
    heroTagline: formData.get('heroTagline'),
    videoUrl: formData.get('videoUrl'),
  }

  const result = homeContentSchema.safeParse(data)

  if (result.success) {
    try {
      await db.collection('content').doc('home').set(result.data, { merge: true });
      revalidatePath('/'); // Revalidate the home page to show the new content
      return { 
          success: true,
          message: 'Home page content updated successfully!',
          errors: null,
          error: null,
      }
    } catch (e: any) {
      console.error('Failed to write home content to Firestore:', e)
       let userFriendlyMessage = 'Failed to save content. A server error occurred.';
       if (e.code === 7) { // PERMISSION_DENIED
            userFriendlyMessage = `Save failed: Permission Denied. Since you've already set the roles, this is likely a temporary delay. Please wait a moment and try saving again.`;
       } else if (e.message?.includes('Cloud Firestore API has not been used')) {
            userFriendlyMessage = `Save failed: The Firestore database has not been created for this project. Please create it in the Firebase Console before saving content.`;
       }

      return {
        success: false,
        message: userFriendlyMessage,
        errors: null,
        error: e.message || "Firestore error."
      }
    }
  } else {
    console.error('Validation errors:', result.error.flatten().fieldErrors)
    return {
        success: false,
        message: 'Please correct the errors and try again.',
        errors: result.error.flatten().fieldErrors,
        error: "Validation failed."
    }
  }
}
