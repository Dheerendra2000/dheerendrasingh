
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { db, initError } from '@/lib/firebase-admin'

const courseSchema = z.object({
  id: z.string(),
  title: z.string().min(1, { message: 'Title is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  thumbnail: z.string().url({ message: 'Thumbnail URL must be a valid URL.' }).min(1, { message: 'A thumbnail image is required.'}),
  hint: z.string().optional(),
  price: z.string().min(1, { message: 'Price is required.' }),
  category: z.string().min(1, { message: 'Category is required.' }),
  link: z.string().url({ message: 'Link must be a valid URL.' }).or(z.literal('')),
});

const coursesContentSchema = z.object({
  courses: z.array(courseSchema),
});

type ReturnValue = {
    success: boolean;
    message: string;
    errors?: Record<string, string[]> | null;
}

export async function updateCoursesContent(data: unknown): Promise<ReturnValue> {
  if (initError || !db) {
    const errorMessage = initError || "Database not initialized.";
    return { success: false, message: `Failed to save: ${errorMessage}` };
  }

  const result = coursesContentSchema.safeParse(data);

  if (!result.success) {
    console.error('Validation errors:', result.error.flatten().fieldErrors);
    return {
        success: false,
        message: 'Please correct the errors and try again.',
        errors: result.error.flatten().fieldErrors
    }
  }

  try {
    await db.collection('content').doc('courses').set(result.data, { merge: true });
    
    revalidatePath('/'); // Revalidate the home page
    revalidatePath('/admin/dashboard/courses'); // Revalidate this page
    
    return { 
        success: true,
        message: 'Courses updated successfully!',
    }
  } catch (e: any) {
    console.error('Failed to write courses content to Firestore:', e)
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
