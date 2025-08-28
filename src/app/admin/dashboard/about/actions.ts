
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { db, initError } from '@/lib/firebase-admin'

const aboutContentSchema = z.object({
  heading: z.string().min(1, { message: 'Heading is required.' }),
  paragraph1: z.string().min(1, { message: 'First paragraph is required.' }),
  paragraph2: z.string().min(1, { message: 'Second paragraph is required.' }),
  highlights: z.string().min(1, { message: 'Highlights are required.' }),
  imageHint: z.string().max(20, { message: "Hint can't be more than two words." }).optional(),
  imageUrl: z.string().url({ message: 'A valid image URL is required.' }).min(1, { message: 'Image is required.' }),
})

type ReturnValue = {
    success: boolean;
    message: string;
    errors?: Record<string, string[]> | null;
}

export async function updateAboutContent(data: unknown): Promise<ReturnValue> {
  if (initError || !db) {
    const errorMessage = initError || "Database not initialized.";
    return { success: false, message: `Failed to save: ${errorMessage}` };
  }

  const result = aboutContentSchema.safeParse(data);

  if (!result.success) {
    console.error('Validation errors:', result.error.flatten().fieldErrors)
    return {
        success: false,
        message: 'Please correct the errors and try again.',
        errors: result.error.flatten().fieldErrors,
    }
  }

  try {
    const highlightsArray = result.data.highlights.split('\n').map(h => h.trim()).filter(h => h);
    const contentToSave = {
      ...result.data,
      highlights: highlightsArray,
    };
    
    await db.collection('content').doc('about').set(contentToSave, { merge: true });
    
    revalidatePath('/');
    revalidatePath('/admin/dashboard/about');

    return { 
        success: true,
        message: 'About page content updated successfully!',
    }
  } catch (e: any) {
    console.error('Failed to write about content to Firestore:', e)
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
