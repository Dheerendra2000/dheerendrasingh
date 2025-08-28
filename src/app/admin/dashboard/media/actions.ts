
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { db, storage, initError } from '@/lib/firebase-admin'

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

type ReturnValue = {
    success: boolean;
    message: string;
}

export async function updateMediaContent(formData: FormData): Promise<ReturnValue> {
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET;

    if (initError || !db || !storage || !bucketName) {
        const errorMessage = initError || "Database/Storage not initialized or Bucket Name missing.";
        return { success: false, message: `Failed to save: ${errorMessage}` };
    }

    const mediaJson = formData.get('media');

    if (typeof mediaJson !== 'string') {
        return { 
            success: false,
            message: 'Invalid form data submitted. Could not find media data.',
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
            message: 'Invalid data format. Media data is not valid JSON.',
        }
    }

    for (let i = 0; i < parsedData.items.length; i++) {
        const item = parsedData.items[i];
        const logoFile = formData.get(`logo-file-${item.id}`) as File | null;
        if (!item.outletLogoUrl && (!logoFile || logoFile.size === 0)) {
            return { success: false, message: `Error in Item #${i + 1}: An outlet logo is required.` };
        }
        const coverFile = formData.get(`cover-file-${item.id}`) as File | null;
        if (!item.coverImageUrl && (!coverFile || coverFile.size === 0)) {
            return { success: false, message: `Error in Item #${i + 1}: A cover image is required.` };
        }
    }
  
    const result = mediaContentSchema.safeParse({ items: parsedData.items });

    if (!result.success) {
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
        }
    }

    try {
        const bucket = storage.bucket(bucketName);
        const itemsWithUrls = await Promise.all(result.data.items.map(async (item) => {
            let newItem = { ...item };
            const logoFile = formData.get(`logo-file-${item.id}`) as File | null;
            const coverFile = formData.get(`cover-file-${item.id}`) as File | null;

            if (logoFile && logoFile.size > 0) {
                const fileBuffer = Buffer.from(await logoFile.arrayBuffer());
                const filename = `media/logos/${item.id}-${Date.now()}-${logoFile.name}`;
                const fileUpload = bucket.file(filename);
                await fileUpload.save(fileBuffer, { metadata: { contentType: logoFile.type } });
                await fileUpload.makePublic();
                newItem.outletLogoUrl = fileUpload.publicUrl();
            }

            if (coverFile && coverFile.size > 0) {
                const fileBuffer = Buffer.from(await coverFile.arrayBuffer());
                const filename = `media/covers/${item.id}-${Date.now()}-${coverFile.name}`;
                const fileUpload = bucket.file(filename);
                await fileUpload.save(fileBuffer, { metadata: { contentType: coverFile.type } });
                await fileUpload.makePublic();
                newItem.coverImageUrl = fileUpload.publicUrl();
            }

            return newItem;
        }));

        const dataToSave = { items: itemsWithUrls, filters: parsedData.filters };
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
