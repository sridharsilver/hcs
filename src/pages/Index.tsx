import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, BookOpen, Users, Microscope, Trophy, Quote, ArrowRight, Sparkles, Calendar, GraduationCap, Heart, Music } from "lucide-react";
import heroImg from "@/assets/hero-school.jpg";

const Home = () => {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        <img src={heroImg} alt="Hyderabad Central Schools campus" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1024} />
        <div className="absolute inset-0 gradient-hero" />
        <div className="container relative text-primary-foreground py-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/15 backdrop-blur-sm border border-primary-foreground/20 text-sm mb-6">
            <Sparkles className="w-4 h-4 text-accent" />
            Admissions Open for 2025-26
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold max-w-4xl leading-tight mb-6">
            Where Curiosity Meets <span className="text-accent">Excellence</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mb-8">
            Welcome to Hyderabad Central Schools — three thriving campuses dedicated to shaping the thinkers, innovators, and leaders of tomorrow.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
              <Link to="/admissions">Apply for Admission <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/about">Discover Our Story</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14 max-w-3xl">
            {[["27+", "Years of Excellence"], ["5,200+", "Happy Students"], ["320+", "Expert Faculty"], ["3", "Vibrant Campuses"]].map(([n, l]) => (
              <div key={l}>
                <p className="text-3xl md:text-4xl font-display font-bold text-accent">{n}</p>
                <p className="text-sm text-primary-foreground/80 mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WELCOME */}
      <section className="py-20">
        <div className="container grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">Welcome</p>
            <h2 className="text-3xl md:text-4xl mb-5">A Place Where Every Child <span className="text-primary">Belongs & Blooms</span></h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              At Hyderabad Central Schools, learning is a joyful adventure. Our campuses across Banjara Hills, Kukatpally, and Secunderabad offer a nurturing environment where academic rigour meets creativity, sport, and character.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              From early years to senior secondary, we craft experiences that build confident, compassionate, and capable young people ready for a global future.
            </p>
            <Button asChild variant="outline">
              <Link to="/about">Learn more about us <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: BookOpen, title: "CBSE Curriculum", desc: "Future-ready learning" },
              { icon: Microscope, title: "Modern Labs", desc: "STEM & innovation" },
              { icon: Trophy, title: "Sports Excellence", desc: "20+ disciplines" },
              { icon: Heart, title: "Holistic Care", desc: "Counsellors on campus" },
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
      </section>

      {/* ACHIEVEMENTS */}
      <section className="py-20 gradient-soft">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">Achievements</p>
            <h2 className="text-3xl md:text-4xl">Celebrating Our Proud Moments</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Award, num: "98%", title: "Class XII Pass Rate", desc: "With 42% scoring above 90%" },
              { icon: Trophy, num: "150+", title: "State & National Medals", desc: "Across academics, sports & arts" },
              { icon: GraduationCap, num: "1,200+", title: "Ivy & IIT Alumni", desc: "Across the world's best universities" },
            ].map((a) => (
              <Card key={a.title} className="hover-lift border-border/60 bg-card">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-5">
                    <a.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <p className="text-4xl font-display font-bold text-primary mb-1">{a.num}</p>
                  <h3 className="font-semibold mb-2">{a.title}</h3>
                  <p className="text-sm text-muted-foreground">{a.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ADMISSION HIGHLIGHTS */}
      <section className="py-20">
        <div className="container">
          <div className="rounded-3xl gradient-primary text-primary-foreground p-10 md:p-14 shadow-elegant relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-primary-foreground/10" />
            <div className="absolute -left-10 -bottom-10 w-52 h-52 rounded-full bg-accent/20" />
            <div className="relative grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-accent font-semibold uppercase tracking-widest text-sm mb-3">Admissions 2025-26</p>
                <h2 className="text-3xl md:text-4xl mb-4">Begin Your Child's Journey With Us</h2>
                <p className="text-primary-foreground/85 mb-6">Now open for Pre-KG to Grade XI. Enjoy a simple online process, transparent fees, and a campus tour included.</p>
                <ul className="space-y-2 mb-6 text-sm">
                  {["Easy 4-step online application", "Scholarships for meritorious students", "Sibling & alumni discounts", "Personalised campus tours"].map((x) => (
                    <li key={x} className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-accent rounded-full" />{x}</li>
                  ))}
                </ul>
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link to="/admissions">Start Application</Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Calendar, t: "Pre-KG – Grade V", d: "Apply anytime" },
                  { icon: Calendar, t: "Grade VI – VIII", d: "Entrance + interview" },
                  { icon: Calendar, t: "Grade IX & XI", d: "Merit-based intake" },
                  { icon: Calendar, t: "Open Day", d: "Every Saturday" },
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
      </section>

      {/* FACULTY */}
      <section className="py-20 bg-secondary/40">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">Our Faculty</p>
            <h2 className="text-3xl md:text-4xl mb-4">Mentors Who Inspire</h2>
            <p className="text-muted-foreground">A team of 320+ educators — postgraduates, doctorates, and certified specialists who bring learning to life.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: "Dr. Anjali Rao", role: "Principal, Banjara Hills", init: "AR" },
              { name: "Mr. Rahul Verma", role: "Head of STEM", init: "RV" },
              { name: "Ms. Priya Iyer", role: "Head of Languages", init: "PI" },
              { name: "Mr. Karthik Reddy", role: "Director of Sports", init: "KR" },
            ].map((m) => (
              <Card key={m.name} className="text-center hover-lift border-border/60">
                <CardContent className="p-6">
                  <div className="w-20 h-20 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center text-primary-foreground font-display font-bold text-xl">{m.init}</div>
                  <h3 className="font-semibold">{m.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{m.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* STUDENT ACTIVITIES */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">Student Life</p>
            <h2 className="text-3xl md:text-4xl">Beyond the Classroom</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Music, t: "Performing Arts", d: "Music, dance, drama and choir clubs that fill our halls with creativity." },
              { icon: Trophy, t: "Sports & Fitness", d: "From cricket and football to swimming, yoga and athletics." },
              { icon: Microscope, t: "Clubs & Societies", d: "Robotics, Model UN, eco-club, coding, debate and more." },
            ].map((a) => (
              <Card key={a.t} className="hover-lift overflow-hidden border-border/60 group">
                <div className="h-44 gradient-primary flex items-center justify-center">
                  <a.icon className="w-16 h-16 text-primary-foreground/80 group-hover:scale-110 transition-smooth" />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{a.t}</h3>
                  <p className="text-sm text-muted-foreground">{a.d}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 gradient-soft">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">Testimonials</p>
            <h2 className="text-3xl md:text-4xl">Voices From Our Community</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { q: "HCS gave my daughter wings — confident, articulate, and curious. Truly a school that cares.", a: "Sneha Mehta", r: "Parent, Grade VIII" },
              { q: "The teachers go far beyond textbooks. I discovered my love for robotics here in Grade IX.", a: "Arjun Reddy", r: "Alumnus, IIT Madras" },
              { q: "A campus where sports, arts and academics live in perfect balance. Incredible community.", a: "Fatima Khan", r: "Parent, Grade III" },
            ].map((t) => (
              <Card key={t.a} className="hover-lift border-border/60 bg-card">
                <CardContent className="p-7">
                  <Quote className="w-8 h-8 text-primary/30 mb-3" />
                  <p className="text-foreground/90 mb-5 leading-relaxed">"{t.q}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">{t.a[0]}</div>
                    <div>
                      <p className="font-semibold text-sm">{t.a}</p>
                      <p className="text-xs text-muted-foreground">{t.r}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">Quick Links</p>
            <h2 className="text-3xl md:text-4xl">Explore More</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { t: "Academics", d: "Curriculum & programs", to: "/academics", icon: BookOpen },
              { t: "Admissions", d: "How to apply", to: "/admissions", icon: GraduationCap },
              { t: "Branches", d: "Visit our campuses", to: "/branches", icon: Users },
              { t: "Gallery", d: "Life at HCS", to: "/gallery", icon: Sparkles },
            ].map((q) => (
              <Link key={q.t} to={q.to} className="group">
                <Card className="hover-lift border-border/60 h-full">
                  <CardContent className="p-6">
                    <q.icon className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-smooth">{q.t}</h3>
                    <p className="text-sm text-muted-foreground">{q.d}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
