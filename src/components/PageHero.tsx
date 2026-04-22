import { ReactNode } from "react";

const PageHero = ({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) => (
  <section className="relative gradient-primary text-primary-foreground overflow-hidden">
    <div className="absolute inset-0 opacity-20" style={{
      backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)",
      backgroundSize: "60px 60px",
    }} />
    <div className="container relative py-20 md:py-28 text-center animate-fade-in-up">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">{title}</h1>
      {subtitle && <p className="text-lg md:text-xl text-primary-foreground/85 max-w-2xl mx-auto">{subtitle}</p>}
      {children}
    </div>
  </section>
);

export default PageHero;
