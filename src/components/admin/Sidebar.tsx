import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MapPin, 
  Users, 
  GraduationCap, 
  Image as ImageIcon, 
  Settings,
  ChevronLeft,
  LogOut,
  User,
  Shield,
  IndianRupee,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import hcsLogo from "@/assets/HCS-Logo-final.png";


const navigationGroups = [
  {
    title: 'Overview',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    ]
  },
  {
    title: 'Management',
    items: [
      { icon: MapPin, label: 'Branches', path: '/admin/branches' },
      { icon: GraduationCap, label: 'Students', path: '/admin/students' },
      { icon: Users, label: 'Teachers', path: '/admin/teachers' },
      { icon: IndianRupee, label: 'Fees', path: '/admin/fees' },
      { icon: MessageSquare, label: 'Enquiries', path: '/admin/enquiries' },
    ]
  },
  {
    title: 'Content',
    items: [
      { icon: ImageIcon, label: 'Gallery', path: '/admin/gallery' },
    ]
  },
  {
    title: 'System',
    items: [
      { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ]
  }
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const [pendingCount, setPendingCount] = React.useState<number>(0);

  React.useEffect(() => {
    const fetchPendingCount = async () => {
      const { count, error } = await supabase
        .from('enquiries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Pending');
      
      if (!error && count !== null) {
        setPendingCount(count);
      }
    };

    fetchPendingCount();

    // Subscribe to changes
    const channel = supabase
      .channel('enquiries_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'enquiries' }, () => {
        fetchPendingCount();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (

    <motion.aside
      initial={false}
      animate={{ 
        width: collapsed ? '88px' : '280px',
      }}
      className={cn(
        "fixed left-0 top-0 h-screen text-primary-foreground z-50 overflow-hidden border-r border-white/10 shadow-2xl transition-all duration-500 ease-in-out",
        "gradient-primary"
      )}
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-glow/5 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none" />

      <div className="flex flex-col h-full relative z-10">
        {/* Logo Section */}
        <div className="h-24 flex items-center px-6 mb-4">
          <NavLink to="/admin/dashboard" className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-accent to-primary-glow rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative h-12 w-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                <img src={hcsLogo} alt="HCS" className="h-8 w-8 object-contain" />
              </div>
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <h1 className="font-display font-bold text-lg leading-none tracking-tight">
                    HCS <span className="text-accent">Admin</span>
                  </h1>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-primary-foreground/40 mt-1 font-bold">
                    Command Center
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </NavLink>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-8 overflow-y-auto scrollbar-hide py-4">
          {navigationGroups.map((group, groupIdx) => (
            <div key={group.title} className="space-y-3">
              {!collapsed && (
                <motion.h3 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-4 text-[10px] font-bold uppercase tracking-[0.15em] text-primary-foreground/30"
                >
                  {group.title}
                </motion.h3>
              )}
              <div className="space-y-1.5">
                {group.items.map((item, itemIdx) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => cn(
                      "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                      isActive 
                        ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/10" 
                        : "hover:bg-white/5 text-primary-foreground/50 hover:text-primary-foreground"
                    )}
                  >
                    {({ isActive }) => (
                      <>
                        {/* Active Indicator Line */}
                        <div className={cn(
                          "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-r-full transition-all duration-300",
                          isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
                        )} />
                        
                        <item.icon className={cn(
                          "h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110",
                          isActive && "text-accent"
                        )} />
                        
                        {!collapsed && (
                          <div className="flex items-center justify-between flex-1">
                            <motion.span
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="font-medium text-sm tracking-wide"
                            >
                              {item.label}
                            </motion.span>
                            
                            {item.label === 'Enquiries' && pendingCount > 0 && (
                              <Badge className="bg-accent text-accent-foreground border-none h-5 px-1.5 min-w-[20px] flex items-center justify-center text-[10px] font-bold rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                {pendingCount}
                              </Badge>
                            )}
                          </div>
                        )}


                        {/* Tooltip for Collapsed state */}
                        {collapsed && (
                          <div className="fixed left-[100px] px-3 py-2 bg-[#0d1b2e] border border-white/10 text-white text-xs font-medium rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 shadow-2xl z-[100] flex items-center gap-2">
                            {item.label}
                            {item.label === 'Enquiries' && pendingCount > 0 && (
                              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                            )}
                          </div>
                        )}

                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 mt-auto">
          <div className={cn(
            "rounded-2xl bg-white/5 border border-white/10 p-3 transition-all duration-300 overflow-hidden",
            collapsed ? "items-center" : "space-y-3"
          )}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent/20 border border-accent/20 flex items-center justify-center shrink-0">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">System Admin</p>
                  <p className="text-[10px] text-primary-foreground/40 font-medium">HCS-HQ-01</p>
                </div>
              )}
            </div>
            
            {!collapsed && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                <button className="flex items-center justify-center gap-2 p-2 rounded-xl hover:bg-white/5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground/60 hover:text-white transition-colors">
                  <User className="h-3 w-3" /> Profile
                </button>
                <button className="flex items-center justify-center gap-2 p-2 rounded-xl hover:bg-destructive/10 text-[10px] font-bold uppercase tracking-wider text-destructive/70 hover:text-destructive transition-colors">
                  <LogOut className="h-3 w-3" /> Exit
                </button>
              </div>
            )}
          </div>

          {/* Collapse Toggle Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full mt-4 flex items-center justify-center h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
          >
            <ChevronLeft className={cn(
              "h-5 w-5 text-primary-foreground/40 group-hover:text-primary-foreground transition-all duration-500",
              collapsed && "rotate-180"
            )} />
          </button>
        </div>
      </div>
    </motion.aside>
  );
};
