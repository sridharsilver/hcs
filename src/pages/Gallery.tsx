import { useMemo, useState } from "react";
import PageHero from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { t: string; c: string; img: string };

const items: Item[] = [
  { t: "Annual Sports Day", c: "Sports", img: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80" },
  { t: "Spring Music Festival", c: "Arts", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80" },
  { t: "Science Exhibition", c: "Academics", img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80" },
  { t: "Art & Craft Showcase", c: "Arts", img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80" },
  { t: "Cultural Day", c: "Community", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80" },
  { t: "Model United Nations", c: "Academics", img: "https://images.unsplash.com/photo-1560523159-4a9692d222f8?auto=format&fit=crop&w=1200&q=80" },
  { t: "Founder's Day", c: "Community", img: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80" },
  { t: "Field Trip — Ramoji", c: "Excursions", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80" },
  { t: "Inter-school Tournament", c: "Sports", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80" },
];

const sections = [
  { t: "Sports & Athletics", d: "Capturing every winning moment, every sprint and every cheer." },
  { t: "Arts & Performances", d: "Music recitals, dance evenings and theatre productions." },
  { t: "Academics & Innovation", d: "Science fairs, hackathons, debates and exhibitions." },
];

const categories = ["All", "Sports", "Arts", "Academics", "Community", "Excursions"];

const Gallery = () => {
  const [active, setActive] = useState("All");
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const filtered = useMemo(
    () => (active === "All" ? items : items.filter((i) => i.c === active)),
    [active]
  );

  const current = openIdx !== null ? filtered[openIdx] : null;

  const go = (dir: number) => {
    if (openIdx === null) return;
    setOpenIdx((openIdx + dir + filtered.length) % filtered.length);
  };

  return (
    <>
      <PageHero title="Life at HCS" subtitle="A peek into the moments that make our school memorable." />

      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">Gallery</p>
            <h2 className="text-3xl md:text-4xl">Recent Highlights</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium border transition-smooth",
                  active === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground/75 border-border hover:border-primary hover:text-primary"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((it, i) => (
              <Card
                key={it.t}
                onClick={() => setOpenIdx(i)}
                className="overflow-hidden border-border/60 hover-lift group cursor-pointer"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={it.img}
                    alt={it.t}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-smooth group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/85 backdrop-blur-sm text-foreground text-xs font-medium">
                    {it.c}
                  </div>
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-smooth" />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold">{it.t}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Click to view</p>
                </div>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground mt-8">No photos in this category yet.</p>
          )}
        </div>
      </section>

      <Dialog open={openIdx !== null} onOpenChange={(o) => !o && setOpenIdx(null)}>
        <DialogContent className="max-w-5xl p-0 bg-background border-border overflow-hidden">
          <DialogTitle className="sr-only">{current?.t ?? "Gallery image"}</DialogTitle>
          {current && (
            <div className="relative">
              <img
                src={current.img}
                alt={current.t}
                className="w-full max-h-[80vh] object-contain bg-black"
              />
              <button
                onClick={() => setOpenIdx(null)}
                aria-label="Close"
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-background/80 hover:bg-background flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
              <Button
                onClick={() => go(-1)}
                aria-label="Previous"
                size="icon"
                variant="secondary"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => go(1)}
                aria-label="Next"
                size="icon"
                variant="secondary"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
              <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/80 to-transparent text-white">
                <p className="text-xs uppercase tracking-widest text-accent mb-1">{current.c}</p>
                <h3 className="text-xl font-display font-semibold">{current.t}</h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
};

export default Gallery;
