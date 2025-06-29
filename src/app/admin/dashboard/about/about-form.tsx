'use client'

import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { updateAboutContent } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  )
}

type AboutContent = {
  imageUrl: string;
  imageHint: string;
  heading: string;
  paragraph1: string;
  paragraph2: string;
  highlights: string[];
}

export default function AboutForm({ content }: { content: AboutContent }) {
  const [state, formAction] = useActionState(updateAboutContent, null)
  const { toast } = useToast()

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast({
        title: 'Success!',
        description: state.message,
      })
    } else if (state.error) {
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
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" name="imageUrl" type="url" defaultValue={content.imageUrl} />
            {state?.errors?.imageUrl && <p className="text-sm font-medium text-destructive">{state.errors.imageUrl[0]}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="imageHint">Image AI Hint</Label>
            <Input id="imageHint" name="imageHint" defaultValue={content.imageHint} />
            {state?.errors?.imageHint && <p className="text-sm font-medium text-destructive">{state.errors.imageHint[0]}</p>}
            <p className="text-xs text-muted-foreground">Optional: one or two keywords for AI image search (e.g. "professional portrait").</p>
        </div>
        <div className="space-y-2">
            <Label htmlFor="heading">Heading</Label>
            <Input id="heading" name="heading" defaultValue={content.heading} />
            {state?.errors?.heading && <p className="text-sm font-medium text-destructive">{state.errors.heading[0]}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="paragraph1">Biography Paragraph 1</Label>
            <Textarea id="paragraph1" name="paragraph1" defaultValue={content.paragraph1} rows={5} />
            {state?.errors?.paragraph1 && <p className="text-sm font-medium text-destructive">{state.errors.paragraph1[0]}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="paragraph2">Biography Paragraph 2</Label>
            <Textarea id="paragraph2" name="paragraph2" defaultValue={content.paragraph2} rows={5} />
            {state?.errors?.paragraph2 && <p className="text-sm font-medium text-destructive">{state.errors.paragraph2[0]}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="highlights">Key Highlights</Label>
            <Textarea id="highlights" name="highlights" defaultValue={content.highlights.join('\n')} rows={5} />
            <p className="text-xs text-muted-foreground">Enter each highlight on a new line.</p>
            {state?.errors?.highlights && <p className="text-sm font-medium text-destructive">{state.errors.highlights[0]}</p>}
        </div>
        
        <SubmitButton />
    </form>
  )
}
