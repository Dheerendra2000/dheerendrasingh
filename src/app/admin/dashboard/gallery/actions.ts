
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { db, storage, initError } from '@/lib/firebase-admin'

const galleryItemSchema = z.object({
  id: z.string(),
  type: z.enum(['image', 'video']),
  src: z.string().url({ message: 'URL must be a valid.' }).optional().or(z.literal('')),
  alt: z.string().min(1, { message: 'Alt text is required.' }),
  hint: z.string().optional(),
  category: z.string().min(1, { message: 'Category is required.' }),
  videoSrc: z.string().url({ message: 'Video URL must be a valid URL.' }).optional().or(z.literal('')),
  size: z.enum(['regular', 'large']).optional(),
}).superRefine((data, ctx) => {
    if (data.type === 'image' && (!data.src || data.src.trim() === '')) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['src'], message: 'Image URL is required for image items.' });
    }
    if (data.type === 'video' && (!data.videoSrc || data.videoSrc.trim() === '')) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['videoSrc'], message: 'A valid Video URL is required for video items.'});
    }
});


const galleryContentSchema = z.object({
  items: z.array(galleryItemSchema),
  filters: z.array(z.string()),
});

export async function updateGalleryContent(prevState: any, formData: FormData) {
  if (initError || !db || !storage) {
    const errorMessage = initError || "Database or Storage not initialized.";
    return { success: false, message: `Failed to save: ${errorMessage}`, errors: { _form: errorMessage } };
  }

  const galleryJson = formData.get('gallery');
  if (typeof galleryJson !== 'string') {
    return { success: false, message: 'Invalid form data submitted.', errors: { _form: 'Could not find gallery data.' } };
  }

  let parsedData;
  try {
    const rawItems = JSON.parse(galleryJson);
    const categories = [...new Set(rawItems.map((item: any) => item.category.trim()).filter(Boolean))];
    const filters = ["all", ...categories];
    parsedData = { items: rawItems, filters };
  } catch (error) {
     return { success: false, message: 'Invalid data format.', errors: { _form: 'Gallery data is not valid JSON.' } };
  }

  const result = galleryContentSchema.safeParse(parsedData);

  if (!result.success) {
    const firstIssue = result.error.issues[0];
    let specificMessage = 'An unexpected validation error occurred. Please check all fields.';
    if (firstIssue) {
        const path = firstIssue.path;
        const defaultMessage = firstIssue.message;
        if (path.length > 2 && path[0] === 'items') {
            const itemIndex = Number(path[1]) + 1;
            const fieldName = String(path[2]);
            const prettyFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1');
            specificMessage = `Error in Item #${itemIndex} (${prettyFieldName}): ${defaultMessage}`;
        } else {
            specificMessage = defaultMessage;
        }
    }
    console.error('Validation errors:', result.error.format());
    return { success: false, message: specificMessage, errors: { _form: specificMessage } };
  }

  try {
    const bucket = storage.bucket();
    const itemsWithUploadedUrls = await Promise.all(result.data.items.map(async (item, index) => {
      const file = formData.get(`src-file-${item.id}`) as File | null;
      let newItem = { ...item };

      if (file && file.size > 0) {
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const filename = `gallery/${item.id}-${Date.now()}-${file.name}`;
        const fileUpload = bucket.file(filename);

        await fileUpload.save(fileBuffer, {
          metadata: { contentType: file.type },
        });
        
        // Get the public URL
        const [url] = await fileUpload.getSignedUrl({
            action: 'read',
            expires: '03-09-2491' // Far-future expiration date
        });

        newItem.src = url;
      }
      
      // Clear videoSrc for image types for cleaner data
      if (newItem.type === 'image') {
        newItem.videoSrc = '';
      }
      
      return newItem;
    }));

    const finalData = {
      ...result.data,
      items: itemsWithUploadedUrls
    };

    await db.collection('content').doc('gallery').set(finalData, { merge: true });
    revalidatePath('/');
    revalidatePath('/admin/dashboard/gallery');
    return { success: true, message: 'Gallery updated successfully!', errors: null };

  } catch (e: any) {
    console.error('Failed to write gallery content to Firestore or upload file:', e);
    let userFriendlyMessage = 'Failed to save content. A server error occurred.';
    if (e.code === 7) { // PERMISSION_DENIED
        userFriendlyMessage = `Save failed: Permission Denied. Since you've already set the roles, this is likely a temporary delay. Please wait a moment and try saving again.`;
    } else if (e.message?.includes('Cloud Firestore API has not been used')) {
        userFriendlyMessage = `Save failed: The Firestore database has not been created for this project. Please create it in the Firebase Console before saving content.`;
    }
    return { success: false, message: userFriendlyMessage, errors: { _form: e.message || "Firestore/Storage error." } };
  }
}
