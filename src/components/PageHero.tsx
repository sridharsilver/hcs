import { ReactNode } from "react";
import heroBg from "@/assets/page-hero-bg.jpg";

const PageHero = ({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) => (
  <section className="relative text-primary-foreground overflow-hidden">
    <img
      src={heroBg}
      alt=""
      aria-hidden="true"
      loading="lazy"
      width={1920}
      height={800}
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 gradient-hero" />
    <div className="absolute inset-0 opacity-15" style={{
      backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)",
      backgroundSize: "60px 60px",
    }} />
    <div className="container relative py-20 md:py-28 text-center animate-fade-in-up">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">{title}</h1>
      {subtitle && <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">{subtitle}</p>}
      {children}
    </div>
  </section>
);

export default PageHero;
