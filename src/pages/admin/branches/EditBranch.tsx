import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BranchForm } from '@/components/admin/branches/BranchForm';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Branch } from '@/types';

export const EditBranch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const { data, error } = await supabase
          .from('branches')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setBranch(data);
      } catch (error: any) {
        console.error('Error fetching branch:', error);
        toast.error('Branch not found');
        navigate('/admin/settings?tab=campuses');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchBranch();
  }, [id, navigate]);

  const onSubmit = async (values: any) => {
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('branches')
        .update(values)
        .eq('id', id);

      if (error) throw error;

      toast.success('Branch updated successfully');
      navigate('/admin/settings?tab=campuses');
    } catch (error: any) {
      console.error('Error updating branch:', error);
      toast.error(error.message || 'Error updating branch');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="font-medium">Loading branch details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/admin/settings?tab=campuses')}
          className="h-10 w-10 rounded-xl border-border shadow-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Edit Branch</h1>
          <p className="text-muted-foreground mt-1">Update the information for {branch?.name}.</p>
        </div>
      </div>

      <div className="bg-card p-8 rounded-3xl shadow-card border border-border/50">
        <BranchForm 
          initialData={branch} 
          onSubmit={onSubmit} 
          isLoading={isSaving} 
        />
      </div>
    </div>
  );
};
