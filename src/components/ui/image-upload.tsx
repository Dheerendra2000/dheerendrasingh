
'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  id: string;
  name: string;
  initialValue?: string;
  onFileSelect: (file: File | null) => void;
}

export default function ImageUpload({ id, name, initialValue = '', onFileSelect }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(initialValue);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(initialValue);
  }, [initialValue]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const handleRemoveImage = () => {
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

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{name}</Label>
      <div className={cn(
        "relative flex flex-col items-center justify-center w-full min-h-[150px] p-4 border-2 border-dashed rounded-lg transition-colors",
        preview ? "border-primary" : "border-input"
      )}>
        {preview ? (
          <>
            <Image 
              src={preview} 
              alt="Image preview" 
              width={200}
              height={150}
              className="max-h-[150px] w-auto rounded-md object-contain" 
            />
            {fileName && <p className="text-xs text-muted-foreground mt-2">{fileName}</p>}
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 h-7 w-7"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="text-center">
            <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              <Button type="button" variant="link" onClick={handleButtonClick} className="p-0 h-auto">
                Click to upload
              </Button> or drag and drop.
            </p>
            <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
        <Input
          id={id}
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="sr-only"
          accept="image/png, image/jpeg, image/gif"
        />
      </div>
    </div>
  );
}
