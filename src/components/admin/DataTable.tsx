import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Search,
  Plus,
  Users2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onSearch?: (term: string) => void;
  onAddClick?: () => void;
  isLoading?: boolean;
  emptyMessage?: string;
  extraFilters?: React.ReactNode;
  hideHeader?: boolean;
}

export function DataTable<T>({ 
  columns, 
  data, 
  onSearch, 
  onAddClick,
  isLoading,
  emptyMessage = "No results found.",
  extraFilters,
  hideHeader = false
}: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      {!hideHeader && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="pl-10 bg-card rounded-xl h-10 border-border/50"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {extraFilters}
            {onAddClick && (
              <Button onClick={onAddClick} size="sm" className="gap-2 h-10 px-4 rounded-xl shadow-elegant font-bold transition-all hover:scale-[1.02]">
                <Plus className="h-4 w-4" />
                Add New
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-2xl border border-border/50 bg-card overflow-hidden shadow-card">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-border/50">
              {columns.map((column, index) => (
                <TableHead key={index} className="h-12 font-bold text-foreground py-4">
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-border/40">
                  {columns.map((_, j) => (
                    <TableCell key={j} className="py-4">
                      <div className="h-4 w-full bg-muted/50 animate-pulse rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length > 0 ? (
              data.map((item, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-muted/20 border-border/40 transition-colors">
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} className="py-4">
                      {column.cell ? column.cell(item) : (item[column.accessorKey as keyof T] as React.ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground font-medium">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card border border-border/50 rounded-2xl p-4 space-y-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-muted/50" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-3/4 bg-muted/50 rounded" />
                  <div className="h-3 w-1/2 bg-muted/50 rounded" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="h-8 bg-muted/50 rounded-lg" />
                <div className="h-8 bg-muted/50 rounded-lg" />
              </div>
            </div>
          ))
        ) : data.length > 0 ? (
          data.map((item: any, index) => (
            <div key={index} className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm active:scale-[0.98] transition-transform">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {item.photo_url ? (
                    <img src={item.photo_url} alt="" className="h-12 w-12 rounded-full object-cover border-2 border-primary/10" />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center">
                      <Users2 className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-foreground leading-tight">{item.full_name}</h4>
                    <p className="text-xs text-muted-foreground">{item.admission_number || 'No ADM'}</p>
                  </div>
                </div>
                
                {/* Actions inside card */}
                <div className="flex items-center gap-1">
                  {columns.find(c => c.accessorKey === 'actions')?.cell?.(item)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 py-3 border-y border-border/50 my-3 text-sm">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">Class</span>
                  <p className="font-medium">{item.class} - {item.section}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">Branch</span>
                  <p className="font-medium truncate">{item.branch_name}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {columns.find(c => c.accessorKey === 'status')?.cell?.(item)}
                </div>
                <p className="text-xs font-medium text-muted-foreground">{item.mobile_number}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-card border border-border/50 rounded-2xl p-12 text-center text-muted-foreground">
            {emptyMessage}
          </div>
        )}
      </div>

      {/* Pagination Placeholder */}
      <div className="flex items-center justify-between px-2 py-4">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{data.length}</span> results
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" disabled>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" disabled>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" disabled>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" disabled>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
