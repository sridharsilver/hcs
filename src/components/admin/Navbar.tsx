import React from 'react';
import { Bell, Search, User, Menu, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [pendingEnquiries, setPendingEnquiries] = React.useState<any[]>([]);
  const [pendingCount, setPendingCount] = React.useState(0);

  const fetchEnquiries = async () => {
    const { data, count } = await supabase
      .from('enquiries')
      .select('*', { count: 'exact' })
      .eq('status', 'Pending')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (data) setPendingEnquiries(data);
    if (count !== null) setPendingCount(count);
  };

  React.useEffect(() => {
    fetchEnquiries();

    const channel = supabase
      .channel('navbar_enquiries')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'enquiries' }, () => {
        fetchEnquiries();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-40 px-6">
      <div className="h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="relative hidden md:flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2 bg-muted/50 border-none rounded-full w-64 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-muted rounded-full transition-all relative group">
                <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                {pendingCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 min-w-[16px] px-1 bg-destructive text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center animate-in zoom-in duration-300">
                    {pendingCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-border/50 p-0 overflow-hidden">
              <div className="bg-primary/5 p-4 flex items-center justify-between">
                <DropdownMenuLabel className="p-0 font-display font-bold text-base">Notifications</DropdownMenuLabel>
                {pendingCount > 0 && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold">
                    {pendingCount} New
                  </Badge>
                )}
              </div>
              <DropdownMenuSeparator className="m-0" />
              <div className="max-h-[350px] overflow-y-auto py-2">
                {pendingEnquiries.length > 0 ? (
                  pendingEnquiries.map((enquiry) => (
                    <Link 
                      key={enquiry.id} 
                      to="/admin/enquiries"
                      className="flex gap-3 p-4 hover:bg-muted/50 cursor-pointer border-b border-border/5 last:border-0 transition-colors"
                    >
                      <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col gap-1 min-w-0 text-left">
                        <p className="text-sm font-bold text-foreground truncate">New Enquiry: {enquiry.parent_name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{enquiry.grade === 'General' ? 'General Inquiry' : `Admission for ${enquiry.grade}`}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium mt-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(enquiry.created_at), 'MMM dd, hh:mm a')}
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <div className="h-12 w-12 rounded-2xl bg-muted mx-auto mb-3 flex items-center justify-center text-muted-foreground/30">
                      <Bell className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">No new notifications</p>
                  </div>
                )}
              </div>
              <DropdownMenuSeparator className="m-0" />
              <Link 
                to="/admin/enquiries"
                className="flex items-center justify-center gap-2 w-full p-3 text-center text-xs font-bold text-primary hover:bg-primary/5 transition-colors"
              >
                View all enquiries
                <ArrowRight className="h-3 w-3" />
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="h-8 w-px bg-border mx-2"></div>
          
          <button className="flex items-center gap-3 hover:bg-muted p-1.5 rounded-full transition-colors">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-semibold">Admin User</span>
              <span className="text-xs text-muted-foreground">Super Admin</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <User className="h-5 w-5" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
