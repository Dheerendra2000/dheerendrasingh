'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { db, initError } from '@/lib/firebase-admin'

const testimonialSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Name is required.' }),
  title: z.string().min(1, { message: 'Title is required.' }),
  quote: z.string().min(1, { message: 'Quote is required.' }),
  image: z.string().url({ message: 'Image URL must be a valid URL.' }).or(z.literal('')),
  hint: z.string().optional(),
});

const testimonialsContentSchema = z.object({
  testimonials: z.array(testimonialSchema),
});

export async function updateTestimonialsContent(prevState: any, formData: FormData) {
  if (initError || !db) {
    return { 
        success: false,
        message: 'Failed to save: Database not connected.',
        errors: { _form: initError || "Database not initialized." },
    }
  }

  const testimonialsJson = formData.get('testimonials');

  if (typeof testimonialsJson !== 'string') {
    return { 
        success: false,
        message: 'Invalid form data submitted.',
        errors: { _form: 'Could not find testimonials data.' },
    }
  }

  let parsedData;
  try {
    parsedData = { testimonials: JSON.parse(testimonialsJson) };
  } catch (error) {
     return { 
        success: false,
        message: 'Invalid data format.',
        errors: { _form: 'Testimonials data is not valid JSON.' },
    }
  }

  const result = testimonialsContentSchema.safeParse(parsedData)

  if (result.success) {
    try {
      await db.collection('content').doc('testimonials').set(result.data, { merge: true });
      revalidatePath('/'); // Revalidate the home page
      revalidatePath('/admin/dashboard/testimonials'); // Revalidate this page
      return { 
          success: true,
          message: 'Testimonials updated successfully!',
          errors: null,
      }
    } catch (e: any) {
      console.error('Failed to write testimonials content to Firestore:', e)
       let userFriendlyMessage = 'Failed to save content. A server error occurred.';
       if (e.code === 7) { // PERMISSION_DENIED
            userFriendlyMessage = `Save failed: Permission Denied. Since you've already set the roles, this is likely a temporary delay. Please wait a moment and try saving again.`;
       } else if (e.message?.includes('Cloud Firestore API has not been used')) {
            userFriendlyMessage = `Save failed: The Firestore database has not been created for this project. Please create it in the Firebase Console before saving content.`;
       }

      return {
        success: false,
        message: userFriendlyMessage,
        errors: { _form: e.message || "Firestore error." },
      }
    }
  } else {
    const firstIssue = result.error.issues[0];
    let specificMessage = 'Please correct the errors and try again.';
    if (firstIssue) {
        const path = firstIssue.path;
        const defaultMessage = firstIssue.message;
        if (path.length > 2 && path[0] === 'testimonials') {
            const itemIndex = Number(path[1]) + 1;
            const fieldName = String(path[2]);
            const prettyFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
            specificMessage = `Error in Item #${itemIndex} (${prettyFieldName}): ${defaultMessage}`;
        } else {
            specificMessage = defaultMessage;
        }
    }
    
    console.error('Validation errors:', result.error.format());
    return {
        success: false,
        message: specificMessage,
        errors: { _form: specificMessage },
    }
  }
}
