"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { submitTestimonial } from "@/app/actions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const testimonialFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }).optional().or(z.literal('')),
  testimonial: z.string().min(10, { message: "Testimonial must be at least 10 characters." }),
})

type TestimonialFormValues = z.infer<typeof testimonialFormSchema>

export default function TestimonialForm() {
  const { toast } = useToast()
  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      name: "",
      email: "",
      testimonial: "",
    },
  })

  const onSubmit = async (data: TestimonialFormValues) => {
    const result = await submitTestimonial(data)
    if (result.success) {
      toast({
        title: "Testimonial Submitted!",
        description: result.message,
      })
      form.reset()
    } else {
      toast({
        title: "Error",
        description: result.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="mt-16">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Leave a Testimonial</CardTitle>
          <CardDescription>Share your experience. Your feedback helps others and is greatly appreciated!</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address (Optional)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="testimonial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Testimonial</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Dheerendra's branding strategies revolutionized our market approach..." rows={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
                {form.formState.isSubmitting ? 'Submitting...' : 'Submit Testimonial'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
