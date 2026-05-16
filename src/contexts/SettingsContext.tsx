import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Settings {
  schoolName: string;
  schoolTagline: string;
  logoUrl: string;
  footerText: string;
  contactInfo: {
    email: string;
    secondaryEmail: string;
    phone: string;
    secondaryPhone: string;
    address: string;
  };
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
  themeConfig: {
    primaryColor: string;
    showLanguageSwitcher: boolean;
  };
}

interface SettingsContextType {
  settings: Settings | null;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  isLoading: true,
  refreshSettings: async () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
          .from('settings')
          .select('*')
          .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setSettings({
          schoolName: data.school_name || 'Hyderabad Central Schools',
          schoolTagline: data.theme_config?.school_tagline || data.school_tagline || 'Empowering minds for a better tomorrow',
          logoUrl: data.logo_url || '',
          footerText: data.footer_text || `© ${new Date().getFullYear()} Hyderabad Central Schools. All Rights Reserved.`,
          contactInfo: {
            email: data.contact_info?.email || data.email || 'info@hcs.edu',
            secondaryEmail: data.contact_info?.secondary_email || '',
            phone: data.contact_info?.phone || data.phone || '+91 40 2354 1100',
            secondaryPhone: data.contact_info?.secondary_phone || '',
            address: data.contact_info?.address || data.address || 'Hyderabad, Telangana',
          },
          socialLinks: {
            facebook: data.social_links?.facebook || '',
            instagram: data.social_links?.instagram || '',
            twitter: data.social_links?.twitter || '',
            youtube: data.social_links?.youtube || '',
          },
          themeConfig: {
            primaryColor: data.theme_config?.primary_color || '#1a237e',
            showLanguageSwitcher: data.theme_config?.show_language_switcher !== false,
          }
        });
      }
    } catch (error) {
      console.error('Error fetching global settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    const channel = supabase
      .channel('settings_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'settings' 
      }, () => {
        fetchSettings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, isLoading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
