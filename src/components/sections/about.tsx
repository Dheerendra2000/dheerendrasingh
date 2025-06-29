import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { getAboutContent } from "@/lib/data/about"


export default async function AboutSection() {
  const content = await getAboutContent();

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
                src={content.imageUrl}
                alt="Dheerendra Singh professional portrait"
                data-ai-hint={content.imageHint}
                width={600}
                height={800}
                className="object-cover w-full h-full"
              />
            </Card>
          </div>
          <div className="md:col-span-3">
            <h3 className="text-3xl font-headline font-semibold text-primary mb-4">{content.heading}</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {content.paragraph1}
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              {content.paragraph2}
            </p>
            <ul className="space-y-3">
              {content.highlights.map((highlight, index) => (
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
