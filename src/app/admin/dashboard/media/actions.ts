'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { db, initError } from '@/lib/firebase-admin'

const mediaItemSchema = z.object({
  id: z.string(),
  type: z.enum(['article', 'podcast', 'video']),
  title: z.string().min(1, 'Title is required.'),
  quote: z.string().min(1, 'Quote is required.'),
  outletName: z.string().min(1, 'Outlet name is required.'),
  outletLogoUrl: z.string().url('Outlet logo URL must be valid.').or(z.literal('')),
  link: z.string().url('Link must be a valid URL.'),
  coverImageUrl: z.string().url('Cover image URL must be valid.').or(z.literal('')),
  coverImageHint: z.string().optional(),
  date: z.string().min(1, 'Date is required.'),
});

const mediaContentSchema = z.object({
  items: z.array(mediaItemSchema),
});

export async function updateMediaContent(prevState: any, formData: FormData) {
  if (initError || !db) {
    return { 
        success: false,
        message: 'Failed to save: Database not connected.',
        errors: { _form: initError || "Database not initialized." },
    }
  }

  const mediaJson = formData.get('media');

  if (typeof mediaJson !== 'string') {
    return { 
        success: false,
        message: 'Invalid form data submitted.',
        errors: { _form: 'Could not find media data.' },
    }
  }

  let parsedData;
  try {
    const rawItems = JSON.parse(mediaJson);
    const types = [...new Set(rawItems.map((item: any) => item.type.trim()).filter(Boolean))];
    const filters = ["all", ...types];
    parsedData = { items: rawItems, filters };
  } catch (error) {
     return { 
        success: false,
        message: 'Invalid data format.',
        errors: { _form: 'Media data is not valid JSON.' },
    }
  }
  
  // Re-check schema against the items only, as filters are derived.
  const result = mediaContentSchema.safeParse({ items: parsedData.items });

  if (result.success) {
    try {
      const dataToSave = { ...result.data, filters: parsedData.filters };
      await db.collection('content').doc('media').set(dataToSave, { merge: true });
      revalidatePath('/'); // Revalidate home page
      revalidatePath('/media'); // Revalidate the new media page
      revalidatePath('/admin/dashboard/media'); // Revalidate this page
      return { 
          success: true,
          message: 'Media coverage updated successfully!',
          errors: null,
      }
    } catch (e: any) {
      console.error('Failed to write media content to Firestore:', e)
       let userFriendlyMessage = 'Failed to save content. A server error occurred.';
       if (e.code === 7) { // PERMISSION_DENIED
            userFriendlyMessage = `Save failed: Permission Denied. This is likely temporary. Please wait and try again.`;
       } else if (e.message?.includes('Cloud Firestore API has not been used')) {
            userFriendlyMessage = `Save failed: Firestore database not created. Please create it in the Firebase Console.`;
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
        if (path.length > 2 && path[0] === 'items') {
            const itemIndex = Number(path[1]) + 1;
            const fieldName = String(path[2]);
            const prettyFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
            specificMessage = `Error in Item #${itemIndex} (${prettyFieldName}): ${defaultMessage}`;
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
