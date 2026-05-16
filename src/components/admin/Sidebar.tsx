import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut } from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isMobile?: boolean;
}

export function Sidebar({ collapsed, setCollapsed, isMobile }: SidebarProps) {
  const { signOut } = useAuth();
  
  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { label: 'Students', path: '/admin/students', icon: '🎓' },
    { label: 'Teachers', path: '/admin/teachers', icon: '👥' },
    { label: 'Enquiries', path: '/admin/enquiries', icon: '💬' },
    { label: 'Gallery', path: '/admin/gallery', icon: '🖼️' },
    { label: 'Settings', path: '/admin/settings', icon: '⚙️' }
  ];

  return (
    <div className="h-full w-full bg-[#0a192f] text-white flex flex-col relative overflow-hidden border-r border-white/5">
      <div className="h-20 flex items-center justify-between px-6 shrink-0 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold">H</div>
          {(!collapsed || isMobile) && <span className="font-bold">HCS Admin</span>}
        </div>
        {isMobile && (
          <button onClick={() => setCollapsed(true)} className="p-2 text-white bg-white/5 rounded-lg">✕</button>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => isMobile && setCollapsed(true)}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all
              ${isActive ? "bg-white/10 text-white border border-white/10" : "text-white/50 hover:text-white hover:bg-white/5"}
            `}
          >
            <span className="text-lg">{item.icon}</span>
            {(!collapsed || isMobile) && <span className="font-medium text-sm">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-4">
        <button 
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut className="h-5 w-5" />
          {(!collapsed || isMobile) && <span className="font-medium text-sm">Sign Out</span>}
        </button>

        <div className="flex items-center gap-3 opacity-30 px-4">
          <span>🛡️</span>
          {(!collapsed || isMobile) && <span className="text-[10px] font-bold uppercase tracking-widest">Secured Panel</span>}
        </div>
      </div>
    </div>
  );
}
