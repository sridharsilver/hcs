import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { GalleryItem, GalleryCategory } from '@/types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/ImageUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageIcon, Tag, Layout } from 'lucide-react';

const gallerySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  category: z.string().min(1, "Category is required"),
  image_url: z.string().min(1, "Image is required"),
  description: z.string().optional(),
});

type GalleryFormValues = z.infer<typeof gallerySchema>;

interface GalleryFormProps {
  initialData?: GalleryItem | null;
  categories: GalleryCategory[];
  onSubmit: (values: GalleryFormValues) => void;
  isLoading?: boolean;
}

export const GalleryForm: React.FC<GalleryFormProps> = ({ 
  initialData, 
  categories,
  onSubmit, 
  isLoading 
}) => {
  const form = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    defaultValues: initialData ? {
      title: initialData.title,
      category: initialData.category,
      image_url: initialData.image_url,
      description: initialData.description || '',
    } : {
      title: '',
      category: '',
      image_url: '',
      description: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <Layout className="h-5 w-5" />
              <h3 className="text-lg font-bold font-display">Image Details</h3>
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Annual Sports Day 2024" {...field} className="bg-muted/30 rounded-xl h-12 border-border/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gallery Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-muted/30 rounded-xl h-12 border-border/50">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl shadow-elegant border-border/50">
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.name} className="rounded-lg">
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief context about this highlight..." 
                      className="bg-muted/30 rounded-xl min-h-[120px] border-border/50 resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <ImageIcon className="h-5 w-5" />
              <h3 className="text-lg font-bold font-display">Media Upload</h3>
            </div>

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gallery Image</FormLabel>
                  <FormControl>
                    <ImageUpload 
                      value={field.value} 
                      onChange={field.onChange} 
                      onRemove={() => field.onChange('')}
                      folder="gallery"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <p className="text-xs text-muted-foreground flex gap-2">
                <Tag className="h-3.5 w-3.5 text-primary shrink-0" />
                Images will be displayed in the public gallery under the selected category. Use high-resolution landscape images for best results.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={() => window.history.back()} className="rounded-xl px-8 h-11 border-border/60">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="rounded-xl px-10 h-11 shadow-elegant font-bold">
            {isLoading ? "Uploading..." : (initialData ? "Update Highlight" : "Add to Gallery")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
