import React, { useEffect, useState } from "react";
import PageHero from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Calendar, CheckCircle2, Loader2, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Branch } from "@/types";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const Branches = () => {
  const { t } = useTranslation();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('branches')
          .select('*')
          .eq('status', 'Active')
          .order('campus_number', { ascending: true });

        if (error) throw error;
        setBranches(data || []);
      } catch (error: any) {
        console.error('Error fetching branches:', error);
        toast.error('Failed to load campus information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-display font-medium animate-pulse tracking-wide">
          {t('branches.loading')}
        </p>
      </div>
    );
  }

  return (
    <>
      <PageHero 
        title={t('branches.heroTitle')} 
        subtitle={t('branches.heroSubtitle')} 
      />

      <section className="py-20 bg-background relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -ml-48 -mb-48" />

        <div className="container relative z-10 space-y-16">
          {branches.length > 0 ? (
            branches.map((b, i) => (
              <Card 
                key={b.id} 
                id={b.slug} 
                className="overflow-hidden border-border/60 hover-lift shadow-elegant rounded-[2.5rem]"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-2 ${i % 2 ? "lg:[&>div:first-child]:order-2" : ""}`}>
                  <div className="relative aspect-[16/10] lg:aspect-auto min-h-[300px] overflow-hidden group">
                    {b.image_url ? (
                      <img
                        src={b.image_url}
                        alt={`${b.name} campus`}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        loading={i === 0 ? "eager" : "lazy"}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-muted flex items-center justify-center">
                        <Building2 className="h-20 w-20 text-muted-foreground/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-60" />
                    
                    <div className="absolute bottom-8 left-8 right-8">
                      <div className="inline-flex items-center gap-2 rounded-2xl bg-white/10 backdrop-blur-md px-5 py-3 border border-white/20 text-white shadow-2xl">
                        <MapPin className="h-5 w-5 text-accent" />
                        <p className="font-display font-bold text-xl tracking-tight">{b.area}</p>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-8 sm:p-10 md:p-14 flex flex-col justify-center">
                    <div className="space-y-2 mb-6">
                      <p className="text-xs uppercase tracking-[0.3em] text-accent font-black">{t('branches.campus')} {b.campus_number || (i + 1).toString().padStart(2, '0')}</p>
                      <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground leading-tight">{b.name}</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                      <ul className="space-y-5">
                        <li className="flex gap-4">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/10">
                            <MapPin className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-sm leading-relaxed text-muted-foreground">{b.address}</span>
                        </li>
                        <li className="flex gap-4">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/10">
                            <Phone className="w-5 h-5 text-primary" />
                          </div>
                          <a href={`tel:${b.phone_number.replace(/\s/g, '')}`} className="text-sm font-medium hover:text-primary transition-colors self-center">{b.phone_number}</a>
                        </li>
                        <li className="flex gap-4">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/10">
                            <Mail className="w-5 h-5 text-primary" />
                          </div>
                          <a href={`mailto:${b.email}`} className="text-sm font-medium hover:text-primary transition-colors self-center">{b.email}</a>
                        </li>
                        <li className="flex gap-4">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/10">
                            <Calendar className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-sm font-medium self-center">{t('branches.established')} {b.established}</span>
                        </li>
                      </ul>

                      <div className="bg-muted/30 rounded-3xl p-6 border border-border/50">
                        <p className="font-bold mb-4 text-xs uppercase tracking-widest text-primary/70">{t('branches.facilities')}</p>
                        <div className="space-y-3">
                          {b.facilities?.slice(0, 5).map((f) => (
                            <div key={f} className="flex items-center gap-3 text-sm font-medium text-foreground/80">
                              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                              {f}
                            </div>
                          ))}
                          {b.facilities.length > 5 && (
                            <p className="text-[10px] text-muted-foreground italic pl-7">{t('branches.more')}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4 border-t border-border/40">
                      <Button asChild className="h-14 px-8 rounded-2xl gradient-primary text-primary-foreground border-0 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all font-bold tracking-wide">
                        <Link to="/admissions#enquiry">{t('branches.enquire')}</Link>
                      </Button>
                      <Button asChild variant="outline" className="h-14 px-8 rounded-2xl border-border/60 hover:bg-muted font-bold tracking-wide transition-all">
                        <Link to="/contact">{t('branches.visit')}</Link>
                      </Button>
                      {b.maps_url && (
                        <Button asChild variant="ghost" className="h-14 px-6 rounded-2xl text-muted-foreground hover:text-primary transition-all flex items-center gap-2">
                          <a href={b.maps_url} target="_blank" rel="noreferrer">
                            {t('branches.directions')}
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-20 bg-muted/20 rounded-[3rem] border border-dashed border-border/60">
              <Building2 className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-display font-bold">{t('branches.emptyTitle')}</h3>
              <p className="text-muted-foreground mt-2">{t('branches.emptyDesc')}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Branches;
