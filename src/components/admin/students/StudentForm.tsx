import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Student, Branch } from '@/types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/ImageUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const studentSchema = z.object({
  full_name: z.string().min(3, "Full name is required"),
  admission_number: z.string().min(1, "Admission number is required"),
  class: z.string().min(1, "Class is required"),
  section: z.string().min(1, "Section is required"),
  branch_id: z.string().min(1, "Branch is required"),
  gender: z.string().min(1, "Gender is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  parent_name: z.string().min(1, "Parent name is required"),
  mobile_number: z.string().min(10, "Valid mobile number is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address is required"),
  photo_url: z.string().min(1, "Student photo is required"),
  status: z.enum(['Active', 'Inactive']),
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface StudentFormProps {
  initialData?: Student | null;
  onSubmit: (values: StudentFormValues) => void;
  isLoading?: boolean;
}

export const StudentForm: React.FC<StudentFormProps> = ({ 
  initialData, 
  onSubmit, 
  isLoading 
}) => {
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    const fetchBranches = async () => {
      const { data } = await supabase.from('branches').select('id, name');
      if (data) {
        // Filter out duplicate branch names
        const uniqueBranches = Array.from(new Map(data.map(b => [b.name, b])).values());
        setBranches(uniqueBranches);
      }
    };
    fetchBranches();
  }, []);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: initialData ? {
      ...initialData,
      status: initialData.status as 'Active' | 'Inactive'
    } : {
      full_name: '',
      admission_number: '',
      class: '',
      section: '',
      branch_id: '',
      gender: '',
      date_of_birth: '',
      parent_name: '',
      mobile_number: '',
      email: '',
      address: '',
      photo_url: '',
      status: 'Active',
    },
  });

  // Diagnostic: Alert user of validation errors
  useEffect(() => {
    const errorKeys = Object.keys(form.formState.errors);
    if (errorKeys.length > 0) {
      const firstKey = errorKeys[0];
      const error = (form.formState.errors as any)[firstKey];
      toast.error(`Form Error: ${firstKey} - ${error.message}`);
      console.log('Validation Errors:', form.formState.errors);
    }
  }, [form.formState.errors]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Identity & Branch */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">Student Identity</h3>
            
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} className="bg-card rounded-xl h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="admission_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admission No.</FormLabel>
                    <FormControl>
                      <Input placeholder="ADM-2024-001" {...field} className="bg-card rounded-xl h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-card rounded-xl h-12">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl shadow-elegant">
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-card rounded-xl h-12">
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl shadow-elegant">
                        {['Nursery', 'LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'].map(cls => (
                          <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section</FormLabel>
                    <Input placeholder="e.g. A" {...field} className="bg-card rounded-xl h-12" />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="branch_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-card rounded-xl h-12">
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl shadow-elegant">
                      {branches.map(branch => (
                        <SelectItem key={branch.id} value={branch.id} className="rounded-lg">
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Parents & Contact */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">Guardian & Contact</h3>
            
            <FormField
              control={form.control}
              name="parent_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent/Guardian Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Robert Doe" {...field} className="bg-card rounded-xl h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="mobile_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+91 XXXXX XXXXX" {...field} className="bg-card rounded-xl h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="bg-card rounded-xl h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="parent@example.com" {...field} className="bg-card rounded-xl h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permanent Address</FormLabel>
                  <FormControl>
                    <Input placeholder="House No, Street, City" {...field} className="bg-card rounded-xl h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-card rounded-xl h-12">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl shadow-elegant">
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Photo Upload */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold border-b pb-2">Student Photo</h3>
          <FormField
            control={form.control}
            name="photo_url"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUpload 
                    value={field.value} 
                    onChange={field.onChange} 
                    onRemove={() => field.onChange('')}
                    folder="students"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4 pt-8">
          <Button type="button" variant="outline" className="rounded-xl px-8 h-12 border-border">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="rounded-xl px-12 h-12 shadow-elegant">
            {isLoading ? "Saving..." : (initialData ? "Update Student" : "Register Student")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
