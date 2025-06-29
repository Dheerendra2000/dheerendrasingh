'use server'

import { z } from 'zod'

const homeContentSchema = z.object({
  heroTitle: z.string().min(1, { message: 'Hero title is required.' }),
  heroTagline: z.string().min(1, { message: 'Hero tagline is required.' }),
  videoUrl: z.string().url({ message: 'Please enter a valid URL for the video.' }),
})

// This function is designed to be used in a useActionState hook.
export async function updateHomeContent(prevState: any, formData: FormData) {
  const data = {
    heroTitle: formData.get('heroTitle'),
    heroTagline: formData.get('heroTagline'),
    videoUrl: formData.get('videoUrl'),
  }

  const result = homeContentSchema.safeParse(data)

  if (result.success) {
    // In a real app, you would save this data to your database.
    console.log('Updated home content:', result.data)
    return { 
        success: true,
        message: 'Home page content updated successfully!',
        errors: null,
        error: null,
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
