
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { db, storage, initError } from '@/lib/firebase-admin'

const aboutContentSchema = z.object({
  heading: z.string().min(1, { message: 'Heading is required.' }),
  paragraph1: z.string().min(1, { message: 'First paragraph is required.' }),
  paragraph2: z.string().min(1, { message: 'Second paragraph is required.' }),
  highlights: z.string().min(1, { message: 'Highlights are required.' }),
  imageHint: z.string().max(20, { message: "Hint can't be more than two words." }).optional(),
  // imageUrl is now handled separately from the main schema
  imageUrl: z.string().url().optional().or(z.literal('')),
})

type ReturnValue = {
    success: boolean;
    message: string;
    errors?: Record<string, string[]> | null;
    newImageUrl?: string;
}

export async function updateAboutContent(formData: FormData): Promise<ReturnValue> {
  const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
  
  if (initError || !db || !storage || !bucketName) {
    const errorMessage = initError || "Database/Storage not initialized or Bucket Name missing.";
    return { success: false, message: `Failed to save: ${errorMessage}` };
  }

  const rawData = {
    heading: formData.get('heading'),
    paragraph1: formData.get('paragraph1'),
    paragraph2: formData.get('paragraph2'),
    highlights: formData.get('highlights'),
    imageHint: formData.get('imageHint'),
    // imageUrl is not parsed here, it's handled after potential upload
  }

  const result = aboutContentSchema.safeParse(rawData)

  if (!result.success) {
    console.error('Validation errors:', result.error.flatten().fieldErrors)
    return {
        success: false,
        message: 'Please correct the errors and try again.',
        errors: result.error.flatten().fieldErrors,
    }
  }

  try {
    let finalImageUrl = formData.get('currentImageUrl') as string || '';
    const imageFile = formData.get('imageFile') as File | null;

    if (imageFile && imageFile.size > 0) {
      const bucket = storage.bucket(bucketName);
      const fileBuffer = Buffer.from(await imageFile.arrayBuffer());
      const filename = `about/profile-${Date.now()}-${imageFile.name}`;
      const fileUpload = bucket.file(filename);

      await fileUpload.save(fileBuffer, { metadata: { contentType: imageFile.type } });
      await fileUpload.makePublic();
      finalImageUrl = fileUpload.publicUrl();
    } else if (!finalImageUrl) {
        return {
            success: false,
            message: 'A profile image is required. Please upload a file.',
        }
    }

    const highlightsArray = result.data.highlights.split('\n').map(h => h.trim()).filter(h => h);
    const contentToSave = {
      ...result.data,
      highlights: highlightsArray,
      imageUrl: finalImageUrl,
    };
    
    await db.collection('content').doc('about').set(contentToSave, { merge: true });
    revalidatePath('/');
    revalidatePath('/admin/dashboard/about');
    return { 
        success: true,
        message: 'About page content updated successfully!',
        newImageUrl: finalImageUrl,
    }
  } catch (e: any) {
    console.error('Failed to write about content to Firestore or upload file:', e)
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
