import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import MediaClient from './media-client'
import { getMediaContent } from '@/lib/data/media'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Terminal } from 'lucide-react'

export default async function MediaPage() {
    const content = await getMediaContent();

    if (content.error) {
      return (
        <div className="flex flex-col min-h-screen bg-background">
          <Header />
          <main className="flex-grow">
            <section id="media-hub" className="py-20 bg-background">
                <div className="container mx-auto px-4">
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Action Required: Configuration Error</AlertTitle>
                    <AlertDescription>
                    <p className="font-semibold">The 'Media Hub' cannot connect to the database.</p>
                    <code className="mt-2 relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                        {content.error}
                    </code>
                    </AlertDescription>
                </Alert>
                </div>
            </section>
          </main>
          <Footer />
        </div>
      );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow">
                <MediaClient content={content} />
            </main>
            <Footer />
        </div>
    )
}
