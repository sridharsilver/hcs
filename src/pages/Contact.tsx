import { motion } from "framer-motion";
import PageHero from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { sendEmail } from "@/lib/email";
import { useTranslation } from "react-i18next";
import { useSettings } from "@/contexts/SettingsContext";

const Contact = () => {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    
    const enquiry = {
      parent_name: data.get("n") as string,
      child_name: "General Enquiry",
      phone: data.get("p") as string,
      email: data.get("e") as string,
      grade: "General",
      campus: "General",
      message: data.get("m") as string,
    };

    setSubmitting(true);
    try {
      const { error } = await supabase.from("enquiries").insert([enquiry]);
      if (error) throw error;
      
      // Send email notification
      await sendEmail({
        from_name: enquiry.parent_name,
        from_email: enquiry.email,
        subject: `New General Message from ${enquiry.parent_name}`,
        phone: enquiry.phone,
        message: enquiry.message || 'No message provided.'
      });

      toast.success("Message sent! We'll reply within one working day.");
      form.reset();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };


  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    },
  };

  const contactCards = [
    { 
      icon: Phone, 
      tKey: "contact.call", 
      lines: [
        settings?.contactInfo?.phone || "+91 40 2354 1100",
        settings?.contactInfo?.secondaryPhone || "+91 40 2305 4400"
      ].filter(Boolean)
    },
    { 
      icon: Mail, 
      tKey: "contact.mail", 
      lines: [
        settings?.contactInfo?.email || "info@hcschools.in",
        settings?.contactInfo?.secondaryEmail || "admissions@hcschools.in"
      ].filter(Boolean)
    },
    { 
      icon: MapPin, 
      tKey: "contact.office", 
      lines: settings?.contactInfo?.address?.split('\n') || [
        "Road No. 12, Banjara Hills",
        "Hyderabad, Telangana 500034"
      ]
    },
  ];

  const socialLinks = [
    { icon: Facebook, url: settings?.socialLinks?.facebook, label: 'Facebook' },
    { icon: Instagram, url: settings?.socialLinks?.instagram, label: 'Instagram' },
    { icon: Twitter, url: settings?.socialLinks?.twitter, label: 'Twitter' },
    { icon: Youtube, url: settings?.socialLinks?.youtube, label: 'YouTube' }
  ].filter(link => link.url);

  return (
    <>
      <PageHero title={t('contact.heroTitle')} subtitle={t('contact.heroSubtitle')} />

      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-20 bg-primary-foreground"
      >
        <div className="container grid lg:grid-cols-3 gap-6 mb-14">
          {contactCards.map(({ icon: Icon, tKey, lines }) => (
            <motion.div key={tKey} variants={itemVariants}>
              <Card className="hover-lift border-border/60 h-full">
                <CardContent className="p-7">
                  <div className="w-12 h-12 rounded-lg gradient-primary text-primary-foreground flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-2">{t(tKey)}</h3>
                  {lines.map((l) => <p key={l} className="text-sm text-muted-foreground">{l}</p>)}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemVariants} className="container grid lg:grid-cols-[2fr_1fr] gap-8 items-start">
          <Card className="border-border/60">
            <CardContent className="p-8">
              <h2 className="text-2xl font-display font-semibold mb-2">{t('contact.formTitle')}</h2>
              <p className="text-sm text-muted-foreground mb-6">{t('contact.formDesc')}</p>
                    <form onSubmit={onSubmit} className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="n">{t('contact.name')}</Label>
                          <Input id="n" name="n" required placeholder={t('contact.namePlaceholder')} />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="e">{t('admissions.email')}</Label>
                          <Input id="e" name="e" type="email" required placeholder="you@example.com" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="p">{t('admissions.phone')}</Label>
                        <Input
                          id="p"
                          name="p"
                          type="tel"
                          required
                          placeholder={t('contact.phonePlaceholder')}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="m">{t('admissions.message')}</Label>
                        <Textarea
                          id="m"
                          name="m"
                          rows={5}
                          required
                          placeholder={t('contact.msgPlaceholder')}
                        />
                      </div>


                      <Button
                        type="submit"
                        disabled={submitting}
                        className="gradient-primary text-primary-foreground border-0 w-full"
                        size="lg"
                      >
                        {submitting ? t('admissions.sending') : t('contact.btn')}
                      </Button>
                    </form>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardContent className="p-7">
              <h3 className="font-display font-semibold text-xl mb-4">{t('contact.followTitle')}</h3>
              <p className="text-sm text-muted-foreground mb-5">{t('contact.followDesc')}</p>
             <div className="flex gap-3">
                {socialLinks.length > 0 ? (
                  socialLinks.map(({ icon: Icon, url, label }, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-11 h-11 rounded-full gradient-primary text-primary-foreground flex items-center justify-center hover:scale-110 transition-smooth"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ))
                ) : (
                  [Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                    <div
                      key={i}
                      className="w-11 h-11 rounded-full bg-muted text-muted-foreground flex items-center justify-center cursor-not-allowed"
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>
    </>
  );
};

export default Contact;
