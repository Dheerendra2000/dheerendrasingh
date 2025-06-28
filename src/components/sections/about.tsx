import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function AboutSection() {
  const highlights = [
    "15+ years of experience in public speaking",
    "Expert in personal and corporate branding",
    "Featured in major media outlets",
    "Helped 100+ clients build their brand presence",
  ]

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary">About Me</h2>
          <p className="text-lg text-muted-foreground mt-2">Discover my journey and expertise</p>
        </div>
        <div className="grid md:grid-cols-5 gap-12 items-center">
          <div className="md:col-span-2">
            <Card className="overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
              <Image
                src="https://placehold.co/600x800.png"
                alt="Dheerendra Singh professional portrait"
                data-ai-hint="professional portrait"
                width={600}
                height={800}
                className="object-cover w-full h-full"
              />
            </Card>
          </div>
          <div className="md:col-span-3">
            <h3 className="text-3xl font-headline font-semibold text-primary mb-4">A Passion for Communication and Branding</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Dheerendra Singh is a renowned public speaker and branding specialist with over a decade of experience in empowering individuals and organizations to communicate with impact and build unforgettable brands. His journey began with a passion for storytelling, which evolved into a mission to help others find their unique voice and leverage it for success.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Through dynamic keynote speeches, interactive workshops, and personalized coaching, Dheerendra has transformed leaders, entrepreneurs, and professionals across various industries, enabling them to master the art of public relations and strategic branding.
            </p>
            <ul className="space-y-3">
              {highlights.map((highlight, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-accent mr-3 flex-shrink-0" />
                  <span className="font-medium text-foreground/90">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
