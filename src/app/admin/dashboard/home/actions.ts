'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { db, initError } from '@/lib/firebase-admin'

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
      const userFriendlyMessage = e.code === 7 // PERMISSION_DENIED
        ? "Save failed: Permission Denied. Please ensure your service account has the 'Cloud Datastore User' or 'Editor' role in Google Cloud IAM."
        : 'Failed to save content. A server error occurred.'

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
