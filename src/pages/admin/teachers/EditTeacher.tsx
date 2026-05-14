import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TeacherForm } from '@/components/admin/teachers/TeacherForm';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Teacher } from '@/types';

export const EditTeacher: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const { data, error } = await supabase
          .from('teachers')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setTeacher(data);
      } catch (error: any) {
        console.error('Error fetching teacher:', error);
        toast.error('Teacher record not found');
        navigate('/admin/teachers');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchTeacher();
  }, [id, navigate]);

  const onSubmit = async (values: any) => {
    try {
      setIsSaving(true);
      // Remove fields that shouldn't be updated or cause conflicts
      const { id: _, created_at, updated_at, branches, ...updateData } = values;

      const { data, error } = await supabase
        .from('teachers')
        .update(updateData)
        .eq('id', id)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error('No profile was found to update. Please refresh and try again.');
      }

      toast.success('Teacher profile updated successfully');
      navigate('/admin/teachers');
    } catch (error: any) {
      console.error('Error updating teacher:', error);
      toast.error(error.message || 'Error updating teacher');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="font-medium">Loading teacher details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/admin/teachers')}
          className="h-10 w-10 rounded-xl border-border shadow-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Edit Teacher Profile</h1>
          <p className="text-muted-foreground mt-1">Update profile for {teacher?.full_name}.</p>
        </div>
      </div>

      <div className="bg-card p-8 rounded-3xl shadow-card border border-border/50">
        <TeacherForm 
          initialData={teacher} 
          onSubmit={onSubmit} 
          isLoading={isSaving} 
        />
      </div>
    </div>
  );
};
