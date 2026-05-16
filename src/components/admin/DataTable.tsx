import React, { useState } from 'react';
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
  MoreVertical,
  LayoutGrid,
  List
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
  hideOnMobile?: boolean;
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
  viewMode?: 'list' | 'grid';
  onViewModeChange?: (mode: 'list' | 'grid') => void;
}

export function DataTable<T>({ 
  columns, 
  data, 
  onSearch, 
  onAddClick,
  isLoading,
  emptyMessage = "No results found.",
  extraFilters,
  hideHeader = false,
  viewMode: externalViewMode,
  onViewModeChange
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [internalViewMode, setInternalViewMode] = useState<'list' | 'grid'>('list');

  const viewMode = externalViewMode || internalViewMode;
  const setViewMode = onViewModeChange || setInternalViewMode;

  // Pagination logic
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(startIndex, startIndex + pageSize);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="space-y-6">
      {!hideHeader && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search record..." 
                className="pl-10 bg-card rounded-2xl h-11 border-border/50 shadow-sm focus:ring-primary/20 transition-all focus:h-12"
                onChange={(e) => {
                  onSearch?.(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            
            {/* View Toggle */}
            <div className="hidden sm:flex items-center bg-muted/30 p-1.5 rounded-2xl border border-border/50 shadow-inner">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('list')}
                className={cn(
                  "h-8 w-10 p-0 rounded-xl transition-all duration-300",
                  viewMode === 'list' ? "bg-white text-primary shadow-elegant" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={cn(
                  "h-8 w-10 p-0 rounded-xl transition-all duration-300",
                  viewMode === 'grid' ? "bg-white text-primary shadow-elegant" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {extraFilters}
            {onAddClick && (
              <Button onClick={onAddClick} size="sm" className="gap-2 h-11 px-6 rounded-2xl shadow-elegant font-bold shrink-0 hover:scale-105 active:scale-95 transition-all">
                <Plus className="h-4 w-4" />
                Add New
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area with Animation */}
      <div className="relative min-h-[400px]">
        {isLoading && (
          <div className="absolute inset-0 z-20 bg-background/5 backdrop-blur-[2px] flex items-center justify-center rounded-3xl">
            <div className="bg-card/90 backdrop-blur-md p-6 rounded-[2.5rem] shadow-2xl border border-white/20 flex flex-col items-center gap-4">
              <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <span className="text-sm font-bold text-foreground/80 tracking-tight">Updating database...</span>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="rounded-[2rem] border border-border/50 bg-card overflow-hidden shadow-elegant"
            >
              {/* Desktop View: Traditional Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/20">
                    <TableRow className="hover:bg-transparent border-border/40">
                      {columns.map((column, index) => (
                        <TableHead key={index} className="h-14 font-bold text-foreground/60 py-4 px-8 text-[10px] uppercase tracking-[0.2em]">
                          {column.header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((item, rowIndex) => (
                        <TableRow key={rowIndex} className="hover:bg-muted/10 border-border/30 transition-colors group">
                          {columns.map((column, colIndex) => (
                            <TableCell key={colIndex} className="py-5 px-8 transition-all group-hover:translate-x-1">
                              {column.cell ? column.cell(item) : (item[column.accessorKey as keyof T] as React.ReactNode)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : !isLoading && (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-64 text-center">
                          <div className="flex flex-col items-center justify-center gap-4 opacity-40">
                            <Search className="h-12 w-12" />
                            <p className="text-lg font-medium italic">{emptyMessage}</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile View: Optimized List */}
              <div className="md:hidden divide-y divide-border/20">
                {paginatedData.length > 0 ? (
                  paginatedData.map((item: any, index) => (
                    <div 
                      key={index} 
                      className="p-6 bg-card active:bg-primary/5 transition-all active:scale-[0.97] relative group"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex-1 min-w-0">
                          {columns[0].cell ? columns[0].cell(item) : (
                            <div className="font-bold text-lg text-foreground truncate">
                              {typeof item[columns[0].accessorKey as keyof T] === 'object' 
                                ? JSON.stringify(item[columns[0].accessorKey as keyof T]) 
                                : String(item[columns[0].accessorKey as keyof T] || '')}
                            </div>
                          )}
                        </div>
                        <div className="shrink-0 ml-4">
                          {columns[columns.length - 1].cell ? columns[columns.length - 1].cell(item) : (
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-muted/40 text-muted-foreground">
                              <MoreVertical className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-y-5 gap-x-6">
                        {columns.slice(1, -1).map((col, idx) => (
                          !col.hideOnMobile && (
                            <div key={idx} className="space-y-1.5">
                              <span className="text-[9px] uppercase font-bold text-muted-foreground/40 tracking-[0.15em] block">
                                {col.header}
                              </span>
                              <div className="text-sm font-bold text-foreground/80 truncate leading-none">
                                {col.cell ? col.cell(item) : (
                                  typeof item[col.accessorKey as keyof T] === 'object'
                                    ? '---'
                                    : String(item[col.accessorKey as keyof T] || '')
                                )}
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  ))
                ) : !isLoading && (
                  <div className="p-20 text-center space-y-4">
                    <div className="h-20 w-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Search className="h-10 w-10 text-muted-foreground/20" />
                    </div>
                    <p className="text-muted-foreground font-medium italic">{emptyMessage}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            /* Grid View: Information Cards */
            <motion.div
              key="grid"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {paginatedData.length > 0 ? (
                paginatedData.map((item: any, index) => (
                  <div 
                    key={index} 
                    className="group rounded-[2.5rem] border border-border/50 bg-card p-7 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 relative overflow-hidden flex flex-col"
                  >
                    {/* Card Decoration */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-700 blur-3xl opacity-50" />

                    <div className="relative flex-1 space-y-8">
                      {/* Card Header */}
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          {columns[0].cell ? columns[0].cell(item) : (
                            <div className="font-bold text-xl text-foreground tracking-tight truncate">
                              {typeof item[columns[0].accessorKey as keyof T] === 'object'
                                ? '---'
                                : String(item[columns[0].accessorKey as keyof T] || '')}
                            </div>
                          )}
                        </div>
                        <div className="shrink-0 ml-4 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 delay-75">
                          {columns[columns.length - 1].cell ? columns[columns.length - 1].cell(item) : (
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-white/80 shadow-lg border-white/20 backdrop-blur-md">
                              <MoreVertical className="h-5 w-5" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="grid grid-cols-2 gap-y-6 gap-x-4 pt-6 border-t border-border/20">
                        {columns.slice(1, -1).map((col, idx) => (
                          <div key={idx} className="space-y-2">
                            <span className="text-[9px] uppercase font-bold text-muted-foreground/30 tracking-[0.2em] block">
                              {col.header}
                            </span>
                            <div className="text-[13px] font-bold text-foreground/80 leading-tight">
                              {col.cell ? col.cell(item) : (
                                typeof item[col.accessorKey as keyof T] === 'object'
                                  ? '---'
                                  : String(item[col.accessorKey as keyof T] || '')
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer Visual Cue */}
                    <div className="mt-8 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-300">
                      <span className="text-[10px] font-bold uppercase tracking-widest">View Details</span>
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </div>
                ))
              ) : !isLoading && (
                <div className="col-span-full bg-card rounded-[3rem] border border-border/50 p-24 text-center shadow-card">
                  <div className="h-24 w-24 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Search className="h-12 w-12 text-muted-foreground/10" />
                  </div>
                  <p className="text-muted-foreground text-xl font-medium italic">{emptyMessage}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-8 px-2 py-8 mt-12 border-t border-border/20">
        <div className="flex items-center gap-5 order-2 sm:order-1 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-3 bg-muted/20 px-4 py-2.5 rounded-[1.25rem] border border-border/30">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/40">Per Page</span>
            <Select 
              value={pageSize.toString()} 
              onValueChange={(val) => {
                setPageSize(parseInt(val));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-6 w-14 rounded-lg bg-transparent border-none p-0 focus:ring-0 shadow-none font-bold text-sm text-foreground/70">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl shadow-2xl border-border/50 p-1">
                {[5, 10, 20, 50].map(size => (
                  <SelectItem key={size} value={size.toString()} className="rounded-xl py-2 font-bold focus:bg-primary/5 focus:text-primary">
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30">
            {data.length} total entries
          </span>
        </div>

        <div className="flex items-center gap-3 order-1 sm:order-2">
          <div className="flex items-center gap-1.5">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 rounded-2xl border-border/50 bg-card active:scale-90 hover:bg-primary/5 hover:text-primary transition-all shadow-sm disabled:opacity-20"
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 rounded-2xl border-border/50 bg-card active:scale-90 hover:bg-primary/5 hover:text-primary transition-all shadow-sm disabled:opacity-20"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center px-6 h-12 bg-white shadow-elegant rounded-2xl border border-border/30 min-w-[100px] justify-center">
            <span className="text-sm font-bold tabular-nums tracking-tighter">
              {currentPage} <span className="text-muted-foreground/20 mx-2 text-lg font-light">/</span> {totalPages || 1}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 rounded-2xl border-border/50 bg-card active:scale-90 hover:bg-primary/5 hover:text-primary transition-all shadow-sm disabled:opacity-20"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-12 w-12 rounded-2xl border-border/50 bg-card active:scale-90 hover:bg-primary/5 hover:text-primary transition-all shadow-sm disabled:opacity-20"
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
