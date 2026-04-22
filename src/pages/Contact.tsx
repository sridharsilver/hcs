import PageHero from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { branches } from "@/data/branches";

const Contact = () => {
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Message sent! We'll reply within one working day.");
      (e.target as HTMLFormElement).reset();
    }, 800);
  };

  return (
    <>
      <PageHero title="Contact Us" subtitle="We'd love to hear from you. Reach out and we'll respond within 24 hours." />

      <section className="py-20">
        <div className="container grid lg:grid-cols-3 gap-6 mb-14">
          {[
            { icon: Phone, t: "Call Us", lines: ["+91 40 2354 1100", "+91 40 2305 4400"] },
            { icon: Mail, t: "Email Us", lines: ["info@hcschools.in", "admissions@hcschools.in"] },
            { icon: MapPin, t: "Head Office", lines: ["Road No. 12, Banjara Hills", "Hyderabad, Telangana 500034"] },
          ].map((c) => (
            <Card key={c.t} className="hover-lift border-border/60">
              <CardContent className="p-7">
                <div className="w-12 h-12 rounded-lg gradient-primary text-primary-foreground flex items-center justify-center mb-4">
                  <c.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">{c.t}</h3>
                {c.lines.map((l) => <p key={l} className="text-sm text-muted-foreground">{l}</p>)}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <Card className="border-border/60">
            <CardContent className="p-8">
              <h2 className="text-2xl font-display font-semibold mb-2">Send Us a Message</h2>
              <p className="text-sm text-muted-foreground mb-6">Have a question or want to plan a campus visit? We're here.</p>
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="n">Name</Label><Input id="n" required placeholder="Your name" /></div>
                  <div className="space-y-2"><Label htmlFor="e">Email</Label><Input id="e" type="email" required placeholder="you@example.com" /></div>
                </div>
                <div className="space-y-2"><Label htmlFor="m">Message</Label><Textarea id="m" rows={5} required placeholder="Type your message..." /></div>
                <Button type="submit" disabled={submitting} className="gradient-primary text-primary-foreground border-0 w-full" size="lg">
                  {submitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardContent className="p-7">
              <h3 className="font-display font-semibold text-xl mb-4">Follow Us</h3>
              <p className="text-sm text-muted-foreground mb-5">Daily moments and updates from across our campuses.</p>
              <div className="flex gap-3">
                {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                  <a key={i} href="#" aria-label="social" className="w-11 h-11 rounded-full gradient-primary text-primary-foreground flex items-center justify-center hover:scale-110 transition-smooth">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
};

export default Contact;
