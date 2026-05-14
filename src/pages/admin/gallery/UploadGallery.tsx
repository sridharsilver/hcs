import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GalleryForm } from '@/components/admin/gallery/GalleryForm';
import { ChevronLeft, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { GalleryCategory } from '@/types';

export const UploadGallery: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('gallery_categories')
          .select('*')
          .order('name');
        
        if (error) throw error;
        setCategories(data || []);
      } catch (error: any) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      } finally {
        setIsFetching(false);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('gallery')
        .insert([values]);

      if (error) throw error;

      toast.success('Image added to gallery successfully');
      navigate('/admin/gallery');
    } catch (error: any) {
      console.error('Error uploading to gallery:', error);
      toast.error(error.message || 'Error uploading image');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="font-medium">Preparing upload form...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/admin/gallery')}
          className="h-10 w-10 rounded-xl border-border shadow-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">New Highlight</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">Upload Media</h1>
          <p className="text-muted-foreground mt-1">Showcase a new moment in the school gallery.</p>
        </div>
      </div>

      <div className="bg-card p-8 rounded-[2.5rem] shadow-card border border-border/50">
        <GalleryForm 
          categories={categories}
          onSubmit={onSubmit} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
};
