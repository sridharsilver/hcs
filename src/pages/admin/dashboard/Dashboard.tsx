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
import { motion } from 'framer-motion';
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
        
        // Fetch stats counts
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

        // Fetch chart data (Students per branch)
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

        // Fetch recent admissions with branch names
        const { data: recentStudents } = await supabase
          .from('students')
          .select('*, branch:branches(name)')
          .order('created_at', { ascending: false })
          .limit(5);

        setRecentAdmissions(recentStudents || []);

        // Fetch recent enquiries
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
        <p className="text-muted-foreground font-medium">Powering up your command center...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10">
      {/* Premium Welcome Hero */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-primary/90 to-[#1e3a8a] p-8 lg:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] -ml-32 -mb-32" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/90 text-sm font-medium"
            >
              <Zap className="h-4 w-4 text-accent fill-accent/20" />
              <span>System Online • All Systems Nominal</span>
            </motion.div>
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-6xl font-display font-bold tracking-tight">
                {getGreeting()}, <span className="text-accent italic">Admin!</span>
              </h1>
              <p className="text-white/70 text-lg max-w-xl">
                The command center is updated with the latest data from all {stats.branches} campuses. Here's your overview for today.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-inner text-right min-w-[200px]">
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/50 mb-1">Current Date</div>
              <div className="text-3xl font-display font-bold">{format(new Date(), 'dd MMMM')}</div>
              <div className="text-sm text-white/60 mt-1">{format(new Date(), 'EEEE, yyyy')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Add Student', icon: GraduationCap, path: '/admin/students/add', color: 'bg-blue-500' },
          { label: 'New Enquiry', icon: MessageSquare, path: '/admin/enquiries', color: 'bg-amber-500' },
          { label: 'Process Fee', icon: IndianRupee, path: '/admin/fees', color: 'bg-emerald-500' },
          { label: 'Post Update', icon: Plus, path: '/admin/gallery/upload', color: 'bg-purple-500' }
        ].map((action, i) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="group relative flex flex-col items-center justify-center p-6 rounded-3xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-elegant"
          >
            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg mb-3 transition-transform group-hover:scale-110", action.color)}>
              <action.icon className="h-6 w-6" />
            </div>
            <span className="font-bold text-sm text-foreground/80 group-hover:text-primary transition-colors">{action.label}</span>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="h-4 w-4 text-primary" />
            </div>
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Students" 
          value={stats.students.toLocaleString()} 
          icon={GraduationCap} 
          trend={{ value: 12, isUp: true }}
          delay={0.1}
        />
        <StatCard 
          title="Staff Count" 
          value={stats.teachers.toString()} 
          icon={Users} 
          trend={{ value: 4, isUp: true }}
          delay={0.2}
        />
        <StatCard 
          title="Enquiries" 
          value={stats.enquiries.toString()} 
          icon={MessageSquare} 
          trend={{ value: 24, isUp: true }}
          className="border-amber-500/20"
          delay={0.3}
        />
        <StatCard 
          title="Gallery Items" 
          value={stats.gallery.toLocaleString()} 
          icon={ImageIcon} 
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-card p-8 rounded-3xl shadow-card border border-border/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32" />
          
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div>
              <h3 className="text-xl font-display font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Enrollment Overview
              </h3>
              <p className="text-sm text-muted-foreground">Student distribution across all school campuses</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Primary</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-accent" />
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Campus B</span>
              </div>
            </div>
          </div>
          
          <div className="h-[350px] w-full relative z-10">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} 
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 11 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white/90 backdrop-blur-md border border-border/50 p-4 rounded-2xl shadow-elegant">
                            <p className="text-[10px] uppercase font-bold text-primary mb-1">{payload[0].payload.name}</p>
                            <p className="text-2xl font-bold text-foreground">{payload[0].value} <span className="text-sm font-medium text-muted-foreground">Students</span></p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="students" radius={[8, 8, 0, 0]} barSize={45}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "url(#barGradient)" : "var(--accent)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground italic">
                No branch data available for chart.
              </div>
            )}
          </div>
        </div>

        {/* Intelligence Feeds */}
        <div className="space-y-8">
          {/* Recent Admissions */}
          <div className="bg-card p-6 rounded-3xl shadow-card border border-border/50 overflow-hidden relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Admissions
              </h3>
              <Link to="/admin/students" className="text-[10px] font-bold uppercase text-primary hover:underline underline-offset-4 flex items-center gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-5">
              {recentAdmissions.length > 0 ? (
                recentAdmissions.map((student) => (
                  <div key={student.id} className="flex items-center gap-4 group cursor-pointer hover:bg-muted/30 p-2 -mx-2 rounded-2xl transition-colors">
                    <div className="h-10 w-10 rounded-xl overflow-hidden border border-border bg-muted shrink-0">
                      {student.photo_url ? (
                        <img src={student.photo_url} alt={student.full_name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                          <Users className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold truncate group-hover:text-primary transition-colors">{student.full_name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="secondary" className="h-4 px-1.5 text-[9px] font-bold bg-primary/5 text-primary border-none">Grade {student.class}</Badge>
                        <span className="text-[10px] text-muted-foreground font-medium">• {student.branch?.name.replace('HCS ', '') || 'Campus'}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground italic text-xs">No recent data.</div>
              )}
            </div>
          </div>

          {/* Pending Enquiries */}
          <div className="bg-card p-6 rounded-3xl shadow-card border border-border/50 overflow-hidden relative">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2 text-amber-600">
                <MessageSquare className="h-5 w-5" />
                Live Enquiries
              </h3>
              <Link to="/admin/enquiries" className="text-[10px] font-bold uppercase text-amber-600 hover:underline underline-offset-4 flex items-center gap-1">
                Management <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-5">
              {recentEnquiries.length > 0 ? (
                recentEnquiries.map((enquiry) => (
                  <div key={enquiry.id} className="flex items-center gap-4 group cursor-pointer hover:bg-amber-50/30 p-2 -mx-2 rounded-2xl transition-colors">
                    <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold truncate">{enquiry.parent_name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">{enquiry.grade === 'General' ? 'General' : `Grade ${enquiry.grade}`}</span>
                        <span className="text-[10px] text-muted-foreground font-medium">• {format(new Date(enquiry.created_at), 'MMM dd')}</span>
                      </div>
                    </div>
                    {enquiry.status === 'Pending' && (
                      <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground italic text-xs">No pending enquiries.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

