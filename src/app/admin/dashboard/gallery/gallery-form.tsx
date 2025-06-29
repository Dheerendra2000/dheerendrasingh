'use client'

import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { updateGalleryContent } from './actions'
import type { GalleryContent, GalleryItem } from '@/lib/contentDefaults'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full mt-6">
      {pending ? 'Saving...' : 'Save All Changes'}
    </Button>
  )
}

export default function GalleryForm({ content }: { content: GalleryContent }) {
  const [state, formAction] = useActionState(updateGalleryContent, null)
  const { toast } = useToast()
  const [items, setItems] = useState<GalleryItem[]>(content.items)

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast({
        title: 'Success!',
        description: state.message,
      })
    } else if (state.message) {
       toast({
        title: 'Error updating content',
        description: state.message,
        variant: 'destructive',
      })
    }
  }, [state, toast])

  const handleInputChange = (id: string, field: keyof Omit<GalleryItem, 'id'>, value: string) => {
    setItems(prev => 
      prev.map(item => item.id === id ? { ...item, [field]: value } : item)
    )
  }

  const addItem = () => {
    setItems(prev => [
      ...prev,
      { id: crypto.randomUUID(), type: 'image', src: '', alt: '', hint: '', category: '', videoSrc: '' }
    ])
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  return (
    <form action={formAction}>
        <input type="hidden" name="gallery" value={JSON.stringify(items)} />
        
        <div className="space-y-6">
          {items.map((item) => (
            <Card key={item.id} className="bg-secondary/50 relative">
              <CardHeader className="pb-4">
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-4 right-4 h-8 w-8"
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove gallery item"
                  >
                      <Trash2 className="h-4 w-4" />
                  </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label>Item Type</Label>
                    <RadioGroup
                      value={item.type}
                      onValueChange={(value) => handleInputChange(item.id, 'type', value as 'image' | 'video')}
                      className="flex items-center gap-4 pt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="image" id={`type-image-${item.id}`} />
                        <Label htmlFor={`type-image-${item.id}`} className="font-normal">Image</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="video" id={`type-video-${item.id}`} />
                        <Label htmlFor={`type-video-${item.id}`} className="font-normal">Video</Label>
                      </div>
                    </RadioGroup>
                  </div>

                 <div className="space-y-2">
                    <Label htmlFor={`src-${item.id}`}>Image / Poster URL</Label>
                    <Input 
                        id={`src-${item.id}`}
                        type="url"
                        value={item.src}
                        onChange={(e) => handleInputChange(item.id, 'src', e.target.value)}
                        placeholder="https://placehold.co/600x400.png"
                    />
                </div>

                {item.type === 'video' && (
                  <div className="space-y-2">
                    <Label htmlFor={`videoSrc-${item.id}`}>Video URL</Label>
                    <Input
                      id={`videoSrc-${item.id}`}
                      type="url"
                      value={item.videoSrc}
                      onChange={(e) => handleInputChange(item.id, 'videoSrc', e.target.value)}
                      placeholder="e.g., https://videos.pexels.com/video.mp4"
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`category-${item.id}`}>Category</Label>
                        <Input 
                            id={`category-${item.id}`}
                            value={item.category}
                            onChange={(e) => handleInputChange(item.id, 'category', e.target.value)}
                            placeholder="e.g., events"
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor={`hint-${item.id}`}>AI Hint (for poster)</Label>
                        <Input 
                            id={`hint-${item.id}`}
                            value={item.hint}
                            onChange={(e) => handleInputChange(item.id, 'hint', e.target.value)}
                            placeholder="e.g., conference stage"
                        />
                    </div>
                 </div>
                <div className="space-y-2">
                    <Label htmlFor={`alt-${item.id}`}>Alt Text (for accessibility)</Label>
                    <Input 
                        id={`alt-${item.id}`}
                        value={item.alt}
                        onChange={(e) => handleInputChange(item.id, 'alt', e.target.value)}
                        placeholder="e.g., Speaking at a major tech conference"
                    />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {state?.errors?._form && 
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Save Error</AlertTitle>
              <AlertDescription>{state.errors._form}</AlertDescription>
            </Alert>
        }

        <Button type="button" variant="outline" onClick={addItem} className="mt-6 w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add New Media Item
        </Button>
        
        <SubmitButton />
    </form>
  )
}
