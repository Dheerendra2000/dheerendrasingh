
"use client"

import * as React from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { MediaContent } from "@/lib/contentDefaults"
import { Badge } from "@/components/ui/badge"
import { format, parseISO } from "date-fns"
import { ArrowRight, Quote } from "lucide-react"

export default function MediaClient({ content }: { content: MediaContent }) {
  const [activeFilter, setActiveFilter] = React.useState("all");

  const filteredItems = activeFilter === "all"
    ? content.items
    : content.items.filter(item => item.type === activeFilter);
  
  // Sort items by date, newest first
  const sortedItems = filteredItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


  return (
    <section id="media-hub" className="py-20 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary">Media Hub</h1>
          <p className="text-lg text-muted-foreground mt-2">Explore my features, interviews, and articles.</p>
        </div>
        <div className="flex justify-center flex-wrap gap-2 mb-12">
          {content.filters.map(filter => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              onClick={() => setActiveFilter(filter)}
              className="capitalize rounded-full"
            >
              {filter}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {sortedItems.map(item => (
            <Card key={item.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full rounded-2xl">
              <CardHeader>
                <div className="relative aspect-video">
                  <Image
                    src={item.coverImageUrl}
                    alt={item.title}
                    data-ai-hint={item.coverImageHint}
                    fill
                    className="object-cover rounded-lg"
                  />
                  <Badge className="absolute top-2 right-2 capitalize">{item.type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col p-6 pt-0">
                  <p className="text-sm text-muted-foreground mb-2">{format(parseISO(item.date), "MMMM d, yyyy")}</p>
                  <h3 className="text-xl font-headline font-semibold text-primary mb-3 flex-grow">{item.title}</h3>
                  <div className="flex items-start gap-3 text-muted-foreground mb-4">
                    <Quote className="w-8 h-8 text-accent flex-shrink-0" />
                    <blockquote className="italic text-sm">"{item.quote}"</blockquote>
                  </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex justify-between items-center bg-card/80">
                 <div className="flex items-center gap-3">
                    <Image src={item.outletLogoUrl} alt={`${item.outletName} logo`} width={80} height={20} className="object-contain h-5 w-auto" />
                 </div>
                 <Button asChild variant="link" className="p-0 h-auto">
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                        {item.type === 'article' ? 'Read More' : 'Watch / Listen'}
                        <ArrowRight className="ml-2 h-4 w-4"/>
                    </a>
                 </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
