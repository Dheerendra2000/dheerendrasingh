'use client'

import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { updateAchievementsContent } from './actions'
import type { AchievementsContent, Achievement } from '@/lib/contentDefaults'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full mt-6">
      {pending ? 'Saving...' : 'Save All Changes'}
    </Button>
  )
}

export default function AchievementsForm({ content }: { content: AchievementsContent }) {
  const [state, formAction] = useActionState(updateAchievementsContent, null)
  const { toast } = useToast()
  const [achievements, setAchievements] = useState<Achievement[]>(content.achievements)

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

  const handleInputChange = (id: string, field: keyof Omit<Achievement, 'id'>, value: string) => {
    setAchievements(prev => 
      prev.map(ach => ach.id === id ? { ...ach, [field]: value } : ach)
    )
  }

  const addAchievement = () => {
    setAchievements(prev => [
      ...prev,
      { id: crypto.randomUUID(), icon: 'Award', year: '', title: '', description: '' }
    ])
  }

  const removeAchievement = (id: string) => {
    setAchievements(prev => prev.filter(ach => ach.id !== id))
  }

  return (
    <form action={formAction}>
        <input type="hidden" name="achievements" value={JSON.stringify(achievements)} />
        
        <div className="space-y-6">
          {achievements.map((achievement) => (
            <Card key={achievement.id} className="bg-secondary/50 relative">
              <CardHeader className="pb-4">
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-4 right-4 h-8 w-8"
                    onClick={() => removeAchievement(achievement.id)}
                    aria-label="Remove achievement"
                  >
                      <Trash2 className="h-4 w-4" />
                  </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor={`year-${achievement.id}`}>Year</Label>
                        <Input 
                            id={`year-${achievement.id}`}
                            value={achievement.year}
                            onChange={(e) => handleInputChange(achievement.id, 'year', e.target.value)}
                            placeholder="e.g., 2023"
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor={`icon-${achievement.id}`}>Icon Name</Label>
                        <Input 
                            id={`icon-${achievement.id}`}
                            value={achievement.icon}
                            onChange={(e) => handleInputChange(achievement.id, 'icon', e.target.value)}
                            placeholder="e.g., Award"
                        />
                    </div>
                 </div>
                <div className="space-y-2">
                    <Label htmlFor={`title-${achievement.id}`}>Title</Label>
                    <Input 
                        id={`title-${achievement.id}`}
                        value={achievement.title}
                        onChange={(e) => handleInputChange(achievement.id, 'title', e.target.value)}
                        placeholder="e.g., Speaker of the Year Award"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`description-${achievement.id}`}>Description</Label>
                    <Textarea 
                        id={`description-${achievement.id}`}
                        value={achievement.description}
                        onChange={(e) => handleInputChange(achievement.id, 'description', e.target.value)}
                        placeholder="e.g., Recognized for outstanding speeches..."
                        rows={3}
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

        <Button type="button" variant="outline" onClick={addAchievement} className="mt-6 w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add New Achievement
        </Button>
        
        <SubmitButton />
    </form>
  )
}
