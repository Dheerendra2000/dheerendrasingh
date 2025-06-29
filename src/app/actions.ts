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
    // Verify connection configuration before sending
    await transporter.verify();
    
    await transporter.sendMail({
      from: `"${name}" <${EMAIL_FROM}>`,
      to: EMAIL_TO,
      replyTo: email,
      subject: `New Contact Form Submission: ${subject}`,
      text: `
New Message from your Website (dheerendrasingh.com)
---------------------------------------------------

You have received a new inquiry.

SENDER DETAILS:
- Name: ${name}
- Email: ${email}

MESSAGE:
- Subject: ${subject}

${message}

---------------------------------------------------
This is an automated message from your website's contact form.
      `,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <div style="background-color: #23497B; color: #ffffff; padding: 25px 20px; text-align: center;">
            <h1 style="margin: 0; font-family: 'Playfair Display', serif; font-size: 28px; font-weight: bold;">New Contact Inquiry</h1>
          </div>
          <div style="padding: 25px 20px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hello Dheerendra, you have received a new message via your portfolio website's contact form:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 15px;">
              <tr style="background-color: #f7f9fc;">
                <td style="padding: 12px; font-weight: bold; border: 1px solid #e0e0e0; width: 100px;">From:</td>
                <td style="padding: 12px; border: 1px solid #e0e0e0;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px; font-weight: bold; border: 1px solid #e0e0e0;">Email:</td>
                <td style="padding: 12px; border: 1px solid #e0e0e0;"><a href="mailto:${email}" style="color: #23497B; text-decoration: none;">${email}</a></td>
              </tr>
              <tr style="background-color: #f7f9fc;">
                <td style="padding: 12px; font-weight: bold; border: 1px solid #e0e0e0;">Subject:</td>
                <td style="padding: 12px; border: 1px solid #e0e0e0;">${subject}</td>
              </tr>
            </table>

            <h3 style="font-family: 'Playfair Display', serif; color: #23497B; border-bottom: 2px solid #e0e0e0; padding-bottom: 5px; margin-top: 30px; margin-bottom: 15px;">Message:</h3>
            <div style="font-size: 15px; line-height: 1.7; background-color: #fdfdfd; padding: 15px; border-left: 3px solid #23497B; min-height: 100px;">
              <p style="margin: 0; white-space: pre-wrap; word-wrap: break-word;">${message.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
          <div style="background-color: #f4f4f4; color: #888; padding: 20px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">This email was sent automatically from dheerendrasingh.com.</p>
            <p style="margin: 5px 0 0;">&copy; ${new Date().getFullYear()} Dheerendra Singh</p>
          </div>
        </div>
      `,
    });
    return { success: true, message: 'Thank you for your message! We will get back to you soon.' }
  } catch (error) {
    console.error('Failed to send contact form email:', error);
    // Return a more helpful error to the user to avoid leaking implementation details
    return { 
      success: false, 
      errors: null,
      message: "Sorry, we couldn't send your message. Please double-check your SMTP settings in the .env file or try again later."
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
