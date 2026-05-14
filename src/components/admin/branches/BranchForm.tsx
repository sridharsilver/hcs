import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Branch } from '@/types';
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
import { X, Plus, Sparkles, Building2, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const branchSchema = z.object({
  name: z.string().min(3, "Branch name must be at least 3 characters"),
  area: z.string().min(2, "Area is required"),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
  campus_number: z.string().min(1, "Campus number is required"),
  principal_name: z.string().min(3, "Principal name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(6, "Valid pincode is required"),
  maps_url: z.string().url("Must be a valid Google Maps URL").or(z.literal('')),
  established: z.string().min(4, "Established year is required"),
  facilities: z.array(z.string()).min(1, "At least one facility is required"),
  image_url: z.string().min(1, "Branch image is required"),
  status: z.enum(['Active', 'Inactive']),
});

type BranchFormValues = z.infer<typeof branchSchema>;

interface BranchFormProps {
  initialData?: Branch | null;
  onSubmit: (values: BranchFormValues) => void;
  isLoading?: boolean;
}

export const BranchForm: React.FC<BranchFormProps> = ({ 
  initialData, 
  onSubmit, 
  isLoading 
}) => {
  const [newFacility, setNewFacility] = useState('');

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: initialData ? {
      ...initialData,
      status: initialData.status as 'Active' | 'Inactive',
      facilities: initialData.facilities || [],
      maps_url: initialData.maps_url || '',
    } : {
      name: '',
      area: '',
      slug: '',
      campus_number: '',
      principal_name: '',
      email: '',
      phone_number: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      maps_url: '',
      established: '',
      facilities: [],
      image_url: '',
      status: 'Active',
    },
  });

  const addFacility = () => {
    if (!newFacility.trim()) return;
    const current = form.getValues('facilities');
    if (!current.includes(newFacility.trim())) {
      form.setValue('facilities', [...current, newFacility.trim()]);
    }
    setNewFacility('');
  };

  const removeFacility = (facility: string) => {
    const current = form.getValues('facilities');
    form.setValue('facilities', current.filter(f => f !== facility));
  };

  const generateSlug = () => {
    const name = form.getValues('name');
    const area = form.getValues('area');
    const combined = `${name} ${area}`.trim();
    if (combined) {
      const slug = combined
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      form.setValue('slug', slug);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Column 1: Display Information (Matches Screenshot) */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <h3 className="text-xl font-bold font-display">Public Display Info</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="sm:col-span-1">
                <FormField
                  control={form.control}
                  name="campus_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campus ID</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 01" {...field} className="bg-muted/30 rounded-xl h-12 border-border/50 focus:bg-background transition-all" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Branch Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. HCS Balkampet" {...field} className="bg-muted/30 rounded-xl h-12 border-border/50 focus:bg-background transition-all" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Balkampet" {...field} onBlur={generateSlug} className="bg-muted/30 rounded-xl h-12 border-border/50 focus:bg-background transition-all" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="established"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Established Year</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 1998" {...field} className="bg-muted/30 rounded-xl h-12 border-border/50 focus:bg-background transition-all" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Public Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="info@hcschools.in" {...field} className="bg-muted/30 rounded-xl h-12 border-border/50 focus:bg-background transition-all" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+91 40 2354 1100" {...field} className="bg-muted/30 rounded-xl h-12 border-border/50 focus:bg-background transition-all" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="maps_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Maps URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.google.com/maps/..." {...field} className="bg-muted/30 rounded-xl h-12 border-border/50 focus:bg-background transition-all" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Column 2: Location & Facilities */}
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-primary">
              <MapPin className="h-5 w-5" />
              <h3 className="text-xl font-bold font-display">Location & Facilities</h3>
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Address Line</FormLabel>
                  <FormControl>
                    <Input placeholder="Road No. 12, Balkampet, Hyderabad..." {...field} className="bg-muted/30 rounded-xl h-12 border-border/50 focus:bg-background transition-all" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} className="bg-muted/30 rounded-xl h-12 border-border/50 focus:bg-background transition-all" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="State" {...field} className="bg-muted/30 rounded-xl h-12 border-border/50 focus:bg-background transition-all" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input placeholder="Pincode" {...field} className="bg-muted/30 rounded-xl h-12 border-border/50 focus:bg-background transition-all" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormLabel>Key Facilities</FormLabel>
              <div className="flex gap-2">
                <Input 
                  placeholder="e.g. Smart Classrooms" 
                  value={newFacility} 
                  onChange={(e) => setNewFacility(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFacility())}
                  className="bg-muted/30 rounded-xl h-12 border-border/50"
                />
                <Button type="button" onClick={addFacility} className="h-12 w-12 p-0 rounded-xl shadow-elegant shrink-0">
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2 min-h-[40px]">
                {form.watch('facilities')?.map((f) => (
                  <Badge key={f} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary border-primary/20 flex items-center gap-2 group transition-all hover:bg-destructive hover:text-white hover:border-destructive">
                    {f}
                    <button type="button" onClick={() => removeFacility(f)} className="transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <FormField
                control={form.control}
                name="facilities"
                render={() => <FormMessage />}
              />
            </div>
          </div>
        </div>

        {/* Admin Management Section */}
        <div className="pt-10 border-t space-y-8">
          <div className="flex items-center gap-2 text-primary">
            <Building2 className="h-5 w-5" />
            <h3 className="text-xl font-bold font-display">Admin Management</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>URL Slug</FormLabel>
                    <button type="button" onClick={generateSlug} className="text-[10px] uppercase font-bold text-primary hover:underline">Auto-generate</button>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">/</span>
                      <Input {...field} className="pl-6 bg-muted/30 rounded-xl h-12 border-border/50 focus:bg-background transition-all" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="principal_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Principal Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Dr. Sarah Johnson" {...field} className="bg-muted/30 rounded-xl h-12 border-border/50 focus:bg-background transition-all" />
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
                  <FormLabel>Branch Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-muted/30 rounded-xl h-12 border-border/50">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl shadow-elegant border-border/50">
                      <SelectItem value="Active" className="rounded-lg">Active</SelectItem>
                      <SelectItem value="Inactive" className="rounded-lg">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campus Hero Image</FormLabel>
                <FormControl>
                  <ImageUpload 
                    value={field.value} 
                    onChange={field.onChange} 
                    onRemove={() => field.onChange('')}
                    folder="branches"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4 pt-10 border-t">
          <Button type="button" variant="outline" onClick={() => window.history.back()} className="rounded-xl px-10 h-12 border-border/60 text-muted-foreground hover:bg-muted/50 transition-all">
            Discard Changes
          </Button>
          <Button type="submit" disabled={isLoading} className="rounded-xl px-14 h-12 shadow-elegant font-bold tracking-wide">
            {isLoading ? "Saving Record..." : (initialData ? "Update Campus" : "Create New Campus")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
