import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { Branch } from '@/types';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  MapPin,
  Building2,
  Users,
  GraduationCap,
  Plus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { cn } from '@/lib/utils';

export const BranchManagement: React.FC = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBranches = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('branches')
        .select(`
          *,
          students:students(count),
          teachers:teachers(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedData = data?.map(branch => ({
        ...branch,
        student_count: branch.students?.[0]?.count || 0,
        teacher_count: branch.teachers?.[0]?.count || 0
      }));
      
      setBranches(formattedData || []);
    } catch (error: any) {
      console.error('Error fetching branches:', error);
      toast.error('Failed to load branches');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;

      toast.success('Branch deleted successfully');
      setBranches(branches.filter(b => b.id !== deleteId));
      setDeleteId(null);
    } catch (error: any) {
      console.error('Error deleting branch:', error);
      toast.error('Failed to delete branch');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Branch',
      accessorKey: 'name',
      cell: (branch: Branch) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg overflow-hidden bg-muted border border-border/50">
            {branch.image_url ? (
              <img src={branch.image_url} alt={branch.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                <Building2 className="h-5 w-5" />
              </div>
            )}
          </div>
          <div>
            <div className="font-semibold text-sm">{branch.name}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {branch.area}, {branch.city}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Principal',
      accessorKey: 'principal_name',
      cell: (branch: Branch) => (
        <div className="text-sm">
          <div className="font-medium">{branch.principal_name}</div>
          <div className="text-xs text-muted-foreground">{branch.email}</div>
        </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (branch: Branch) => (
        <Badge 
          className={cn(
            "rounded-full px-3 font-medium text-[10px] uppercase tracking-wider",
            branch.status === 'Active' 
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200" 
              : "bg-muted text-muted-foreground hover:bg-muted border-border/50"
          )}
        >
          {branch.status}
        </Badge>
      )
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (branch: Branch) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-elegant border-border/50 p-1">
            <DropdownMenuItem 
              onClick={() => navigate(`/admin/branches/view/${branch.id}`)}
              className="gap-2 cursor-pointer py-2 px-3 rounded-lg"
            >
              <Eye className="h-4 w-4 text-muted-foreground" /> View Details
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => navigate(`/admin/branches/edit/${branch.id}`)}
              className="gap-2 cursor-pointer py-2 px-3 rounded-lg"
            >
              <Edit className="h-4 w-4 text-muted-foreground" /> Edit Branch
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setDeleteId(branch.id)}
              className="gap-2 cursor-pointer py-2 px-3 rounded-lg text-destructive focus:text-destructive focus:bg-destructive/5"
            >
              <Trash2 className="h-4 w-4" /> Delete Branch
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  const filteredBranches = branches.filter(branch => 
    (branch.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (branch.city?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (branch.principal_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-lg font-bold">Campuses & Branches</h3>
          <p className="text-xs text-muted-foreground">Manage school locations and contact details.</p>
        </div>
        <Button 
          onClick={() => navigate('/admin/branches/add')}
          className="rounded-xl gap-2 h-10 px-4"
        >
          <Plus className="h-4 w-4" />
          Add Branch
        </Button>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredBranches} 
        isLoading={isLoading}
        onSearch={setSearchTerm}
      />

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Branch"
        description="Are you sure you want to delete this branch? This action cannot be undone and may affect associated students and teachers."
      />
    </div>
  );
};
