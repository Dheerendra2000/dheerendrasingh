'use client'

import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { updateHomeContent } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  )
}

type HomeContent = {
  heroTitle: string;
  heroTagline: string;
  videoUrl: string;
}

export default function HomeForm({ content }: { content: HomeContent }) {
  const [state, formAction] = useActionState(updateHomeContent, null)
  const { toast } = useToast()

  useEffect(() => {
    if (state?.success) {
      toast({
        title: 'Success!',
        description: state.message,
      })
    } else if (state?.error) {
       toast({
        title: 'Error updating content',
        description: state.message,
        variant: 'destructive',
      })
    }
  }, [state, toast])

  return (
    <form action={formAction} className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="heroTitle">Hero Title</Label>
            <Input id="heroTitle" name="heroTitle" defaultValue={content.heroTitle} />
            {state?.errors?.heroTitle && <p className="text-sm font-medium text-destructive">{state.errors.heroTitle[0]}</p>}
        </div>
          <div className="space-y-2">
            <Label htmlFor="heroTagline">Hero Tagline</Label>
            <Input id="heroTagline" name="heroTagline" defaultValue={content.heroTagline} />
            {state?.errors?.heroTagline && <p className="text-sm font-medium text-destructive">{state.errors.heroTagline[0]}</p>}
        </div>
          <div className="space-y-2">
            <Label htmlFor="videoUrl">Background Video URL</Label>
            <Input id="videoUrl" name="videoUrl" type="url" defaultValue={content.videoUrl} />
            {state?.errors?.videoUrl && <p className="text-sm font-medium text-destructive">{state.errors.videoUrl[0]}</p>}
        </div>
        <SubmitButton />
    </form>
  )
}
