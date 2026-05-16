import React from 'react';
import { cn } from '@/lib/utils';

interface AdminContentProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export const AdminContent: React.FC<AdminContentProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn("space-y-6 lg:space-y-8 pb-10", className)}>
      {children}
    </div>
  );
};
