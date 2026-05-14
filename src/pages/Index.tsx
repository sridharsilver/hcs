import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Award, BookOpen, Users, Microscope, Trophy, Quote, ArrowRight, Sparkles, Calendar, GraduationCap, Heart, Music, X } from "lucide-react";
import heroImg from "@/assets/hero-school4.jpg";
import faculty1 from "@/assets/Faculty1.png";
import faculty2 from "@/assets/Faculty2.png";
import faculty3 from "@/assets/Faculty3.png";
import faculty4 from "@/assets/Faculty4.png";
import testimonial1 from "@/assets/testimonial1.png";
import testimonial2 from "@/assets/testimonial2.png";
import testimonial3 from "@/assets/testimonial3.png";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Home = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
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

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden text-primary-foreground">
        {/* Background Image Layer with Ken Burns effect */}
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ scale: 1.1, filter: "blur(4px)" }}
            animate={{ scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="w-full h-full"
          >
            <img 
              src={heroImg} 
              alt={t('hero.alt')} 
              className="w-full h-full object-cover" 
              width={1920} 
              height={1024} 
            />
          </motion.div>
          
          {/* Advanced Multi-layered Overlays */}
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-[1px] z-10" />
          <div className="absolute inset-0 gradient-hero opacity-90 mix-blend-multiply z-20" />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-transparent to-accent/5 z-25" />
          
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.08] z-30 pointer-events-none" style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }} />
        </div>

        <div className="container relative z-40 py-24 md:py-32">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-5xl"
          >
            {/* Admissions Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm mb-8 shadow-xl">
              <Sparkles className="w-4 h-4 text-accent animate-pulse" />
              <span className="font-semibold tracking-wide uppercase text-[10px]">{t('hero.admissionsOpen')}</span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.05] mb-8 tracking-tight drop-shadow-2xl">
              {t('hero.title').split(' ').slice(0, -1).join(' ')} <span className="text-accent relative inline-block">
                {t('hero.title').split(' ').slice(-1)}
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-accent/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p variants={itemVariants} className="text-lg md:text-2xl text-white/90 max-w-2xl mb-12 leading-relaxed font-light drop-shadow-lg">
              {t('hero.subtitle')}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-5 mb-16">
              <Button asChild size="lg" className="h-14 px-8 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base shadow-elegant hover:scale-105 transition-all duration-300">
                <Link to="/admissions#enquiry">{t('hero.applyNow')} <ArrowRight className="w-5 h-5 ml-2" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-8 bg-white/5 backdrop-blur-md border-white/30 text-white hover:bg-white hover:text-primary font-semibold text-base transition-all duration-300">
                <Link to="/about">{t('hero.learnMore')}</Link>
              </Button>
            </motion.div>

            {/* Quick Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-4xl border-t border-white/10 pt-12">
              {[
                ["27+", t('stats.years')], 
                ["5,200+", t('stats.students')], 
                ["320+", t('stats.faculty')], 
                ["3", t('stats.campuses')]
              ].map(([n, l], idx) => (
                <div key={l} className="group">
                  <p className="text-3xl md:text-5xl font-display font-bold text-accent mb-2 group-hover:scale-110 transition-transform duration-300 origin-left">{n}</p>
                  <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-white/60">{l}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Light Blooms */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-accent/10 blur-[140px] rounded-full z-10 pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-primary-glow/20 blur-[140px] rounded-full z-10 pointer-events-none" />
        
        {/* Bottom Fade Transition */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-45" />
      </section>

      {/* WELCOME */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="py-20"
      >
        <div className="container grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">{t('welcome.tag')}</p>
            <h2 className="text-3xl md:text-4xl mb-5">{t('welcome.title')}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('welcome.p1')}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {t('welcome.p2')}
            </p>
            <Button asChild variant="outline">
              <Link to="/about">{t('welcome.cta')} <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: BookOpen, title: t('features.cbse'), desc: t('features.cbseDesc') },
              { icon: Microscope, title: t('features.labs'), desc: t('features.labsDesc') },
              { icon: Trophy, title: t('features.sports'), desc: t('features.sportsDesc') },
              { icon: Heart, title: t('features.care'), desc: t('features.careDesc') },
            ].map((f) => (
              <Card key={f.title} className="hover-lift border-border/60">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-secondary text-primary flex items-center justify-center mb-4">
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ACHIEVEMENTS */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-20 gradient-soft"
      >
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <motion.p variants={itemVariants} className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">{t('achievements.tag')}</motion.p>
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl">{t('achievements.title')}</motion.h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Award, num: "98%", title: t('achievements.passRate'), desc: t('achievements.passRateDesc') },
              { icon: Trophy, num: "150+", title: t('achievements.medals'), desc: t('achievements.medalsDesc') },
              { icon: GraduationCap, num: "1,200+", title: t('achievements.alumni'), desc: t('achievements.alumniDesc') },
            ].map((a) => (
              <motion.div key={a.title} variants={itemVariants}>
                <Card className="hover-lift border-border/60 bg-card h-full">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-5">
                      <a.icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <p className="text-4xl font-display font-bold text-primary mb-1">{a.num}</p>
                    <h3 className="font-semibold mb-2">{a.title}</h3>
                    <p className="text-sm text-muted-foreground">{a.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ADMISSION HIGHLIGHTS */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="py-20"
      >
        <div className="container">
          <div className="rounded-3xl gradient-primary text-primary-foreground p-10 md:p-14 shadow-elegant relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-primary-foreground/10" />
            <div className="absolute -left-10 -bottom-10 w-52 h-52 rounded-full bg-accent/20" />
            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-accent font-semibold uppercase tracking-widest text-sm mb-3">{t('admissionHighlights.tag')}</p>
                <h2 className="text-3xl md:text-4xl mb-4">{t('admissionHighlights.title')}</h2>
                <p className="text-primary-foreground/85 mb-6">{t('admissionHighlights.desc')}</p>
                <ul className="space-y-2 mb-6 text-sm">
                  {[
                    t('admissionHighlights.feature1'),
                    t('admissionHighlights.feature2'),
                    t('admissionHighlights.feature3'),
                    t('admissionHighlights.feature4')
                  ].map((x) => (
                    <li key={x} className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-accent rounded-full" />{x}</li>
                  ))}
                </ul>
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link to="/admissions#enquiry">{t('admissionHighlights.btn')}</Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Calendar, t: t('admissionHighlights.card1T'), d: t('admissionHighlights.card1D') },
                  { icon: Calendar, t: t('admissionHighlights.card2T'), d: t('admissionHighlights.card2D') },
                  { icon: Calendar, t: t('admissionHighlights.card3T'), d: t('admissionHighlights.card3D') },
                  { icon: Calendar, t: t('admissionHighlights.card4T'), d: t('admissionHighlights.card4D') },
                ].map((c) => (
                  <div key={c.t} className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-5 border border-primary-foreground/15">
                    <c.icon className="w-5 h-5 text-accent mb-3" />
                    <p className="font-semibold">{c.t}</p>
                    <p className="text-xs text-primary-foreground/75 mt-1">{c.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* FACULTY */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-20 bg-secondary/40"
      >
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <motion.p variants={itemVariants} className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">{t('facultySection.tag')}</motion.p>
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl mb-4">{t('facultySection.title')}</motion.h2>
            <motion.p variants={itemVariants} className="text-muted-foreground">{t('facultySection.desc')}</motion.p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: "Mr. Ramana Babu", role: t('facultySection.member1Role'), img: faculty1 },
              { name: "Mr. Aditya", role: t('facultySection.member2Role'), img: faculty2 },
              { name: "Ms. Priya Iyer", role: t('facultySection.member3Role'), img: faculty3 },
              { name: "Mr. Karthik Reddy", role: t('facultySection.member4Role'), img: faculty4 },
            ].map((m) => (
              <motion.div key={m.name} variants={itemVariants}>
                <Card className="text-center hover-lift border-border/60 h-full">
                  <CardContent className="p-6">
                    <img
                      src={m.img}
                      alt={m.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-secondary shadow-md"
                      loading="lazy"
                    />
                    <h3 className="font-semibold">{m.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{m.role}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* STUDENT ACTIVITIES */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-20"
      >
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <motion.p variants={itemVariants} className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">{t('studentLife.tag')}</motion.p>
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl">{t('studentLife.title')}</motion.h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Music, t: t('studentLife.artsT'), d: t('studentLife.artsD') },
              { icon: Trophy, t: t('studentLife.sportsT'), d: t('studentLife.sportsD') },
              { icon: Microscope, t: t('studentLife.clubsT'), d: t('studentLife.clubsD') },
            ].map((a) => (
              <motion.div key={a.t} variants={itemVariants}>
                <Card className="hover-lift overflow-hidden border-border/60 group h-full">
                  <div className="h-44 gradient-primary flex items-center justify-center">
                    <a.icon className="w-16 h-16 text-primary-foreground/80 group-hover:scale-110 transition-smooth" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{a.t}</h3>
                    <p className="text-sm text-muted-foreground">{a.d}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* TESTIMONIALS */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-20 gradient-soft"
      >
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <motion.p variants={itemVariants} className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">{t('testimonials.tag')}</motion.p>
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl">{t('testimonials.title')}</motion.h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { q: t('testimonials.t1Q'), a: "Sneha Mehta", r: t('testimonials.t1R'), img: testimonial1 },
              { q: t('testimonials.t2Q'), a: "Arjun Reddy", r: t('testimonials.t2R'), img: testimonial2 },
              { q: t('testimonials.t3Q'), a: "Fatima Khan", r: t('testimonials.t3R'), img: testimonial3 },
            ].map((t) => (
              <motion.div key={t.a} variants={itemVariants}>
                <Card className="hover-lift border-border/60 bg-card h-full">
                  <CardContent className="p-7">
                    <Quote className="w-8 h-8 text-primary/30 mb-3" />
                    <p className="text-foreground/90 mb-5 leading-relaxed">"{t.q}"</p>
                    <div className="flex items-center gap-3">
                      <img
                        src={t.img}
                        alt={t.a}
                        className="w-11 h-11 rounded-full object-cover border-2 border-secondary shadow-sm"
                        loading="lazy"
                      />
                      <div>
                        <p className="font-semibold text-sm">{t.a}</p>
                        <p className="text-xs text-muted-foreground">{t.r}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* QUICK LINKS */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-20"
      >
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <motion.p variants={itemVariants} className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">{t('quickLinks.tag')}</motion.p>
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl">{t('quickLinks.title')}</motion.h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { t: t('quickLinks.item1T'), d: t('quickLinks.item1D'), to: "/academics", icon: BookOpen },
              { t: t('quickLinks.item2T'), d: t('quickLinks.item2D'), to: "/admissions#enquiry", icon: GraduationCap },
              { t: t('quickLinks.item3T'), d: t('quickLinks.item3D'), to: "/branches", icon: Users },
              { t: t('quickLinks.item4T'), d: t('quickLinks.item4D'), to: "/gallery", icon: Sparkles },
            ].map((q) => (
              <motion.div key={q.t} variants={itemVariants}>
                <Link to={q.to} className="group">
                  <Card className="hover-lift border-border/60 h-full">
                    <CardContent className="p-6">
                      <q.icon className="w-8 h-8 text-primary mb-4" />
                      <h3 className="font-semibold mb-1 group-hover:text-primary transition-smooth">{q.t}</h3>
                      <p className="text-sm text-muted-foreground">{q.d}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* BROCHURE DOWNLOAD - PREMIUM */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="py-20"
      >
        <div className="container">
          <div className="relative rounded-3xl overflow-hidden p-10 md:p-14 gradient-primary text-primary-foreground shadow-elegant">

            {/* DECOR SHAPES */}
            <div className="absolute -left-16 bottom-0 w-72 h-72 bg-primary-foreground/10 rounded-full blur-2xl" />
            <div className="absolute -right-16 top-0 w-72 h-72 bg-primary-foreground/10 rounded-full blur-2xl" />

            <div className="relative grid lg:grid-cols-2 gap-10 items-center">

              {/* LEFT CONTENT */}
              <div>
                <p className="text-accent font-semibold uppercase tracking-widest text-sm mb-3">
                  {t('brochure.tag')}
                </p>

                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {t('brochure.title')}
                </h2>

                <p className="text-primary-foreground/85 mb-6 max-w-xl">
                  {t('brochure.desc')}
                </p>

                <ul className="space-y-2 mb-6 text-sm">
                  {[
                    t('brochure.f1'),
                    t('brochure.f2'),
                    t('brochure.f3'),
                    t('brochure.f4')
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* BUTTONS FIXED */}
                <div className="flex flex-wrap gap-4">

                  {/* PREVIEW BUTTON */}
                  <Button
                    size="lg"
                    onClick={() => setOpen(true)}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                  >
                    {t('brochure.preview')}
                  </Button>

                  {/* DOWNLOAD BUTTON FIXED */}
                  <Button
                    asChild
                    size="lg"
                    className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
                  >
                    <a href={`${window.location.origin}${import.meta.env.BASE_URL}brochure.pdf`} download>
                      {t('brochure.download')}
                    </a>
                  </Button>

                </div>
              </div>

              {/* RIGHT SIDE CARDS */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: t('brochure.c1T'), desc: t('brochure.c1D') },
                  { title: t('brochure.c2T'), desc: t('brochure.c2D') },
                  { title: t('brochure.c3T'), desc: t('brochure.c3D') },
                  { title: t('brochure.c4T'), desc: t('brochure.c4D') }
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-5 border border-primary-foreground/15"
                  >
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-xs text-primary-foreground/75 mt-1">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </motion.section>
      {/* BROCHURE PREVIEW MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent hideClose={true} className="max-w-5xl h-[95vh] p-0 overflow-hidden border-none bg-black/5 shadow-none flex flex-col">
          <div className="relative flex-1 w-full h-full">
            {/* HIGHLIGHTED CLOSE BUTTON */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
            >
              <X className="w-6 h-6" />
            </Button>

            <iframe
              src={`${window.location.origin}${import.meta.env.BASE_URL}brochure.pdf`}
              className="w-full h-full border-none"
              title="School Brochure"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Home;
