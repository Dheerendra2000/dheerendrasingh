
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { db, initError } from '@/lib/firebase-admin'

const homeContentSchema = z.object({
  heroTitle: z.string().min(1, { message: 'Hero title is required.' }),
  heroTagline: z.string().min(1, { message: 'Hero tagline is required.' }),
  heroTitleColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/i, { message: 'Must be a valid hex color code (e.g., #FFD700).' }),
  heroTaglineColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/i, { message: 'Must be a valid hex color code (e.g., #F8FAFC).' }),
  videoUrl: z.string().url({ message: 'A valid video URL is required.' }).min(1, { message: 'Background video is required.' }),
});

type ReturnValue = {
    success: boolean;
    message: string;
    errors?: Record<string, string[]> | null;
}

export async function updateHomeContent(data: unknown): Promise<ReturnValue> {
    if (initError || !db) {
        const errorMessage = initError || "Database not initialized.";
        return { success: false, message: `Failed to save: ${errorMessage}` };
    }

  const result = homeContentSchema.safeParse(data);

  if (!result.success) {
    return {
        success: false,
        message: 'Please correct the errors and try again.',
        errors: result.error.flatten().fieldErrors,
    }
  }

  try {
    await db.collection('content').doc('home').set(result.data, { merge: true });
    
    revalidatePath('/'); // Revalidate the home page to show the new content
    revalidatePath('/admin/dashboard/home');

    return { 
        success: true,
        message: 'Home page content updated successfully!',
    }
  } catch (e: any) {
    console.error('Failed to write home content to Firestore:', e)
     let userFriendlyMessage = 'Failed to save content. A server error occurred.';
     if (e.code === 7) { // PERMISSION_DENIED
          userFriendlyMessage = `Save failed: Permission Denied. This is likely a temporary issue. Please wait a moment and try again.`;
     } else if (e.message?.includes('Cloud Firestore API has not been used')) {
          userFriendlyMessage = `Save failed: The Firestore database has not been created for this project. Please create it in the Firebase Console.`;
     }

    return {
      success: false,
      message: userFriendlyMessage,
    }
  }
}
