import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import fs from 'fs/promises'
import path from 'path'

type HeroContent = {
  heroTitle: string;
  heroTagline: string;
  videoUrl: string;
}

async function getHeroContent(): Promise<HeroContent> {
  const contentFilePath = path.join(process.cwd(), 'src', 'lib', 'content', 'home.json');
  try {
    const data = await fs.readFile(contentFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read hero content, using fallback:", error);
    // Fallback content in case the file doesn't exist or is invalid
    return {
      heroTitle: "Dheerendra Singh",
      heroTagline: "Leading Public Speaker & Branding and PR Specialist",
      videoUrl: "https://dummy-media.torchbox.com/media/hero-1920x1080.mp4",
    };
  }
}

export default async function HeroSection() {
  const content = await getHeroContent();

  return (
    <section id="home" className="relative h-[calc(100vh-5rem)] min-h-[600px] flex items-center justify-center text-white overflow-hidden">
      <video
        key={content.videoUrl} // Add key to force re-render on URL change
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src={content.videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-primary/70 -z-10" />
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 drop-shadow-lg animate-fade-in-down">
          {content.heroTitle}
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto drop-shadow-md animate-fade-in-up">
          {content.heroTagline}
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
