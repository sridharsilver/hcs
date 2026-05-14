import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TeacherForm } from '@/components/admin/teachers/TeacherForm';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const AddTeacher: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('teachers')
        .insert([values]);

      if (error) throw error;

      toast.success('Teacher added successfully');
      navigate('/admin/teachers');
    } catch (error: any) {
      console.error('Error adding teacher:', error);
      toast.error(error.message || 'Error adding teacher');
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-3xl font-display font-bold text-foreground">Add Faculty Member</h1>
          <p className="text-muted-foreground mt-1">Onboard a new teacher into the school staff.</p>
        </div>
      </div>

      <div className="bg-card p-8 rounded-3xl shadow-card border border-border/50">
        <TeacherForm onSubmit={onSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};
