import PageHero from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, FileText, MessageSquare, ClipboardCheck, GraduationCap } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { sendEmail } from "@/lib/email";
import { useTranslation } from "react-i18next";


import heroBg from "@/assets/page-hero-bg.jpg";

const Admissions = () => {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    grade: "",
    campus: ""
  });

  const steps = [
    { icon: FileText, tKey: "admissions.step1T", dKey: "admissions.step1D" },
    { icon: ClipboardCheck, tKey: "admissions.step2T", dKey: "admissions.step2D" },
    { icon: MessageSquare, tKey: "admissions.step3T", dKey: "admissions.step3D" },
    { icon: GraduationCap, tKey: "admissions.step4T", dKey: "admissions.step4D" },
  ];

  const fees = [
    { g: "Pre-KG – KG II", a: "₹ 75,000", t: "₹ 95,000" },
    { g: "Grade I – V", a: "₹ 95,000", t: "₹ 1,15,000" },
    { g: "Grade VI – VIII", a: "₹ 1,15,000", t: "₹ 1,40,000" },
    { g: "Grade IX – X", a: "₹ 1,35,000", t: "₹ 1,65,000" },
  ];

  useEffect(() => {
    if (window.location.hash === "#enquiry") {
      setTimeout(() => {
        const element = document.getElementById("enquiry");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    
    const enquiry = {
      parent_name: data.get("pname") as string,
      child_name: data.get("cname") as string,
      phone: data.get("phone") as string,
      email: data.get("email") as string,
      grade: formData.grade,
      campus: formData.campus,
      message: data.get("msg") as string,
    };

    if (!enquiry.grade || !enquiry.campus) {
      toast.error("Please select grade and campus");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("enquiries").insert([enquiry]);
      if (error) throw error;
      
      // Send email notification
      await sendEmail({
        from_name: enquiry.parent_name,
        from_email: enquiry.email,
        subject: `New Admission Enquiry: ${enquiry.child_name}`,
        phone: enquiry.phone,
        grade: enquiry.grade,
        campus: enquiry.campus,
        child_name: enquiry.child_name,
        message: enquiry.message || 'No message provided.'
      });

      toast.success("Enquiry received! Our admissions team will reach out within 24 hours.");
      form.reset();
      setFormData({ grade: "", campus: "" });
    } catch (error: any) {
      console.error("Error submitting enquiry:", error);
      toast.error("Failed to send enquiry. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <>
      <PageHero 
        title={t('admissions.heroTitle')} 
        subtitle={t('admissions.heroSubtitle')} 
        bgImage={heroBg}
      />

      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">{t('admissions.processTag')}</p>
            <h2 className="text-3xl md:text-4xl">{t('admissions.processTitle')}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <Card key={s.tKey} className="hover-lift border-border/60 relative">
                <CardContent className="p-7">
                  <div className="absolute -top-3 -right-3 w-9 h-9 rounded-full gradient-primary text-primary-foreground flex items-center justify-center font-display font-bold text-sm shadow-card">{i + 1}</div>
                  <s.icon className="w-9 h-9 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">{t(s.tKey)}</h3>
                  <p className="text-sm text-muted-foreground">{t(s.dKey)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 gradient-soft">
        <div className="container grid lg:grid-cols-2 gap-10">
          <Card className="border-border/60">
            <CardContent className="p-8">
              <h3 className="text-2xl font-display font-semibold mb-5">{t('admissions.eligibility')}</h3>
              <ul className="space-y-3 text-sm">
                {(t('admissions.eligibilityList', { returnObjects: true }) as string[]).map((x) => (
                  <li key={x} className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span>{x}</span></li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-8">
              <h3 className="text-2xl font-display font-semibold mb-5">{t('admissions.docs')}</h3>
              <ul className="space-y-3 text-sm">
                {(t('admissions.docsList', { returnObjects: true }) as string[]).map((x) => (
                  <li key={x} className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span>{x}</span></li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">Fee Structure</p>
            <h2 className="text-3xl md:text-4xl mb-3">{t('admissions.feeTitle')}</h2>
            <p className="text-muted-foreground text-sm">{t('admissions.feeDesc')}</p>
          </div>
          <Card className="border-border/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="gradient-primary text-primary-foreground">
                  <tr>
                    <th className="text-left p-4 font-semibold">{t('admissions.feeGrade')}</th>
                    <th className="text-left p-4 font-semibold">{t('admissions.feeAcademic')}</th>
                    <th className="text-left p-4 font-semibold">{t('admissions.feeTotal')}</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((f, i) => (
                    <tr key={f.g} className={i % 2 ? "bg-secondary/40" : ""}>
                      <td className="p-4 font-medium">{f.g}</td>
                      <td className="p-4 text-muted-foreground">{f.a}</td>
                      <td className="p-4 font-semibold text-primary">{f.t}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      <section id="enquiry" className="py-20 gradient-soft">
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">{t('admissions.enquiryTag')}</p>
            <h2 className="text-3xl md:text-4xl">{t('admissions.enquiryTitle')}</h2>
          </div>
          <Card className="border-border/60">
            <CardContent className="p-8">
              <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2"><Label htmlFor="pname">{t('admissions.parentName')}</Label><Input id="pname" name="pname" required placeholder={t('admissions.formParentName')} /></div>
                <div className="space-y-2"><Label htmlFor="cname">{t('admissions.childName')}</Label><Input id="cname" name="cname" required placeholder={t('admissions.formChildName')} /></div>
                <div className="space-y-2"><Label htmlFor="phone">{t('admissions.phone')}</Label><Input id="phone" name="phone" type="tel" required placeholder="+91" /></div>
                <div className="space-y-2"><Label htmlFor="email">{t('admissions.email')}</Label><Input id="email" name="email" type="email" required placeholder="you@example.com" /></div>
                <div className="space-y-2">
                  <Label>{t('admissions.grade')}</Label>
                  <Select value={formData.grade} onValueChange={(v) => setFormData(prev => ({ ...prev, grade: v }))}>
                    <SelectTrigger><SelectValue placeholder={t('admissions.formSelectGrade')} /></SelectTrigger>
                    <SelectContent>
                      {[
                        "Nursery", "LKG", "UKG", 
                        "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
                        "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10"
                      ].map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('admissions.campus')}</Label>
                  <Select value={formData.campus} onValueChange={(v) => setFormData(prev => ({ ...prev, campus: v }))}>
                    <SelectTrigger><SelectValue placeholder={t('admissions.formChooseCampus')} /></SelectTrigger>
                    <SelectContent>{["Balkampet", "Kukatpally", "Fathenagar"].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="msg">{t('admissions.message')}</Label>
                  <Textarea id="msg" name="msg" rows={4} placeholder={t('admissions.formMessagePlaceholder')} />
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" disabled={submitting} className="gradient-primary text-primary-foreground border-0 w-full md:w-auto" size="lg">
                    {submitting ? t('admissions.sending') : t('admissions.submit')}
                  </Button>
                </div>
              </form>

            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
};

export default Admissions;
