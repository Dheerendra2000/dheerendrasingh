import { getGalleryContent } from '@/lib/data/gallery'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Terminal } from 'lucide-react'
import GalleryClient from './gallery-client'

export default async function GallerySection() {
  const content = await getGalleryContent()

  if (content.error) {
    return (
      <section id="gallery" className="py-20 bg-transparent">
        <div className="container mx-auto px-4">
          <Alert variant="destructive" className="glassmorphism">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Action Required: Configuration Error</AlertTitle>
            <AlertDescription>
              <p className="font-semibold">The 'Gallery' section cannot connect to the database.</p>
              <code className="mt-2 relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                {content.error}
              </code>
            </AlertDescription>
          </Alert>
        </div>
      </section>
    )
  }

  return <GalleryClient content={content} />
}
