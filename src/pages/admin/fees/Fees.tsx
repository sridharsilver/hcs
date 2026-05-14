import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { Fee, Branch } from '@/types';
import { Badge } from '@/components/ui/badge';
import { 
  IndianRupee,
  Calendar,
  Building2,
  Users2,
  Download,
  FileSpreadsheet,
  FileText,
  Camera,
  Upload,
  X,
  Eye,
  FileImage,
  GraduationCap,
  User,
  Clock,
  Info,
  Search,
  RotateCcw,
  Filter
} from 'lucide-react';
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
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const Fees: React.FC = () => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    new_payment: 0,
    total_amount: 0,
    payment_method: 'Cash',
    remarks: '',
    proof_file: null as File | null,
    proof_preview: null as string | null
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchData();
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    // Default to 'admin' for now, but ready for metadata check
    const role = user?.user_metadata?.role || 'admin'; 
    setUserRole(role);
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Fetch ALL students and their associated fee records
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select(`
          id,
          full_name,
          admission_number,
          class,
          section,
          branch_id,
          branches (
            name
          ),
          fees (*)
        `)
        .order('full_name', { ascending: true });

      if (studentsError) throw studentsError;

      // Fetch branches for tabs
      const { data: branchesData } = await supabase.from('branches').select('*');

      const formattedFees = studentsData?.map(student => {
        const fee = student.fees?.[0]; // Get the first fee record if it exists
        return {
          id: fee?.id || `temp-${student.id}`,
          student_id: student.id,
          total_amount: fee?.total_amount || 0,
          paid_amount: fee?.paid_amount || 0,
          due_amount: fee?.due_amount || 0,
          status: fee?.status || 'Overdue',
          due_date: fee?.due_date || null,
          branch_name: student.branches?.name || 'Unknown',
          student: student // Keep student info for the table
        };
      }) || [];

      setFees(formattedFees as any);
      if (branchesData) setBranches(branchesData);
    } catch (error: any) {
      console.error('Error fetching fees:', error);
      toast.error('Failed to load fee data');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFees = fees.filter(fee => {
    const student = fee.student;
    if (!student) return false;

    const matchesSearch = 
      (student.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (student.admission_number?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesBranch = selectedBranch === 'All' || fee.branch_name === selectedBranch;
    const matchesClass = selectedClass === 'All' || student.class === selectedClass;
    const matchesStatus = selectedStatus === 'All' || fee.status === selectedStatus;

    return matchesSearch && matchesBranch && matchesClass && matchesStatus;
  });

  const uniqueBranches = Array.from(new Map(branches.map(b => [b.name, b])).values());
  const classesList = ['Nursery', 'LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];

  const stats = {
    totalExpected: filteredFees.reduce((acc, curr) => acc + Number(curr.total_amount), 0),
    totalCollected: filteredFees.reduce((acc, curr) => acc + Number(curr.paid_amount), 0),
    totalDues: filteredFees.reduce((acc, curr) => acc + Number(curr.due_amount), 0),
  };

  const columns = [
    {
      header: "Student",
      accessorKey: "student",
      cell: (fee: Fee) => (
        <div className="flex flex-col">
          <span className="font-bold text-foreground">{fee.student?.full_name}</span>
          <span className="text-xs text-muted-foreground">{fee.student?.admission_number}</span>
        </div>
      )
    },
    {
      header: "Class",
      accessorKey: "class",
      cell: (fee: Fee) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{fee.student?.class} - {fee.student?.section}</span>
          <span className="text-[10px] text-muted-foreground uppercase">{fee.branch_name}</span>
        </div>
      )
    },
    {
      header: "Fee Details",
      accessorKey: "amounts",
      cell: (fee: Fee) => (
        <div className="space-y-1">
          <div className="flex justify-between text-xs w-32">
            <span className="text-muted-foreground">Total:</span>
            <span className="font-bold">₹{Number(fee.total_amount).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs w-32">
            <span className="text-green-600">Paid:</span>
            <span className="font-bold text-green-600">₹{Number(fee.paid_amount).toLocaleString()}</span>
          </div>
        </div>
      )
    },
    {
      header: "Due Amount",
      accessorKey: "due_amount",
      cell: (fee: Fee) => (
        <div className="flex flex-col">
          <span className={cn(
            "font-bold text-lg",
            fee.due_amount > 0 ? "text-red-600" : "text-green-600"
          )}>
            ₹{Number(fee.due_amount).toLocaleString()}
          </span>
          {fee.due_date && (
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Due: {new Date(fee.due_date).toLocaleDateString()}
            </span>
          )}
        </div>
      )
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (fee: Fee) => (
        <Badge 
          className={cn(
            "rounded-lg px-3 py-1 border-none",
            fee.status === 'Paid' ? "bg-green-100 text-green-700" : 
            fee.status === 'Partial' ? "bg-amber-100 text-amber-700" : 
            "bg-red-100 text-red-700"
          )}
        >
          {fee.status}
        </Badge>
      )
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (fee: Fee) => {
        // Only show update button for admins or financial admins
        const canUpdate = userRole === 'admin' || userRole === 'financial_admin' || userRole === 'super_admin';
        
        if (!canUpdate) return null;

        return (
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-xl border-primary/20 text-primary hover:bg-primary/5 gap-2"
            onClick={async () => {
              setSelectedFee(fee);
              setUpdateForm({
                new_payment: 0,
                total_amount: Number(fee.total_amount),
                payment_method: 'Cash',
                remarks: '',
                proof_file: null,
                proof_preview: null
              });
              
              // Fetch payment history for this student
              if (fee.id && !fee.id.startsWith('temp-')) {
                const { data, error } = await supabase
                  .from('fee_payments')
                  .select('*')
                  .eq('fee_id', fee.id)
                  .order('payment_date', { ascending: false });
                
                if (error) {
                  console.error("Error fetching history:", error);
                  setPaymentHistory([]);
                } else {
                  setPaymentHistory(data || []);
                }
              } else {
                setPaymentHistory([]);
              }
              
              setIsUpdateModalOpen(true);
            }}
          >
            <IndianRupee className="h-3 w-3" />
            Update
          </Button>
        );
      }
    }
  ];

  const handleUpdatePayment = async () => {
    if (!selectedFee) return;

    try {
      setIsUploading(true);
      
      // Get current user for audit tracking
      const { data: { user } } = await supabase.auth.getUser();
      const userName = user?.user_metadata?.full_name || user?.email || 'System';

      const newPaymentAmount = Number(updateForm.new_payment);
      const newTotal = Number(updateForm.total_amount);
      const currentPaid = Number(selectedFee.paid_amount);
      const totalPaid = currentPaid + newPaymentAmount;
      
      let newStatus = 'Partial';
      if (totalPaid >= newTotal && newTotal > 0) newStatus = 'Paid';
      else if (totalPaid === 0) newStatus = 'Overdue';

      let proofUrl = null;

      // 1. Upload proof image if exists
      if (updateForm.proof_file) {
        const file = updateForm.proof_file;
        const fileExt = file.name.split('.').pop();
        const fileName = `${selectedFee.student_id}-${Date.now()}.${fileExt}`;
        const filePath = `receipts/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('payment-proofs')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('payment-proofs')
          .getPublicUrl(filePath);
        
        proofUrl = publicUrl;
      }

      // 2. Upsert/Update the main Fee record
      const feePayload: any = {
        student_id: selectedFee.student_id,
        paid_amount: totalPaid,
        total_amount: newTotal,
        status: newStatus,
        last_payment_date: newPaymentAmount > 0 ? new Date().toISOString() : selectedFee.last_payment_date,
        updated_at: new Date().toISOString(),
        updated_by: userName
      };

      if (!selectedFee.id.startsWith('temp-')) {
        feePayload.id = selectedFee.id;
      } else {
        // New record
        feePayload.created_by = userName;
      }

      const { data: updatedFee, error: feeError } = await supabase
        .from('fees')
        .upsert(feePayload)
        .select()
        .single();

      if (feeError) throw feeError;

      // 3. If a new payment was made, record it in history
      if (newPaymentAmount > 0) {
        const { error: paymentError } = await supabase
          .from('fee_payments')
          .insert({
            fee_id: updatedFee.id,
            amount_paid: newPaymentAmount,
            payment_method: updateForm.payment_method,
            remarks: updateForm.remarks,
            payment_date: new Date().toISOString(),
            proof_url: proofUrl,
            created_by: userName
          });

        if (paymentError) throw paymentError;
      }

      toast.success(newPaymentAmount > 0 ? "Payment recorded successfully" : "Fee structure updated");
      setIsUpdateModalOpen(false);
      fetchData();
    } catch (error: any) {
      console.error('Error updating payment:', error);
      toast.error('Failed to update payment: ' + (error.message || 'Unknown error'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleExportCSV = () => {
    if (filteredFees.length === 0) {
      toast.error("No data to export");
      return;
    }
    const headers = ["Admission No", "Student Name", "Class", "Total Fee", "Paid", "Due", "Status"];
    const rows = filteredFees.map(f => [
      f.student?.admission_number,
      f.student?.full_name,
      `${f.student?.class}-${f.student?.section}`,
      f.total_amount,
      f.paid_amount,
      f.due_amount,
      f.status
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `HCS_Fees_${selectedBranch}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("HCS Fee Dues Report", 14, 20);
    const rows = filteredFees.map(f => [
      f.student?.admission_number,
      f.student?.full_name,
      f.student?.class,
      `Rs. ${Number(f.total_amount).toLocaleString()}`,
      `Rs. ${Number(f.paid_amount).toLocaleString()}`,
      `Rs. ${Number(f.due_amount).toLocaleString()}`,
      f.status
    ]);
    autoTable(doc, {
      head: [["ADM No", "Student", "Class", "Total", "Paid", "Due", "Status"]],
      body: rows,
      startY: 30,
    });
    doc.save(`HCS_Fees_${selectedBranch}.pdf`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Fee Management</h1>
          <p className="text-muted-foreground mt-1">Track collections and student dues across branches.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <IndianRupee className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase">Total Expected</p>
              <p className="text-2xl font-bold">₹{stats.totalExpected.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase">Total Collected</p>
              <p className="text-2xl font-bold text-green-600">₹{stats.totalCollected.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
              <Users2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase">Total Dues</p>
              <p className="text-2xl font-bold text-red-600">₹{stats.totalDues.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="All" className="w-full" onValueChange={setSelectedBranch}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <TabsList className="bg-muted/50 p-1 rounded-2xl h-auto flex-wrap justify-start gap-1">
            <TabsTrigger value="All" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-background transition-all">
              All Branches
            </TabsTrigger>
            {uniqueBranches.map(branch => (
              <TabsTrigger key={branch.id} value={branch.name} className="rounded-xl px-6 py-2.5 data-[state=active]:bg-background transition-all">
                {branch.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary font-bold px-4 py-1.5 rounded-full">
              {filteredFees.length} Students Listed
            </Badge>
          </div>
        </div>

        {/* High-Density Filter Bar */}
        <div className="bg-card border border-border/50 rounded-3xl p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or admission number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 h-12 bg-muted/30 border-none rounded-2xl focus-visible:ring-primary/20 w-full"
              />
            </div>

            {/* Filters Group */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 rounded-2xl border border-transparent">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="h-9 border-none bg-transparent shadow-none focus:ring-0 min-w-[120px] font-semibold text-sm">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-border/50 shadow-elegant">
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 rounded-2xl border border-transparent">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="h-9 border-none bg-transparent shadow-none focus:ring-0 min-w-[120px] font-semibold text-sm">
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-border/50 shadow-elegant">
                    <SelectItem value="All">All Classes</SelectItem>
                    {classesList.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('All');
                  setSelectedClass('All');
                }}
                className="h-11 w-11 rounded-2xl hover:bg-primary/5 text-muted-foreground hover:text-primary transition-colors"
                title="Reset Filters"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>

              <div className="h-8 w-px bg-border mx-1 hidden md:block" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="h-11 gap-2 rounded-2xl bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 px-6">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-elegant border-border/50">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Select Format</div>
                  <DropdownMenuItem onClick={handleExportCSV} className="gap-3 cursor-pointer rounded-xl py-3 focus:bg-green-50">
                    <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                      <FileSpreadsheet className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">CSV Spreadsheet</span>
                      <span className="text-[10px] text-muted-foreground">For Excel / Google Sheets</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportPDF} className="gap-3 cursor-pointer rounded-xl py-3 focus:bg-red-50">
                    <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">PDF Report</span>
                      <span className="text-[10px] text-muted-foreground">Ready for Printing</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <DataTable 
          columns={columns} 
          data={filteredFees} 
          isLoading={isLoading}
          hideHeader={true}
        />
      </Tabs>

      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="rounded-[2.5rem] max-w-2xl p-0 overflow-hidden border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] bg-background">
          <div className="bg-gradient-to-br from-primary/5 via-transparent to-primary/5 p-8">
            <DialogHeader className="mb-8">
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/20">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <div className="text-left">
                  <DialogTitle className="text-3xl font-display font-bold tracking-tight text-foreground">
                    Update Payment
                  </DialogTitle>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary font-bold rounded-full px-3">
                      {selectedFee?.student?.admission_number}
                    </Badge>
                    <span className="text-muted-foreground font-medium">•</span>
                    <span className="text-foreground font-bold">{selectedFee?.student?.full_name}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold">{selectedFee?.branch_name}</span>
                  </div>
                </div>
              </div>
              
              {/* Audit Info Badge */}
              <div className="flex flex-col items-end text-right">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Info className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    {selectedFee?.updated_by ? `Last update: ${selectedFee.updated_by}` : 'System Entry'}
                  </span>
                </div>
                {selectedFee?.updated_at && (
                  <span className="text-[9px] text-muted-foreground mt-1 mr-2 font-medium flex items-center gap-1 justify-end">
                    <Clock className="h-2.5 w-2.5" />
                    {new Date(selectedFee.updated_at).toLocaleString('en-IN', { 
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit', hour12: true 
                    })}
                  </span>
                )}
              </div>
            </DialogHeader>

            {/* Financial Overview Strip */}
            <div className="grid grid-cols-3 gap-0 rounded-3xl overflow-hidden border border-border/50 bg-card shadow-sm mb-8">
              <div className="p-4 border-r border-border/50 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">Total Fee</span>
                <div className="flex items-center gap-1.5">
                  <Input 
                    type="number" 
                    value={updateForm.total_amount}
                    onChange={(e) => setUpdateForm({...updateForm, total_amount: Number(e.target.value)})}
                    className="w-24 h-8 bg-transparent border-none text-center font-bold text-lg p-0 focus-visible:ring-0"
                  />
                  <span className="text-xs text-muted-foreground">₹</span>
                </div>
              </div>
              <div className="p-4 border-r border-border/50 flex flex-col items-center justify-center text-center bg-green-50/30">
                <span className="text-[10px] uppercase tracking-widest font-bold text-green-600/70 mb-1">Total Paid</span>
                <p className="text-lg font-bold text-green-700">₹{Number(selectedFee?.paid_amount || 0).toLocaleString()}</p>
              </div>
              <div className="p-4 flex flex-col items-center justify-center text-center bg-red-50/30">
                <span className="text-[10px] uppercase tracking-widest font-bold text-red-600/70 mb-1">Balance Due</span>
                <p className={cn(
                  "text-lg font-bold",
                  (updateForm.total_amount - (Number(selectedFee?.paid_amount || 0) + updateForm.new_payment)) > 0 ? "text-red-700" : "text-green-700"
                )}>
                  ₹{(updateForm.total_amount - (Number(selectedFee?.paid_amount || 0) + updateForm.new_payment)).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Form */}
              <div className="space-y-6">
                <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/10 shadow-inner space-y-5">
                  <div className="space-y-2.5">
                    <Label className="text-sm font-bold text-primary flex items-center gap-2">
                      <IndianRupee className="h-4 w-4" /> Add Installment
                    </Label>
                    <Input 
                      type="number" 
                      placeholder="Enter amount..."
                      value={updateForm.new_payment || ''}
                      onChange={(e) => setUpdateForm({...updateForm, new_payment: Number(e.target.value)})}
                      className="rounded-2xl h-14 bg-background border-primary/20 text-primary text-xl font-bold focus:ring-primary/20 shadow-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Method</Label>
                      <Select 
                        value={updateForm.payment_method} 
                        onValueChange={(v) => setUpdateForm({...updateForm, payment_method: v})}
                      >
                        <SelectTrigger className="h-10 rounded-xl bg-background border-border/50 text-xs font-bold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/50 shadow-elegant">
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="PhonePe">PhonePe / GPay</SelectItem>
                          <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                          <SelectItem value="Cheque">Cheque</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Remarks</Label>
                      <Input 
                        placeholder="Ref No..."
                        value={updateForm.remarks}
                        onChange={(e) => setUpdateForm({...updateForm, remarks: e.target.value})}
                        className="rounded-xl h-10 bg-background border-border/50 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Proof of Payment</Label>
                    {updateForm.proof_preview ? (
                      <div className="relative group rounded-2xl overflow-hidden border border-primary/20 aspect-video shadow-md">
                        <img src={updateForm.proof_preview} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Proof" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button 
                            onClick={() => setUpdateForm({...updateForm, proof_file: null, proof_preview: null})}
                            className="p-2.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative group">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setUpdateForm({
                                ...updateForm, 
                                proof_file: file,
                                proof_preview: URL.createObjectURL(file)
                              });
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <div className="border-2 border-dashed border-primary/20 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-background group-hover:bg-primary/5 transition-all duration-300">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Camera className="h-5 w-5" />
                          </div>
                          <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">Click to upload screenshot</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: History Timeline */}
              <div className="space-y-6 flex flex-col">
                <div className="flex items-center justify-between px-2">
                  <h4 className="text-xs uppercase font-bold text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                    <Calendar className="h-3 w-3" /> Payment History
                  </h4>
                  <Badge variant="outline" className="rounded-full bg-muted/50 border-none font-bold text-[10px]">
                    {paymentHistory.length} Transactions
                  </Badge>
                </div>
                
                <div className="flex-1 max-h-[400px] overflow-y-auto pr-3 space-y-4 scrollbar-hide">
                  {paymentHistory.length > 0 ? (
                    <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border/50">
                      {paymentHistory.map((payment, idx) => (
                        <div key={payment.id} className="relative group">
                          <div className={cn(
                            "absolute -left-[19px] top-1.5 h-3 w-3 rounded-full border-2 border-background z-10 shadow-sm",
                            idx === 0 ? "bg-primary" : "bg-muted-foreground/30"
                          )} />
                          <div className="p-4 rounded-2xl bg-card border border-border/50 shadow-sm transition-all hover:shadow-md hover:border-primary/20 group-hover:translate-x-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-lg font-bold text-foreground">₹{Number(payment.amount_paid).toLocaleString()}</span>
                              {payment.proof_url && (
                                <a 
                                  href={payment.proof_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-all shadow-sm"
                                >
                                  <Eye className="h-4 w-4" />
                                </a>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3 w-3" />
                                {new Date(payment.payment_date).toLocaleDateString('en-IN', { 
                                  day: '2-digit', month: 'short', year: 'numeric' 
                                })}
                                <span className="mx-1 opacity-30">•</span>
                                <Clock className="h-3 w-3" />
                                {new Date(payment.payment_date).toLocaleTimeString([], { 
                                  hour: '2-digit', minute: '2-digit', hour12: true 
                                })}
                              </div>
                              <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-0.5 rounded-full">
                                <Badge variant="secondary" className="h-1.5 w-1.5 p-0 rounded-full bg-primary/40 mr-1" />
                                {payment.payment_method}
                              </div>
                              {payment.remarks && (
                                <div className="flex items-center gap-1.5 text-primary/70">
                                  <FileText className="h-3 w-3" />
                                  {payment.remarks}
                                </div>
                              )}
                            </div>
                            
                            {/* Added Who & Time info */}
                            <div className="mt-3 pt-3 border-t border-border/10 flex items-center justify-between">
                              <div className="flex items-center gap-2 text-[10px] font-bold text-primary/60 uppercase">
                                <User className="h-3 w-3" />
                                <span>{payment.created_by || 'Staff'}</span>
                              </div>
                              <div className="text-[9px] text-muted-foreground font-medium">
                                Recorded on {new Date(payment.payment_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-40">
                      <FileImage className="h-12 w-12 mb-4 stroke-[1]" />
                      <p className="text-sm font-medium">No transaction history found</p>
                      <p className="text-[10px] uppercase tracking-widest mt-1">Ready for first payment</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="mt-8 pt-8 border-t border-border/50 gap-3">
              <Button 
                variant="ghost" 
                onClick={() => setIsUpdateModalOpen(false)} 
                className="rounded-2xl h-12 px-8 hover:bg-muted/50 font-bold"
              >
                Close Window
              </Button>
              <Button 
                onClick={handleUpdatePayment} 
                disabled={isUploading}
                className="rounded-2xl h-12 px-10 shadow-[0_10px_20px_-5px_rgba(var(--primary-rgb),0.3)] bg-primary hover:bg-primary/90 font-bold text-white min-w-[180px] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isUploading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Recording...
                  </>
                ) : (
                  'Record Payment'
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
