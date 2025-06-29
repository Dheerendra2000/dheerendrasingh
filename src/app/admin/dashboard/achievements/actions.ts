'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { db, initError } from '@/lib/firebase-admin'

const achievementSchema = z.object({
  id: z.string(),
  icon: z.string().min(1, { message: 'Icon name is required.' }),
  year: z.string().min(4, { message: 'Year is required.' }),
  title: z.string().min(1, { message: 'Title is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
});

const achievementsContentSchema = z.object({
  achievements: z.array(achievementSchema),
});

export async function updateAchievementsContent(prevState: any, formData: FormData) {
  if (initError || !db) {
    return { 
        success: false,
        message: 'Failed to save: Database not connected.',
        errors: { _form: initError || "Database not initialized." },
    }
  }

  const achievementsJson = formData.get('achievements');

  if (typeof achievementsJson !== 'string') {
    return { 
        success: false,
        message: 'Invalid form data submitted.',
        errors: { _form: 'Could not find achievements data.' },
    }
  }

  let parsedData;
  try {
    parsedData = { achievements: JSON.parse(achievementsJson) };
  } catch (error) {
     return { 
        success: false,
        message: 'Invalid data format.',
        errors: { _form: 'Achievements data is not valid JSON.' },
    }
  }

  const result = achievementsContentSchema.safeParse(parsedData)

  if (result.success) {
    try {
      await db.collection('content').doc('achievements').set(result.data, { merge: true });
      revalidatePath('/'); // Revalidate the home page
      revalidatePath('/admin/dashboard/achievements'); // Revalidate this page
      return { 
          success: true,
          message: 'Achievements updated successfully!',
          errors: null,
      }
    } catch (e: any) {
      console.error('Failed to write achievements content to Firestore:', e)
       let userFriendlyMessage = 'Failed to save content. A server error occurred.';
       if (e.code === 7) { // PERMISSION_DENIED
            userFriendlyMessage = `Save failed: Permission Denied. Since you've already set the roles, this is likely a temporary delay. Please wait a moment and try saving again.`;
       } else if (e.message?.includes('Cloud Firestore API has not been used')) {
            userFriendlyMessage = `Save failed: The Firestore database has not been created for this project. Please create it in the Firebase Console before saving content.`;
       }

      return {
        success: false,
        message: userFriendlyMessage,
        errors: { _form: e.message || "Firestore error." },
      }
    }
  } else {
    console.error('Validation errors:', result.error.flatten().fieldErrors)
    return {
        success: false,
        message: 'Please correct the errors and try again.',
        errors: result.error.flatten().fieldErrors,
    }
  }
}
