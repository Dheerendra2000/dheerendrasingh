import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function ManageGalleryPage() {
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
            Manage Gallery
          </h1>
          <div className="w-16"></div>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Image Gallery</CardTitle>
                <CardDescription>Update the images in your gallery.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Management form for the gallery will be implemented here soon.</p>
            </CardContent>
        </Card>
      </main>
    </div>
  )
}
