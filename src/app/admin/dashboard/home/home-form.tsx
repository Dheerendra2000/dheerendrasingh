
'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { updateHomeContent } from './actions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import ImageUpload from '@/components/ui/image-upload'
import { useUploader } from '@/hooks/use-uploader'
import { Progress } from '@/components/ui/progress'

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
  const { uploadFile, isUploading, uploadProgress, error: uploaderError } = useUploader();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({})
  const [titleColor, setTitleColor] = useState(content.heroTitleColor);
  const [taglineColor, setTaglineColor] = useState(content.heroTaglineColor);
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [currentVideoUrl, setCurrentVideoUrl] = useState(content.videoUrl)
  
  const formRef = useRef<HTMLFormElement>(null);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setFormErrors({})

    try {
        let finalVideoUrl = currentVideoUrl;
        // 1. If a new file is selected, upload it first.
        if (videoFile) {
            const uploadResult = await uploadFile(videoFile, 'hero');
            if (!uploadResult.success || !uploadResult.url) {
                setError(uploadResult.error || "Video upload failed. Please try again.");
                setIsSubmitting(false);
                return;
            }
            finalVideoUrl = uploadResult.url;
        }

        if (!formRef.current) {
            setError("Form reference is not available.");
            setIsSubmitting(false);
            return;
        }

        // 2. Prepare data and call the server action.
        const currentForm = new FormData(formRef.current);
        const rawData = {
            heroTitle: currentForm.get('heroTitle') as string,
            heroTagline: currentForm.get('heroTagline') as string,
            heroTitleColor: currentForm.get('heroTitleColor') as string,
            heroTaglineColor: currentForm.get('heroTaglineColor') as string,
            videoUrl: finalVideoUrl,
        };

        const result = await updateHomeContent(rawData);

        if (result.success) {
            toast({ title: 'Success!', description: result.message });
            setCurrentVideoUrl(finalVideoUrl);
            setVideoFile(null);
        } else {
            setError(result.message || 'An unknown error occurred.');
            setFormErrors(result.errors || {});
        }
    } catch (e: any) {
        console.error("Submission failed:", e);
        setError("An unexpected error occurred on the client. Please check the console.");
    } finally {
        setIsSubmitting(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
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
                maxSizeMB={500}
            />
        </div>

        {(error || uploaderError) && !Object.keys(formErrors).length && (
            <Alert variant="destructive">
                <AlertTitle>Save Error</AlertTitle>
                <AlertDescription>{error || uploaderError}</AlertDescription>
            </Alert>
        )}
        
        {isUploading && (
          <div className="space-y-2">
            <Label>Uploading Video...</Label>
            <Progress value={uploadProgress || 0} />
          </div>
        )}

        <Button type="submit" disabled={isSubmitting || isUploading} className="w-full">
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}
        </Button>
    </form>
  )
}

    