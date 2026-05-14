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
  Printer,
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

export const Students: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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

      toast.success('Student record deleted');
      setStudents(students.filter(s => s.id !== deleteId));
      setDeleteId(null);
    } catch (error: any) {
      console.error('Error deleting student:', error);
      toast.error('Failed to delete student');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Student',
      accessorKey: 'full_name',
      cell: (student: Student) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-muted border border-border/50">
            {student.photo_url ? (
              <img src={student.photo_url} alt={student.full_name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                <User className="h-5 w-5" />
              </div>
            )}
          </div>
          <div>
            <div className="font-semibold text-sm">{student.full_name}</div>
            <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              {student.admission_number}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Class',
      accessorKey: 'class',
      cell: (student: Student) => (
        <div className="text-sm">
          <span className="font-medium">{student.class}</span> - <span className="text-muted-foreground">{student.section}</span>
        </div>
      )
    },
    {
      header: 'Branch',
      accessorKey: 'branch_name',
      cell: (student: Student) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-3 w-3" />
          {student.branch_name || 'N/A'}
        </div>
      )
    },
    {
      header: 'Parent Info',
      accessorKey: 'parent_name',
      cell: (student: Student) => (
        <div className="text-xs">
          <div className="font-medium text-foreground">{student.parent_name}</div>
          <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
            <Phone className="h-3 w-3" /> {student.mobile_number}
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (student: Student) => (
        <Badge 
          className={cn(
            "rounded-full px-3 font-medium",
            student.status === 'Active' 
              ? "bg-green-100 text-green-700 hover:bg-green-100" 
              : "bg-muted text-muted-foreground hover:bg-muted"
          )}
        >
          {student.status}
        </Badge>
      )
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (student: Student) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-elegant border-border/50 p-1">
            <DropdownMenuItem 
              onClick={() => navigate(`/admin/students/profile/${student.id}`)}
              className="gap-2 cursor-pointer py-2 px-3 rounded-lg"
            >
              <Eye className="h-4 w-4 text-muted-foreground" /> View Profile
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => navigate(`/admin/students/edit/${student.id}`)}
              className="gap-2 cursor-pointer py-2 px-3 rounded-lg"
            >
              <Edit className="h-4 w-4 text-muted-foreground" /> Edit Student
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setDeleteId(student.id)}
              className="gap-2 cursor-pointer py-2 px-3 rounded-lg text-destructive focus:text-destructive focus:bg-destructive/5"
            >
              <Trash2 className="h-4 w-4" /> Delete Student
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      (student.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (student.admission_number?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (student.parent_name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesBranch = selectedBranch === 'All' || student.branch_name === selectedBranch;
    const matchesClass = selectedClass === 'All' || student.class === selectedClass;
    const matchesStatus = selectedStatus === 'All' || student.status === selectedStatus;

    return matchesSearch && matchesBranch && matchesClass && matchesStatus;
  });

  // Filter out duplicate branch names for the dropdown
  const uniqueBranches = Array.from(new Map(branches.map(b => [b.name, b])).values());

  const classesList = ['Nursery', 'LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];

  const handleExportCSV = () => {
    if (filteredStudents.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = ["Admission No", "Full Name", "Class", "Section", "Branch", "Gender", "Parent Name", "Mobile", "Status"];
    const csvRows = [
      headers.join(","),
      ...filteredStudents.map(s => [
        `"${s.admission_number}"`,
        `"${s.full_name}"`,
        `"${s.class}"`,
        `"${s.section}"`,
        `"${s.branch_name}"`,
        `"${s.gender}"`,
        `"${s.parent_name}"`,
        `"${s.mobile_number}"`,
        `"${s.status}"`
      ].join(","))
    ];

    const blob = new Blob([csvRows.join("\n")], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `HCS_Students_${selectedBranch}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Exported successfully");
  };

  const handleExportPDF = () => {
    if (filteredStudents.length === 0) {
      toast.error("No data to export");
      return;
    }

    const doc = new jsPDF();
    
    // Add Header
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("HCS Student Report", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Branch: ${selectedBranch} | Class: ${selectedClass}`, 14, 30);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 35);

    const tableColumn = ["ADM No", "Full Name", "Class", "Section", "Mobile", "Status"];
    const tableRows = filteredStudents.map(s => [
      s.admission_number,
      s.full_name,
      s.class,
      s.section,
      s.mobile_number,
      s.status
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [79, 70, 229], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      margin: { top: 45 }
    });

    doc.save(`HCS_Students_${selectedBranch}_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("PDF Downloaded successfully");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground mt-1">Manage student records, admissions, and information.</p>
        </div>
        
        <div className="bg-primary/5 p-3 rounded-2xl flex items-center gap-3 border border-primary/10">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-elegant">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <div className="text-2xl font-bold leading-none">{students.length}</div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Enrolled Students</div>
          </div>
        </div>
      </div>

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
                <span>Reset all</span>
              </Button>
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto lg:ml-auto">
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

              <Button onClick={() => navigate('/admin/students/add')} size="sm" className="gap-2 h-10 px-4 rounded-xl shadow-elegant font-bold transition-all hover:scale-[1.02] flex-1 lg:flex-none whitespace-nowrap">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Student</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>
        </div>

        <DataTable 
          columns={columns} 
          data={filteredStudents} 
          isLoading={isLoading}
          hideHeader={true}
        />
      </Tabs>

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Student Record"
        description="Are you sure you want to delete this student's record? This action is permanent and will remove all associated data."
      />
    </div>
  );
};
