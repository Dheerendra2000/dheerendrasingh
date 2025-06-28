import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <section id="home" className="relative h-[calc(100vh-5rem)] min-h-[600px] flex items-center justify-center text-white">
      <Image
        src="https://placehold.co/1920x1080.png"
        alt="Dheerendra Singh speaking at an event"
        data-ai-hint="speaker event"
        fill
        className="object-cover -z-10"
        priority
      />
      <div className="absolute inset-0 bg-primary/70 -z-10" />
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 drop-shadow-lg animate-fade-in-down">
          Dheerendra Singh
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto drop-shadow-md animate-fade-in-up">
          Leading Public Speaker & Branding and PR Specialist
        </p>
        <div className="flex justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <Button size="lg" asChild>
            <Link href="#contact">
              Book a Session <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="#courses">
              Explore Courses
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
