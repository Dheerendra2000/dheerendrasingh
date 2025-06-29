'use server'

import { z } from 'zod'

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

const testimonialSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }).optional().or(z.literal('')),
  testimonial: z.string().min(10, { message: 'Testimonial must be at least 10 characters.' }),
})

export async function submitTestimonial(data: unknown) {
  const result = testimonialSchema.safeParse(data)

  if (result.success) {
    // In a real app, you'd save this to a database for approval.
    console.log('New testimonial submission:', result.data)
    return { success: true, message: 'Thank you for your testimonial! We may feature it on our site soon.' }
  } else {
    console.error('Validation errors:', result.error.flatten().fieldErrors)
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
      message: "Please correct the errors and try again."
    }
  }
}
