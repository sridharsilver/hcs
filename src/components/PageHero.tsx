import * as React from "react";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Home, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import heroBg from "@/assets/hcs-balkampet.jpg";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  bgImage?: string;
}

const PageHero = ({ title, subtitle, children, bgImage }: PageHeroProps) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
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

  return (
    <section className="relative min-h-[40vh] md:min-h-[50vh] lg:min-h-[55vh] flex items-center justify-center text-primary-foreground overflow-hidden">
      {/* Background Image Layer with Ken Burns effect */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.15, filter: "blur(4px)" }}
          animate={{ scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-full h-full"
        >
          <img
            src={bgImage || heroBg}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        {/* Multilayered Overlays for depth */}
        <div className="absolute inset-0 bg-primary/40 backdrop-blur-[1px] z-10" />
        <div className="absolute inset-0 gradient-hero opacity-95 mix-blend-multiply z-20" />
        
        {/* Animated Subtle Gradient for life */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-accent/10 z-25" />
        
        {/* Precise Technical Grid pattern */}
        <div className="absolute inset-0 opacity-[0.08] z-30 pointer-events-none" style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container relative z-40 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          {/* Breadcrumbs - Glassmorphic Pills */}
          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <Breadcrumb className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-lg">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/" className="flex items-center gap-1.5 text-white/90 hover:text-accent transition-colors">
                      <Home className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Home</span>
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                
                {pathnames.map((name, index) => {
                  const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                  const isLast = index === pathnames.length - 1;
                  const formattedName = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ");

                  return (
                    <React.Fragment key={name}>
                      <BreadcrumbSeparator className="text-white/30">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </BreadcrumbSeparator>
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage className="text-accent text-[10px] font-bold uppercase tracking-[0.2em]">
                            {formattedName}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link to={routeTo} className="text-white/70 hover:text-accent text-[10px] font-bold uppercase tracking-[0.2em] transition-colors">
                              {formattedName}
                            </Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            variants={itemVariants}
            className="text-3xl md:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight text-white leading-[1.15] drop-shadow-xl"
          >
            {title}
          </motion.h1>

          {/* Contextual Subtitle */}
          {subtitle && (
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-light drop-shadow-md"
            >
              {subtitle}
            </motion.p>
          )}

          {/* Action Area / Children */}
          {children && (
            <motion.div variants={itemVariants} className="mt-10">
              {children}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Bottom Fade-out transition */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background via-background/20 to-transparent z-45 pointer-events-none" />
      
      {/* Peripheral Light Blooms */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/10 blur-[120px] rounded-full z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-glow/20 blur-[120px] rounded-full z-10 pointer-events-none" />
    </section>
  );
};

export default PageHero;
