import { getContactInfo } from "@/lib/data/contact"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import ContactClient from "./contact-client"

export default async function ContactSection() {
    const content = await getContactInfo()

    if (content.error) {
    return (
      <section id="contact" className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
           <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Action Required: Configuration Error</AlertTitle>
            <AlertDescription>
              <p className="font-semibold">The 'Contact' section cannot connect to the database.</p>
              <code className="mt-2 relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                {content.error}
              </code>
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

    return <ContactClient content={content} />
}
