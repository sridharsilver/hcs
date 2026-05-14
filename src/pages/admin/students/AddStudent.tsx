import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentForm } from '@/components/admin/students/StudentForm';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const AddStudent: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('students')
        .insert([values]);

      if (error) throw error;

      toast.success('Student registered successfully');
      navigate('/admin/students');
    } catch (error: any) {
      console.error('Error registering student:', error);
      toast.error(error.message || 'Error registering student');
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
          onClick={() => navigate('/admin/students')}
          className="h-10 w-10 rounded-xl border-border shadow-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Register New Student</h1>
          <p className="text-muted-foreground mt-1">Enroll a new student into the school system.</p>
        </div>
      </div>

      <div className="bg-card p-8 rounded-3xl shadow-card border border-border/50">
        <StudentForm onSubmit={onSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};
