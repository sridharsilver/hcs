import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit3, ChevronLeft, Layout, Tag, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { GalleryCategory } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';

export const GalleryCategories: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('gallery_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSaving(true);
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      if (editingId) {
        const { error } = await supabase
          .from('gallery_categories')
          .update({ name, slug, description })
          .eq('id', editingId);
        if (error) throw error;
        toast.success('Category updated');
      } else {
        const { error } = await supabase
          .from('gallery_categories')
          .insert([{ name, slug, description }]);
        if (error) throw error;
        toast.success('Category created');
      }

      setName('');
      setDescription('');
      setEditingId(null);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || 'Error saving category');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase.from('gallery_categories').delete().eq('id', deleteId);
      if (error) throw error;
      setCategories(categories.filter(c => c.id !== deleteId));
      toast.success('Category deleted');
    } catch (error: any) {
      toast.error('Cannot delete category (it may be in use)');
    } finally {
      setDeleteId(null);
    }
  };

  const startEdit = (cat: GalleryCategory) => {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
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
          <h1 className="text-3xl font-display font-bold text-foreground">Gallery Categories</h1>
          <p className="text-muted-foreground mt-1">Organize your highlights by type (Sports, Arts, etc.)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <div className="bg-card p-6 rounded-[2rem] border border-border/50 shadow-card sticky top-8">
            <div className="flex items-center gap-2 text-primary mb-6">
              {editingId ? <Edit3 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              <h3 className="font-bold font-display">{editingId ? 'Edit Category' : 'New Category'}</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/80">Category Name</label>
                <Input 
                  placeholder="e.g. Science Fair" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-muted/30 rounded-xl h-11 border-border/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/80">Description</label>
                <Textarea 
                  placeholder="What is this category for?" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-muted/30 rounded-xl min-h-[100px] border-border/50 resize-none"
                />
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button type="submit" disabled={isSaving} className="w-full rounded-xl h-11 shadow-elegant font-bold">
                  {isSaving ? 'Saving...' : (editingId ? 'Update Category' : 'Create Category')}
                </Button>
                {editingId && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => { setEditingId(null); setName(''); setDescription(''); }}
                    className="w-full rounded-xl h-11 text-muted-foreground"
                  >
                    Cancel Edit
                  </Button>
                )}
              </div>
            </form>

            <div className="mt-8 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-3">
              <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-600/80 leading-relaxed font-medium uppercase tracking-wider">
                Note: Deleting a category that has images assigned to it might cause display issues in the public gallery.
              </p>
            </div>
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 w-full bg-muted animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid gap-4">
              {categories.map((cat) => (
                <div 
                  key={cat.id}
                  className="group flex items-center justify-between p-5 bg-card border border-border/50 rounded-2xl hover:border-primary/30 transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <Tag className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{cat.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{cat.description || 'No description provided.'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => startEdit(cat)}
                      className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setDeleteId(cat.id)}
                      className="h-10 w-10 rounded-full hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[40vh] flex flex-col items-center justify-center gap-4 text-muted-foreground bg-card rounded-[3rem] border border-dashed border-border/60">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <Layout className="h-8 w-8 opacity-20" />
              </div>
              <p className="font-medium text-lg">No categories created yet.</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? Images already using this category will remain, but the category itself will be removed."
        confirmText="Yes, delete it"
        variant="destructive"
      />
    </div>
  );
};
