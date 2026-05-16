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
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { 
  Loader2, 
  Save, 
  School, 
  Globe, 
  Mail, 
  Phone, 
  Palette, 
  Settings as SettingsIcon, 
  Languages, 
  Layout,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Share2,
  Sparkles,
  Image as ImageIcon,
  Building2
} from 'lucide-react';
import { AdminContent } from '@/components/admin/AdminContent';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { BranchManagement } from '@/components/admin/BranchManagement';

const settingsSchema = z.object({
  school_name: z.string().min(3, "School name is required").nullable().or(z.string().min(3)),
  school_tagline: z.string().nullable().optional(),
  logo_url: z.string().nullable().optional(),
  email: z.string().email("Invalid email").nullable().optional().or(z.literal('')),
  secondary_email: z.string().email("Invalid email").nullable().optional().or(z.literal('')),
  phone: z.string().nullable().optional(),
  secondary_phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  footer_text: z.string().nullable().optional(),
  facebook_url: z.string().url("Invalid URL").nullable().optional().or(z.literal('')),
  instagram_url: z.string().url("Invalid URL").nullable().optional().or(z.literal('')),
  twitter_url: z.string().url("Invalid URL").nullable().optional().or(z.literal('')),
  youtube_url: z.string().url("Invalid URL").nullable().optional().or(z.literal('')),
  show_language_switcher: z.boolean().default(true),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export const Settings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Get tab from URL if present
  const queryParams = new URLSearchParams(window.location.search);
  const defaultTab = queryParams.get('tab') || 'general';
  const [activeTab, setActiveTab] = useState(defaultTab);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      school_name: 'Hyderabad Central Schools',
      school_tagline: '',
      logo_url: '',
      email: 'info@hcs.edu',
      secondary_email: '',
      phone: '+91 40 2354 1100',
      secondary_phone: '',
      address: 'Banjara Hills, Hyderabad',
      footer_text: '© 2024 Hyderabad Central Schools. All Rights Reserved.',
      facebook_url: '',
      instagram_url: '',
      twitter_url: '',
      youtube_url: '',
      show_language_switcher: true,
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
            school_name: data.school_name || '',
            school_tagline: data.theme_config?.school_tagline || data.school_tagline || '',
            logo_url: data.logo_url || '',
            email: data.contact_info?.email || '',
            secondary_email: data.contact_info?.secondary_email || '',
            phone: data.contact_info?.phone || '',
            secondary_phone: data.contact_info?.secondary_phone || '',
            address: data.contact_info?.address || '',
            footer_text: data.footer_text || '',
            facebook_url: data.social_links?.facebook || '',
            instagram_url: data.social_links?.instagram || '',
            twitter_url: data.social_links?.twitter || '',
            youtube_url: data.social_links?.youtube || '',
            show_language_switcher: data.theme_config?.show_language_switcher !== false,
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

  const saveSettings = async (section: string, payload: any) => {
    try {
      setIsSaving(true);
      
      // Fetch current settings to preserve all fields and handle partial updates
      const { data: currentSettings } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 'global')
        .maybeSingle();

      // Get current form values as a fallback for required fields
      const formValues = form.getValues();

      // Start with current settings, then apply new payload
      // This ensures columns like school_name are preserved even if not in the payload
      const mergedPayload = { 
        id: 'global',
        school_name: formValues.school_name,
        ...(currentSettings || {}), 
        ...payload,
        updated_at: new Date().toISOString()
      };
      
      // Deep merge JSONB objects if we are updating them to avoid overwriting the entire object
      if (payload.theme_config && currentSettings?.theme_config) {
        mergedPayload.theme_config = { ...currentSettings.theme_config, ...payload.theme_config };
      }
      if (payload.contact_info && currentSettings?.contact_info) {
        mergedPayload.contact_info = { ...currentSettings.contact_info, ...payload.contact_info };
      }
      if (payload.social_links && currentSettings?.social_links) {
        mergedPayload.social_links = { ...currentSettings.social_links, ...payload.social_links };
      }

      const { error } = await supabase
        .from('settings')
        .upsert([mergedPayload]);

      if (error) throw error;
      toast.success(`${section} updated successfully`);
    } catch (error: any) {
      console.error(`Error saving ${section}:`, error);
      toast.error(`Failed to save ${section}: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const saveIdentity = async () => {
    const isValid = await form.trigger(['school_name', 'school_tagline', 'logo_url']);
    if (!isValid) return;

    const values = form.getValues();
    await saveSettings('Identity Settings', {
      school_name: values.school_name,
      logo_url: values.logo_url,
      theme_config: {
        school_tagline: values.school_tagline
      }
    });
  };

  const saveFeatures = async () => {
    const isValid = await form.trigger(['show_language_switcher']);
    if (!isValid) return;

    const values = form.getValues();
    await saveSettings('Feature Settings', {
      theme_config: {
        show_language_switcher: values.show_language_switcher,
      }
    });
  };

  const saveContactSocial = async () => {
    const isValid = await form.trigger([
      'email', 'secondary_email', 'phone', 'secondary_phone', 'address',
      'facebook_url', 'instagram_url', 'twitter_url', 'youtube_url', 'footer_text'
    ]);
    if (!isValid) return;

    const values = form.getValues();
    await saveSettings('Contact & Social Settings', {
      contact_info: {
        email: values.email,
        secondary_email: values.secondary_email,
        phone: values.phone,
        secondary_phone: values.secondary_phone,
        address: values.address,
      },
      social_links: {
        facebook: values.facebook_url,
        instagram: values.instagram_url,
        twitter: values.twitter_url,
        youtube: values.youtube_url,
      },
      footer_text: values.footer_text,
    });
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
    <AdminContent className="max-w-4xl mx-auto">
      <AdminPageHeader 
        title="General Settings"
        description="Configure global school information and appearance."
        icon={SettingsIcon}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-card border border-border/50 p-1 rounded-2xl h-auto flex-nowrap overflow-x-auto justify-start gap-1 mb-8 no-scrollbar max-w-full">
          <TabsTrigger value="general" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2 shrink-0">
            <School className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="campuses" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2 shrink-0">
            <Building2 className="h-4 w-4" />
            Campuses
          </TabsTrigger>
          <TabsTrigger value="features" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2 shrink-0">
            <Layout className="h-4 w-4" />
            Frontend Features
          </TabsTrigger>
          <TabsTrigger value="contact" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white transition-all gap-2 shrink-0">
            <Globe className="h-4 w-4" />
            Contact & Social
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <div className="space-y-0">
            <TabsContent value="general" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none">
              <div className="bg-card p-8 rounded-3xl shadow-card border border-border/50">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs mb-4">
                    <School className="h-4 w-4" />
                    School Identity
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <FormField
                      control={form.control}
                      name="logo_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <ImageIcon className="h-4 w-4 text-primary" /> Present Logo
                          </FormLabel>
                          <FormControl>
                            <ImageUpload 
                              value={field.value} 
                              onChange={field.onChange} 
                              onRemove={() => field.onChange('')}
                              folder="branches"
                              className="!w-full"
                            />
                          </FormControl>
                          <FormDescription>This logo appears in the Navbar and Footer.</FormDescription>
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
                              <Input placeholder="Hyderabad Central Schools" {...field} className="bg-muted/30 rounded-xl h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="school_tagline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-amber-500" /> School Tagline
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Empowering minds for a better tomorrow" {...field} className="bg-muted/30 rounded-xl h-12" />
                            </FormControl>
                            <FormDescription>This will appear in the website footer and header.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button onClick={saveIdentity} disabled={isSaving} className="rounded-xl px-8 h-12 shadow-elegant gap-2">
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Identity Settings
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="campuses" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none">
              <div className="bg-card p-6 lg:p-8 rounded-3xl shadow-card border border-border/50 overflow-hidden">
                <BranchManagement />
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none">
              <div className="bg-card p-8 rounded-3xl shadow-card border border-border/50">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs mb-4">
                    <Languages className="h-4 w-4" />
                    Frontend Features
                  </div>
                  
                  <div className="bg-muted/20 p-6 rounded-2xl border border-border/50">
                    <FormField
                      control={form.control}
                      name="show_language_switcher"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg p-3">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Language Switcher</FormLabel>
                            <FormDescription>
                              Show or hide the language selection menu on the public website.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button onClick={saveFeatures} disabled={isSaving} className="rounded-xl px-8 h-12 shadow-elegant gap-2">
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Feature Settings
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none">
              <div className="bg-card p-8 rounded-3xl shadow-card border border-border/50">
                <div className="space-y-10">
                  {/* Contact Info */}
                  <div className="space-y-6">
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
                            <FormLabel className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> Primary Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="info@hcschools.in" {...field} className="bg-muted/30 rounded-xl h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="secondary_email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> Admissions Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="admissions@hcschools.in" {...field} className="bg-muted/30 rounded-xl h-12" />
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
                            <FormLabel className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> Primary Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="+91 40 2354 1100" {...field} className="bg-muted/30 rounded-xl h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="secondary_phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> Secondary Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="+91 40 2305 4400" {...field} className="bg-muted/30 rounded-xl h-12" />
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
                          <FormLabel>Head Office Address</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Road No. 12, Banjara Hills..." {...field} className="bg-muted/30 rounded-xl min-h-[80px] resize-none" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Social Links */}
                  <div className="space-y-6 border-t pt-10">
                    <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
                      <Share2 className="h-4 w-4" />
                      Social Media Links
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="facebook_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2"><Facebook className="h-4 w-4 text-[#1877F2]" /> Facebook URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://facebook.com/..." {...field} className="bg-muted/30 rounded-xl h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="instagram_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2"><Instagram className="h-4 w-4 text-[#E4405F]" /> Instagram URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://instagram.com/..." {...field} className="bg-muted/30 rounded-xl h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="twitter_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2"><Twitter className="h-4 w-4 text-[#1DA1F2]" /> Twitter URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://twitter.com/..." {...field} className="bg-muted/30 rounded-xl h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="youtube_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2"><Youtube className="h-4 w-4 text-[#FF0000]" /> YouTube URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://youtube.com/..." {...field} className="bg-muted/30 rounded-xl h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Footer Branding */}
                  <div className="space-y-6 border-t pt-10">
                    <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
                      <Layout className="h-4 w-4" />
                      Footer Branding
                    </div>
                     <FormField
                      control={form.control}
                      name="footer_text"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Footer Copyright Text</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-muted/30 rounded-xl h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button onClick={saveContactSocial} disabled={isSaving} className="rounded-xl px-8 h-12 shadow-elegant gap-2">
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Contact & Social Settings
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Form>
      </Tabs>
    </AdminContent>
  );
};
