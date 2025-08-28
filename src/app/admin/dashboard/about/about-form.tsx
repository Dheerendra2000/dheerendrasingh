
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { updateAboutContent } from './actions'
import { Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import ImageUpload from '@/components/ui/image-upload'
import { useUploader } from '@/hooks/use-uploader'
import { Progress } from '@/components/ui/progress'

type AboutContent = {
  imageUrl: string;
  imageHint: string;
  heading: string;
  paragraph1: string;
  paragraph2: string;
  highlights: string[];
}

export default function AboutForm({ content }: { content: AboutContent }) {
  const { toast } = useToast()
  const { uploadFile, isUploading, uploadProgress, error: uploaderError } = useUploader();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({})
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState(content.imageUrl)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setFormErrors({})

    try {
        let finalImageUrl = currentImageUrl;
        
        if (imageFile) {
            const uploadResult = await uploadFile(imageFile, 'about');
            if (!uploadResult.success || !uploadResult.url) {
                setError(uploadResult.error || "Image upload failed. Please try again.");
                setIsSubmitting(false);
                return;
            }
            finalImageUrl = uploadResult.url;
        }

        const formData = new FormData(event.currentTarget);
        const data = {
          heading: formData.get('heading') as string,
          paragraph1: formData.get('paragraph1') as string,
          paragraph2: formData.get('paragraph2') as string,
          highlights: formData.get('highlights') as string,
          imageHint: formData.get('imageHint') as string,
          imageUrl: finalImageUrl,
        };
        
        const result = await updateAboutContent(data);

        if (result.success) {
            toast({ title: 'Success!', description: result.message });
            setCurrentImageUrl(finalImageUrl);
            setImageFile(null);
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
    <form onSubmit={handleSubmit} className="space-y-6">
        <ImageUpload
            id="about-image"
            name="Profile Image"
            initialValue={currentImageUrl}
            onFileSelect={setImageFile}
            maxSizeMB={10}
        />
        <div className="space-y-2">
            <Label htmlFor="imageHint">Image AI Hint</Label>
            <Input id="imageHint" name="imageHint" defaultValue={content.imageHint} />
            {formErrors?.imageHint && <p className="text-sm font-medium text-destructive">{formErrors.imageHint[0]}</p>}
            <p className="text-xs text-muted-foreground">Optional: one or two keywords for AI image search (e.g. "professional portrait").</p>
        </div>
        <div className="space-y-2">
            <Label htmlFor="heading">Heading</Label>
            <Input id="heading" name="heading" defaultValue={content.heading} />
            {formErrors?.heading && <p className="text-sm font-medium text-destructive">{formErrors.heading[0]}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="paragraph1">Biography Paragraph 1</Label>
            <Textarea id="paragraph1" name="paragraph1" defaultValue={content.paragraph1} rows={5} />
            {formErrors?.paragraph1 && <p className="text-sm font-medium text-destructive">{formErrors.paragraph1[0]}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="paragraph2">Biography Paragraph 2</Label>
            <Textarea id="paragraph2" name="paragraph2" defaultValue={content.paragraph2} rows={5} />
            {formErrors?.paragraph2 && <p className="text-sm font-medium text-destructive">{formErrors.paragraph2[0]}</p>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="highlights">Key Highlights</Label>
            <Textarea id="highlights" name="highlights" defaultValue={content.highlights.join('\n')} rows={5} />
            <p className="text-xs text-muted-foreground">Enter each highlight on a new line.</p>
            {formErrors?.highlights && <p className="text-sm font-medium text-destructive">{formErrors.highlights[0]}</p>}
        </div>
        
        {(error || uploaderError) && !Object.keys(formErrors).length && (
            <Alert variant="destructive">
                <AlertTitle>Save Error</AlertTitle>
                <AlertDescription>{error || uploaderError}</AlertDescription>
            </Alert>
        )}
        
        {isUploading && (
          <div className="space-y-2">
            <Label>Uploading Image...</Label>
            <Progress value={uploadProgress || 0} />
          </div>
        )}

        <Button type="submit" disabled={isSubmitting || isUploading} className="w-full">
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}
        </Button>
    </form>
  )
}
