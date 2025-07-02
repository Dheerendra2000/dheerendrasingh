import Image from "next/image"
import { Button } from "@/components/ui/button"
import { getMediaContent } from "@/lib/data/media"
import { Terminal } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import Link from "next/link"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"


export default async function MediaCoverageSection() {
  const { items, error } = await getMediaContent();

  if (error) {
    // Non-blocking error for the homepage, just won't render the section.
    console.error("Media Coverage Section Error:", error);
    return null;
  }

  if (!items || items.length === 0) {
    return null; // Don't render if there are no items
  }
  
  // Get unique logos
  const uniqueLogos = Array.from(new Map(items.map(item => [item.outletLogoUrl, item])).values());


  return (
    <section id="media-coverage" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary">As Featured In</h2>
          <p className="text-lg text-muted-foreground mt-2">Recognized by leading media outlets</p>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-8">
            {uniqueLogos.map((item) => (
              <CarouselItem key={item.id} className="pl-8 basis-1/2 md:basis-1/3 lg:basis-1/5">
                <div className="p-1">
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex justify-center items-center h-20 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                    <Image
                      src={item.outletLogoUrl}
                      alt={item.outletName}
                      width={160}
                      height={40}
                      className="object-contain"
                    />
                  </a>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/media">View All Media Features</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
