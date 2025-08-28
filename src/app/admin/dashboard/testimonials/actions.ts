
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { db, storage, initError } from '@/lib/firebase-admin'

const testimonialSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Name is required.' }),
  title: z.string().min(1, { message: 'Title is required.' }),
  quote: z.string().min(1, { message: 'Quote is required.' }),
  image: z.string().url({ message: 'Image URL must be a valid URL.' }).or(z.literal('')),
  hint: z.string().optional(),
});

const testimonialsContentSchema = z.object({
  testimonials: z.array(testimonialSchema),
});

type ReturnValue = {
    success: boolean;
    message: string;
}

export async function updateTestimonialsContent(formData: FormData): Promise<ReturnValue> {
  const bucketName = process.env.FIREBASE_STORAGE_BUCKET;

  if (initError || !db || !storage || !bucketName) {
    const errorMessage = initError || "Database/Storage not initialized or Bucket Name missing.";
    return { success: false, message: `Failed to save: ${errorMessage}` };
  }

  const testimonialsJson = formData.get('testimonials');

  if (typeof testimonialsJson !== 'string') {
    return { 
        success: false,
        message: 'Invalid form data submitted. Could not find testimonials data.',
    }
  }

  let parsedData;
  try {
    parsedData = { testimonials: JSON.parse(testimonialsJson) };
  } catch (error) {
     return { 
        success: false,
        message: 'Invalid data format. Testimonials data is not valid JSON.',
    }
  }
  
  for (let i = 0; i < parsedData.testimonials.length; i++) {
    const item = parsedData.testimonials[i];
    const imageFile = formData.get(`image-file-${item.id}`) as File | null;
    if (!item.image && (!imageFile || imageFile.size === 0)) {
        const errorMessage = `Error in Item #${i + 1}: An image is required. Please upload a file.`;
        return { success: false, message: errorMessage};
    }
  }

  const result = testimonialsContentSchema.safeParse(parsedData)

  if (!result.success) {
    const firstIssue = result.error.issues[0];
    let specificMessage = 'Please correct the errors and try again.';
    if (firstIssue) {
        const path = firstIssue.path;
        const defaultMessage = firstIssue.message;
        if (path.length > 2 && path[0] === 'testimonials') {
            const itemIndex = Number(path[1]) + 1;
            const fieldName = String(path[2]);
            const prettyFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
            specificMessage = `Error in Item #${itemIndex} (${prettyFieldName}): ${defaultMessage}`;
        } else {
            specificMessage = defaultMessage;
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
    const testimonialsWithUrls = await Promise.all(result.data.testimonials.map(async (item) => {
        let newItem = { ...item };
        const imageFile = formData.get(`image-file-${item.id}`) as File | null;

        if (imageFile && imageFile.size > 0) {
            const fileBuffer = Buffer.from(await imageFile.arrayBuffer());
            const filename = `testimonials/${item.id}-${Date.now()}-${imageFile.name}`;
            const fileUpload = bucket.file(filename);
            await fileUpload.save(fileBuffer, { metadata: { contentType: imageFile.type } });
            await fileUpload.makePublic();
            newItem.image = fileUpload.publicUrl();
        }
        return newItem;
    }));

    const finalData = {
        testimonials: testimonialsWithUrls
    };

    await db.collection('content').doc('testimonials').set(finalData, { merge: true });
    revalidatePath('/');
    revalidatePath('/admin/dashboard/testimonials');
    return { 
        success: true,
        message: 'Testimonials updated successfully!',
    }
  } catch (e: any) {
    console.error('Failed to write testimonials content to Firestore or upload file:', e)
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
