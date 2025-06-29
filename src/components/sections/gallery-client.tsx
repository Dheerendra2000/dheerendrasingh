"use client"

import * as React from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { GalleryContent } from "@/lib/contentDefaults"

export default function GalleryClient({ content }: { content: GalleryContent }) {
  const [activeFilter, setActiveFilter] = React.useState("all");

  const filteredItems = activeFilter === "all"
    ? content.items
    : content.items.filter(item => item.category === activeFilter);

  return (
    <section id="gallery" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary">Gallery</h2>
          <p className="text-lg text-muted-foreground mt-2">A glimpse into my world</p>
        </div>
        <div className="flex justify-center flex-wrap gap-2 mb-8">
          {content.filters.map(filter => (
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
                <div className="aspect-[3/2] w-full">
                  {item.type === 'video' && item.videoSrc ? (
                     <video
                      poster={item.src}
                      controls
                      className="object-cover w-full h-full"
                      preload="metadata"
                      aria-label={item.alt}
                    >
                      <source src={item.videoSrc} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <Image
                      src={item.src}
                      alt={item.alt}
                      data-ai-hint={item.hint}
                      width={600}
                      height={400}
                      className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
