import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, Terminal } from 'lucide-react'
import { getTestimonialsContent } from '@/lib/data/testimonials'
import TestimonialsForm from './testimonials-form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default async function ManageTestimonialsPage() {
  const content = await getTestimonialsContent();

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
            Manage Testimonials
          </h1>
          <div className="w-16"></div>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Client Testimonials</CardTitle>
                <CardDescription>Add, edit, or remove client testimonials from your website.</CardDescription>
            </CardHeader>
            <CardContent>
                {content.error ? (
                  <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Could not load testimonials data</AlertTitle>
                    <AlertDescription>
                      <p>{content.error}</p>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <TestimonialsForm content={content} />
                )}
            </CardContent>
        </Card>
      </main>
    </div>
  )
}
