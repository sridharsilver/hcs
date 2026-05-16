import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Branch } from '@/types';
import { 
  ChevronLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Building2, 
  Users, 
  GraduationCap,
  Calendar,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ViewBranch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const { data, error } = await supabase
          .from('branches')
          .select(`
            *,
            students:students(count),
            teachers:teachers(count)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        
        const formattedBranch = {
          ...data,
          student_count: data.students?.[0]?.count || 0,
          teacher_count: data.teachers?.[0]?.count || 0
        };
        
        setBranch(formattedBranch as any);
      } catch (error) {
        console.error('Error:', error);
        navigate('/admin/settings?tab=campuses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranch();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading branch details...</p>
      </div>
    );
  }

  if (!branch) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/admin/settings?tab=campuses')}
          className="rounded-xl border-border shadow-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Branch Details</h1>
          <p className="text-muted-foreground mt-1">Detailed overview of {branch.name}.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image and Main Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-card rounded-3xl shadow-card border border-border/50 overflow-hidden">
            <div className="aspect-video relative">
              <img 
                src={branch.image_url} 
                alt={branch.name} 
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-primary hover:bg-white px-4 py-1.5 rounded-full">
                {branch.status}
              </Badge>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-display font-bold">{branch.name}</h2>
                <p className="text-muted-foreground flex items-center gap-2 mt-2">
                  <MapPin className="h-4 w-4" /> {branch.area}, {branch.city}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                  <GraduationCap className="h-5 w-5 text-primary mb-2" />
                  <div className="text-xl font-bold">{branch.student_count || 0}</div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">Students</div>
                </div>
                <div className="bg-accent/5 p-4 rounded-2xl border border-accent/10">
                  <Users className="h-5 w-5 text-accent mb-2" />
                  <div className="text-xl font-bold">{branch.teacher_count || 0}</div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">Teachers</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card p-8 rounded-3xl shadow-card border border-border/50 space-y-6">
            <h3 className="font-semibold flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" /> Contact Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                  <Phone className="h-4 w-4" />
                </div>
                <span>{branch.phone_number}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                  <Mail className="h-4 w-4" />
                </div>
                <span>{branch.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Principal and Detailed Sections */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-card p-8 rounded-3xl shadow-card border border-border/50">
             <div className="flex items-center gap-6">
               <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                 <Users className="h-10 w-10" />
               </div>
               <div>
                 <p className="text-xs uppercase font-bold text-primary tracking-widest mb-1">Principal</p>
                 <h3 className="text-2xl font-display font-bold">{branch.principal_name}</h3>
                 <p className="text-muted-foreground text-sm mt-1">Leading with excellence at {branch.name}</p>
               </div>
             </div>
           </div>

           <div className="bg-card p-8 rounded-3xl shadow-card border border-border/50 space-y-6">
              <h3 className="font-semibold text-lg border-b pb-4">Key Facilities</h3>
              <div className="flex flex-wrap gap-2">
                {branch.facilities?.map((f) => (
                  <Badge key={f} variant="outline" className="px-4 py-2 rounded-xl bg-muted/30 border-border/50 text-sm font-medium">
                    {f}
                  </Badge>
                ))}
                {(!branch.facilities || branch.facilities.length === 0) && (
                  <p className="text-sm text-muted-foreground italic">No facilities listed for this campus.</p>
                )}
              </div>
           </div>

           <div className="bg-card p-8 rounded-3xl shadow-card border border-border/50 space-y-6">
              <h3 className="font-semibold text-lg border-b pb-4">System & Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Established Year</p>
                      <p className="text-sm font-bold">{branch.established}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Last Updated</p>
                      <p className="text-sm font-medium">{new Date(branch.updated_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-muted/20 rounded-2xl border border-border/50">
                  <p className="text-xs uppercase font-bold text-muted-foreground mb-3 tracking-widest">Full Address</p>
                  <p className="text-sm leading-relaxed">
                    {branch.address}<br />
                    {branch.city}, {branch.state}<br />
                    PIN: {branch.pincode}
                  </p>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// Helper for Clock icon if lucide doesn't export it
const Clock = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
