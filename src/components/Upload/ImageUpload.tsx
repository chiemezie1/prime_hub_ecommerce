"use client"

import React, { useState } from 'react';

interface UploadImageProps {
  onImageUpload: (imageUrl: string) => void;
}

const UploadImage: React.FC<UploadImageProps> = ({ onImageUpload }) => {
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please select a valid image file (JPG, PNG, GIF).');
        return;
      }
      setImage(selectedFile);
      setError(null);
      await handleUpload(selectedFile);
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      onImageUpload(data.url);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <label htmlFor="image-upload" className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          {uploading ? 'Uploading...' : 'Choose Image'}
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
        {image && <span className="text-sm text-gray-500">{image.name}</span>}
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
    </div>
  );
};

export default UploadImage;