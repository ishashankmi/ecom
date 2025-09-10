import { useState } from 'react';
import { FiX, FiPlus } from 'react-icons/fi';

interface MultiImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function MultiImageUpload({ images, onChange, maxImages = 5 }: MultiImageUploadProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (files: FileList) => {
    const newImages: string[] = [];
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/') && images.length + newImages.length < maxImages) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          newImages.push(result);
          if (newImages.length === Math.min(files.length, maxImages - images.length)) {
            onChange([...images, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image}
              alt={`Upload ${index + 1}`}
              className="w-full h-24 object-cover rounded-lg border"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FiX size={12} />
            </button>
          </div>
        ))}
        
        {images.length < maxImages && (
          <label
            className={`w-full h-24 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
              dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
            />
            <FiPlus size={24} className="text-gray-400" />
          </label>
        )}
      </div>
      
      <p className="text-sm text-gray-500">
        {images.length}/{maxImages} images selected. Click + to add more or drag & drop images.
      </p>
    </div>
  );
}