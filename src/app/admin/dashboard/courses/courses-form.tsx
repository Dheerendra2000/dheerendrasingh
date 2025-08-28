
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { updateCoursesContent } from './actions'
import type { CoursesContent, Course } from '@/lib/contentDefaults'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import ImageUpload from '@/components/ui/image-upload'
import { useUploader } from '@/hooks/use-uploader'
import { Progress } from '@/components/ui/progress'

export default function CoursesForm({ content }: { content: CoursesContent }) {
  const { toast } = useToast()
  const { uploadFile, isUploading, uploadProgress, error: uploaderError } = useUploader();
  const [courses, setCourses] = useState<Course[]>(content.courses)
  const [thumbnailFiles, setThumbnailFiles] = useState<Map<string, File | null>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (id: string, field: keyof Omit<Course, 'id'>, value: string) => {
    setCourses(prev => 
      prev.map(item => item.id === id ? { ...item, [field]: value } : item)
    )
  }
  
  const handleFileSelect = (id: string, file: File | null) => {
    setThumbnailFiles(prev => new Map(prev).set(id, file));
    // Also clear the existing image URL if a new file is selected, so we know it needs upload.
    if (file) {
      setCourses(prev =>
        prev.map(item =>
          item.id === id ? { ...item, thumbnail: '' } : item
        )
      );
    }
  };

  const addCourse = () => {
    setCourses(prev => [
      ...prev,
      { id: Date.now().toString(), title: '', description: '', thumbnail: '', hint: '', price: '', category: '', link: '#' }
    ])
  }

  const removeCourse = (id: string) => {
    setCourses(prev => prev.filter(item => item.id !== id))
    setThumbnailFiles(prev => {
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
      let updatedCourses = [...courses];

      for (let i = 0; i < updatedCourses.length; i++) {
        const item = updatedCourses[i];
        const file = thumbnailFiles.get(item.id);

        if (file) {
          const uploadResult = await uploadFile(file, `courses/${item.id}`);
          if (!uploadResult.success || !uploadResult.url) {
            throw new Error(uploadResult.error || `Failed to upload thumbnail for ${item.title}.`);
          }
          updatedCourses[i] = { ...item, thumbnail: uploadResult.url };
        }
      }

      const result = await updateCoursesContent({ courses: updatedCourses });

      if (result.success) {
        toast({ title: 'Success!', description: result.message });
        setThumbnailFiles(new Map());
        setCourses(updatedCourses); // Sync state with the new URLs
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
          {courses.map((course) => (
            <Card key={course.id} className="bg-secondary/50 relative">
              <CardHeader className="pb-4">
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-4 right-4 h-8 w-8"
                    onClick={() => removeCourse(course.id)}
                    aria-label="Remove course"
                    disabled={disableActions}
                  >
                      <Trash2 className="h-4 w-4" />
                  </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor={`title-${course.id}`}>Title</Label>
                    <Input 
                        id={`title-${course.id}`}
                        value={course.title}
                        onChange={(e) => handleInputChange(course.id, 'title', e.target.value)}
                        placeholder="e.g., Mastering Public Speaking"
                        disabled={disableActions}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`description-${course.id}`}>Description</Label>
                    <Textarea 
                        id={`description-${course.id}`}
                        value={course.description}
                        onChange={(e) => handleInputChange(course.id, 'description', e.target.value)}
                        placeholder="e.g., Conquer your fear of public speaking..."
                        rows={3}
                        disabled={disableActions}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <ImageUpload
                          id={`thumbnail-file-${course.id}`}
                          name="Course Thumbnail"
                          initialValue={course.thumbnail}
                          onFileSelect={(file) => handleFileSelect(course.id, file)}
                          maxSizeMB={10}
                      />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor={`hint-${course.id}`}>AI Hint</Label>
                      <Input 
                          id={`hint-${course.id}`}
                          value={course.hint}
                          onChange={(e) => handleInputChange(course.id, 'hint', e.target.value)}
                          placeholder="e.g., presentation stage"
                          disabled={disableActions}
                      />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor={`price-${course.id}`}>Price</Label>
                      <Input 
                          id={`price-${course.id}`}
                          value={course.price}
                          onChange={(e) => handleInputChange(course.id, 'price', e.target.value)}
                          placeholder="e.g., $299"
                          disabled={disableActions}
                      />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor={`category-${course.id}`}>Category</Label>
                      <Input 
                          id={`category-${course.id}`}
                          value={course.category}
                          onChange={(e) => handleInputChange(course.id, 'category', e.target.value)}
                          placeholder="e.g., Communication"
                          disabled={disableActions}
                      />
                  </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`link-${course.id}`}>Learn More Link</Label>
                    <Input 
                        id={`link-${course.id}`}
                        type="url"
                        value={course.link}
                        onChange={(e) => handleInputChange(course.id, 'link', e.target.value)}
                        placeholder="https://example.com/course-details"
                        disabled={disableActions}
                    />
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
            <Label>Uploading Thumbnail...</Label>
            <Progress value={uploadProgress} />
          </div>
        )}

        <Button type="button" variant="outline" onClick={addCourse} className="mt-6 w-full" disabled={disableActions}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Course
        </Button>
        
        <Button type="submit" disabled={disableActions} className="w-full mt-6">
          {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save All Changes'}
        </Button>
    </form>
  )
}
