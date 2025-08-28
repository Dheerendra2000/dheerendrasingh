'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { updateTestimonialsContent } from './actions'
import type { TestimonialsContent, Testimonial } from '@/lib/contentDefaults'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function TestimonialsForm({ content }: { content: TestimonialsContent }) {
  const { toast } = useToast()
  const [testimonials, setTestimonials] = useState<Testimonial[]>(content.testimonials)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (id: string, field: keyof Omit<Testimonial, 'id'>, value: string) => {
    setTestimonials(prev => 
      prev.map(item => item.id === id ? { ...item, [field]: value } : item)
    )
  }

  const addTestimonial = () => {
    setTestimonials(prev => [
      ...prev,
      { id: crypto.randomUUID(), name: '', title: '', quote: '', image: '', hint: '' }
    ])
  }

  const removeTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(item => item.id !== id))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    const formData = new FormData()
    formData.append('testimonials', JSON.stringify(testimonials))

    const result = await updateTestimonialsContent(formData)

    if (result.success) {
      toast({
        title: 'Success!',
        description: result.message,
      })
    } else {
      setError(result.message || 'An unknown error occurred.')
      toast({
        title: 'Error updating content',
        description: result.message,
        variant: 'destructive',
      })
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-secondary/50 relative">
              <CardHeader className="pb-4">
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-4 right-4 h-8 w-8"
                    onClick={() => removeTestimonial(testimonial.id)}
                    aria-label="Remove testimonial"
                  >
                      <Trash2 className="h-4 w-4" />
                  </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`name-${testimonial.id}`}>Name</Label>
                        <Input 
                            id={`name-${testimonial.id}`}
                            value={testimonial.name}
                            onChange={(e) => handleInputChange(testimonial.id, 'name', e.target.value)}
                            placeholder="e.g., John Doe"
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor={`title-${testimonial.id}`}>Title / Company</Label>
                        <Input 
                            id={`title-${testimonial.id}`}
                            value={testimonial.title}
                            onChange={(e) => handleInputChange(testimonial.id, 'title', e.target.value)}
                            placeholder="e.g., CEO, TechCorp"
                        />
                    </div>
                 </div>
                <div className="space-y-2">
                    <Label htmlFor={`quote-${testimonial.id}`}>Quote</Label>
                    <Textarea 
                        id={`quote-${testimonial.id}`}
                        value={testimonial.quote}
                        onChange={(e) => handleInputChange(testimonial.id, 'quote', e.target.value)}
                        placeholder="e.g., An inspiring quote..."
                        rows={4}
                    />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`image-${testimonial.id}`}>Image URL</Label>
                        <Input 
                            id={`image-${testimonial.id}`}
                            type="url"
                            value={testimonial.image}
                            onChange={(e) => handleInputChange(testimonial.id, 'image', e.target.value)}
                            placeholder="https://placehold.co/100x100.png"
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor={`hint-${testimonial.id}`}>AI Hint</Label>
                        <Input 
                            id={`hint-${testimonial.id}`}
                            value={testimonial.hint}
                            onChange={(e) => handleInputChange(testimonial.id, 'hint', e.target.value)}
                            placeholder="e.g., man portrait"
                        />
                    </div>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {error && 
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Save Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
        }

        <Button type="button" variant="outline" onClick={addTestimonial} className="mt-6 w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add New Testimonial
        </Button>
        
        <Button type="submit" disabled={isSubmitting} className="w-full mt-6">
          {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save All Changes'}
        </Button>
    </form>
  )
}
