
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { db, initError } from '@/lib/firebase-admin'

const galleryItemSchema = z.object({
  id: z.string(),
  type: z.enum(['image', 'video']),
  src: z.string().url({ message: 'URL must be a valid.' }).optional().or(z.literal('')),
  alt: z.string().min(1, { message: 'Alt text is required.' }),
  hint: z.string().optional(),
  category: z.string().min(1, { message: 'Category is required.' }),
  videoSrc: z.string().url({ message: 'Video URL must be a valid URL.' }).optional().or(z.literal('')),
  size: z.enum(['regular', 'large']).optional(),
}).refine(data => (data.type === 'image' && data.src) || (data.type === 'video' && data.videoSrc), {
    message: "A source URL (src or videoSrc) is required based on the item type.",
    path: ["src"], // you can point to a specific field
});

const galleryContentSchema = z.object({
  items: z.array(galleryItemSchema),
});

type ReturnValue = {
    success: boolean;
    message: string;
    errors?: Record<string, string[]> | null;
}

export async function updateGalleryContent(data: unknown): Promise<ReturnValue> {
  if (initError || !db) {
    const errorMessage = initError || "Database not initialized.";
    return { success: false, message: `Failed to save: ${errorMessage}` };
  }

  const rawData = data as { items: unknown[] };
  const items = rawData.items || [];
  const categories = [...new Set(items.map((item: any) => item.category?.trim()).filter(Boolean))];
  const filters = ["all", ...categories];
  const dataToValidate = { items, filters };

  const result = galleryContentSchema.safeParse(dataToValidate);

  if (!result.success) {
    console.error('Validation errors:', result.error.flatten().fieldErrors);
    return {
        success: false,
        message: 'Please correct the errors and try again.',
        errors: result.error.flatten().fieldErrors
    }
  }

  try {
    const finalData = { ...result.data, filters };

    await db.collection('content').doc('gallery').set(finalData, { merge: true });
    
    revalidatePath('/');
    revalidatePath('/admin/dashboard/gallery');
    
    return { success: true, message: 'Gallery updated successfully!' };

  } catch (e: any) {
    console.error('Failed to write gallery content to Firestore or upload file:', e);
    let userFriendlyMessage = 'Failed to save content. A server error occurred.';
    if (e.code === 7) { // PERMISSION_DENIED
        userFriendlyMessage = `Save failed: Permission Denied. Since you've already set the roles, this is likely a temporary delay. Please wait a moment and try saving again.`;
    } else if (e.message?.includes('Cloud Firestore API has not been used')) {
        userFriendlyMessage = `Save failed: The Firestore database has not been created for this project. Please create it in the Firebase Console before saving content.`;
    }
    return { success: false, message: userFriendlyMessage };
  }
}
