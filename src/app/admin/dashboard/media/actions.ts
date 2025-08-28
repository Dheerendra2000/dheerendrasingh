
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
  outletLogoUrl: z.string().url('Outlet logo URL must be valid.').min(1, 'Outlet logo is required.'),
  link: z.string().url('Link must be a valid URL.'),
  coverImageUrl: z.string().url('Cover image URL must be valid.').min(1, 'Cover image is required.'),
  coverImageHint: z.string().optional(),
  date: z.string().min(1, 'Date is required.'),
});

const mediaContentSchema = z.object({
  items: z.array(mediaItemSchema),
});

type ReturnValue = {
    success: boolean;
    message: string;
    errors?: Record<string, string[]> | null;
}

export async function updateMediaContent(data: unknown): Promise<ReturnValue> {
    if (initError || !db) {
        const errorMessage = initError || "Database not initialized.";
        return { success: false, message: `Failed to save: ${errorMessage}` };
    }
  
    // Because we're also creating filters on the server, we need to manually extract the items
    // and then construct the final object for validation.
    const rawData = data as { items: unknown[] };
    const items = rawData.items || [];
    const types = [...new Set(items.map((item: any) => item.type?.trim()).filter(Boolean))];
    const filters = ["all", ...types];
    const dataToValidate = { items, filters };

    const result = mediaContentSchema.safeParse(dataToValidate);

    if (!result.success) {
      console.error('Validation errors:', result.error.flatten().fieldErrors);
      return {
          success: false,
          message: 'Please correct the errors and try again.',
          errors: result.error.flatten().fieldErrors
      }
    }

    try {
        const dataToSave = { ...result.data, filters }; // Add the server-generated filters
        await db.collection('content').doc('media').set(dataToSave, { merge: true });
        
        revalidatePath('/'); // Revalidate home page
        revalidatePath('/media'); // Revalidate the new media page
        revalidatePath('/admin/dashboard/media'); // Revalidate this page

        return { 
            success: true,
            message: 'Media coverage updated successfully!',
        }
    } catch (e: any) {
        console.error('Failed to write media content to Firestore or upload file:', e)
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
