
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
})

const galleryContentSchema = z.object({
  items: z.array(galleryItemSchema),
  filters: z.array(z.string()),
});

type ReturnValue = {
    success: boolean;
    message: string;
}

export async function updateGalleryContent(formData: FormData): Promise<ReturnValue> {
  const bucketName = process.env.FIREBASE_STORAGE_BUCKET;

  if (initError || !db || !storage || !bucketName) {
    const errorMessage = initError || "Database/Storage not initialized or Bucket Name missing.";
    return { success: false, message: `Failed to save: ${errorMessage}` };
  }

  const galleryJson = formData.get('gallery');
  if (typeof galleryJson !== 'string') {
    return { success: false, message: 'Invalid form data submitted. Could not find gallery data.' };
  }

  let parsedData;
  try {
    const rawItems = JSON.parse(galleryJson);
    const categories = [...new Set(rawItems.map((item: any) => item.category.trim()).filter(Boolean))];
    const filters = ["all", ...categories];
    parsedData = { items: rawItems, filters };
  } catch (error) {
     return { success: false, message: 'Invalid data format. Gallery data is not valid JSON.' };
  }
  
  // Custom validation check for required files before Zod parse
  for (let i = 0; i < parsedData.items.length; i++) {
    const item = parsedData.items[i];
    const posterFile = formData.get(`src-file-${item.id}`) as File | null;
    
    if (item.type === 'image' && !item.src && (!posterFile || posterFile.size === 0)) {
        const errorMessage = `Error in Item #${i + 1}: An image is required. Please upload a file or provide a URL.`;
        return { success: false, message: errorMessage};
    }
     
    if (item.type === 'video') {
       const videoFile = formData.get(`video-file-${item.id}`) as File | null;
       if (!item.videoSrc && (!videoFile || videoFile.size === 0)) {
           const errorMessage = `Error in Item #${i + 1}: A video file is required. Please upload one.`;
           return { success: false, message: errorMessage};
       }
       if (!item.src && (!posterFile || posterFile.size === 0)) {
           const errorMessage = `Error in Item #${i + 1}: A video poster image is required. Please upload a file for the "Video Poster".`;
           return { success: false, message: errorMessage};
       }
    }
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
    return { success: false, message: specificMessage };
  }

  try {
    const bucket = storage.bucket(bucketName);
    const itemsWithUploadedUrls = await Promise.all(result.data.items.map(async (item) => {
      let newItem = { ...item };
      const posterFile = formData.get(`src-file-${item.id}`) as File | null;
      const videoFile = formData.get(`video-file-${item.id}`) as File | null;

      // Handle poster/image upload
      if (posterFile && posterFile.size > 0) {
        const fileBuffer = Buffer.from(await posterFile.arrayBuffer());
        const filename = `gallery/images/${item.id}-${Date.now()}-${posterFile.name}`;
        const fileUpload = bucket.file(filename);
        await fileUpload.save(fileBuffer, { metadata: { contentType: posterFile.type } });
        const [url] = await fileUpload.getSignedUrl({ action: 'read', expires: '03-09-2491' });
        newItem.src = url;
      }
      
      // Handle video upload if item type is video
      if (newItem.type === 'video' && videoFile && videoFile.size > 0) {
         const fileBuffer = Buffer.from(await videoFile.arrayBuffer());
         const filename = `gallery/videos/${item.id}-${Date.now()}-${videoFile.name}`;
         const fileUpload = bucket.file(filename);
         await fileUpload.save(fileBuffer, { metadata: { contentType: videoFile.type } });
         const [url] = await fileUpload.getSignedUrl({ action: 'read', expires: '03-09-2491' });
         newItem.videoSrc = url;
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
    return { success: true, message: 'Gallery updated successfully!' };

  } catch (e: any) {
    console.error('Failed to write gallery content to Firestore or upload file:', e);
    let userFriendlyMessage = 'Failed to save content. A server error occurred.';
    if (e.code === 7) { // PERMISSION_DENIED
        userFriendlyMessage = `Save failed: Permission Denied. Since you've already set the roles, this is likely a temporary delay. Please wait a moment and try saving again.`;
    } else if (e.message?.includes('Cloud Firestore API has not been used')) {
        userFriendlyMessage = `Save failed: The Firestore database has not been created for this project. Please create it in the Firebase Console before saving content.`;
    } else if (e.message?.includes('Bucket name not specified or invalid')) {
        userFriendlyMessage = `The Storage Bucket is not configured correctly on the server. Please check environment variables.`;
    }
    return { success: false, message: userFriendlyMessage };
  }
}
