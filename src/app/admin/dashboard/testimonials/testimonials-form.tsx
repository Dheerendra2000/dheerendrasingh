
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
import ImageUpload from '@/components/ui/image-upload'
import { useUploader } from '@/hooks/use-uploader'
import { Progress } from '@/components/ui/progress'

export default function TestimonialsForm({ content }: { content: TestimonialsContent }) {
  const { toast } = useToast()
  const { uploadFile, isUploading, uploadProgress, error: uploaderError } = useUploader();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(content.testimonials)
  const [imageFiles, setImageFiles] = useState<Map<string, File | null>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (id: string, field: keyof Omit<Testimonial, 'id'>, value: string) => {
    setTestimonials(prev => 
      prev.map(item => item.id === id ? { ...item, [field]: value } : item)
    )
  }

  const handleFileSelect = (id: string, file: File | null) => {
    setImageFiles(prev => new Map(prev).set(id, file));
     // Also clear the existing image URL if a new file is selected, so we know it needs upload.
    if (file) {
      setTestimonials(prev =>
        prev.map(item =>
          item.id === id ? { ...item, image: '' } : item
        )
      );
    }
  };

  const addTestimonial = () => {
    setTestimonials(prev => [
      ...prev,
      { id: Date.now().toString(), name: '', title: '', quote: '', image: '', hint: '' }
    ])
  }

  const removeTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(item => item.id !== id))
    setImageFiles(prev => {
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
      let updatedTestimonials = [...testimonials];

      for (let i = 0; i < updatedTestimonials.length; i++) {
        const item = updatedTestimonials[i];
        const file = imageFiles.get(item.id);

        if (file) {
          const uploadResult = await uploadFile(file, `testimonials/${item.id}`);
          if (!uploadResult.success || !uploadResult.url) {
            throw new Error(uploadResult.error || `Failed to upload image for ${item.name}.`);
          }
          updatedTestimonials[i] = { ...item, image: uploadResult.url };
        }
      }

      const result = await updateTestimonialsContent({ testimonials: updatedTestimonials });

      if (result.success) {
        toast({ title: 'Success!', description: result.message });
        setImageFiles(new Map());
        setTestimonials(updatedTestimonials); // Sync state with the new URLs
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
                    disabled={disableActions}
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
                            disabled={disableActions}
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor={`title-${testimonial.id}`}>Title / Company</Label>
                        <Input 
                            id={`title-${testimonial.id}`}
                            value={testimonial.title}
                            onChange={(e) => handleInputChange(testimonial.id, 'title', e.target.value)}
                            placeholder="e.g., CEO, TechCorp"
                            disabled={disableActions}
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
                        disabled={disableActions}
                    />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <ImageUpload
                            id={`image-file-${testimonial.id}`}
                            name="Client Image"
                            initialValue={testimonial.image}
                            onFileSelect={(file) => handleFileSelect(testimonial.id, file)}
                            maxSizeMB={10}
                       />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor={`hint-${testimonial.id}`}>AI Hint (for image)</Label>
                        <Input 
                            id={`hint-${testimonial.id}`}
                            value={testimonial.hint}
                            onChange={(e) => handleInputChange(testimonial.id, 'hint', e.target.value)}
                            placeholder="e.g., man portrait"
                            disabled={disableActions}
                        />
                    </div>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(error || uploaderError) && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Save Error</AlertTitle>
              <AlertDescription>{error || uploaderError}</AlertDescription>
            </Alert>
        )}

        {isUploading && (
          <div className="space-y-2 mt-4">
            <Label>Uploading Image...</Label>
            <Progress value={uploadProgress} />
          </div>
        )}

        <Button type="button" variant="outline" onClick={addTestimonial} className="mt-6 w-full" disabled={disableActions}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Testimonial
        </Button>
        
        <Button type="submit" disabled={disableActions} className="w-full mt-6">
          {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save All Changes'}
        </Button>
    </form>
  )
}
