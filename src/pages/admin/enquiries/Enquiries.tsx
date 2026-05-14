import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { Enquiry } from '@/types';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare,
  Calendar,
  Phone,
  Mail,
  User,
  GraduationCap,
  Building2,
  Clock,
  CheckCircle2,
  MoreHorizontal,
  Download,
  FileSpreadsheet,
  FileText,
  MessageCircle
} from 'lucide-react';



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


import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export const Enquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');




  const fetchEnquiries = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEnquiries(data || []);
    } catch (error: any) {
      console.error('Error fetching enquiries:', error);
      toast.error('Failed to load enquiries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const updateStatus = async (id: string, status: Enquiry['status']) => {
    try {
      const { error } = await supabase
        .from('enquiries')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
      toast.success(`Enquiry marked as ${status}`);
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const columns = [
    {
      header: 'Parent & Child',
      accessorKey: 'parent_name',
      cell: (enquiry: Enquiry) => {
        const isGeneral = enquiry.grade === 'General';
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
              <User className="h-3 w-3 text-primary" />
              {enquiry.parent_name}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              {isGeneral ? (
                <MessageSquare className="h-3 w-3" />
              ) : (
                <GraduationCap className="h-3 w-3" />
              )}
              {isGeneral ? 'General Inquiry' : `Child: ${enquiry.child_name}`}
            </div>
          </div>
        );
      }
    },
    {
      header: 'Contact Info',
      accessorKey: 'email',
      cell: (enquiry: Enquiry) => (
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-3 w-3" />
            {enquiry.email}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-3 w-3" />
            {enquiry.phone}
          </div>
        </div>
      )
    },
    {
      header: 'Requirements',
      accessorKey: 'grade',
      cell: (enquiry: Enquiry) => {
        const isGeneral = enquiry.grade === 'General';
        return (
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Clock className="h-3 w-3 text-muted-foreground" />
              {isGeneral ? 'General' : `Grade: ${enquiry.grade}`}
            </div>
            {!isGeneral && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-3 w-3" />
                {enquiry.campus}
              </div>
            )}
          </div>
        );
      }
    },
    {
      header: 'Date',
      accessorKey: 'created_at',
      cell: (enquiry: Enquiry) => (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {format(new Date(enquiry.created_at), 'MMM dd, yyyy')}
        </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (enquiry: Enquiry) => (
        <Badge 
          className={cn(
            "rounded-full px-3 font-medium",
            enquiry.status === 'Pending' && "bg-amber-100 text-amber-700 hover:bg-amber-100",
            enquiry.status === 'Contacted' && "bg-blue-100 text-blue-700 hover:bg-blue-100",
            enquiry.status === 'Closed' && "bg-green-100 text-green-700 hover:bg-green-100"
          )}
        >
          {enquiry.status}
        </Badge>
      )
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (enquiry: Enquiry) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-elegant border-border/50 p-1">
            <DropdownMenuItem 
              onClick={() => window.location.href = `mailto:${enquiry.email}?subject=RE: Your Enquiry to HCS`}
              className="gap-2 cursor-pointer py-2 px-3 rounded-lg"
            >
              <Mail className="h-4 w-4 text-primary" /> Reply via Email
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => {
                const cleanPhone = enquiry.phone.replace(/\D/g, '');
                const finalPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
                window.open(`https://wa.me/${finalPhone}?text=Hello ${enquiry.parent_name}, I am reaching out from HCS regarding your enquiry.`, '_blank');
              }}
              className="gap-2 cursor-pointer py-2 px-3 rounded-lg"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" /> Chat on WhatsApp
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => updateStatus(enquiry.id, 'Pending')}
              className="gap-2 cursor-pointer py-2 px-3 rounded-lg"
            >

              <Clock className="h-4 w-4 text-amber-500" /> Mark as Pending
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => updateStatus(enquiry.id, 'Contacted')}
              className="gap-2 cursor-pointer py-2 px-3 rounded-lg"
            >
              <Phone className="h-4 w-4 text-blue-500" /> Mark as Contacted
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => updateStatus(enquiry.id, 'Closed')}
              className="gap-2 cursor-pointer py-2 px-3 rounded-lg"
            >
              <CheckCircle2 className="h-4 w-4 text-green-500" /> Mark as Closed
            </DropdownMenuItem>
          </DropdownMenuContent>

        </DropdownMenu>
      )
    }
  ];

  const handleExportCSV = () => {
    if (filteredEnquiries.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = ["Date", "Parent Name", "Child Name", "Email", "Phone", "Grade", "Campus", "Status", "Message"];
    const csvRows = [
      headers.join(","),
      ...filteredEnquiries.map(e => [
        `"${format(new Date(e.created_at), 'yyyy-MM-dd')}"`,
        `"${e.parent_name}"`,
        `"${e.child_name}"`,
        `"${e.email}"`,
        `"${e.phone}"`,
        `"${e.grade}"`,
        `"${e.campus}"`,
        `"${e.status}"`,
        `"${(e.message || '').replace(/"/g, '""')}"`
      ].join(","))
    ];

    const blob = new Blob([csvRows.join("\n")], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `HCS_Enquiries_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Exported successfully");
  };

  const handleExportPDF = () => {
    if (filteredEnquiries.length === 0) {
      toast.error("No data to export");
      return;
    }

    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text("HCS Enquiries Report", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    const tableColumn = ["Date", "Parent Name", "Child Name", "Grade", "Campus", "Status"];
    const tableRows = filteredEnquiries.map(e => [
      format(new Date(e.created_at), 'MMM dd, yyyy'),
      e.parent_name,
      e.child_name,
      e.grade,
      e.campus,
      e.status
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [79, 70, 229], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      margin: { top: 40 }
    });

    doc.save(`HCS_Enquiries_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("PDF Downloaded successfully");
  };

  const filteredEnquiries = enquiries.filter(e => {
    const matchesSearch = 
      (e.parent_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (e.child_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (e.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (e.phone || '').includes(searchTerm);
    
    const isGeneral = e.grade === 'General';
    const matchesType = 
      typeFilter === 'all' || 
      (typeFilter === 'general' && isGeneral) || 
      (typeFilter === 'admission' && !isGeneral);
      
    return matchesSearch && matchesType;
  });


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Admissions Enquiries</h1>
          <p className="text-muted-foreground mt-1">Manage and track potential student enquiries from the website.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-2 rounded-xl border-border/50 bg-background px-4">
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

          <div className="bg-primary/5 p-3 rounded-2xl flex items-center gap-3 border border-primary/10">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-elegant">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold leading-none">{enquiries.length}</div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Total Enquiries</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/50 p-4 rounded-2xl border border-border/40">
        <div className="flex items-center gap-4">
          <Button 
            variant={typeFilter === 'all' ? 'default' : 'outline'} 
            onClick={() => setTypeFilter('all')}
            className="rounded-xl h-9"
          >
            All
          </Button>
          <Button 
            variant={typeFilter === 'admission' ? 'default' : 'outline'} 
            onClick={() => setTypeFilter('admission')}
            className="rounded-xl h-9"
          >
            Admissions
          </Button>
          <Button 
            variant={typeFilter === 'general' ? 'default' : 'outline'} 
            onClick={() => setTypeFilter('general')}
            className="rounded-xl h-9"
          >
            General
          </Button>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background/50 px-3 py-1.5 rounded-lg border border-border/20">
          <span className="font-medium text-foreground">{filteredEnquiries.length}</span> results found
        </div>
      </div>

      <div className="bg-card/50 p-6 rounded-3xl border border-border/40 shadow-sm">

        <DataTable 
          columns={columns} 
          data={filteredEnquiries} 
          isLoading={isLoading}
          onSearch={setSearchTerm}
          emptyMessage="No enquiries found matching your search."
        />
      </div>

    </div>
  );
};
