'use server'

import { z } from 'zod'
import fs from 'fs/promises'
import path from 'path'
import { revalidatePath } from 'next/cache'

const aboutContentSchema = z.object({
  heading: z.string().min(1, { message: 'Heading is required.' }),
  paragraph1: z.string().min(1, { message: 'First paragraph is required.' }),
  paragraph2: z.string().min(1, { message: 'Second paragraph is required.' }),
  highlights: z.string().min(1, { message: 'Highlights are required.' }),
  imageUrl: z.string().url({ message: 'Please enter a valid image URL.' }),
  imageHint: z.string().max(20, { message: "Hint can't be more than two words." }).optional(),
})

const contentFilePath = path.join(process.cwd(), 'src', 'lib', 'content', 'about.json');

// This function is designed to be used in a useActionState hook.
export async function updateAboutContent(prevState: any, formData: FormData) {
  const rawData = {
    heading: formData.get('heading'),
    paragraph1: formData.get('paragraph1'),
    paragraph2: formData.get('paragraph2'),
    highlights: formData.get('highlights'),
    imageUrl: formData.get('imageUrl'),
    imageHint: formData.get('imageHint'),
  }

  const result = aboutContentSchema.safeParse(rawData)

  if (result.success) {
    try {
      const highlightsArray = result.data.highlights.split('\n').map(h => h.trim()).filter(h => h);
      const contentToSave = {
        ...result.data,
        highlights: highlightsArray,
      };
      
      await fs.writeFile(contentFilePath, JSON.stringify(contentToSave, null, 2));
      revalidatePath('/'); // Revalidate the home page to show new content
      revalidatePath('/admin/dashboard/about'); // Revalidate this page to show new content in form
      return { 
          success: true,
          message: 'About page content updated successfully!',
          errors: null,
          error: null,
      }
    } catch (e) {
      console.error('Failed to write about content file:', e)
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
