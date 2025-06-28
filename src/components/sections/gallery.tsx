"use client"

import * as React from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const galleryItems = [
  { id: 1, category: "events", src: "https://placehold.co/600x400.png", alt: "Speaking at a major tech conference", hint: "conference stage" },
  { id: 2, category: "media", src: "https://placehold.co/600x400.png", alt: "Interview on a TV show", hint: "tv interview" },
  { id: 3, category: "behind-the-scenes", src: "https://placehold.co/600x400.png", alt: "Preparing backstage for a keynote", hint: "backstage preparation" },
  { id: 4, category: "events", src: "https://placehold.co/600x400.png", alt: "Workshop with a corporate team", hint: "corporate workshop" },
  { id: 5, category: "media", src: "https://placehold.co/600x400.png", alt: "Podcast recording session", hint: "podcast recording" },
  { id: 6, category: "events", src: "https://placehold.co/600x400.png", alt: "Panel discussion on branding", hint: "panel discussion" },
  { id: 7, category: "behind-the-scenes", src: "https://placehold.co/600x400.png", alt: "Meeting with a client", hint: "client meeting" },
  { id: 8, category: "media", src: "https://placehold.co/600x400.png", alt: "Photoshoot for a magazine feature", hint: "professional photoshoot" },
];

const filters = ["all", "events", "media", "behind-the-scenes"];

export default function GallerySection() {
  const [activeFilter, setActiveFilter] = React.useState("all");

  const filteredItems = activeFilter === "all"
    ? galleryItems
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <section id="gallery" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary">Gallery</h2>
          <p className="text-lg text-muted-foreground mt-2">A glimpse into my world</p>
        </div>
        <div className="flex justify-center flex-wrap gap-2 mb-8">
          {filters.map(filter => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              onClick={() => setActiveFilter(filter)}
              className="capitalize"
            >
              {filter.replace('-', ' ')}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredItems.map(item => (
            <Card key={item.id} className="overflow-hidden group shadow-lg">
              <CardContent className="p-0">
                <div className="aspect-w-3 aspect-h-2">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    data-ai-hint={item.hint}
                    width={600}
                    height={400}
                    className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
