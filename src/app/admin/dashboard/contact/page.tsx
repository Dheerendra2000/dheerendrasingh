import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, Terminal } from 'lucide-react'
import { getContactInfo } from '@/lib/data/contact'
import ContactForm from './contact-form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default async function ManageContactPage() {
  const content = await getContactInfo();

  return (
    <div className="flex min-h-screen flex-col bg-secondary">
       <header className="bg-background border-b shadow-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
            <Button asChild variant="ghost">
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4"/>
                  <span>Back</span>
              </Link>
            </Button>
          <h1 className="text-xl md:text-2xl font-bold font-headline text-primary">
            Manage Contact Info
          </h1>
          <div className="w-16"></div>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Contact Section</CardTitle>
                <CardDescription>Update the contact information displayed on your site.</CardDescription>
            </CardHeader>
            <CardContent>
                {content.error ? (
                  <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Could not load contact data</AlertTitle>
                    <AlertDescription>
                      <p>{content.error}</p>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <ContactForm content={content} />
                )}
            </CardContent>
        </Card>
      </main>
    </div>
  )
}
