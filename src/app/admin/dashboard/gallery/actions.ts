
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { db, initError } from '@/lib/firebase-admin'

// A more robust schema using superRefine for conditional validation.
const galleryItemSchema = z.object({
  id: z.string(),
  type: z.enum(['image', 'video']),
  src: z.string().min(1, { message: 'Image/Poster URL is required.'}).url({ message: 'URL must be valid.' }),
  alt: z.string().min(1, { message: 'Alt text is required.' }),
  hint: z.string().optional(),
  category: z.string().min(1, { message: 'Category is required.' }),
  // Allow videoSrc to be an optional, empty, or valid URL string.
  videoSrc: z.string().url({ message: 'Video URL must be a valid URL.' }).optional().or(z.literal('')),
  size: z.enum(['regular', 'large']).optional(),
}).superRefine((data, ctx) => {
    // If the type is 'video', the videoSrc must be a non-empty string.
    if (data.type === 'video' && (!data.videoSrc || data.videoSrc.trim() === '')) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['videoSrc'], // Point error to the videoSrc field
            message: 'A valid Video URL is required for video items.',
        });
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
      // Ensure empty videoSrc is not saved for image types for cleaner data.
      const cleanedData = {
        ...result.data,
        items: result.data.items.map(item => {
          if (item.type === 'image') {
            return { ...item, videoSrc: '' };
          }
          return item;
        }),
      };
      await db.collection('content').doc('gallery').set(cleanedData, { merge: true });
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
    console.error('Validation errors:', result.error.format());
    
    // Provide a much more specific error message by inspecting the first Zod issue.
    const firstIssue = result.error.issues[0];
    let specificMessage = 'An unexpected validation error occurred. Please check all fields.';

    if (firstIssue) {
        const path = firstIssue.path; // e.g., ['items', 0, 'src']
        const defaultMessage = firstIssue.message;
        
        if (path.length > 2 && path[0] === 'items') {
            const itemIndex = Number(path[1]) + 1;
            const fieldName = String(path[2]);
            // Capitalize field name for display
            const prettyFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1');
            specificMessage = `Error in Item #${itemIndex} (${prettyFieldName}): ${defaultMessage}`;
        } else {
            // A more general error not specific to an item field.
            specificMessage = defaultMessage;
        }
    }

    return {
        success: false,
        message: specificMessage,
        errors: { _form: specificMessage },
    }
  }
}
