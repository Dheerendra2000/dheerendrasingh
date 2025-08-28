
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import HomeForm from './home-form'
import { getHomeContent } from '@/lib/data/home'

export const maxDuration = 300; // Allow up to 5 minutes for video uploads

export default async function ManageHomePage() {
  const content = await getHomeContent();

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
            Manage Home Page
          </h1>
          <div className="w-16"></div>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>Update the title, tagline, and background video of your hero section.</CardDescription>
            </CardHeader>
            <CardContent>
                <HomeForm content={content} />
            </CardContent>
        </Card>
      </main>
    </div>
  )
}
