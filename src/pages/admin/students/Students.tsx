import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { Student } from '@/types';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  User,
  GraduationCap,
  Calendar,
  Phone,
  Building2,
  Users2,
  X,
  Download,
  FileText,
  FileSpreadsheet,
  LayoutGrid,
  List,
  Search,
  Plus
} from 'lucide-react';
import { Input } from '@/components/ui/input';
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AdminContent } from '@/components/admin/AdminContent';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

export const Students: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [branches, setBranches] = useState<{id: string, name: string}[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [studentsRes, branchesRes] = await Promise.all([
        supabase.from('students').select('*, branches(name)').order('created_at', { ascending: false }),
        supabase.from('branches').select('id, name').order('name')
      ]);

      if (studentsRes.error) throw studentsRes.error;
      if (branchesRes.error) throw branchesRes.error;
      
      const formattedData = studentsRes.data?.map(student => ({
        ...student,
        branch_name: student.branches?.name
      }));
      
      setStudents(formattedData || []);
      setBranches(branchesRes.data || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;
      
      toast.success('Student deleted successfully');
      setStudents(students.filter(s => s.id !== deleteId));
      setDeleteId(null);
    } catch (error: any) {
      console.error('Error deleting student:', error);
      toast.error('Failed to delete student');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Admission No', 'Name', 'Class', 'Section', 'Branch', 'Parent Name', 'Phone'];
    const csvData = filteredStudents.map(s => [
      s.admission_number,
      s.full_name,
      s.class,
      s.section,
      s.branch_name,
      s.parent_name,
      s.mobile_number
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('HCS Students Directory', 14, 15);
    
    const tableData = filteredStudents.map(s => [
      s.admission_number,
      s.full_name,
      s.class,
      s.section,
      s.branch_name,
      s.mobile_number
    ]);

    autoTable(doc, {
      head: [['ADM NO', 'NAME', 'CLASS', 'SEC', 'BRANCH', 'PHONE']],
      body: tableData,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [31, 41, 55] }
    });

    doc.save(`students_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admission_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parent_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBranch = selectedBranch === 'All' || student.branch_name === selectedBranch;
    const matchesClass = selectedClass === 'All' || student.class === selectedClass;
    const matchesStatus = selectedStatus === 'All' || student.status === selectedStatus;

    return matchesSearch && matchesBranch && matchesClass && matchesStatus;
  });

  const columns = [
    {
      header: "Student",
      accessorKey: "full_name",
      cell: (student: Student) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden border border-primary/20">
            {student.photo_url ? (
              <img 
                src={student.photo_url} 
                alt={student.full_name} 
                className="h-full w-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.full_name)}&background=random`;
                }}
              />
            ) : (
              student.full_name.charAt(0)
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-foreground leading-none mb-1">{student.full_name}</span>
            <span className="text-xs text-muted-foreground tabular-nums">#{student.admission_number}</span>
          </div>
        </div>
      )
    },
    {
      header: "Academic",
      accessorKey: "class",
      cell: (student: Student) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{student.class} - {student.section}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{student.branch_name}</span>
        </div>
      )
    },
    {
      header: "Contact",
      accessorKey: "mobile_number",
      cell: (student: Student) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{student.parent_name}</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Phone className="h-3 w-3" /> {student.mobile_number}
          </span>
        </div>
      )
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (student: Student) => (
        <Badge variant="outline" className={cn(
          "rounded-full px-3 font-medium",
          student.status === 'Active' ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
        )}>
          {student.status || 'Active'}
        </Badge>
      )
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (student: Student) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/students/profile/${student.id}`)} className="h-8 w-8 rounded-lg hover:bg-primary/5 hover:text-primary">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/students/edit/${student.id}`)} className="h-8 w-8 rounded-lg hover:bg-amber-50 hover:text-amber-600">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteId(student.id)} className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const uniqueBranches = Array.from(new Map(branches.map(b => [b.name, b])).values());
  const classesList = ['Nursery', 'LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];

  return (
    <AdminContent>
      <AdminPageHeader 
        title="Student Directory"
        description="Manage students, records, and academic status."
        icon={Users2}
        stats={{
          label: "Enrolled Students",
          value: students.length,
          icon: GraduationCap
        }}
        action={{
          label: "Add Student",
          onClick: () => navigate('/admin/students/add'),
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
                  <Users2 className="h-4 w-4" />
                  <span className="truncate">All</span>
                  <Badge variant="secondary" className="hidden xs:inline-flex bg-primary/10 text-primary border-none">{students.length}</Badge>
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
                      {students.filter(s => s.branch_name === branch.name).length}
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
                placeholder="Search students..." 
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
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="h-10 bg-background rounded-xl border-border/50 flex-1 lg:w-[140px] lg:flex-none">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-elegant">
                  <SelectItem value="All">All Classes</SelectItem>
                  {classesList.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                variant="ghost" 
                onClick={() => { 
                  setSelectedBranch('All'); 
                  setSelectedClass('All'); 
                  setSelectedStatus('All');
                  setSearchTerm(''); 
                }}
                className="h-10 gap-2 text-muted-foreground hover:text-primary rounded-xl border border-border/50 bg-background px-4 flex-1 lg:flex-none"
              >
                <X className="h-4 w-4" />
                <span>Reset</span>
              </Button>
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto lg:ml-auto">
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
                    <span>Export CSV</span>
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
          data={filteredStudents} 
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
        title="Delete Student Record"
        description="Are you sure you want to delete this student's record? This action is permanent."
      />
    </AdminContent>
  );
};
