
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { db, storage, initError } from '@/lib/firebase-admin'

const courseSchema = z.object({
  id: z.string(),
  title: z.string().min(1, { message: 'Title is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  thumbnail: z.string().url({ message: 'Thumbnail URL must be a valid URL.' }).or(z.literal('')),
  hint: z.string().optional(),
  price: z.string().min(1, { message: 'Price is required.' }),
  category: z.string().min(1, { message: 'Category is required.' }),
  link: z.string().url({ message: 'Link must be a valid URL.' }).or(z.literal('')),
});

const coursesContentSchema = z.object({
  courses: z.array(courseSchema),
});

type ReturnValue = {
    success: boolean;
    message: string;
}

export async function updateCoursesContent(formData: FormData): Promise<ReturnValue> {
  const bucketName = process.env.FIREBASE_STORAGE_BUCKET;

  if (initError || !db || !storage || !bucketName) {
    const errorMessage = initError || "Database/Storage not initialized or Bucket Name missing.";
    return { success: false, message: `Failed to save: ${errorMessage}` };
  }

  const coursesJson = formData.get('courses');

  if (typeof coursesJson !== 'string') {
    return { 
        success: false,
        message: 'Invalid form data submitted. Could not find courses data.',
    }
  }

  let parsedData;
  try {
    parsedData = { courses: JSON.parse(coursesJson) };
  } catch (error) {
     return { 
        success: false,
        message: 'Invalid data format. Courses data is not valid JSON.',
    }
  }
  
  // File validation before Zod parse
  for (let i = 0; i < parsedData.courses.length; i++) {
    const item = parsedData.courses[i];
    const thumbnailFile = formData.get(`thumbnail-file-${item.id}`) as File | null;
    if (!item.thumbnail && (!thumbnailFile || thumbnailFile.size === 0)) {
        const errorMessage = `Error in Item #${i + 1}: A thumbnail image is required. Please upload a file.`;
        return { success: false, message: errorMessage };
    }
  }

  const result = coursesContentSchema.safeParse(parsedData);

  if (!result.success) {
    const firstIssue = result.error.issues[0];
    let specificMessage = 'Please correct the errors and try again.';
    if (firstIssue) {
        const path = firstIssue.path;
        const defaultMessage = firstIssue.message;
        if (path.length > 2 && path[0] === 'courses') {
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
    const coursesWithUrls = await Promise.all(result.data.courses.map(async (item) => {
      let newItem = { ...item };
      const thumbnailFile = formData.get(`thumbnail-file-${item.id}`) as File | null;

      if (thumbnailFile && thumbnailFile.size > 0) {
        const fileBuffer = Buffer.from(await thumbnailFile.arrayBuffer());
        const filename = `courses/thumbnails/${item.id}-${Date.now()}-${thumbnailFile.name}`;
        const fileUpload = bucket.file(filename);
        await fileUpload.save(fileBuffer, { metadata: { contentType: thumbnailFile.type } });
        await fileUpload.makePublic();
        newItem.thumbnail = fileUpload.publicUrl();
      }
      return newItem;
    }));

    const finalData = {
        courses: coursesWithUrls
    };

    await db.collection('content').doc('courses').set(finalData, { merge: true });
    revalidatePath('/'); // Revalidate the home page
    revalidatePath('/admin/dashboard/courses'); // Revalidate this page
    return { 
        success: true,
        message: 'Courses updated successfully!',
    }
  } catch (e: any) {
    console.error('Failed to write courses content to Firestore or upload file:', e)
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
