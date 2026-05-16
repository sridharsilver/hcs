import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  className?: string;
  delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  className
}) => {
  return (
    <div
      className={cn(
        "bg-card p-6 rounded-2xl shadow-card border border-border/50 hover-lift relative overflow-hidden group",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold",
            trend.isUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          )}>
            <span>{trend.isUp ? '↑' : '↓'}</span>
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
      
      <div>
        <p className="text-muted-foreground text-sm font-medium mb-1 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-display font-bold text-foreground tracking-tight">{value}</h3>
      </div>

      <div className="absolute -right-4 -bottom-4 h-24 w-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-smooth"></div>
    </div>
  );
};
