
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

type ReturnValue = {
    success: boolean;
    message: string;
}

export async function updateAchievementsContent(data: unknown): Promise<ReturnValue> {
  if (initError || !db) {
    return { 
        success: false,
        message: `Failed to save: ${initError || "Database not initialized."}`,
    }
  }

  const result = achievementsContentSchema.safeParse(data)

  if (!result.success) {
    const firstIssue = result.error.issues[0];
    let specificMessage = 'Please correct the errors and try again.';
    if (firstIssue) {
        const path = firstIssue.path;
        const defaultMessage = firstIssue.message;
        if (path.length > 2 && path[0] === 'achievements') {
            const itemIndex = Number(path[1]) + 1;
            const fieldName = String(path[2]);
            const prettyFieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
            specificMessage = `Error in Item #${itemIndex} (${prettyFieldName}): ${defaultMessage}`;
        }
    }
    console.error('Validation errors:', result.error.format())
    return {
        success: false,
        message: specificMessage,
    }
  }
  
  try {
    await db.collection('content').doc('achievements').set(result.data, { merge: true });
    revalidatePath('/'); // Revalidate the home page
    revalidatePath('/admin/dashboard/achievements'); // Revalidate this page
    return { 
        success: true,
        message: 'Achievements updated successfully!',
    }
  } catch (e: any) {
    console.error('Failed to write achievements content to Firestore:', e)
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
