
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { db, storage, initError } from '@/lib/firebase-admin'

const homeContentSchema = z.object({
  heroTitle: z.string().min(1, { message: 'Hero title is required.' }),
  heroTagline: z.string().min(1, { message: 'Hero tagline is required.' }),
  heroTitleColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/i, { message: 'Must be a valid hex color code (e.g., #FFD700).' }),
  heroTaglineColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/i, { message: 'Must be a valid hex color code (e.g., #F8FAFC).' }),
  videoUrl: z.string().url({ message: 'Video URL must be a valid URL.' }).optional().or(z.literal('')),
})

type ReturnValue = {
    success: boolean;
    message: string;
    errors?: Record<string, string[]> | null;
    newVideoUrl?: string;
}

export async function updateHomeContent(formData: FormData): Promise<ReturnValue> {
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET;

    if (initError || !db || !storage || !bucketName) {
        const errorMessage = initError || "Database/Storage not initialized or Bucket Name missing.";
        return { success: false, message: `Failed to save: ${errorMessage}` };
    }

  const rawData = {
    heroTitle: formData.get('heroTitle'),
    heroTagline: formData.get('heroTagline'),
    heroTitleColor: formData.get('heroTitleColor'),
    heroTaglineColor: formData.get('heroTaglineColor'),
  }

  const result = homeContentSchema.safeParse(rawData)

  if (!result.success) {
    return {
        success: false,
        message: 'Please correct the errors and try again.',
        errors: result.error.flatten().fieldErrors,
    }
  }

  try {
    let finalVideoUrl = formData.get('currentVideoUrl') as string || '';
    const videoFile = formData.get('videoFile') as File | null;

    if (videoFile && videoFile.size > 0) {
      const bucket = storage.bucket(bucketName);
      const fileBuffer = Buffer.from(await videoFile.arrayBuffer());
      const filename = `hero/background-${Date.now()}-${videoFile.name}`;
      const fileUpload = bucket.file(filename);

      await fileUpload.save(fileBuffer, { metadata: { contentType: videoFile.type } });
      await fileUpload.makePublic();
      finalVideoUrl = fileUpload.publicUrl();
    } else if (!finalVideoUrl) {
        return {
            success: false,
            message: 'A background video is required. Please upload a file.',
        }
    }
    
    const contentToSave = {
      ...result.data,
      videoUrl: finalVideoUrl,
    };

    await db.collection('content').doc('home').set(contentToSave, { merge: true });
    revalidatePath('/'); // Revalidate the home page to show the new content
    revalidatePath('/admin/dashboard/home');
    return { 
        success: true,
        message: 'Home page content updated successfully!',
        newVideoUrl: finalVideoUrl,
    }
  } catch (e: any) {
    console.error('Failed to write home content to Firestore or upload file:', e)
     let userFriendlyMessage = 'Failed to save content. A server error occurred.';
     if (e.code === 7) { // PERMISSION_DENIED
          userFriendlyMessage = `Save failed: Permission Denied. This is likely a temporary issue. Please wait a moment and try again.`;
     } else if (e.message?.includes('Cloud Firestore API has not been used')) {
          userFriendlyMessage = `Save failed: The Firestore database has not been created for this project. Please create it in the Firebase Console.`;
     } else if (e.message?.includes('Bucket name not specified or invalid')) {
        userFriendlyMessage = `The Storage Bucket is not configured correctly on the server. Please check environment variables.`;
    }

    return {
      success: false,
      message: userFriendlyMessage,
    }
  }
}
