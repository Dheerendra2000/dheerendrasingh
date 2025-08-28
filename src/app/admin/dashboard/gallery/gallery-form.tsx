
'use client'

import { useState, useEffect, useMemo } from 'react'
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { updateGalleryContent } from './actions'
import type { GalleryContent, GalleryItem } from '@/lib/contentDefaults'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Plus, Trash2, GripVertical, ChevronsUpDown, Check, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import ImageUpload from '@/components/ui/image-upload'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { cn } from '@/lib/utils'

function CategoryCombobox({ value, onChange, categories }: { value: string; onChange: (value: string) => void; categories: string[] }) {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const displayValue = categories.find(c => c.toLowerCase() === value?.toLowerCase()) || value;

  const showCreateOption = useMemo(() => {
    const trimmedSearch = searchText.trim().toLowerCase();
    if (!trimmedSearch) return false;
    return !categories.some(c => c.toLowerCase() === trimmedSearch);
  }, [categories, searchText]);


  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) setSearchText("");
    }}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between font-normal">
          {displayValue || "Select or create..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command filter={(value, search) => value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0}>
          <CommandInput value={searchText} onValueChange={setSearchText} placeholder="Search or type new..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem key={category} value={category} onSelect={() => { onChange(category); setSearchText(""); setOpen(false); }}>
                  <Check className={cn("mr-2 h-4 w-4", value?.toLowerCase() === category.toLowerCase() ? "opacity-100" : "opacity-0")} />
                  {category}
                </CommandItem>
              ))}
            </CommandGroup>
            {showCreateOption && <CommandSeparator />}
            {showCreateOption && (
                <CommandGroup>
                    <CommandItem value={searchText} onSelect={() => { onChange(searchText.trim()); setSearchText(""); setOpen(false); }} className="cursor-pointer">
                        <Plus className="mr-2 h-4 w-4" />
                        Create "{searchText}"
                    </CommandItem>
                </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}


export default function GalleryForm({ content }: { content: GalleryContent }) {
  const { toast } = useToast()
  const [items, setItems] = useState<GalleryItem[]>(content.items)
  const [posterFiles, setPosterFiles] = useState<Map<string, File | null>>(new Map());
  const [videoFiles, setVideoFiles] = useState<Map<string, File | null>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBrowser, setIsBrowser] = useState(false);

  const existingCategories = [...new Set(items.map((item) => item.category?.trim()).filter(Boolean))].sort();

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleInputChange = (id: string, field: keyof Omit<GalleryItem, 'id'>, value: string) => {
    setItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const updatedItem = { ...item, [field]: value };
      if (field === 'type' && value === 'image') updatedItem.videoSrc = '';
      if (field === 'type' && value === 'video') updatedItem.src = '';
      return updatedItem;
    }))
  }

  const handlePosterFileSelect = (id: string, file: File | null) => {
    setPosterFiles(prev => new Map(prev).set(id, file));
  };
  
  const handleVideoFileSelect = (id: string, file: File | null) => {
    setVideoFiles(prev => new Map(prev).set(id, file));
  };

  const addItem = () => {
    setItems(prev => [
      ...prev,
      { id: crypto.randomUUID(), type: 'image', src: '', alt: '', hint: '', category: '', videoSrc: '', size: 'regular' }
    ])
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
    setPosterFiles(prev => {
        const newFiles = new Map(prev);
        newFiles.delete(id);
        return newFiles;
    });
     setVideoFiles(prev => {
        const newFiles = new Map(prev);
        newFiles.delete(id);
        return newFiles;
    });
  }
  
  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;
    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, reorderedItem);
    setItems(newItems);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.set('gallery', JSON.stringify(items));
    posterFiles.forEach((file, id) => {
      if (file) formData.set(`src-file-${id}`, file);
    });
    videoFiles.forEach((file, id) => {
        if (file) formData.set(`video-file-${id}`, file);
    });

    const result = await updateGalleryContent(formData);

    if (result.success) {
      toast({ title: 'Success!', description: result.message });
      setPosterFiles(new Map());
      setVideoFiles(new Map());
    } else {
      setError(result.message || 'An unknown error occurred.');
      toast({ title: 'Error updating content', description: result.message, variant: 'destructive' });
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
        {isBrowser ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="galleryItems">
              {(provided) => (
                <div className="space-y-6" ref={provided.innerRef} {...provided.droppableProps}>
                  {items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps}>
                          <Card className="bg-secondary/50 relative">
                             <div {...provided.dragHandleProps} className="absolute top-1/2 -translate-y-1/2 left-3 text-muted-foreground cursor-grab p-1" aria-label="Drag to reorder">
                               <GripVertical className="h-6 w-6" />
                             </div>
                             <div className="pl-12">
                                <CardHeader className="pb-4">
                                    <Button type="button" variant="destructive" size="icon" className="absolute top-4 right-4 h-8 w-8" onClick={() => removeItem(item.id)} aria-label="Remove gallery item">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                          <Label>Item Type</Label>
                                          <RadioGroup value={item.type} onValueChange={(value) => handleInputChange(item.id, 'type', value as 'image' | 'video')} className="flex items-center gap-4 pt-2">
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="image" id={`type-image-${item.id}`} /><Label htmlFor={`type-image-${item.id}`} className="font-normal">Image</Label></div>
                                            <div className="flex items-center space-x-2"><RadioGroupItem value="video" id={`type-video-${item.id}`} /><Label htmlFor={`type-video-${item.id}`} className="font-normal">Video</Label></div>
                                          </RadioGroup>
                                      </div>
                                      <div className="space-y-2">
                                          <Label htmlFor={`size-${item.id}`}>Display Size</Label>
                                          <Select value={item.size || 'regular'} onValueChange={(value) => handleInputChange(item.id, 'size', value)}>
                                              <SelectTrigger id={`size-${item.id}`}><SelectValue placeholder="Select display size" /></SelectTrigger>
                                              <SelectContent><SelectItem value="regular">Regular</SelectItem><SelectItem value="large">Large (2 columns)</SelectItem></SelectContent>
                                          </Select>
                                      </div>
                                  </div>
                                  
                                  {item.type === 'image' && (
                                    <ImageUpload
                                      id={`src-file-${item.id}`}
                                      name='Image'
                                      initialValue={item.src}
                                      onFileSelect={(file) => handlePosterFileSelect(item.id, file)}
                                      accept="image/png, image/jpeg, image/gif"
                                    />
                                  )}

                                  {item.type === 'video' && (
                                     <div className="space-y-4">
                                         <ImageUpload
                                            id={`video-file-${item.id}`}
                                            name="Video File"
                                            initialValue={item.videoSrc}
                                            onFileSelect={(file) => handleVideoFileSelect(item.id, file)}
                                            accept="video/mp4, video/webm"
                                         />
                                     </div>
                                  )}
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                          <Label>Category</Label>
                                           <CategoryCombobox value={item.category || ''} onChange={(newValue) => handleInputChange(item.id, 'category', newValue)} categories={existingCategories} />
                                      </div>
                                      <div className="space-y-2">
                                          <Label htmlFor={`hint-${item.id}`}>AI Hint (for image)</Label>
                                          <Input id={`hint-${item.id}`} value={item.hint || ''} onChange={(e) => handleInputChange(item.id, 'hint', e.target.value)} placeholder="e.g., conference stage" />
                                      </div>
                                  </div>
                                  <div className="space-y-2">
                                      <Label htmlFor={`alt-${item.id}`}>Alt Text (for accessibility)</Label>
                                      <Input id={`alt-${item.id}`} value={item.alt || ''} onChange={(e) => handleInputChange(item.id, 'alt', e.target.value)} placeholder="e.g., Speaking at a major tech conference" />
                                  </div>
                                </CardContent>
                              </div>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : null}

        {error && <Alert variant="destructive" className="mt-4"><AlertTitle>Save Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
        
        <Button type="button" variant="outline" onClick={addItem} className="mt-6 w-full"><Plus className="h-4 w-4 mr-2" /> Add New Media Item</Button>
        
        <Button type="submit" disabled={isSubmitting} className="w-full mt-6">
          {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save All Changes'}
        </Button>
    </form>
  )
}
