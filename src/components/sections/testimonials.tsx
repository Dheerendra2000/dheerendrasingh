import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Quote, Terminal } from "lucide-react"
import { getTestimonialsContent } from "@/lib/data/testimonials"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import TestimonialForm from "./testimonial-form"

export default async function TestimonialsSection() {
  const { testimonials, error } = await getTestimonialsContent();

  if (error) {
    return (
      <section id="testimonials" className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
           <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Action Required: Configuration Error</AlertTitle>
            <AlertDescription>
              <p className="font-semibold">The 'Testimonials' section cannot connect to the database.</p>
              <code className="mt-2 relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                {error}
              </code>
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary">What My Audience Says</h2>
          <p className="text-lg text-muted-foreground mt-2">Hear from those who've experienced the impact</p>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/1">
                <div className="p-1">
                  <Card className="shadow-lg">
                    <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                      <Quote className="w-10 h-10 text-accent mb-4" />
                      <p className="text-muted-foreground italic mb-6">"{testimonial.quote}"</p>
                      <div className="flex items-center">
                        <Avatar className="h-16 w-16 mr-4">
                          <AvatarImage src={testimonial.image} alt={testimonial.name} data-ai-hint={testimonial.hint} />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-primary">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        
        <TestimonialForm />

      </div>
    </section>
  )
}
