'use server'

import { z } from 'zod'
import nodemailer from 'nodemailer'

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
})

export async function submitContactForm(data: unknown) {
  const result = contactSchema.safeParse(data)

  if (!result.success) {
    console.error('Validation errors:', result.error.flatten().fieldErrors)
    return { 
      success: false, 
      errors: result.error.flatten().fieldErrors,
      message: "Please correct the errors and try again."
    }
  }

  const { name, email, subject, message } = result.data;
  
  // Email sending logic
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM, EMAIL_TO } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !EMAIL_FROM || !EMAIL_TO) {
    console.error('SMTP environment variables are not set. Email not sent. Please configure them in your .env file.');
    // As a fallback, we log the message to the console.
    console.log('New contact message (email not sent due to missing config):', result.data);
    // Still return a success message to the user.
    return { success: true, message: 'Thank you for your message! We will get back to you soon.' }
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"${name}" <${EMAIL_FROM}>`,
      to: EMAIL_TO,
      replyTo: email,
      subject: `New Contact Form Submission: ${subject}`,
      text: `You have received a new message from your website contact form.\n\nHere are the details:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>New Message from Website Contact Form</h2>
          <p>You have received a new message from <strong>${name}</strong> (<a href="mailto:${email}">${email}</a>).</p>
          <hr>
          <h3>Message Details</h3>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p style="padding: 1rem; background-color: #f4f4f4; border-left: 4px solid #ccc;">${message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    });
    return { success: true, message: 'Thank you for your message! We will get back to you soon.' }
  } catch (error) {
    console.error('Failed to send contact form email:', error);
    // Return a generic error to the user to avoid leaking implementation details
    return { 
      success: false, 
      errors: null,
      message: "Sorry, there was an issue sending your message. Please try again later."
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
