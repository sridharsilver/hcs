import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Student } from '@/types';
import { 
  ChevronLeft, 
  User, 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Building2,
  FileText,
  BadgeCheck,
  Clock,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const StudentProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const { data, error } = await supabase
          .from('students')
          .select('*, branches(name)')
          .eq('id', id)
          .single();

        if (error) throw error;
        setStudent({
          ...data,
          branch_name: data.branches?.name
        });
      } catch (error) {
        console.error('Error:', error);
        navigate('/admin/students');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudent();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading student profile...</p>
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/admin/students')}
          className="rounded-xl border-border shadow-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Student Profile</h1>
          <p className="text-muted-foreground mt-1">Academic and personal records for {student.full_name}.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: Photo and Key Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card rounded-3xl shadow-card border border-border/50 overflow-hidden text-center p-8">
            <div className="relative mx-auto w-32 h-32 mb-6">
              <img 
                src={student.photo_url} 
                alt={student.full_name} 
                className="w-full h-full object-cover rounded-full border-4 border-primary/10"
              />
              <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2 rounded-full shadow-elegant border-2 border-white">
                <BadgeCheck className="h-4 w-4" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold">{student.full_name}</h2>
            <p className="text-sm text-muted-foreground mt-1 font-medium">{student.admission_number}</p>
            
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 rounded-full px-3 py-1">
                Class {student.class}-{student.section}
              </Badge>
              <Badge 
                className={cn(
                  "rounded-full px-3 py-1 font-medium",
                  student.status === 'Active' 
                    ? "bg-green-100 text-green-700 hover:bg-green-100" 
                    : "bg-muted text-muted-foreground hover:bg-muted"
                )}
              >
                {student.status}
              </Badge>
            </div>
          </div>

          <div className="bg-card p-6 rounded-3xl shadow-card border border-border/50 space-y-4">
            <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-2">
              <Building2 className="h-3 w-3" /> Campus
            </h3>
            <p className="font-semibold text-sm">{student.branch_name}</p>
            
            <div className="h-px bg-border/50 my-4" />
            
            <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-2">
              <Calendar className="h-3 w-3" /> Date of Birth
            </h3>
            <p className="font-semibold text-sm">{new Date(student.date_of_birth).toLocaleDateString()}</p>
            
            <div className="h-px bg-border/50 my-4" />

            <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-2">
              <User className="h-3 w-3" /> Gender
            </h3>
            <p className="font-semibold text-sm">{student.gender}</p>
          </div>
        </div>

        {/* Main Content: Tabs/Details */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-card p-8 rounded-3xl shadow-card border border-border/50 space-y-8">
            <div className="flex items-center gap-3 border-b pb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Guardian Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Parent/Guardian Name</p>
                  <p className="font-medium">{student.parent_name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Mobile Number</p>
                    <p className="text-sm font-medium">{student.mobile_number}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Email Address</p>
                    <p className="text-sm font-medium">{student.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-primary shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Home Address</p>
                    <p className="text-sm font-medium">{student.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card p-8 rounded-3xl shadow-card border border-border/50">
             <div className="flex items-center gap-3 border-b pb-4 mb-6">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Registration Details</h3>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-8">
              <div className="flex-1 space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Enrolled On</p>
                <p className="text-xl font-display font-bold text-primary">
                  {new Date(student.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Profile Status</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="font-semibold text-green-600">Active Record</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
