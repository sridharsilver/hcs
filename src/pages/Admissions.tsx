import PageHero from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, FileText, MessageSquare, ClipboardCheck, GraduationCap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const steps = [
  { icon: FileText, t: "Submit Enquiry", d: "Fill the online enquiry form below." },
  { icon: ClipboardCheck, t: "Application", d: "Receive the application form & checklist via email." },
  { icon: MessageSquare, t: "Interaction", d: "Student & parent interaction with our team." },
  { icon: GraduationCap, t: "Confirmation", d: "Offer letter, fee payment & welcome kit." },
];

const fees = [
  { g: "Pre-KG – KG II", a: "₹ 75,000", t: "₹ 95,000" },
  { g: "Grade I – V", a: "₹ 95,000", t: "₹ 1,15,000" },
  { g: "Grade VI – VIII", a: "₹ 1,15,000", t: "₹ 1,40,000" },
  { g: "Grade IX – X", a: "₹ 1,35,000", t: "₹ 1,65,000" },
  { g: "Grade XI – XII", a: "₹ 1,55,000", t: "₹ 1,85,000" },
];

const Admissions = () => {
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Enquiry received! Our admissions team will reach out within 24 hours.");
      (e.target as HTMLFormElement).reset();
    }, 800);
  };

  return (
    <>
      <PageHero title="Admissions 2025-26" subtitle="A simple, transparent process to welcome your child into the HCS family." />

      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">Process</p>
            <h2 className="text-3xl md:text-4xl">Four Simple Steps</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <Card key={s.t} className="hover-lift border-border/60 relative">
                <CardContent className="p-7">
                  <div className="absolute -top-3 -right-3 w-9 h-9 rounded-full gradient-primary text-primary-foreground flex items-center justify-center font-display font-bold text-sm shadow-card">{i + 1}</div>
                  <s.icon className="w-9 h-9 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">{s.t}</h3>
                  <p className="text-sm text-muted-foreground">{s.d}</p>
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
              <h3 className="text-2xl font-display font-semibold mb-5">Eligibility</h3>
              <ul className="space-y-3 text-sm">
                {[
                  "Pre-KG: Child must be 2.5 years on June 1, 2025",
                  "KG I: Child must be 3.5 years on June 1, 2025",
                  "Grade I onwards: Age + previous school transfer certificate",
                  "Mid-year admissions: Subject to seat availability",
                  "Entrance assessment for Grade VI and above",
                ].map((x) => (
                  <li key={x} className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span>{x}</span></li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-8">
              <h3 className="text-2xl font-display font-semibold mb-5">Documents Required</h3>
              <ul className="space-y-3 text-sm">
                {[
                  "Birth certificate (photocopy)",
                  "Aadhaar card of student & parents",
                  "Latest report card (Grade I onwards)",
                  "Transfer Certificate (if applicable)",
                  "4 passport-size photographs",
                  "Address & income proof",
                ].map((x) => (
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
            <h2 className="text-3xl md:text-4xl mb-3">Transparent Annual Fees</h2>
            <p className="text-muted-foreground text-sm">Indicative figures for 2025-26. Final fees vary slightly by campus. Please contact admissions for the exact schedule.</p>
          </div>
          <Card className="border-border/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="gradient-primary text-primary-foreground">
                  <tr>
                    <th className="text-left p-4 font-semibold">Grade</th>
                    <th className="text-left p-4 font-semibold">Academic Fee</th>
                    <th className="text-left p-4 font-semibold">Total Annual</th>
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

      <section className="py-20 gradient-soft">
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">Enquiry Form</p>
            <h2 className="text-3xl md:text-4xl">Get in Touch With Admissions</h2>
          </div>
          <Card className="border-border/60">
            <CardContent className="p-8">
              <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2"><Label htmlFor="pname">Parent Name</Label><Input id="pname" required placeholder="Your name" /></div>
                <div className="space-y-2"><Label htmlFor="cname">Child's Name</Label><Input id="cname" required placeholder="Child's name" /></div>
                <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" type="tel" required placeholder="+91" /></div>
                <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" required placeholder="you@example.com" /></div>
                <div className="space-y-2">
                  <Label>Grade</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
                    <SelectContent>{["Pre-KG","KG I","KG II","Grade 1-5","Grade 6-8","Grade 9-10","Grade 11-12"].map((g)=><SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Preferred Campus</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Choose campus" /></SelectTrigger>
                    <SelectContent>{["Banjara Hills","Kukatpally","Secunderabad"].map((g)=><SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="msg">Message</Label>
                  <Textarea id="msg" rows={4} placeholder="Tell us anything we should know..." />
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" disabled={submitting} className="gradient-primary text-primary-foreground border-0 w-full md:w-auto" size="lg">
                    {submitting ? "Sending..." : "Submit Enquiry"}
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
