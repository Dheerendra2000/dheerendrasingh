'use server'

import { z } from 'zod'
import { storage, initError } from '@/lib/firebase-admin'
import { v4 as uuidv4 } from 'uuid';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
})

export async function submitContactForm(data: unknown) {
  const result = contactSchema.safeParse(data)

  if (result.success) {
    // In a real app, you'd send an email, save to a DB, etc.
    console.log('New contact message:', result.data)
    return { success: true, message: 'Thank you for your message! We will get back to you soon.' }
  } else {
    console.error('Validation errors:', result.error.flatten().fieldErrors)
    return { 
      success: false, 
      errors: result.error.flatten().fieldErrors,
      message: "Please correct the errors and try again."
    }
  }
}

// New action to generate a signed URL for direct browser uploads
const signedUrlSchema = z.object({
  fileName: z.string(),
  fileType: z.string(),
  path: z.string().optional().default('general'),
});

type SignedUrlResponse = {
  success: boolean;
  message?: string;
  uploadUrl?: string;
  publicUrl?: string;
};

export async function getSignedUploadUrl(data: unknown): Promise<SignedUrlResponse> {
  const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
  
  if (initError || !storage || !bucketName) {
    const errorMessage = initError || "Storage not initialized or Bucket Name missing.";
    console.error(`getSignedUploadUrl Error: ${errorMessage}`);
    return { success: false, message: `Server Error: ${errorMessage}` };
  }

  const result = signedUrlSchema.safeParse(data);
  if (!result.success) {
    return { success: false, message: 'Invalid request data.' };
  }

  const { fileName, fileType, path } = result.data;
  const uniqueId = uuidv4();
  const extension = fileName.split('.').pop();
  const uniqueFileName = `${path}/${uniqueId}.${extension}`;

  try {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(uniqueFileName);

    const [uploadUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: fileType,
    });

    const publicUrl = file.publicUrl();

    return {
      success: true,
      uploadUrl,
      publicUrl,
    };
  } catch (error: any) {
    console.error('Failed to generate signed URL:', error);
    let userFriendlyMessage = 'Could not initiate file upload. A server error occurred.';
    if (error.code === 403) {
      userFriendlyMessage = `Server Permission Denied. Ensure the service account has 'Storage Admin' role.`;
    }
    return {
      success: false,
      message: userFriendlyMessage,
    };
  }
}
