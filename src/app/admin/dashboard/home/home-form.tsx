
'use client'

import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { updateHomeContent } from './actions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Lightbulb } from 'lucide-react'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Saving...' : 'Save Changes'}
    </Button>
  )
}

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
  const [state, formAction] = useActionState(updateHomeContent, null)
  const { toast } = useToast()
  const [titleColor, setTitleColor] = useState(content.heroTitleColor);
  const [taglineColor, setTaglineColor] = useState(content.heroTaglineColor);


  useEffect(() => {
    if (state?.success) {
      toast({
        title: 'Success!',
        description: state.message,
      })
    } else if (state?.error) {
       toast({
        title: 'Error updating content',
        description: state.message,
        variant: 'destructive',
      })
    }
  }, [state, toast])

  return (
    <form action={formAction} className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="heroTitle">Hero Title</Label>
            <Input id="heroTitle" name="heroTitle" defaultValue={content.heroTitle} />
            {state?.errors?.heroTitle && <p className="text-sm font-medium text-destructive">{state.errors.heroTitle[0]}</p>}
        </div>
          <div className="space-y-2">
            <Label htmlFor="heroTagline">Hero Tagline</Label>
            <Input id="heroTagline" name="heroTagline" defaultValue={content.heroTagline} />
            {state?.errors?.heroTagline && <p className="text-sm font-medium text-destructive">{state.errors.heroTagline[0]}</p>}
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
            {state?.errors?.heroTitleColor && <p className="text-sm font-medium text-destructive">{state.errors.heroTitleColor[0]}</p>}
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
            {state?.errors?.heroTaglineColor && <p className="text-sm font-medium text-destructive">{state.errors.heroTaglineColor[0]}</p>}
            <p className="text-xs text-muted-foreground">Enter a hex color code, use the color picker, or select from the palette.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="videoUrl">Background Video URL</Label>
          <Input id="videoUrl" name="videoUrl" type="url" defaultValue={content.videoUrl} />
          {state?.errors?.videoUrl && <p className="text-sm font-medium text-destructive">{state.errors.videoUrl[0]}</p>}
          <Alert className="!mt-4">
            <Lightbulb className="h-4 w-4" />
            <AlertTitle>How to get a video URL</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 space-y-1 mt-2 text-xs text-muted-foreground">
                <li>The URL must link directly to a video file (e.g., end in .mp4).</li>
                <li>YouTube or Vimeo links will not work.</li>
                <li>
                  Find free stock videos on sites like <strong>Pexels</strong> or <strong>Pixabay</strong>.
                </li>
                <li>
                  On those sites, you can often right-click the download button and choose "Copy Link Address" to get the direct URL.
                </li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
        <SubmitButton />
    </form>
  )
}
