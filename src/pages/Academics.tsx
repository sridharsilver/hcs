import PageHero from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, FlaskConical, Library, Trophy, Palette, Code2, Music, Globe } from "lucide-react";

const Academics = () => (
  <>
    <PageHero title="Academics at HCS" subtitle="A future-ready curriculum that balances rigour, creativity, and well-being." />

    <section className="py-20">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">Curriculum</p>
          <h2 className="text-3xl md:text-4xl">Learning, Stage by Stage</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { t: "Pre-Primary", g: "Pre-KG – KG II", d: "Play-based learning, language, motor skills and social-emotional growth." },
            { t: "Primary", g: "Grade I – V", d: "Inquiry-led foundation in literacy, numeracy, science and the arts." },
            { t: "Middle", g: "Grade VI – VIII", d: "Conceptual clarity, project work, second language and digital literacy." },
            { t: "Secondary & Sr.", g: "Grade IX – XII", d: "CBSE board prep with Science, Commerce, Humanities streams." },
          ].map((c) => (
            <Card key={c.t} className="hover-lift border-border/60">
              <CardContent className="p-6">
                <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-2">{c.g}</p>
                <h3 className="font-semibold text-lg mb-2">{c.t}</h3>
                <p className="text-sm text-muted-foreground">{c.d}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20 gradient-soft">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">Facilities</p>
          <h2 className="text-3xl md:text-4xl">Spaces Designed for Discovery</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: FlaskConical, t: "Science Labs", d: "Fully-equipped Physics, Chemistry and Biology labs with safety-first design." },
            { icon: Code2, t: "Computer & AI Labs", d: "Modern workstations, robotics kits, and Python/AI learning modules." },
            { icon: Library, t: "Library & Resource Centre", d: "30,000+ titles, digital archives and quiet reading zones." },
            { icon: Trophy, t: "Sports Facilities", d: "Cricket grounds, swimming pool, indoor courts, athletics track." },
            { icon: Palette, t: "Art & Design Studios", d: "Painting, ceramics, design thinking and maker-space corners." },
            { icon: Music, t: "Music & Dance Studios", d: "Western & Indian classical music, soundproof rooms and a dance hall." },
          ].map((f) => (
            <Card key={f.t} className="hover-lift border-border/60 bg-card">
              <CardContent className="p-7">
                <div className="w-12 h-12 rounded-lg bg-secondary text-primary flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">{f.t}</h3>
                <p className="text-sm text-muted-foreground">{f.d}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">Beyond Books</p>
          <h2 className="text-3xl md:text-4xl">Sports & Extracurriculars</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-border/60 hover-lift">
            <CardContent className="p-8">
              <Trophy className="w-9 h-9 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Sports Programs</h3>
              <p className="text-muted-foreground mb-4">Over 20 disciplines led by professional coaches.</p>
              <div className="flex flex-wrap gap-2">
                {["Cricket", "Football", "Swimming", "Basketball", "Athletics", "Yoga", "Karate", "Chess", "Table Tennis"].map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">{s}</span>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/60 hover-lift">
            <CardContent className="p-8">
              <Globe className="w-9 h-9 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Clubs & Societies</h3>
              <p className="text-muted-foreground mb-4">Spaces to find your tribe and pursue your passions.</p>
              <div className="flex flex-wrap gap-2">
                {["Robotics", "Model UN", "Debate", "Eco Club", "Drama", "Choir", "Coding", "Photography", "Astronomy"].map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">{s}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  </>
);

export default Academics;
