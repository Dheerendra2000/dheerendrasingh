
'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, X, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  id: string;
  name: string;
  initialValue?: string;
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
}

export default function ImageUpload({ 
  id, 
  name, 
  initialValue = '', 
  onFileSelect,
  accept = "image/*",
  maxSizeMB = 500, // Default to a high value
}: ImageUploadProps) {
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(initialValue);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isVideo = accept.includes('video');

  useEffect(() => {
    setPreview(initialValue);
  }, [initialValue]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: `The selected file exceeds the ${maxSizeMB}MB limit.`,
          variant: 'destructive',
        });
        // Clear the input value to allow re-selection of the same file if needed
        if(fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setPreview(URL.createObjectURL(file));
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const renderPreview = () => {
    if (!preview) return null;

    if (isVideo) {
      return (
        <video 
          key={preview} // Use key to force re-render when src changes
          controls 
          className="max-h-[150px] w-auto rounded-md object-contain"
        >
          <source src={preview} />
          Your browser does not support the video tag.
        </video>
      );
    }
    
    return (
      <Image 
        src={preview} 
        alt="Image preview" 
        width={200}
        height={150}
        className="max-h-[150px] w-auto rounded-md object-contain" 
      />
    );
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{name}</Label>
      <div className={cn(
        "relative flex flex-col items-center justify-center w-full min-h-[150px] p-4 border-2 border-dashed rounded-lg transition-colors",
        preview ? "border-primary" : "border-input"
      )}>
        {preview ? (
          <>
            {renderPreview()}
            {fileName && <p className="text-xs text-muted-foreground mt-2">{fileName}</p>}
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleRemove}
              className="absolute top-2 right-2 h-7 w-7"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="text-center">
            {isVideo ? (
                <Video className="mx-auto h-10 w-10 text-muted-foreground" />
            ) : (
                <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground" />
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              <Button type="button" variant="link" onClick={handleButtonClick} className="p-0 h-auto">
                Click to upload
              </Button> or drag and drop.
            </p>
            <p className="text-xs text-muted-foreground">
              {accept.toUpperCase().replace(/,/g, ', ')} (Max {maxSizeMB}MB)
            </p>
          </div>
        )}
        <Input
          id={id}
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="sr-only"
          accept={accept}
        />
      </div>
    </div>
  );
}
