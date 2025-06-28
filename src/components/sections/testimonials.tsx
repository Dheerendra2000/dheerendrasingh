import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Quote } from "lucide-react"

const testimonials = [
  {
    name: "John Doe",
    title: "CEO, TechCorp",
    image: "https://placehold.co/100x100.png",
    hint: "man portrait",
    quote: "Dheerendra's branding strategies revolutionized our market approach. His insights are invaluable, and his delivery is captivating.",
  },
  {
    name: "Jane Smith",
    title: "Marketing Director, Innovate Ltd.",
    image: "https://placehold.co/100x100.png",
    hint: "woman portrait",
    quote: "Working with Dheerendra was a game-changer. His public speaking course gave our team the confidence to shine.",
  },
  {
    name: "Samuel Green",
    title: "Startup Founder",
    image: "https://placehold.co/100x100.png",
    hint: "person portrait",
    quote: "As a founder, getting the brand story right is crucial. Dheerendra helped me craft a narrative that resonates with investors and customers.",
  },
]

export default function TestimonialsSection() {
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
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/1">
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
      </div>
    </section>
  )
}
