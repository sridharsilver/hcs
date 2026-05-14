import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/admin/Sidebar';
import { Navbar } from '../components/admin/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar for desktop */}
      <div className="hidden lg:block transition-all duration-300">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Sidebar for mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed left-0 top-0 h-screen w-[280px] z-[70] lg:hidden"
            >
              <Sidebar collapsed={false} setCollapsed={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main 
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300",
          collapsed ? "lg:pl-[88px]" : "lg:pl-[280px]"
        )}
      >
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        
        <div className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
};
