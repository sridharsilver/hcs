import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Teacher, Branch } from '@/types';
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

const teacherSchema = z.object({
  full_name: z.string().min(3, "Full name is required"),
  employee_id: z.string().min(1, "Employee ID is required"),
  subject: z.string().min(1, "Subject is required"),
  branch_id: z.string().min(1, "Branch is required"),
  qualification: z.string().min(1, "Qualification is required"),
  experience: z.string().min(1, "Experience is required"),
  phone_number: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address is required"),
  joining_date: z.string().min(1, "Joining date is required"),
  photo_url: z.string().min(1, "Teacher photo is required"),
  status: z.enum(['Active', 'Inactive']),
});

type TeacherFormValues = z.infer<typeof teacherSchema>;

interface TeacherFormProps {
  initialData?: Teacher | null;
  onSubmit: (values: TeacherFormValues) => void;
  isLoading?: boolean;
}

export const TeacherForm: React.FC<TeacherFormProps> = ({ 
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

  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: initialData ? {
      ...initialData,
      status: initialData.status as 'Active' | 'Inactive'
    } : {
      full_name: '',
      employee_id: '',
      subject: '',
      branch_id: '',
      qualification: '',
      experience: '',
      phone_number: '',
      email: '',
      address: '',
      joining_date: '',
      photo_url: '',
      status: 'Active',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Professional Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">Professional Info</h3>
            
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Smith" {...field} className="bg-card rounded-xl h-12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="employee_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee ID</FormLabel>
                    <FormControl>
                      <Input placeholder="EMP-101" {...field} className="bg-card rounded-xl h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Mathematics" {...field} className="bg-card rounded-xl h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="qualification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualification</FormLabel>
                    <FormControl>
                      <Input placeholder="M.Sc, B.Ed" {...field} className="bg-card rounded-xl h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience</FormLabel>
                    <FormControl>
                      <Input placeholder="5 Years" {...field} className="bg-card rounded-xl h-12" />
                    </FormControl>
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
                  <FormLabel>Assign to Branch</FormLabel>
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

          {/* Contact & Personal */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">Personal & Contact</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+91 XXXXX XXXXX" {...field} className="bg-card rounded-xl h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="joining_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Joining Date</FormLabel>
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
                    <Input type="email" placeholder="jane@hcs.edu" {...field} className="bg-card rounded-xl h-12" />
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
          <h3 className="text-lg font-semibold border-b pb-2">Profile Photo</h3>
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
                    folder="teachers"
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
            {isLoading ? "Saving..." : (initialData ? "Update Teacher" : "Add Teacher")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
