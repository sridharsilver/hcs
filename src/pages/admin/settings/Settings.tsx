import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2, Save, School, Globe, Mail, Phone, Palette } from 'lucide-react';

const settingsSchema = z.object({
  school_name: z.string().min(3, "School name is required"),
  logo_url: z.string().min(1, "Logo is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().min(5, "Address is required"),
  footer_text: z.string().optional(),
  theme_color: z.string().default('#1a237e'),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export const Settings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      school_name: 'Hyderabad Central Schools',
      logo_url: '',
      email: 'info@hcs.edu',
      phone: '+91 98765 43210',
      address: 'Banjara Hills, Hyderabad',
      footer_text: '© 2024 Hyderabad Central Schools. All Rights Reserved.',
      theme_color: '#1a237e',
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        
        if (data) {
          form.reset({
            school_name: data.school_name,
            logo_url: data.logo_url,
            email: data.contact_info?.email || '',
            phone: data.contact_info?.phone || '',
            address: data.contact_info?.address || '',
            footer_text: data.footer_text,
            theme_color: data.theme_config?.primary_color || '#1a237e',
          });
        }
      } catch (error: any) {
        console.error('Error fetching settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [form]);

  const onSubmit = async (values: SettingsFormValues) => {
    try {
      setIsSaving(true);
      const payload = {
        school_name: values.school_name,
        logo_url: values.logo_url,
        contact_info: {
          email: values.email,
          phone: values.phone,
          address: values.address,
        },
        footer_text: values.footer_text,
        theme_config: {
          primary_color: values.theme_color,
        },
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('settings')
        .upsert([{ id: 'global', ...payload }]);

      if (error) throw error;
      toast.success('Settings updated successfully');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">General Settings</h1>
        <p className="text-muted-foreground mt-1">Configure global school information and appearance.</p>
      </div>

      <div className="bg-card p-8 rounded-3xl shadow-card border border-border/50">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            {/* School Branding */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
                <School className="h-4 w-4" />
                School Identity
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <FormField
                  control={form.control}
                  name="logo_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School Logo</FormLabel>
                      <FormControl>
                        <ImageUpload 
                          value={field.value} 
                          onChange={field.onChange} 
                          onRemove={() => field.onChange('')}
                          folder="settings"
                          className="!w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="school_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Hyderabad Central Schools" {...field} className="bg-card rounded-xl h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="theme_color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Palette className="h-4 w-4" /> Theme Primary Color
                        </FormLabel>
                        <div className="flex gap-3">
                          <FormControl>
                            <Input type="color" {...field} className="h-12 w-20 p-1 bg-card rounded-xl cursor-pointer" />
                          </FormControl>
                          <Input value={field.value} onChange={field.onChange} className="bg-card rounded-xl h-12 flex-1" />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6 border-t pt-10">
              <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
                <Globe className="h-4 w-4" />
                Contact Information
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} className="bg-card rounded-xl h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> Phone</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-card rounded-xl h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="bg-card rounded-xl min-h-[80px] resize-none" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Footer Text */}
            <div className="space-y-6 border-t pt-10">
               <FormField
                control={form.control}
                name="footer_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Footer Copyright Text</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-card rounded-xl h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSaving} className="rounded-xl px-12 h-12 shadow-elegant gap-2">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Settings
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
