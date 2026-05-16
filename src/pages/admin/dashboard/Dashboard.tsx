import React, { useEffect, useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  MapPin, 
  Image as ImageIcon,
  TrendingUp,
  Clock,
  ArrowRight,
  Loader2,
  Plus,
  MessageSquare,
  IndianRupee,
  Search,
  Calendar,
  Zap,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { StatCard } from '@/components/ui/StatCard';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { supabase } from '@/lib/supabase';
import { Student } from '@/types';
import { toast } from 'sonner';
import { AdminContent } from '@/components/admin/AdminContent';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    branches: 0,
    students: 0,
    teachers: 0,
    gallery: 0,
    enquiries: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [recentAdmissions, setRecentAdmissions] = useState<Student[]>([]);
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [branchesCount, studentsCount, teachersCount, galleryCount, enquiriesCount] = await Promise.all([
          supabase.from('branches').select('*', { count: 'exact', head: true }),
          supabase.from('students').select('*', { count: 'exact', head: true }),
          supabase.from('teachers').select('*', { count: 'exact', head: true }),
          supabase.from('gallery').select('*', { count: 'exact', head: true }),
          supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'Pending')
        ]);

        setStats({
          branches: branchesCount.count || 0,
          students: studentsCount.count || 0,
          teachers: teachersCount.count || 0,
          gallery: galleryCount.count || 0,
          enquiries: enquiriesCount.count || 0
        });

        const { data: branchesWithStudents } = await supabase
          .from('branches')
          .select(`
            name,
            students:students(count)
          `);

        if (branchesWithStudents) {
          const formattedChartData = branchesWithStudents.map(b => ({
            name: b.name.replace('HCS ', ''),
            students: b.students?.[0]?.count || 0
          }));
          setChartData(formattedChartData);
        }

        const { data: recentStudents } = await supabase
          .from('students')
          .select('*, branch:branches(name)')
          .order('created_at', { ascending: false })
          .limit(5);

        setRecentAdmissions(recentStudents || []);

        const { data: enquiries } = await supabase
          .from('enquiries')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        setRecentEnquiries(enquiries || []);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium text-sm">Loading Command Center...</p>
      </div>
    );
  }

  return (
    <AdminContent>
      {/* Welcome Hero - No Motion */}
      <section className="relative overflow-hidden rounded-2xl lg:rounded-[2rem] bg-gradient-to-br from-[#0a192f] to-[#112240] p-6 lg:p-10 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 text-[10px] font-medium">
              <Zap className="h-3 w-3 text-[#f59e0b]" />
              <span>{stats.branches} Active Campuses</span>
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl lg:text-5xl font-bold tracking-tight">
                {getGreeting()}, <span className="text-[#f59e0b]">Admin</span>
              </h1>
              <p className="text-white/60 text-sm lg:text-base max-w-xl">
                Quick overview of your school's current performance and metrics.
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 min-w-[160px]">
            <div className="text-[9px] uppercase tracking-wider text-white/30 mb-1">Today</div>
            <div className="text-xl font-bold">{format(new Date(), 'dd MMMM')}</div>
            <div className="text-[10px] text-white/50">{format(new Date(), 'EEEE')}</div>
          </div>
        </div>
      </section>

      {/* Quick Actions Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Add Student', icon: GraduationCap, path: '/admin/students/add', color: 'bg-blue-600' },
          { label: 'Enquiries', icon: MessageSquare, path: '/admin/enquiries', color: 'bg-amber-600' },
          { label: 'Post Update', icon: Plus, path: '/admin/gallery/upload', color: 'bg-purple-600' }
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-card border border-border/50 hover:bg-muted/50 transition-all active:scale-95 shadow-sm"
          >
            <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center text-white mb-2", action.color)}>
              <action.icon className="h-5 w-5" />
            </div>
            <span className="font-bold text-xs text-foreground/80 text-center">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <StatCard 
          title="Students" 
          value={stats.students.toLocaleString()} 
          icon={GraduationCap} 
          className="p-4"
        />
        <StatCard 
          title="Staff" 
          value={stats.teachers.toString()} 
          icon={Users} 
          className="p-4"
        />
        <StatCard 
          title="Enquiries" 
          value={stats.enquiries.toString()} 
          icon={MessageSquare} 
          className="border-amber-500/20 p-4"
        />
        <StatCard 
          title="Gallery" 
          value={stats.gallery.toLocaleString()} 
          icon={ImageIcon} 
          className="p-4"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-card p-5 lg:p-8 rounded-2xl shadow-card border border-border/50">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Enrollment
              </h3>
              <p className="text-xs text-muted-foreground">Per Campus distribution</p>
            </div>
          </div>
          
          <div className="h-[250px] lg:h-[300px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white border border-border/50 p-2 rounded shadow-lg text-xs">
                            <p className="font-bold">{payload[0].payload.name}</p>
                            <p className="text-primary">{payload[0].value} Students</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground italic text-sm">No data.</div>
            )}
          </div>
        </div>

        {/* Intelligence Feeds */}
        <div className="space-y-6">
          <div className="bg-card p-5 rounded-2xl shadow-card border border-border/50">
            <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-primary" />
              Admissions
            </h3>
            <div className="space-y-3">
              {recentAdmissions.map((student) => (
                <div key={student.id} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-[10px] font-bold">
                    {student.full_name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{student.full_name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">Grade {student.class}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card p-5 rounded-2xl shadow-card border border-border/50">
            <h3 className="text-sm font-bold flex items-center gap-2 mb-4 text-amber-600">
              <MessageSquare className="h-4 w-4" />
              Enquiries
            </h3>
            <div className="space-y-3">
              {recentEnquiries.map((enquiry) => (
                <div key={enquiry.id} className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-amber-50 flex items-center justify-center text-amber-600">
                    <MessageSquare className="h-3 w-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{enquiry.parent_name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{format(new Date(enquiry.created_at), 'MMM dd')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminContent>
  );
};
