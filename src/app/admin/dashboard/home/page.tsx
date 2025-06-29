'use client'

import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { updateHomeContent } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  )
}

export default function ManageHomePage() {
  const [state, formAction] = useActionState(updateHomeContent, null)
  const { toast } = useToast()

  useEffect(() => {
    if (state?.success) {
      toast({
        title: 'Success!',
        description: state.message,
      })
    } else if (state?.error && state.errors) {
       toast({
        title: 'Error updating content',
        description: state.message,
        variant: 'destructive',
      })
    }
  }, [state, toast])

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
                <form action={formAction} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="heroTitle">Hero Title</Label>
                        <Input id="heroTitle" name="heroTitle" defaultValue="Dheerendra Singh" />
                        {state?.errors?.heroTitle && <p className="text-sm font-medium text-destructive">{state.errors.heroTitle[0]}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="heroTagline">Hero Tagline</Label>
                        <Input id="heroTagline" name="heroTagline" defaultValue="Leading Public Speaker & Branding and PR Specialist" />
                        {state?.errors?.heroTagline && <p className="text-sm font-medium text-destructive">{state.errors.heroTagline[0]}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="videoUrl">Background Video URL</Label>
                        <Input id="videoUrl" name="videoUrl" type="url" defaultValue="https://dummy-media.torchbox.com/media/hero-1920x1080.mp4" />
                        {state?.errors?.videoUrl && <p className="text-sm font-medium text-destructive">{state.errors.videoUrl[0]}</p>}
                    </div>
                    <SubmitButton />
                </form>
            </CardContent>
        </Card>
      </main>
    </div>
  )
}
