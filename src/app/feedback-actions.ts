'use server'

import { z } from 'zod'

const feedbackSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }).optional().or(z.literal('')),
  feedback: z.string().min(10, { message: 'Feedback must be at least 10 characters.' }),
})

export async function submitFeedbackForm(data: unknown) {
  const result = feedbackSchema.safeParse(data)

  if (result.success) {
    // In a real app, you'd save this to a database.
    console.log('New feedback received:', result.data)
    return { success: true, message: 'Thank you for your feedback! We appreciate you taking the time.' }
  } else {
    console.error('Validation errors:', result.error.flatten().fieldErrors)
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
      message: "Please correct the errors and try again."
    }
  }
}
