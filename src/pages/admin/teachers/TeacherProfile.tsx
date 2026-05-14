import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Teacher } from '@/types';
import { 
  ChevronLeft, 
  User, 
  BookOpen, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Building2,
  Award,
  Clock,
  Briefcase,
  History,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const TeacherProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const { data, error } = await supabase
          .from('teachers')
          .select('*, branches(name)')
          .eq('id', id)
          .single();

        if (error) throw error;
        setTeacher({
          ...data,
          branch_name: data.branches?.name
        });
      } catch (error) {
        console.error('Error:', error);
        navigate('/admin/teachers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeacher();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading teacher profile...</p>
      </div>
    );
  }

  if (!teacher) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/admin/teachers')}
          className="rounded-xl border-border shadow-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Teacher Profile</h1>
          <p className="text-muted-foreground mt-1">Professional record for {teacher.full_name}.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: Photo and Key Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card rounded-3xl shadow-card border border-border/50 overflow-hidden text-center p-8">
            <div className="mx-auto w-32 h-32 mb-6">
              <img 
                src={teacher.photo_url} 
                alt={teacher.full_name} 
                className="w-full h-full object-cover rounded-2xl border-4 border-primary/10 shadow-elegant"
              />
            </div>
            
            <h2 className="text-xl font-bold">{teacher.full_name}</h2>
            <p className="text-sm text-muted-foreground mt-1 font-medium">{teacher.employee_id}</p>
            
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 rounded-full px-3 py-1">
                {teacher.subject}
              </Badge>
              <Badge 
                className={cn(
                  "rounded-full px-3 py-1 font-medium",
                  teacher.status === 'Active' 
                    ? "bg-green-100 text-green-700 hover:bg-green-100" 
                    : "bg-muted text-muted-foreground hover:bg-muted"
                )}
              >
                {teacher.status}
              </Badge>
            </div>
          </div>

          <div className="bg-card p-6 rounded-3xl shadow-card border border-border/50 space-y-4">
            <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-2">
              <Building2 className="h-3 w-3" /> Assigned Campus
            </h3>
            <p className="font-semibold text-sm">{teacher.branch_name}</p>
            
            <div className="h-px bg-border/50 my-4" />
            
            <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-2">
              <Briefcase className="h-3 w-3" /> Experience
            </h3>
            <p className="font-semibold text-sm">{teacher.experience}</p>
            
            <div className="h-px bg-border/50 my-4" />

            <h3 className="text-xs uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-2">
              <GraduationCap className="h-3 w-3" /> Qualification
            </h3>
            <p className="font-semibold text-sm">{teacher.qualification}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-card p-8 rounded-3xl shadow-card border border-border/50 space-y-6">
                <div className="flex items-center gap-3 border-b pb-4">
                  <Award className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Professional Details</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Expertise Subject</p>
                    <p className="text-lg font-semibold text-primary">{teacher.subject}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Academic Qualification</p>
                    <p className="font-medium">{teacher.qualification}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-primary">
                      <History className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Joining Date</p>
                      <p className="text-sm font-medium">{new Date(teacher.joining_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
             </div>

             <div className="bg-card p-8 rounded-3xl shadow-card border border-border/50 space-y-6">
                <div className="flex items-center gap-3 border-b pb-4">
                  <Mail className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-primary">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Mobile Number</p>
                      <p className="text-sm font-medium">{teacher.phone_number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Email Address</p>
                      <p className="text-sm font-medium">{teacher.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-primary shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Current Address</p>
                      <p className="text-sm font-medium leading-relaxed">{teacher.address}</p>
                    </div>
                  </div>
                </div>
             </div>
          </div>

          <div className="bg-card p-8 rounded-3xl shadow-card border border-border/50">
             <div className="flex items-center gap-3 border-b pb-4 mb-6">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Employment Summary</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Experience</p>
                <p className="text-2xl font-display font-bold text-foreground">{teacher.experience}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Employee Since</p>
                <p className="text-2xl font-display font-bold text-foreground">{new Date(teacher.joining_date).getFullYear()}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Profile Status</p>
                <Badge className="bg-green-500 hover:bg-green-600 rounded-full">ACTIVE</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
