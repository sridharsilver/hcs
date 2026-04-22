import PageHero from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { branches } from "@/data/branches";
import { MapPin, Phone, Mail, Calendar, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const Branches = () => (
  <>
    <PageHero title="Our Three Campuses" subtitle="One school, three vibrant homes across Hyderabad — pick the one closest to you." />

    <section className="py-20">
      <div className="container space-y-12">
        {branches.map((b, i) => (
          <Card key={b.slug} id={b.slug} className="overflow-hidden border-border/60 hover-lift">
            <div className={`grid lg:grid-cols-2 ${i % 2 ? "lg:[&>div:first-child]:order-2" : ""}`}>
              <div className="relative bg-secondary aspect-[4/3] lg:aspect-auto min-h-[320px] flex items-center justify-center">
                {/* Map placeholder */}
                <div className="absolute inset-0 gradient-primary opacity-90" />
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: "linear-gradient(0deg, white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }} />
                <div className="relative text-center text-primary-foreground">
                  <MapPin className="w-14 h-14 mx-auto mb-3 text-accent" />
                  <p className="font-display font-semibold text-xl">{b.area}</p>
                  <p className="text-sm text-primary-foreground/75 mt-1">Interactive map placeholder</p>
                </div>
              </div>
              <CardContent className="p-8 md:p-10">
                <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">Campus 0{i + 1}</p>
                <h2 className="text-2xl md:text-3xl font-display font-semibold mb-4">{b.name}</h2>
                <ul className="space-y-3 text-sm mb-6">
                  <li className="flex gap-3"><MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span>{b.address}</span></li>
                  <li className="flex gap-3"><Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" /><a href={`tel:${b.phone.replace(/\s/g,'')}`} className="hover:text-primary">{b.phone}</a></li>
                  <li className="flex gap-3"><Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" /><a href={`mailto:${b.email}`} className="hover:text-primary">{b.email}</a></li>
                  <li className="flex gap-3"><Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span>Established {b.established}</span></li>
                </ul>
                <div>
                  <p className="font-semibold mb-3 text-sm">Key Facilities</p>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {b.facilities.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />{f}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button asChild className="gradient-primary text-primary-foreground border-0"><Link to="/admissions">Enquire</Link></Button>
                  <Button asChild variant="outline"><Link to="/contact">Schedule Visit</Link></Button>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </section>
  </>
);

export default Branches;
