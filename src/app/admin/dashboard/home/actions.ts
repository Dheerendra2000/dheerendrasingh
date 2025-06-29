'use server'

import { z } from 'zod'
import fs from 'fs/promises'
import path from 'path'
import { revalidatePath } from 'next/cache'

const homeContentSchema = z.object({
  heroTitle: z.string().min(1, { message: 'Hero title is required.' }),
  heroTagline: z.string().min(1, { message: 'Hero tagline is required.' }),
  videoUrl: z.string().url({ message: 'Please enter a valid URL for the video.' }),
})

const contentFilePath = path.join(process.cwd(), 'src', 'lib', 'content', 'home.json');

// This function is designed to be used in a useActionState hook.
export async function updateHomeContent(prevState: any, formData: FormData) {
  const data = {
    heroTitle: formData.get('heroTitle'),
    heroTagline: formData.get('heroTagline'),
    videoUrl: formData.get('videoUrl'),
  }

  const result = homeContentSchema.safeParse(data)

  if (result.success) {
    try {
      await fs.writeFile(contentFilePath, JSON.stringify(result.data, null, 2));
      revalidatePath('/'); // Revalidate the home page to show the new content
      return { 
          success: true,
          message: 'Home page content updated successfully!',
          errors: null,
          error: null,
      }
    } catch (e) {
      console.error('Failed to write home content file:', e)
      return {
        success: false,
        message: 'Failed to save content. Please try again later.',
        errors: null,
        error: "File system error."
      }
    }
  } else {
    console.error('Validation errors:', result.error.flatten().fieldErrors)
    return {
        success: false,
        message: 'Please correct the errors and try again.',
        errors: result.error.flatten().fieldErrors,
        error: "Validation failed."
    }
  }
}
