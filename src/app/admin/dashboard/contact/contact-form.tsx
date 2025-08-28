'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { updateContactInfo } from './actions'
import type { ContactInfo } from '@/lib/contentDefaults'
import { Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function ContactForm({ content }: { content: ContactInfo }) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({})

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setFormErrors({})

    const formData = new FormData(event.currentTarget)
    const result = await updateContactInfo(formData)

    if (result.success) {
      toast({
        title: 'Success!',
        description: result.message,
      })
    } else {
      setError(result.message || 'An unknown error occurred.')
      setFormErrors(result.errors || {})
      toast({
        title: 'Error updating content',
        description: result.message,
        variant: 'destructive',
      })
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={content.title} />
            {formErrors?.title && <p className="text-sm font-medium text-destructive">{formErrors.title[0]}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={content.description} rows={4} />
            {formErrors?.description && <p className="text-sm font-medium text-destructive">{formErrors.description[0]}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={content.email} />
            {formErrors?.email && <p className="text-sm font-medium text-destructive">{formErrors.email[0]}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" defaultValue={content.phone} />
            {formErrors?.phone && <p className="text-sm font-medium text-destructive">{formErrors.phone[0]}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" defaultValue={content.address} />
            {formErrors?.address && <p className="text-sm font-medium text-destructive">{formErrors.address[0]}</p>}
        </div>
        
        {error && !Object.keys(formErrors).length && (
            <Alert variant="destructive">
                <AlertTitle>Save Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}
        </Button>
    </form>
  )
}
