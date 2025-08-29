
"use client"

import * as React from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { GalleryContent } from "@/lib/contentDefaults"
import { cn } from "@/lib/utils"
import { Volume2, VolumeX } from "lucide-react"

// A custom video player component to handle autoplay with a mute/unmute button.
const VideoPlayer = ({ src, alt }: { src: string; alt: string }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = React.useState(true);

  const toggleMute = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (videoRef.current) {
      // Toggle the muted property on the actual DOM element
      videoRef.current.muted = !videoRef.current.muted;
      // Sync the React state with the DOM element's state
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="relative w-full h-full group/video">
      <video
        ref={videoRef}
        className="object-cover w-full h-full"
        aria-label={alt}
        autoPlay
        loop
        muted // Start muted is required for autoplay in most browsers
        playsInline // Important for iOS
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-transparent group-hover/video:bg-black/20 transition-colors duration-300 pointer-events-none" />
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMute}
        className="absolute bottom-2 right-2 z-10 h-9 w-9 text-white bg-black/30 hover:bg-black/60 hover:text-white opacity-0 group-hover/video:opacity-100 focus-visible:opacity-100 transition-opacity duration-300"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
      </Button>
    </div>
  );
};

export default function GalleryClient({ content }: { content: GalleryContent }) {
  const [activeFilter, setActiveFilter] = React.useState("all");

  const filteredItems = activeFilter === "all"
    ? content.items
    : content.items.filter(item => item.category === activeFilter);

  return (
    <section id="gallery" className="py-20 bg-transparent">
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
              className="capitalize rounded-full"
            >
              {filter.replace('-', ' ')}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {filteredItems.map(item => (
            <Card 
              key={item.id} 
              className={cn(
                "overflow-hidden group shadow-lg !bg-transparent aspect-video rounded-2xl",
                item.size === 'large' ? 'sm:col-span-2 lg:col-span-2' : ''
              )}
            >
              <CardContent className="p-0 h-full">
                  {item.type === 'video' && item.videoSrc ? (
                     <VideoPlayer
                        src={item.videoSrc}
                        alt={item.alt}
                      />
                  ) : item.type === 'image' && item.src ? (
                    <Image
                      src={item.src}
                      alt={item.alt}
                      data-ai-hint={item.hint}
                      width={600}
                      height={400}
                      className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : null }
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
