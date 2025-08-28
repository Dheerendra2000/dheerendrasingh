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

export default function CoursesForm({ content }: { content: CoursesContent }) {
  const { toast } = useToast()
  const [courses, setCourses] = useState<Course[]>(content.courses)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (id: string, field: keyof Omit<Course, 'id'>, value: string) => {
    setCourses(prev => 
      prev.map(item => item.id === id ? { ...item, [field]: value } : item)
    )
  }

  const addCourse = () => {
    setCourses(prev => [
      ...prev,
      { id: crypto.randomUUID(), title: '', description: '', thumbnail: '', hint: '', price: '', category: '', link: '#' }
    ])
  }

  const removeCourse = (id: string) => {
    setCourses(prev => prev.filter(item => item.id !== id))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    const formData = new FormData()
    formData.append('courses', JSON.stringify(courses))

    const result = await updateCoursesContent(formData)

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
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor={`thumbnail-${course.id}`}>Thumbnail URL</Label>
                      <Input 
                          id={`thumbnail-${course.id}`}
                          type="url"
                          value={course.thumbnail}
                          onChange={(e) => handleInputChange(course.id, 'thumbnail', e.target.value)}
                          placeholder="https://placehold.co/600x400.png"
                      />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor={`hint-${course.id}`}>AI Hint</Label>
                      <Input 
                          id={`hint-${course.id}`}
                          value={course.hint}
                          onChange={(e) => handleInputChange(course.id, 'hint', e.target.value)}
                          placeholder="e.g., presentation stage"
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
                      />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor={`category-${course.id}`}>Category</Label>
                      <Input 
                          id={`category-${course.id}`}
                          value={course.category}
                          onChange={(e) => handleInputChange(course.id, 'category', e.target.value)}
                          placeholder="e.g., Communication"
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
                    />
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

        <Button type="button" variant="outline" onClick={addCourse} className="mt-6 w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add New Course
        </Button>
        
        <Button type="submit" disabled={isSubmitting} className="w-full mt-6">
          {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save All Changes'}
        </Button>
    </form>
  )
}
