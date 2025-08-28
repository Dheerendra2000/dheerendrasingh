'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { db, initError } from '@/lib/firebase-admin'

const contactInfoSchema = z.object({
  title: z.string().min(1, { message: 'Title is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  phone: z.string().min(1, { message: 'Phone number is required.' }),
  address: z.string().min(1, { message: 'Address is required.' }),
})

type ReturnValue = {
    success: boolean;
    message: string;
    errors?: Record<string, string[]> | null;
}

export async function updateContactInfo(formData: FormData): Promise<ReturnValue> {
  if (initError || !db) {
    return { 
        success: false,
        message: `Failed to save: ${initError || "Database not initialized."}`,
    }
  }

  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    address: formData.get('address'),
  }

  const result = contactInfoSchema.safeParse(rawData)

  if (!result.success) {
    return {
        success: false,
        message: 'Please correct the errors and try again.',
        errors: result.error.flatten().fieldErrors,
    }
  }
  
  try {
    await db.collection('content').doc('contactInfo').set(result.data, { merge: true });
    revalidatePath('/');
    revalidatePath('/admin/dashboard/contact');
    return { 
        success: true,
        message: 'Contact information updated successfully!',
    }
  } catch (e: any) {
    console.error('Failed to write contact info to Firestore:', e)
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
