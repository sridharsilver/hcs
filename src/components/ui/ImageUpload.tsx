import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  folder?: string;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
  folder = 'uploads',
  className
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

      // We use the 'folder' prop as the bucket name
      const { error: uploadError } = await supabase.storage
        .from(folder)
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(folder)
        .getPublicUrl(fileName);

      onChange(publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn("space-y-4 w-full", className)}>
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative h-40 w-full sm:w-64 rounded-2xl overflow-hidden border border-border/50 group shadow-card">
            <img 
              src={value} 
              alt="Uploaded" 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={onRemove}
                className="h-10 w-10 rounded-full shadow-elegant"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "h-40 w-full sm:w-64 rounded-2xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-smooth bg-card group",
              isUploading && "pointer-events-none opacity-60"
            )}
          >
            {isUploading ? (
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            ) : (
              <>
                <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
                  <Upload className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">Click to upload</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                </div>
              </>
            )}
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleUpload} 
          accept="image/*" 
          className="hidden" 
        />
      </div>
    </div>
  );
};
