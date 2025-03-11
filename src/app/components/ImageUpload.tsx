'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2, MoveUp, MoveDown } from 'lucide-react';

interface ImageUploadProps {
  onImagesUploaded: (imageUrls: string[]) => void;
  currentImages?: string[];
  maxImages?: number;
}

export const ImageUpload = ({ onImagesUploaded, currentImages = [], maxImages = 5 }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize or update images when currentImages prop changes
  useEffect(() => {
    setImages(currentImages);
  }, [currentImages]);

  const handleImageLoad = (url: string) => {
    setLoadingImages(prev => {
      const next = new Set(prev);
      next.delete(url);
      return next;
    });
  };

  const handleImageError = (url: string) => {
    console.error(`Error loading image: ${url}`);
    setLoadingImages(prev => {
      const next = new Set(prev);
      next.delete(url);
      return next;
    });
    
    // Remove failed image and notify parent
    const newImages = images.filter(img => img !== url);
    setImages(newImages);
    onImagesUploaded(newImages);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesUploaded(newImages);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    
    setImages(newImages);
    onImagesUploaded(newImages);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (images.length + files.length > maxImages) {
      setError(`Максимальное количество изображений: ${maxImages}`);
      return;
    }

    // Validate each file
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError('Пожалуйста, загрузите только изображения');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Размер каждого файла не должен превышать 5MB');
        return;
      }
    }

    setError('');
    setIsUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Ошибка при загрузке');
        }

        const data = await response.json();
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      // Mark new images as loading
      setLoadingImages(prev => {
        const next = new Set(prev);
        uploadedUrls.forEach(url => next.add(url));
        return next;
      });

      // Update images and notify parent
      const newImages = [...images, ...uploadedUrls];
      setImages(newImages);
      onImagesUploaded(newImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке изображений');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((url, index) => (
          <div key={url} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group">
            {loadingImages.has(url) && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              </div>
            )}
            <div className="relative w-full h-full">
              <Image
                src={url}
                alt={`Image ${index + 1}`}
                fill
                className="object-contain transition-opacity duration-200"
                onLoad={() => handleImageLoad(url)}
                onError={() => handleImageError(url)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => moveImage(index, index - 1)}
                  className="p-1.5 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                  title="Переместить вверх"
                >
                  <MoveUp className="w-4 h-4" />
                </button>
              )}
              {index < images.length - 1 && (
                <button
                  type="button"
                  onClick={() => moveImage(index, index + 1)}
                  className="p-1.5 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                  title="Переместить вниз"
                >
                  <MoveDown className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                title="Удалить изображение"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {images.length < maxImages && (
          <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isUploading ? (
                <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-500 mb-2" />
                  <p className="text-sm text-gray-500">
                    Нажмите или перетащите файл
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, JPEG (до 5MB)
                  </p>
                  <p className="text-xs text-gray-500">
                    {images.length} из {maxImages} изображений
                  </p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileChange}
              disabled={isUploading}
              multiple
            />
          </label>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}; 