
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { db, initError } from '@/lib/firebase-admin'

const testimonialSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Name is required.' }),
  title: z.string().min(1, { message: 'Title is required.' }),
  quote: z.string().min(1, { message: 'Quote is required.' }),
  image: z.string().url({ message: 'A valid image URL is required.' }).min(1, { message: 'Image is required.' }),
  hint: z.string().optional(),
});

const testimonialsContentSchema = z.object({
  testimonials: z.array(testimonialSchema),
});

type ReturnValue = {
    success: boolean;
    message: string;
    errors?: Record<string, string[]> | null;
}

export async function updateTestimonialsContent(data: unknown): Promise<ReturnValue> {
  if (initError || !db) {
    const errorMessage = initError || "Database not initialized.";
    return { success: false, message: `Failed to save: ${errorMessage}` };
  }

  const result = testimonialsContentSchema.safeParse(data);

  if (!result.success) {
    console.error('Validation errors:', result.error.flatten().fieldErrors)
    return {
        success: false,
        message: 'Please correct the errors and try again.',
        errors: result.error.flatten().fieldErrors,
    }
  }

  try {
    await db.collection('content').doc('testimonials').set(result.data, { merge: true });
    
    revalidatePath('/');
    revalidatePath('/admin/dashboard/testimonials');

    return { 
        success: true,
        message: 'Testimonials updated successfully!',
    }
  } catch (e: any) {
    console.error('Failed to write testimonials content to Firestore:', e)
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
