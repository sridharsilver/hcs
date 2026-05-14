import PageHero from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, FlaskConical, Library, Trophy, Palette, Code2, Music, Globe } from "lucide-react";
import heroBg from "@/assets/hero-school3.jpg";
import { useTranslation } from "react-i18next";

const Academics = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageHero 
        title={t('academics.heroTitle')} 
        subtitle={t('academics.heroSubtitle')} 
        bgImage={heroBg}
      />

      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">{t('academics.curriculumTag')}</p>
            <h2 className="text-3xl md:text-4xl">{t('academics.curriculumTitle')}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { tKey: "academics.prePrimary", gKey: "academics.prePrimaryG", dKey: "academics.prePrimaryD" },
              { tKey: "academics.primary", gKey: "academics.primaryG", dKey: "academics.primaryD" },
              { tKey: "academics.middle", gKey: "academics.middleG", dKey: "academics.middleD" },
              { tKey: "academics.secondary", gKey: "academics.secondaryG", dKey: "academics.secondaryD" },
            ].map((c) => (
              <Card key={c.tKey} className="hover-lift border-border/60">
                <CardContent className="p-6">
                  <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">{t(c.gKey)}</p>
                  <h3 className="font-semibold text-lg mb-2">{t(c.tKey)}</h3>
                  <p className="text-sm text-muted-foreground">{t(c.dKey)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 gradient-soft">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">{t('academics.facilitiesTag')}</p>
            <h2 className="text-3xl md:text-4xl">{t('academics.facilitiesTitle')}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FlaskConical, tKey: "academics.scienceLabs", dKey: "academics.scienceLabsD" },
              { icon: Code2, tKey: "academics.aiLabs", dKey: "academics.aiLabsD" },
              { icon: Library, tKey: "academics.library", dKey: "academics.libraryD" },
              { icon: Trophy, tKey: "academics.sportsFac", dKey: "academics.sportsFacD" },
              { icon: Palette, tKey: "academics.artStudios", dKey: "academics.artStudiosD" },
              { icon: Music, tKey: "academics.musicStudios", dKey: "academics.musicStudiosD" },
            ].map((f) => (
              <Card key={f.tKey} className="hover-lift border-border/60 bg-card">
                <CardContent className="p-7">
                  <div className="w-12 h-12 rounded-lg bg-secondary text-primary flex items-center justify-center mb-4">
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold mb-2">{t(f.tKey)}</h3>
                  <p className="text-sm text-muted-foreground">{t(f.dKey)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">{t('academics.beyondBooks')}</p>
            <h2 className="text-3xl md:text-4xl">{t('academics.sportsExtra')}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border/60 hover-lift">
              <CardContent className="p-8">
                <Trophy className="w-9 h-9 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">{t('academics.sportsPrograms')}</h3>
                <p className="text-muted-foreground mb-4">{t('academics.sportsDesc')}</p>
                <div className="flex flex-wrap gap-2">
                  {["cricket", "football", "swimming", "basketball", "athletics", "yoga", "karate", "chess", "tableTennis"].map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                      {t(`academics.activities.${s}`)}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60 hover-lift">
              <CardContent className="p-8">
                <Globe className="w-9 h-9 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">{t('academics.clubsSocieties')}</h3>
                <p className="text-muted-foreground mb-4">{t('academics.clubsDesc')}</p>
                <div className="flex flex-wrap gap-2">
                  {["robotics", "modelUN", "debate", "ecoClub", "drama", "choir", "coding", "photography", "astronomy"].map((s) => (
                    <span key={s} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                      {t(`academics.clubs.${s}`)}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default Academics;
