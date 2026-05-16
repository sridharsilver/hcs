import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Trash2, Edit3, Grid, List as ListIcon, MoreVertical, Image as ImageIcon, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { GalleryItem, GalleryCategory } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { AdminContent } from '@/components/admin/AdminContent';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

export const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [galleryRes, catRes] = await Promise.all([
        supabase.from('gallery').select('*').order('created_at', { ascending: false }),
        supabase.from('gallery_categories').select('*').order('name')
      ]);

      if (galleryRes.error) throw galleryRes.error;
      if (catRes.error) throw catRes.error;

      setItems(galleryRes.data || []);
      setCategories(catRes.data || []);
    } catch (error: any) {
      console.error('Error fetching gallery:', error);
      toast.error('Failed to load gallery items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase.from('gallery').delete().eq('id', deleteId);
      if (error) throw error;
      setItems(items.filter(i => i.id !== deleteId));
      toast.success('Image removed from gallery');
    } catch (error: any) {
      toast.error('Error deleting image');
    } finally {
      setDeleteId(null);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = (item.title?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminContent>
      <AdminPageHeader 
        title="Media Gallery"
        description="Manage school life highlights and event photos."
        icon={ImageIcon}
        action={{
          label: "Add Image",
          onClick: () => navigate('/admin/gallery/upload'),
          icon: Plus
        }}
      />

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search images by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 rounded-2xl border-border/50 bg-card h-12"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {['All', ...categories.map(c => c.name)].map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? 'default' : 'outline'}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "rounded-full px-6 h-10 whitespace-nowrap transition-all text-sm font-medium",
                activeCategory === cat ? "shadow-md" : "border-border/50 text-muted-foreground hover:border-primary/30"
              )}
            >
              {cat}
            </Button>
          ))}
        </div>
        <div className="flex items-center bg-card border border-border/50 rounded-2xl p-1 shrink-0">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
            className="rounded-xl h-10 w-10"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
            className="rounded-xl h-10 w-10"
          >
            <ListIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[4/3] rounded-[2rem] bg-muted animate-pulse" />
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className={cn(
          viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        )}>
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn(
                  "group relative bg-card border border-border/50 overflow-hidden transition-all duration-300",
                  viewMode === 'grid' 
                    ? "rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1"
                    : "rounded-2xl flex items-center p-3 gap-4"
                )}
              >
                <div className={cn(
                  "relative overflow-hidden bg-muted",
                  viewMode === 'grid' ? "aspect-[4/3] w-full" : "h-20 w-20 rounded-xl shrink-0"
                )}>
                  <img 
                    src={item.image_url} 
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="px-3 py-1 rounded-full bg-background/90 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                      {item.category}
                    </div>
                  </div>
                </div>

                <div className={cn(
                  viewMode === 'grid' ? "p-5" : "flex-1 min-w-0"
                )}>
                  <h3 className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  {item.description && viewMode === 'list' && (
                    <p className="text-sm text-muted-foreground truncate mt-1">{item.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-tight font-medium">
                      {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className={cn(
                  "absolute",
                  viewMode === 'grid' ? "top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity" : "relative right-2 ml-auto"
                )}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="icon" className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-md shadow-lg border-white/20 hover:bg-white transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl shadow-elegant border-border/50 min-w-[160px]">
                      <DropdownMenuItem onClick={() => navigate(`/admin/gallery/edit/${item.id}`)} className="flex items-center gap-2 p-3 rounded-lg cursor-pointer">
                        <Edit3 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Edit Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDeleteId(item.id)} className="flex items-center gap-2 p-3 text-destructive focus:text-destructive rounded-lg cursor-pointer">
                        <Trash2 className="h-4 w-4" />
                        <span className="font-medium">Delete Image</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="h-[40vh] flex flex-col items-center justify-center gap-4 text-muted-foreground bg-card rounded-[3rem] border border-dashed border-border/60">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <ImageIcon className="h-8 w-8 opacity-20" />
          </div>
          <p className="font-medium text-lg">No images found in your gallery.</p>
          <Button variant="link" className="text-primary font-bold" onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}>Reset Filters</Button>
        </div>
      )}

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Image"
        message="Are you sure you want to remove this image from the gallery? This action cannot be undone."
        confirmText="Yes, delete it"
        variant="destructive"
      />
    </AdminContent>
  );
};
