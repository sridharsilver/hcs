import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  stats?: {
    label: string;
    value: string | number;
    icon?: LucideIcon;
  };
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  className?: string;
}

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  title,
  description,
  icon: Icon,
  stats,
  action,
  className
}) => {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8", className)}>
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">{title}</h1>
        </div>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      
      <div className="flex items-center gap-4">
        {stats && (
          <div className="bg-primary/5 px-4 py-3 rounded-2xl flex items-center gap-3 border border-primary/10 shadow-sm">
            {stats.icon && (
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-elegant">
                <stats.icon className="h-5 w-5" />
              </div>
            )}
            <div>
              <div className="text-2xl font-bold leading-none">{stats.value}</div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{stats.label}</div>
            </div>
          </div>
        )}

        {action && (
          <Button 
            onClick={action.onClick} 
            size="lg" 
            className="gap-2 px-6 rounded-xl shadow-elegant font-bold transition-all hover:scale-[1.02] whitespace-nowrap h-12"
          >
            {action.icon ? <action.icon className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
};
