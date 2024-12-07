import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { buildApiUrl } from '../config';

interface ExcelUploadProps {
  onUploadSuccess: () => void;
  endpoint: string;
}

export function ExcelUpload({ onUploadSuccess, endpoint }: ExcelUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(buildApiUrl(endpoint), {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      onUploadSuccess();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleUpload}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        <Upload size={20} />
        Import Excel
      </button>
    </div>
  );
} 