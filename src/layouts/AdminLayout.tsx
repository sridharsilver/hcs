import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/admin/Sidebar';
import { Navbar } from '../components/admin/Navbar';
import { cn } from '@/lib/utils';

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex overflow-x-hidden">
      {/* Sidebar for desktop */}
      <div className={cn(
        "hidden lg:block fixed left-0 top-0 h-screen z-50 bg-[#0a192f] transition-all duration-300",
        collapsed ? "w-[88px]" : "w-[280px]"
      )}>
        <Sidebar 
          collapsed={collapsed} 
          setCollapsed={setCollapsed} 
          isMobile={false} 
        />
      </div>

      {/* Sidebar for mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[999] lg:hidden flex">
          <div 
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="relative w-[280px] h-screen bg-[#0a192f] flex flex-col shadow-2xl border-r border-white/10">
            <Sidebar 
              collapsed={false} 
              setCollapsed={() => setMobileOpen(false)} 
              isMobile={true} 
            />
          </div>
        </div>
      )}

      <main 
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300 w-full",
          collapsed ? "lg:pl-[88px]" : "lg:pl-[280px]"
        )}
      >
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        
        <div className="flex-1 p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
