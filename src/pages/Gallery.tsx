import PageHero from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Camera, Trophy, Music, Microscope, Palette, Users, Globe, Sparkles } from "lucide-react";

const items = [
  { icon: Trophy, t: "Annual Sports Day", c: "Sports" },
  { icon: Music, t: "Spring Music Festival", c: "Arts" },
  { icon: Microscope, t: "Science Exhibition", c: "Academics" },
  { icon: Palette, t: "Art & Craft Showcase", c: "Arts" },
  { icon: Users, t: "Cultural Day", c: "Community" },
  { icon: Globe, t: "Model United Nations", c: "Academics" },
  { icon: Sparkles, t: "Founder's Day", c: "Community" },
  { icon: Camera, t: "Field Trip — Ramoji", c: "Excursions" },
  { icon: Trophy, t: "Inter-school Tournament", c: "Sports" },
];

const sections = [
  { t: "Sports & Athletics", d: "Capturing every winning moment, every sprint and every cheer." },
  { t: "Arts & Performances", d: "Music recitals, dance evenings and theatre productions." },
  { t: "Academics & Innovation", d: "Science fairs, hackathons, debates and exhibitions." },
];

const Gallery = () => (
  <>
    <PageHero title="Life at HCS" subtitle="A peek into the moments that make our school memorable." />

    <section className="py-20">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">Gallery</p>
          <h2 className="text-3xl md:text-4xl">Recent Highlights</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it, i) => (
            <Card key={it.t} className="overflow-hidden border-border/60 hover-lift group cursor-pointer">
              <div className="relative aspect-[4/3] gradient-primary flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-15" style={{
                  backgroundImage: "radial-gradient(white 1px, transparent 1px)",
                  backgroundSize: `${20 + i * 2}px ${20 + i * 2}px`,
                }} />
                <it.icon className="w-20 h-20 text-primary-foreground/85 transition-smooth group-hover:scale-110" />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary-foreground/15 backdrop-blur-sm text-primary-foreground text-xs font-medium">{it.c}</div>
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-smooth" />
              </div>
              <div className="p-5">
                <h3 className="font-semibold">{it.t}</h3>
                <p className="text-xs text-muted-foreground mt-1">Image placeholder — replace with event photo</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20 gradient-soft">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">Categories</p>
          <h2 className="text-3xl md:text-4xl">Explore by Activity</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {sections.map((s) => (
            <Card key={s.t} className="p-7 hover-lift border-border/60 bg-card">
              <h3 className="text-xl font-display font-semibold mb-2">{s.t}</h3>
              <p className="text-sm text-muted-foreground">{s.d}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  </>
);

export default Gallery;
