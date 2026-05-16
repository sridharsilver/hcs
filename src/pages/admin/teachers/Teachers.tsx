import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { Teacher, Branch } from '@/types';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  User,
  Users,
  BookOpen,
  Building2,
  X,
  Search,
  Plus,
  Download,
  FileSpreadsheet,
  FileText,
  LayoutGrid,
  List,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { cn } from '@/lib/utils';
import { AdminContent } from '@/components/admin/AdminContent';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

export const Teachers: React.FC = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const { data: branchesData } = await supabase.from('branches').select('*');
      if (branchesData) setBranches(branchesData);

      const { data: teachersData, error: teachersError } = await supabase
        .from('teachers')
        .select(`
          *,
          branches ( name ),
          branch:branches ( name )
        `)
        .order('full_name', { ascending: true });

      if (teachersError) throw teachersError;

      const formattedData = (teachersData || []).map(t => {
        const bName = t.branches?.name || t.branch?.name || 'Unassigned';
        return {
          ...t,
          branch_name: bName
        };
      });

      setTeachers(formattedData);
    } catch (error: any) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to load teachers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      const { error } = await supabase.from('teachers').delete().eq('id', deleteId);
      if (error) throw error;
      toast.success('Teacher profile deleted');
      setTeachers(prev => prev.filter(t => t.id !== deleteId));
      setDeleteId(null);
    } catch (error: any) {
      toast.error('Failed to delete teacher');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredTeachers = teachers.filter(teacher => {
    const name = (teacher.full_name || '').toLowerCase();
    const eid = (teacher.employee_id || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    
    const matchesSearch = name.includes(search) || eid.includes(search);
    const matchesBranch = selectedBranch === 'All' || teacher.branch_name === selectedBranch;
    const matchesSubject = selectedSubject === 'All' || teacher.subject === selectedSubject;
    const matchesStatus = selectedStatus === 'All' || teacher.status === selectedStatus;

    return matchesSearch && matchesBranch && matchesSubject && matchesStatus;
  });

  const uniqueSubjects = Array.from(new Set(teachers.map(t => t.subject || 'Other'))).sort();
  const uniqueBranches = Array.from(new Map(branches.map(b => [b.name, b])).values());

  const handleExportCSV = () => {
    if (filteredTeachers.length === 0) {
      toast.error("No data to export");
      return;
    }
    const headers = ["Employee ID", "Full Name", "Subject", "Branch", "Email", "Phone", "Status"];
    const csvRows = [
      headers.join(","),
      ...filteredTeachers.map(t => [
        `"${t.employee_id}"`,
        `"${t.full_name}"`,
        `"${t.subject}"`,
        `"${t.branch_name}"`,
        `"${t.email}"`,
        `"${t.phone_number}"`,
        `"${t.status}"`
      ].join(","))
    ];
    const blob = new Blob([csvRows.join("\n")], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `HCS_Teachers_${selectedBranch}_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    toast.success("CSV Exported successfully");
  };

  const handleExportPDF = () => {
    if (filteredTeachers.length === 0) {
      toast.error("No data to export");
      return;
    }
    const doc = new jsPDF();
    doc.text("HCS Teachers Report", 14, 20);
    const tableColumn = ["ID", "Name", "Subject", "Branch", "Phone", "Status"];
    const tableRows = filteredTeachers.map(t => [
      t.employee_id, t.full_name, t.subject, t.branch_name, t.phone_number, t.status
    ]);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });
    doc.save(`HCS_Teachers_${selectedBranch}.pdf`);
    toast.success("PDF Exported successfully");
  };

  const columns = [
    {
      header: 'Teacher',
      accessorKey: 'full_name',
      cell: (teacher: any) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl overflow-hidden bg-muted border border-border/50">
            {teacher.photo_url ? (
              <img src={teacher.photo_url} alt={teacher.full_name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                <User className="h-5 w-5" />
              </div>
            )}
          </div>
          <div>
            <div className="font-semibold text-sm">{teacher.full_name || 'N/A'}</div>
            <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              {teacher.employee_id || 'NO-ID'}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Subject',
      accessorKey: 'subject',
      cell: (teacher: any) => (
        <Badge variant="outline" className="bg-primary/5 border-primary/10 text-primary rounded-lg py-1 px-3">
          <BookOpen className="h-3 w-3 mr-1.5" />
          {teacher.subject || 'General'}
        </Badge>
      )
    },
    {
      header: 'Branch',
      accessorKey: 'branch_name',
      cell: (teacher: any) => (
        <div className="flex flex-col">
          <div className="text-sm font-medium">{teacher.branch_name}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Campus</div>
        </div>
      )
    },
    {
      header: 'Contact',
      accessorKey: 'email',
      cell: (teacher: any) => (
        <div className="text-xs">
          <div className="font-medium text-foreground">{teacher.phone_number || 'N/A'}</div>
          <div className="text-muted-foreground mt-0.5">{teacher.email || 'N/A'}</div>
        </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (teacher: any) => (
        <Badge 
          className={cn(
            "rounded-full px-3 font-medium",
            teacher.status === 'Active' 
              ? "bg-green-100 text-green-700 hover:bg-green-100" 
              : "bg-muted text-muted-foreground hover:bg-muted"
          )}
        >
          {teacher.status || 'Active'}
        </Badge>
      )
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (teacher: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-elegant border-border/50 p-1">
            <DropdownMenuItem onClick={() => navigate(`/admin/teachers/profile/${teacher.id}`)} className="gap-2 cursor-pointer py-2 px-3 rounded-lg">
              <Eye className="h-4 w-4 text-muted-foreground" /> View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/admin/teachers/edit/${teacher.id}`)} className="gap-2 cursor-pointer py-2 px-3 rounded-lg">
              <Edit className="h-4 w-4 text-muted-foreground" /> Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeleteId(teacher.id)} className="gap-2 cursor-pointer py-2 px-3 rounded-lg text-destructive">
              <Trash2 className="h-4 w-4" /> Delete Teacher
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <AdminContent>
      <AdminPageHeader 
        title="Teachers"
        description="Manage faculty members across all branches."
        icon={Users}
        stats={{
          label: "Active Faculty",
          value: selectedBranch === 'All' ? teachers.length : teachers.filter(t => t.branch_name === selectedBranch).length,
          icon: Users
        }}
        action={{
          label: "Add Teacher",
          onClick: () => navigate('/admin/teachers/add'),
          icon: Plus
        }}
      />

      <Tabs defaultValue="All" className="w-full" onValueChange={setSelectedBranch}>
        <div className="space-y-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <TabsList className="bg-muted/50 p-1 rounded-2xl h-auto w-full grid grid-cols-2 sm:grid-cols-4 md:flex md:w-auto gap-1">
              <TabsTrigger 
                value="All" 
                className="rounded-xl px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-elegant transition-all w-full"
              >
                <div className="flex items-center justify-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="truncate">All Campuses</span>
                  <Badge variant="secondary" className="hidden xs:inline-flex bg-primary/10 text-primary border-none">{teachers.length}</Badge>
                </div>
              </TabsTrigger>
              {uniqueBranches.map(branch => (
                <TabsTrigger 
                  key={branch.id} 
                  value={branch.name}
                  className="rounded-xl px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-elegant transition-all w-full"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span className="truncate">{branch.name.replace('HCS ', '')}</span>
                    <Badge variant="secondary" className="hidden xs:inline-flex bg-muted text-muted-foreground border-none">
                      {teachers.filter(t => t.branch_name === branch.name).length}
                    </Badge>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-card/50 p-2 rounded-2xl border border-border/40">
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search teachers..." 
                className="pl-10 bg-background rounded-xl h-10 border-border/50 focus-visible:ring-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="h-10 bg-background rounded-xl border-border/50 flex-1 lg:w-[140px] lg:flex-none">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-elegant">
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="h-10 bg-background rounded-xl border-border/50 flex-1 lg:w-[140px] lg:flex-none">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-elegant">
                  <SelectItem value="All">All Subjects</SelectItem>
                  {uniqueSubjects.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                variant="ghost" 
                onClick={() => { 
                  setSelectedBranch('All'); 
                  setSelectedSubject('All'); 
                  setSelectedStatus('All');
                  setSearchTerm(''); 
                }}
                className="h-10 gap-2 text-muted-foreground hover:text-primary rounded-xl border border-border/50 bg-background px-4 flex-1 lg:flex-none"
              >
                <X className="h-4 w-4" />
                <span>Reset all</span>
              </Button>
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto lg:ml-auto">
              {/* View Toggle */}
              <div className="flex items-center bg-muted/30 p-1 rounded-xl border border-border/50 shadow-sm mr-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "h-8 w-8 p-0 rounded-lg transition-all",
                    viewMode === 'list' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:bg-white/50"
                  )}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "h-8 w-8 p-0 rounded-lg transition-all",
                    viewMode === 'grid' ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:bg-white/50"
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-10 gap-2 rounded-xl border-border/50 bg-background px-4 flex-1 lg:flex-none">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-elegant p-1">
                  <DropdownMenuItem onClick={handleExportCSV} className="rounded-lg gap-2 cursor-pointer">
                    <FileSpreadsheet className="h-4 w-4 text-green-600" />
                    <span>Export CSV (Excel)</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportPDF} className="rounded-lg gap-2 cursor-pointer text-red-600">
                    <FileText className="h-4 w-4" />
                    <span>Download PDF</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <DataTable 
          columns={columns} 
          data={filteredTeachers} 
          isLoading={isLoading}
          hideHeader={true}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </Tabs>

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Teacher Profile"
        description="Are you sure you want to delete this teacher's profile?"
      />
    </AdminContent>
  );
};
