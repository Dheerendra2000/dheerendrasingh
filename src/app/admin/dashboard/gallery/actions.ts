'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { db, initError } from '@/lib/firebase-admin'

// Define separate schemas for each type of gallery item.
const imageItemSchema = z.object({
  id: z.string(),
  type: z.literal('image'),
  src: z.string().nonempty({ message: 'Image URL is required.'}).url({ message: 'Image URL must be a valid URL.' }),
  alt: z.string().min(1, { message: 'Alt text is required.' }),
  hint: z.string().optional(),
  category: z.string().min(1, { message: 'Category is required.' }),
  videoSrc: z.string().optional().nullish(), // For images, we don't validate videoSrc
  size: z.enum(['regular', 'large']).optional(),
});

const videoItemSchema = z.object({
  id: z.string(),
  type: z.literal('video'),
  src: z.string().nonempty({ message: 'Poster URL is required.'}).url({ message: 'Poster URL must be a valid URL.' }),
  alt: z.string().min(1, { message: 'Alt text is required.' }),
  hint: z.string().optional(),
  category: z.string().min(1, { message: 'Category is required.' }),
  videoSrc: z.string({ required_error: 'Video URL is required for video items.'}).nonempty({ message: 'Video URL is required for video items.'}).url({ message: 'Video URL must be a valid URL.'}),
  size: z.enum(['regular', 'large']).optional(),
});

// Create a discriminated union based on the 'type' field.
const galleryItemSchema = z.discriminatedUnion("type", [
  imageItemSchema,
  videoItemSchema,
]);


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
    // Try to find a specific error message
    const fieldErrors = result.error.flatten().fieldErrors;
    const errorKeys = Object.keys(fieldErrors);
    let specificMessage = '';
    if (errorKeys.length > 0) {
      const firstErrorKey = errorKeys[0] as keyof typeof fieldErrors;
      const errorMessage = fieldErrors[firstErrorKey]?.[0] || 'An error occurred.';
      const match = firstErrorKey.match(/items\.(\d+)\.(\w+)/);
      if (match) {
        const itemIndex = parseInt(match[1], 10) + 1;
        const fieldName = match[2];
        specificMessage = `Error on item #${itemIndex} in the '${fieldName}' field: ${errorMessage}`;
      } else {
        specificMessage = errorMessage;
      }
    }

    const fallbackMessage = 'Validation failed. Check that all URLs are valid and all required fields (like Alt Text and Category) are filled for every item.';

    return {
        success: false,
        message: specificMessage || fallbackMessage,
        errors: { _form: specificMessage || fallbackMessage },
    }
  }
}
