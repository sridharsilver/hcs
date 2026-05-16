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
  LayoutGrid,
  List,
  RotateCcw,
  Search,
  Plus,
  ArrowUpDown,
  CreditCard,
  Camera,
  X,
  Eye,
  GraduationCap,
  Clock,
  Info,
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
import { AdminContent } from '@/components/admin/AdminContent';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';

export const Fees: React.FC = () => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
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
    const role = user?.user_metadata?.role || 'admin'; 
    setUserRole(role);
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
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

      const { data: branchesData } = await supabase.from('branches').select('*');

      const formattedFees = studentsData?.map(student => {
        const fee = student.fees?.[0];
        return {
          id: fee?.id || `temp-${student.id}`,
          student_id: student.id,
          total_amount: fee?.total_amount || 0,
          paid_amount: fee?.paid_amount || 0,
          due_amount: fee?.due_amount || 0,
          status: fee?.status || 'Overdue',
          due_date: fee?.due_date || null,
          branch_name: student.branches?.name || 'Unknown',
          student: student
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

  const statsValues = {
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
      if (updateForm.proof_file) {
        const file = updateForm.proof_file;
        const fileExt = file.name.split('.').pop();
        const fileName = `${selectedFee.student_id}-${Date.now()}.${fileExt}`;
        const filePath = `receipts/${fileName}`;
        const { error: uploadError } = await supabase.storage
          .from('payment-proofs')
          .upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage
          .from('payment-proofs')
          .getPublicUrl(filePath);
        proofUrl = publicUrl;
      }
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
        feePayload.created_by = userName;
      }
      const { data: updatedFee, error: feeError } = await supabase
        .from('fees')
        .upsert(feePayload)
        .select()
        .single();
      if (feeError) throw feeError;
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
      toast.error('Failed to update payment');
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
    <AdminContent>
      <AdminPageHeader 
        title="Fee Management"
        description="Track collections and student dues across branches."
        icon={IndianRupee}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <IndianRupee className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase">Total Expected</p>
              <p className="text-2xl font-bold">₹{statsValues.totalExpected.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-green-600">₹{statsValues.totalCollected.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-red-600">₹{statsValues.totalDues.toLocaleString()}</p>
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

        <div className="bg-card border border-border/50 rounded-3xl p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or admission number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 h-12 bg-muted/30 border-none rounded-2xl focus-visible:ring-primary/20 w-full"
              />
            </div>

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

                <div className="h-8 w-px bg-border mx-1 hidden md:block" />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="h-11 gap-2 rounded-2xl bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 px-6">
                      <Download className="h-4 w-4" />
                      <span>Export</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-elegant border-border/50">
                    <DropdownMenuItem onClick={handleExportCSV} className="gap-3 cursor-pointer rounded-xl py-3 focus:bg-green-50">
                      <FileSpreadsheet className="h-4 w-4 text-green-600" />
                      <span>CSV Spreadsheet</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportPDF} className="gap-3 cursor-pointer rounded-xl py-3 focus:bg-red-50">
                      <FileText className="h-4 w-4 text-red-600" />
                      <span>Download PDF</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        <DataTable 
          columns={columns} 
          data={filteredFees} 
          isLoading={isLoading}
          hideHeader={true}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </Tabs>

      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="rounded-[2.5rem] max-w-2xl p-0 overflow-hidden border-none shadow-2xl bg-background">
          <div className="p-8">
            <DialogHeader className="mb-8 text-left">
              <DialogTitle className="text-3xl font-display font-bold">Update Payment</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="rounded-full">{selectedFee?.student?.admission_number}</Badge>
                <span className="font-bold">{selectedFee?.student?.full_name}</span>
              </div>
            </DialogHeader>

            <div className="grid grid-cols-3 gap-0 rounded-3xl overflow-hidden border border-border/50 bg-card mb-8 text-center">
              <div className="p-4 border-r border-border/50">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Fee</span>
                <Input 
                  type="number" 
                  value={updateForm.total_amount}
                  onChange={(e) => setUpdateForm({...updateForm, total_amount: Number(e.target.value)})}
                  className="border-none text-center font-bold text-lg h-8 focus-visible:ring-0"
                />
              </div>
              <div className="p-4 border-r border-border/50 bg-green-50/30">
                <span className="text-[10px] uppercase font-bold text-green-600/70">Paid</span>
                <p className="text-lg font-bold text-green-700">₹{Number(selectedFee?.paid_amount || 0).toLocaleString()}</p>
              </div>
              <div className="p-4 bg-red-50/30">
                <span className="text-[10px] uppercase font-bold text-red-600/70">Balance</span>
                <p className="text-lg font-bold text-red-700">
                  ₹{(updateForm.total_amount - (Number(selectedFee?.paid_amount || 0) + updateForm.new_payment)).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Payment Amount</Label>
                  <Input 
                    type="number" 
                    value={updateForm.new_payment || ''}
                    onChange={(e) => setUpdateForm({...updateForm, new_payment: Number(e.target.value)})}
                    className="h-12 rounded-xl text-lg font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Method</Label>
                    <Select value={updateForm.payment_method} onValueChange={(v) => setUpdateForm({...updateForm, payment_method: v})}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="PhonePe">PhonePe</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Remarks</Label>
                    <Input value={updateForm.remarks} onChange={(e) => setUpdateForm({...updateForm, remarks: e.target.value})} className="rounded-xl" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Payment History</Label>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="p-3 rounded-xl bg-muted/50 flex justify-between items-center text-sm">
                      <span className="font-bold">₹{Number(payment.amount_paid).toLocaleString()}</span>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">{new Date(payment.payment_date).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="mt-8">
              <Button variant="ghost" onClick={() => setIsUpdateModalOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdatePayment} disabled={isUploading} className="rounded-xl px-8">
                {isUploading ? "Processing..." : "Confirm Payment"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </AdminContent>
  );
};
