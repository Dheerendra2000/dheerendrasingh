
'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { updateHomeContent } from './actions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import ImageUpload from '@/components/ui/image-upload'

type HomeContent = {
  heroTitle: string;
  heroTagline: string;
  videoUrl: string;
  heroTitleColor: string;
  heroTaglineColor: string;
}

const colorPalette = [
  '#23497B', // Primary
  '#172F51', // Dark Shade
  '#5B78A2', // Medium Tint
  '#94A7C4', // Light Tint
  '#CED7E5', // Lighter Tint
  '#F0F4F8', // Off-White
  '#FFFFFF', // White
  '#000000', // Black
];


export default function HomeForm({ content }: { content: HomeContent }) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({})
  const [titleColor, setTitleColor] = useState(content.heroTitleColor);
  const [taglineColor, setTaglineColor] = useState(content.heroTaglineColor);
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [currentVideoUrl, setCurrentVideoUrl] = useState(content.videoUrl)


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setFormErrors({})

    const formData = new FormData(event.currentTarget)
    if (videoFile) {
        formData.append('videoFile', videoFile)
    }
    
    formData.append('currentVideoUrl', currentVideoUrl);

    const result = await updateHomeContent(formData)

    if (result.success) {
      toast({
        title: 'Success!',
        description: result.message,
      })
      if (result.newVideoUrl) {
        setCurrentVideoUrl(result.newVideoUrl);
      }
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
            <Label htmlFor="heroTitle">Hero Title</Label>
            <Input id="heroTitle" name="heroTitle" defaultValue={content.heroTitle} />
            {formErrors?.heroTitle && <p className="text-sm font-medium text-destructive">{formErrors.heroTitle[0]}</p>}
        </div>
          <div className="space-y-2">
            <Label htmlFor="heroTagline">Hero Tagline</Label>
            <Input id="heroTagline" name="heroTagline" defaultValue={content.heroTagline} />
            {formErrors?.heroTagline && <p className="text-sm font-medium text-destructive">{formErrors.heroTagline[0]}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="heroTitleColor">Hero Title Color</Label>
            <div className="flex items-center gap-2">
              <Input 
                  id="heroTitleColor" 
                  name="heroTitleColor" 
                  value={titleColor}
                  onChange={(e) => setTitleColor(e.target.value)}
                  className="font-mono"
              />
              <div className="relative h-10 w-10 shrink-0">
                  <input 
                      type="color"
                      value={titleColor}
                      onChange={(e) => setTitleColor(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      aria-label="Select hero title color"
                  />
                  <div 
                      className="h-10 w-10 rounded-md border pointer-events-none" 
                      style={{ backgroundColor: titleColor }}
                  />
              </div>
            </div>
             <div className="flex flex-wrap gap-2 pt-2">
                {colorPalette.map(color => (
                    <button
                        key={`title-${color}`}
                        type="button"
                        className="h-8 w-8 rounded-full border-2 transition-all"
                        style={{ backgroundColor: color, borderColor: titleColor.toLowerCase() === color.toLowerCase() ? 'hsl(var(--ring))' : 'hsl(var(--border))' }}
                        onClick={() => setTitleColor(color)}
                        aria-label={`Set title color to ${color}`}
                    />
                ))}
            </div>
            {formErrors?.heroTitleColor && <p className="text-sm font-medium text-destructive">{formErrors.heroTitleColor[0]}</p>}
            <p className="text-xs text-muted-foreground">Enter a hex code, use the color picker, or select from the palette.</p>
        </div>
        <div className="space-y-2">
            <Label htmlFor="heroTaglineColor">Hero Tagline Color</Label>
            <div className="flex items-center gap-2">
              <Input 
                  id="heroTaglineColor" 
                  name="heroTaglineColor" 
                  value={taglineColor}
                  onChange={(e) => setTaglineColor(e.target.value)}
                  className="font-mono"
              />
              <div className="relative h-10 w-10 shrink-0">
                  <input 
                      type="color"
                      value={taglineColor}
                      onChange={(e) => setTaglineColor(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      aria-label="Select hero tagline color"
                  />
                  <div 
                      className="h-10 w-10 rounded-md border pointer-events-none" 
                      style={{ backgroundColor: taglineColor }}
                  />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
                {colorPalette.map(color => (
                    <button
                        key={`tagline-${color}`}
                        type="button"
                        className="h-8 w-8 rounded-full border-2 transition-all"
                        style={{ backgroundColor: color, borderColor: taglineColor.toLowerCase() === color.toLowerCase() ? 'hsl(var(--ring))' : 'hsl(var(--border))' }}
                        onClick={() => setTaglineColor(color)}
                        aria-label={`Set tagline color to ${color}`}
                    />
                ))}
            </div>
            {formErrors?.heroTaglineColor && <p className="text-sm font-medium text-destructive">{formErrors.heroTaglineColor[0]}</p>}
            <p className="text-xs text-muted-foreground">Enter a hex color code, use the color picker, or select from the palette.</p>
        </div>
        <div className="space-y-2">
            <ImageUpload
                id="background-video"
                name="Background Video"
                initialValue={currentVideoUrl}
                onFileSelect={setVideoFile}
                accept="video/mp4,video/webm"
            />
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
