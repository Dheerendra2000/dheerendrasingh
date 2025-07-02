'use client'

import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { updateMediaContent } from './actions'
import type { MediaContent, MediaItem } from '@/lib/contentDefaults'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full mt-6">
      {pending ? 'Saving...' : 'Save All Changes'}
    </Button>
  )
}

export default function MediaForm({ content }: { content: MediaContent }) {
  const [state, formAction] = useActionState(updateMediaContent, null)
  const { toast } = useToast()
  const [items, setItems] = useState<MediaItem[]>(content.items)

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

  const handleInputChange = (id: string, field: keyof Omit<MediaItem, 'id'>, value: string) => {
    setItems(prev =>
      prev.map(item => item.id === id ? { ...item, [field]: value } : item)
    )
  }

  const handleDateChange = (id: string, date: Date | undefined) => {
    if (date) {
      handleInputChange(id, 'date', format(date, 'yyyy-MM-dd'));
    }
  };

  const addItem = () => {
    setItems(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: 'article',
        title: '',
        quote: '',
        outletName: '',
        outletLogoUrl: '',
        link: '',
        coverImageUrl: '',
        coverImageHint: '',
        date: format(new Date(), 'yyyy-MM-dd'),
      }
    ])
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  return (
    <form action={formAction}>
        <input type="hidden" name="media" value={JSON.stringify(items)} />
        
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
                    aria-label="Remove media item"
                  >
                      <Trash2 className="h-4 w-4" />
                  </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Type</Label>
                    <RadioGroup
                      value={item.type}
                      onValueChange={(value) => handleInputChange(item.id, 'type', value as 'article' | 'podcast' | 'video')}
                      className="flex items-center gap-4 pt-2"
                    >
                      <div className="flex items-center space-x-2"><RadioGroupItem value="article" id={`type-article-${item.id}`} /><Label htmlFor={`type-article-${item.id}`} className="font-normal">Article</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="podcast" id={`type-podcast-${item.id}`} /><Label htmlFor={`type-podcast-${item.id}`} className="font-normal">Podcast</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="video" id={`type-video-${item.id}`} /><Label htmlFor={`type-video-${item.id}`} className="font-normal">Video</Label></div>
                    </RadioGroup>
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`title-${item.id}`}>Title</Label>
                    <Input id={`title-${item.id}`} value={item.title} onChange={(e) => handleInputChange(item.id, 'title', e.target.value)} placeholder="e.g., The Future of Personal Branding" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`quote-${item.id}`}>Quote / Snippet</Label>
                    <Textarea id={`quote-${item.id}`} value={item.quote} onChange={(e) => handleInputChange(item.id, 'quote', e.target.value)} placeholder="A compelling quote from the feature..." rows={3} />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`outletName-${item.id}`}>Outlet Name</Label>
                        <Input id={`outletName-${item.id}`} value={item.outletName} onChange={(e) => handleInputChange(item.id, 'outletName', e.target.value)} placeholder="e.g., Forbes" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`outletLogoUrl-${item.id}`}>Outlet Logo URL</Label>
                        <Input id={`outletLogoUrl-${item.id}`} type="url" value={item.outletLogoUrl} onChange={(e) => handleInputChange(item.id, 'outletLogoUrl', e.target.value)} placeholder="https://..." />
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`coverImageUrl-${item.id}`}>Cover Image URL</Label>
                        <Input id={`coverImageUrl-${item.id}`} type="url" value={item.coverImageUrl} onChange={(e) => handleInputChange(item.id, 'coverImageUrl', e.target.value)} placeholder="https://placehold.co/600x400.png" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`coverImageHint-${item.id}`}>Cover Image AI Hint</Label>
                        <Input id={`coverImageHint-${item.id}`} value={item.coverImageHint} onChange={(e) => handleInputChange(item.id, 'coverImageHint', e.target.value)} placeholder="e.g., business magazine" />
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`date-${item.id}`}>Publication Date</Label>
                       <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id={`date-${item.id}`}
                            variant={"outline"}
                            className={cn( "w-full justify-start text-left font-normal", !item.date && "text-muted-foreground")}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {item.date ? format(new Date(item.date), "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={new Date(item.date)}
                            onSelect={(date) => handleDateChange(item.id, date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`link-${item.id}`}>Article/Media Link</Label>
                        <Input id={`link-${item.id}`} type="url" value={item.link} onChange={(e) => handleInputChange(item.id, 'link', e.target.value)} placeholder="https://..." />
                    </div>
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
            Add New Media Feature
        </Button>
        
        <SubmitButton />
    </form>
  )
}
