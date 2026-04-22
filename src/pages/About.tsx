import PageHero from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart, Award, Users, BookOpen } from "lucide-react";

const About = () => (
  <>
    <PageHero title="About Hyderabad Central Schools" subtitle="A legacy of academic excellence and joyful learning since 1998." />
    <section className="py-20">
      <div className="container grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">Our Story</p>
          <h2 className="text-3xl md:text-4xl mb-5">Built on Vision, Grown With Love</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Founded in 1998 with a single campus in Banjara Hills and 120 students, Hyderabad Central Schools has grown into a beloved institution serving over 5,200 learners across three campuses in the city.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We believe in education that is rigorous yet humane — one that prepares young people not just for examinations, but for life. Our classrooms are spaces of inquiry, our playgrounds are arenas of grit, and our campuses are families.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { num: "1998", l: "Founded" },
            { num: "27+", l: "Years strong" },
            { num: "5,200+", l: "Students" },
            { num: "320+", l: "Educators" },
          ].map((s) => (
            <Card key={s.l} className="border-border/60">
              <CardContent className="p-6 text-center">
                <p className="text-3xl font-display font-bold text-primary">{s.num}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.l}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20 gradient-soft">
      <div className="container grid md:grid-cols-3 gap-6">
        {[
          { icon: Eye, t: "Our Vision", d: "To be a beacon of holistic education that nurtures lifelong learners and ethical leaders for a global community." },
          { icon: Target, t: "Our Mission", d: "Provide a safe, stimulating environment where every child discovers their strengths and pursues excellence with joy." },
          { icon: Heart, t: "Our Values", d: "Integrity, curiosity, compassion, and resilience guide every interaction within our school family." },
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

    <section className="py-20">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">Why Choose Us</p>
          <h2 className="text-3xl md:text-4xl">What Makes HCS Special</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Award, t: "Award-winning Curriculum", d: "CBSE-aligned with international best practices and inquiry-led teaching." },
            { icon: Users, t: "Small Class Sizes", d: "Average 1:18 teacher-student ratio for personalised attention." },
            { icon: BookOpen, t: "21st-Century Skills", d: "Critical thinking, creativity, communication and collaboration woven into every subject." },
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
  </>
);

export default About;
