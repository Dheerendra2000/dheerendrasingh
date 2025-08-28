// src/hooks/use-uploader.ts
'use client'

import { useState } from 'react';
import { getSignedUploadUrl } from '@/app/admin/dashboard/actions';

type UploadState = {
  isUploading: boolean;
  uploadProgress: number | null;
  error: string | null;
};

type UseUploaderReturn = UploadState & {
  uploadFile: (file: File, path: string) => Promise<{ success: boolean; url?: string; error?: string }>;
};

export function useUploader(): UseUploaderReturn {
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    uploadProgress: null,
    error: null,
  });

  const uploadFile = async (file: File, path: string): Promise<{ success: boolean; url?: string; error?: string }> => {
    setUploadState({ isUploading: true, uploadProgress: 0, error: null });

    // 1. Get a signed URL from our server
    const signedUrlResponse = await getSignedUploadUrl({
      fileName: file.name,
      fileType: file.type,
      path: path,
    });

    if (!signedUrlResponse.success || !signedUrlResponse.uploadUrl || !signedUrlResponse.publicUrl) {
      const errorMsg = signedUrlResponse.message || 'Could not get an upload URL.';
      setUploadState({ isUploading: false, uploadProgress: null, error: errorMsg });
      return { success: false, error: errorMsg };
    }

    const { uploadUrl, publicUrl } = signedUrlResponse;

    // 2. Upload the file directly to Google Cloud Storage using the signed URL
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.open('PUT', uploadUrl, true);
      xhr.setRequestHeader('Content-Type', file.type);

      // Track progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadState(prevState => ({ ...prevState, uploadProgress: percentComplete }));
        }
      };

      // Handle success
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setUploadState({ isUploading: false, uploadProgress: 100, error: null });
          resolve({ success: true, url: publicUrl });
        } else {
          const errorMsg = `Upload failed with status: ${xhr.status} ${xhr.statusText}`;
          console.error('Upload Error:', xhr.responseText);
          setUploadState({ isUploading: false, uploadProgress: null, error: errorMsg });
          resolve({ success: false, error: errorMsg });
        }
      };

      // Handle errors
      xhr.onerror = () => {
        const errorMsg = 'An unknown network error occurred during upload.';
        console.error('XHR OnError:', xhr.statusText);
        setUploadState({ isUploading: false, uploadProgress: null, error: errorMsg });
        resolve({ success: false, error: errorMsg });
      };

      xhr.send(file);
    });
  };

  return { ...uploadState, uploadFile };
}
