import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageHero from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { GalleryItem, GalleryCategory } from "@/types";
import { useTranslation } from "react-i18next";

import heroBg from "@/assets/hero-school.jpg";

const Gallery = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState("All");
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [isLoading, setIsLoading] = useState(true);

  const sections = [
    { tKey: "gallery.sportsT", dKey: "gallery.sportsD" },
    { tKey: "gallery.artsT", dKey: "gallery.artsD" },
    { tKey: "gallery.academicsT", dKey: "gallery.academicsD" },
  ];

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

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    },
  };

  useEffect(() => {
    fetchGalleryData();
  }, []);

  const fetchGalleryData = async () => {
    try {
      setIsLoading(true);
      const [itemsRes, catsRes] = await Promise.all([
        supabase.from('gallery').select('*').order('created_at', { ascending: false }),
        supabase.from('gallery_categories').select('name').order('name')
      ]);

      if (itemsRes.data) setItems(itemsRes.data);
      if (catsRes.data) {
        const catNames = catsRes.data.map(c => c.name);
        setCategories(["All", ...catNames]);
      }
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = useMemo(
    () => (active === "All" ? items : items.filter((i) => i.category === active)),
    [active, items]
  );

  const current = openIdx !== null ? filtered[openIdx] : null;

  const go = (dir: number) => {
    if (openIdx === null) return;
    setOpenIdx((openIdx + dir + filtered.length) % filtered.length);
  };

  return (
    <>
      <PageHero 
        title={t('gallery.heroTitle')} 
        subtitle={t('gallery.heroSubtitle')} 
        bgImage={heroBg}
      />

      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="py-20"
      >
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">{t('gallery.tag')}</p>
            <h2 className="text-3xl md:text-4xl">{t('gallery.title')}</h2>
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
                {cat === "All" ? t('gallery.all') : cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-[2rem] bg-muted animate-pulse" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((it, i) => (
                <Card
                  key={it.id}
                  onClick={() => setOpenIdx(i)}
                  className="overflow-hidden border-border/60 hover-lift group cursor-pointer"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={it.image_url}
                      alt={it.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-smooth group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-background/85 backdrop-blur-sm text-foreground text-xs font-medium">
                      {it.category}
                    </div>
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-smooth" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold">{it.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{t('gallery.clickToView')}</p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="h-[40vh] flex flex-col items-center justify-center gap-4 text-muted-foreground bg-card rounded-[3rem] border border-dashed border-border/60">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <ImageIcon className="h-8 w-8 opacity-20" />
              </div>
              <p className="font-medium text-lg text-center px-4">{t('gallery.noPhotos')}</p>
              <Button variant="link" className="text-primary font-bold" onClick={() => setActive('All')}>{t('gallery.viewAll')}</Button>
            </div>
          )}
        </div>
      </motion.section>

      <Dialog open={openIdx !== null} onOpenChange={(o) => !o && setOpenIdx(null)}>
        <DialogContent hideClose className="w-auto max-w-none overflow-hidden border-0 bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">{current?.title ?? "Gallery image"}</DialogTitle>
          {current && (
            <div className="relative">
              <div className="relative aspect-[3/4] w-[92vw] max-h-[86vh] overflow-hidden bg-black sm:h-[92vh] sm:w-[96vw] sm:max-h-none sm:aspect-auto">
                <img
                  src={current.image_url}
                  alt={current.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <DialogClose asChild>
                <button
                  type="button"
                  aria-label="Close"
                  className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-background/80 hover:bg-background flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </DialogClose>
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
              <div className="absolute bottom-0 inset-x-0 px-5 pb-7 pt-16 bg-gradient-to-t from-black/90 via-black/65 to-transparent text-white">
                <p className="text-xs uppercase tracking-widest text-accent mb-1">{current.category}</p>
                <h3 className="text-xl font-display font-semibold">{current.title}</h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-20 gradient-soft"
      >
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">{t('gallery.categoriesTag')}</p>
            <h2 className="text-3xl md:text-4xl">{t('gallery.categoriesTitle')}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {sections.map((s) => (
              <motion.div key={s.tKey} variants={itemVariants}>
                <Card className="p-7 hover-lift border-border/60 bg-card h-full">
                  <h3 className="text-xl font-display font-semibold mb-2">{t(s.tKey)}</h3>
                  <p className="text-sm text-muted-foreground">{t(s.dKey)}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default Gallery;
