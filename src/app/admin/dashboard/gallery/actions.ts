'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { db, initError } from '@/lib/firebase-admin'

const galleryItemSchema = z.object({
  id: z.string(),
  type: z.enum(['image', 'video']),
  src: z.string().nonempty({ message: 'Image/Poster URL is required.'}).url({ message: 'Image/Poster URL must be a valid URL.' }),
  alt: z.string().min(1, { message: 'Alt text is required.' }),
  hint: z.string().optional(),
  category: z.string().min(1, { message: 'Category is required.' }),
  videoSrc: z.string().optional(),
  size: z.enum(['regular', 'large']).optional(),
}).superRefine((data, ctx) => {
  if (data.type === 'video') {
    const parseResult = z.string().url().safeParse(data.videoSrc);
    if (!parseResult.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_string,
        validation: 'url',
        message: 'A valid Video URL is required for video items.',
        path: ['videoSrc'],
      });
    }
  }
});


const galleryContentSchema = z.object({
  items: z.array(galleryItemSchema),
  filters: z.array(z.string()),
});

export async function updateGalleryContent(prevState: any, formData: FormData) {
  if (initError || !db) {
    return { 
        success: false,
        message: 'Failed to save: Database not connected.',
        errors: { _form: initError || "Database not initialized." },
    }
  }

  const galleryJson = formData.get('gallery');

  if (typeof galleryJson !== 'string') {
    return { 
        success: false,
        message: 'Invalid form data submitted.',
        errors: { _form: 'Could not find gallery data.' },
    }
  }

  let parsedData;
  try {
    const rawItems = JSON.parse(galleryJson);
    // Dynamically generate the list of filters from the categories provided.
    const categories = [...new Set(rawItems.map((item: any) => item.category.trim()).filter(Boolean))];
    const filters = ["all", ...categories];
    parsedData = { items: rawItems, filters };
  } catch (error) {
     return { 
        success: false,
        message: 'Invalid data format.',
        errors: { _form: 'Gallery data is not valid JSON.' },
    }
  }
  
  const result = galleryContentSchema.safeParse(parsedData);

  if (result.success) {
    try {
      await db.collection('content').doc('gallery').set(result.data, { merge: true });
      revalidatePath('/'); // Revalidate the home page
      revalidatePath('/admin/dashboard/gallery'); // Revalidate this page
      return { 
          success: true,
          message: 'Gallery updated successfully!',
          errors: null,
      }
    } catch (e: any) {
      console.error('Failed to write gallery content to Firestore:', e)
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
    console.error('Validation errors:', result.error.flatten());
    const formErrors = result.error.flatten().formErrors.join(', ');
    const fallbackMessage = 'Validation failed. Check that all URLs are valid and all required fields (like Alt Text and Category) are filled for every item.';

    return {
        success: false,
        message: `Please correct the errors and try again. ${formErrors}`,
        errors: { _form: formErrors || fallbackMessage },
    }
  }
}
