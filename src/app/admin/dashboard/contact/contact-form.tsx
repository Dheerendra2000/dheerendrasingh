'use client'

import { useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { updateContactInfo } from './actions'
import type { ContactInfo } from '@/lib/contentDefaults'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  )
}

export default function ContactForm({ content }: { content: ContactInfo }) {
  const [state, formAction] = useActionState(updateContactInfo, null)
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
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={content.title} />
            {state?.errors?.title && <p className="text-sm font-medium text-destructive">{state.errors.title[0]}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={content.description} rows={4} />
            {state?.errors?.description && <p className="text-sm font-medium text-destructive">{state.errors.description[0]}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={content.email} />
            {state?.errors?.email && <p className="text-sm font-medium text-destructive">{state.errors.email[0]}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" defaultValue={content.phone} />
            {state?.errors?.phone && <p className="text-sm font-medium text-destructive">{state.errors.phone[0]}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" defaultValue={content.address} />
            {state?.errors?.address && <p className="text-sm font-medium text-destructive">{state.errors.address[0]}</p>}
        </div>
        
        <SubmitButton />
    </form>
  )
}
