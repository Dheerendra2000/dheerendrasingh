import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getHomeContent } from "@/lib/data/home"

export default async function HeroSection() {
  const content = await getHomeContent();

  return (
    <section id="home" className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl group">
            <video
                key={content.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
            >
                <source src={content.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-primary/70 z-10" />
            
            <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white p-4">
                <h1 className="text-4xl md:text-6xl font-bold font-headline text-accent mb-4 drop-shadow-lg">
                  {content.heroTitle}
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto drop-shadow-md">
                  {content.heroTagline}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" asChild>
                    <Link href="#contact">
                      Book a Session
                    </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                    <Link href="#courses">
                      Explore Courses
                    </Link>
                </Button>
                </div>
            </div>
        </div>
      </div>
    </section>
  )
}
