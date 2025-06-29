
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getHomeContent } from "@/lib/data/home"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

export default async function HeroSection() {
  const content = await getHomeContent();

  if (content.error) {
    return (
      <section id="home" className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Action Required: Configuration Error</AlertTitle>
            <AlertDescription>
              <p className="font-semibold">The 'Home' section cannot connect to the database.</p>
              <p className="mt-2">This is likely due to one of two issues:</p>
               <ul className="list-disc pl-5 space-y-1 mt-2 text-xs">
                <li>
                  <strong className="font-semibold">Permissions:</strong> The service account 
                  (<code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs">{content.clientEmail || 'not available'}</code>) 
                  may be missing the 'Cloud Datastore User' role in Google Cloud IAM.
                </li>
                <li>
                   <strong className="font-semibold">Database Creation:</strong> The Firestore database may not have been created for this project yet. Please create it in the Firebase Console.
                </li>
              </ul>
              <code className="mt-2 relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                {content.error}
              </code>
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  return (
    <section id="home" className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl group">
            <video
                key={content.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
            >
                <source src={content.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-primary/70 z-10" />
            
            <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white p-4">
                <h1 
                  className="text-4xl md:text-6xl font-bold font-headline mb-4 drop-shadow-lg"
                  style={{ color: content.heroTitleColor }}
                >
                  {content.heroTitle}
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto drop-shadow-md">
                  {content.heroTagline}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" asChild>
                    <Link href="#contact">
                      Book a Session
                    </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                    <Link href="#courses">
                      Explore Courses
                    </Link>
                </Button>
                </div>
            </div>
        </div>
      </div>
    </section>
  )
}
