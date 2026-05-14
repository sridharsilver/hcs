import PageHero from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart, Award, Users, BookOpen } from "lucide-react";
import director from "@/assets/testimonial3.png";
import principal from "@/assets/Faculty1.png";
import heroBg from "@/assets/hero-school2.jpg";
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageHero
        title={t('about.heroTitle')}
        subtitle={t('about.heroSubtitle')}
        bgImage={heroBg}
      />

      {/* STORY */}
      <section className="py-20">
        <div className="container grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">
              {t('about.storyTag')}
            </p>
            <h2 className="text-3xl md:text-4xl mb-5">
              {t('about.storyTitle')}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {t('about.storyP1')}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {t('about.storyP2')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { num: "1998", l: "Founded" },
              { num: "27+", tKey: 'stats.years' },
              { num: "5,200+", tKey: 'stats.students' },
              { num: "320+", tKey: 'stats.faculty' },
            ].map((s) => (
              <Card key={s.num} className="border-border/60">
                <CardContent className="p-6 text-center">
                  <p className="text-3xl font-display font-bold text-primary">
                    {s.num}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{s.tKey ? t(s.tKey) : s.l}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* VISION / MISSION */}
      <section className="py-20 gradient-soft">
        <div className="container grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Eye,
              t: t('about.vision'),
              d: t('about.visionDesc'),
            },
            {
              icon: Target,
              t: t('about.mission'),
              d: t('about.missionDesc'),
            },
            {
              icon: Heart,
              t: t('about.values'),
              d: t('about.valuesDesc'),
            },
          ].map((c) => (
            <Card key={c.t} className="hover-lift border-border/60 bg-card">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-5">
                  <c.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{c.t}</h3>
                <p className="text-muted-foreground leading-relaxed">{c.d}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">
              {t('features.tag')}
            </p>
            <h2 className="text-3xl md:text-4xl">
              {t('features.title')}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Award,
                t: t('features.cbse'),
                d: t('features.cbseDesc'),
              },
              {
                icon: Users,
                t: t('features.classSize'),
                d: t('features.classSizeDesc'),
              },
              {
                icon: BookOpen,
                t: t('features.skills'),
                d: t('features.skillsDesc'),
              },
            ].map((c) => (
              <Card key={c.t} className="hover-lift border-border/60">
                <CardContent className="p-7">
                  <c.icon className="w-9 h-9 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">{c.t}</h3>
                  <p className="text-sm text-muted-foreground">{c.d}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DIRECTOR */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center bg-card border border-border/60 rounded-3xl p-8 md:p-12 shadow-sm">

            {/* IMAGE */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative group">
                <img
                  src={director}
                  alt="Director"
                  className="w-[320px] md:w-[420px] lg:w-[480px] rounded-2xl shadow-lg border border-border/40 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>

            {/* CONTENT */}
            <div className="max-w-xl">
              <div className="border-l-4 border-primary pl-4 mb-4">
                <p className="text-primary font-semibold uppercase tracking-widest text-xs">
                  {t('about.directorTag')}
                </p>
              </div>

              <h2 className="text-3xl md:text-4xl font-semibold mb-5 leading-tight">
                {t('about.directorTitle')}
              </h2>

              <p className="text-muted-foreground leading-relaxed mb-4">
                {t('about.directorP1')}
              </p>

              <p className="text-muted-foreground leading-relaxed mb-4">
                {t('about.directorP2')}
              </p>

              <div className="mt-6">
                <p className="font-semibold text-foreground">
                  {t('about.directorName')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('about.directorRole')}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PRINCIPAL */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center bg-card border border-border/60 rounded-3xl p-8 md:p-12 shadow-sm">

            {/* IMAGE */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative group">
                <img
                  src={principal}
                  alt="Principal"
                  className="w-[320px] md:w-[420px] lg:w-[480px] rounded-2xl shadow-lg border border-border/40 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>

            {/* CONTENT */}
            <div className="order-2 lg:order-1 max-w-xl">
              <div className="border-l-4 border-primary pl-4 mb-4">
                <p className="text-primary font-semibold uppercase tracking-widest text-xs">
                  {t('about.principalTag')}
                </p>
              </div>

              <h2 className="text-3xl md:text-4xl font-semibold mb-5 leading-tight">
                {t('about.principalTitle')}
              </h2>

              <p className="text-muted-foreground leading-relaxed mb-4">
                {t('about.principalP1')}
              </p>

              <p className="text-muted-foreground leading-relaxed mb-4">
                {t('about.principalP2')}
              </p>


              <div className="mt-6">
                <p className="font-semibold text-foreground">
                  {t('about.principalName')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('about.principalRole')}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </>
  );
};

export default About;