
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { updateMediaContent } from './actions'
import type { MediaContent, MediaItem } from '@/lib/contentDefaults'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Plus, Trash2, Loader2, CalendarIcon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import ImageUpload from '@/components/ui/image-upload'
import { useUploader } from '@/hooks/use-uploader'
import { Progress } from '@/components/ui/progress'

export default function MediaForm({ content }: { content: MediaContent }) {
  const { toast } = useToast()
  const { uploadFile, isUploading, uploadProgress, error: uploaderError } = useUploader();
  const [items, setItems] = useState<MediaItem[]>(content.items)
  const [logoFiles, setLogoFiles] = useState<Map<string, File | null>>(new Map());
  const [coverImageFiles, setCoverImageFiles] = useState<Map<string, File | null>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
  
  const handleLogoFileSelect = (id: string, file: File | null) => {
    setLogoFiles(prev => new Map(prev).set(id, file));
    if (file) {
      setItems(prev => prev.map(item => item.id === id ? { ...item, outletLogoUrl: '' } : item));
    }
  };
  
  const handleCoverFileSelect = (id: string, file: File | null) => {
    setCoverImageFiles(prev => new Map(prev).set(id, file));
     if (file) {
      setItems(prev => prev.map(item => item.id === id ? { ...item, coverImageUrl: '' } : item));
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
    setLogoFiles(prev => {
        const newFiles = new Map(prev);
        newFiles.delete(id);
        return newFiles;
    });
    setCoverImageFiles(prev => {
        const newFiles = new Map(prev);
        newFiles.delete(id);
        return newFiles;
    });
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      let updatedItems = [...items];

      for (let i = 0; i < updatedItems.length; i++) {
        const item = updatedItems[i];
        const logoFile = logoFiles.get(item.id);
        const coverFile = coverImageFiles.get(item.id);

        if (logoFile) {
          const uploadResult = await uploadFile(logoFile, `media/logos/${item.id}`);
          if (!uploadResult.success || !uploadResult.url) {
            throw new Error(uploadResult.error || `Failed to upload logo for ${item.title}.`);
          }
          updatedItems[i] = { ...item, outletLogoUrl: uploadResult.url };
        }
        
        if (coverFile) {
           const uploadResult = await uploadFile(coverFile, `media/covers/${item.id}`);
           if (!uploadResult.success || !uploadResult.url) {
            throw new Error(uploadResult.error || `Failed to upload cover for ${item.title}.`);
          }
          updatedItems[i] = { ...updatedItems[i], coverImageUrl: uploadResult.url };
        }
      }

      const result = await updateMediaContent({ items: updatedItems });

      if (result.success) {
        toast({ title: 'Success!', description: result.message });
        setLogoFiles(new Map());
        setCoverImageFiles(new Map());
        setItems(updatedItems);
      } else {
        setError(result.message || 'An unknown error occurred.');
      }
    } catch (e: any) {
       console.error("Submission failed:", e);
       setError(e.message || "An unexpected error occurred during the save process.");
    } finally {
        setIsSubmitting(false)
    }
  }

  const disableActions = isSubmitting || isUploading;

  return (
    <form onSubmit={handleSubmit}>
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
                    disabled={disableActions}
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
                      disabled={disableActions}
                    >
                      <div className="flex items-center space-x-2"><RadioGroupItem value="article" id={`type-article-${item.id}`} /><Label htmlFor={`type-article-${item.id}`} className="font-normal">Article</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="podcast" id={`type-podcast-${item.id}`} /><Label htmlFor={`type-podcast-${item.id}`} className="font-normal">Podcast</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="video" id={`type-video-${item.id}`} /><Label htmlFor={`type-video-${item.id}`} className="font-normal">Video</Label></div>
                    </RadioGroup>
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`title-${item.id}`}>Title</Label>
                    <Input id={`title-${item.id}`} value={item.title} onChange={(e) => handleInputChange(item.id, 'title', e.target.value)} placeholder="e.g., The Future of Personal Branding" disabled={disableActions}/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`quote-${item.id}`}>Quote / Snippet</Label>
                    <Textarea id={`quote-${item.id}`} value={item.quote} onChange={(e) => handleInputChange(item.id, 'quote', e.target.value)} placeholder="A compelling quote from the feature..." rows={3} disabled={disableActions}/>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`outletName-${item.id}`}>Outlet Name</Label>
                        <Input id={`outletName-${item.id}`} value={item.outletName} onChange={(e) => handleInputChange(item.id, 'outletName', e.target.value)} placeholder="e.g., Forbes" disabled={disableActions}/>
                    </div>
                    <div className="space-y-2">
                        <ImageUpload
                            id={`logo-file-${item.id}`}
                            name="Outlet Logo"
                            initialValue={item.outletLogoUrl}
                            onFileSelect={(file) => handleLogoFileSelect(item.id, file)}
                            maxSizeMB={5}
                       />
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <ImageUpload
                            id={`cover-file-${item.id}`}
                            name="Cover Image"
                            initialValue={item.coverImageUrl}
                            onFileSelect={(file) => handleCoverFileSelect(item.id, file)}
                            maxSizeMB={15}
                       />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`coverImageHint-${item.id}`}>Cover Image AI Hint</Label>
                        <Input id={`coverImageHint-${item.id}`} value={item.coverImageHint} onChange={(e) => handleInputChange(item.id, 'coverImageHint', e.target.value)} placeholder="e.g., business magazine" disabled={disableActions}/>
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
                            disabled={disableActions}
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
                        <Input id={`link-${item.id}`} type="url" value={item.link} onChange={(e) => handleInputChange(item.id, 'link', e.target.value)} placeholder="https://..." disabled={disableActions}/>
                    </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(error || uploaderError) && 
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Save Error</AlertTitle>
              <AlertDescription>{error || uploaderError}</AlertDescription>
            </Alert>
        }

        {isUploading && (
          <div className="space-y-2 mt-4">
            <Label>Uploading Media...</Label>
            <Progress value={uploadProgress} />
          </div>
        )}

        <Button type="button" variant="outline" onClick={addItem} className="mt-6 w-full" disabled={disableActions}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Media Feature
        </Button>
        
        <Button type="submit" disabled={disableActions} className="w-full mt-6">
          {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save All Changes'}
        </Button>
    </form>
  )
}
