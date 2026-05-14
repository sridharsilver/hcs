import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const links = [
    { to: "/", label: t('nav.home') },
    { to: "/about", label: t('nav.about') },
    { to: "/academics", label: t('nav.academics') },
    { to: "/admissions", label: t('nav.admissions') },
    { to: "/gallery", label: t('nav.gallery') },
    { to: "/contact", label: t('nav.contact') },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguageCode = i18n.language ? i18n.language.split('-')[0] : 'en';

  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-lg border-b border-border">
      <div className="container flex items-center justify-between h-20">
        <Logo />
        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-smooth",
                  isActive ? "text-primary bg-secondary" : "text-foreground/75 hover:text-primary hover:bg-secondary/60"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        
        <div className="hidden lg:flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 rounded-full hover:bg-secondary">
                <Globe className="h-4 w-4" />
                <span className="text-xs font-bold uppercase">{currentLanguageCode}</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl border-border/50 shadow-elegant p-2">
              <DropdownMenuItem 
                onClick={() => changeLanguage('en')}
                className={cn("rounded-xl cursor-pointer py-2 px-4 gap-3", i18n.language.startsWith('en') && "bg-primary/10 text-primary")}
              >
                <span className="font-bold">English</span>
                {i18n.language.startsWith('en') && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => changeLanguage('hi')}
                className={cn("rounded-xl cursor-pointer py-2 px-4 gap-3", i18n.language.startsWith('hi') && "bg-primary/10 text-primary")}
              >
                <span className="font-bold">हिन्दी (Hindi)</span>
                {i18n.language.startsWith('hi') && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => changeLanguage('te')}
                className={cn("rounded-xl cursor-pointer py-2 px-4 gap-3", i18n.language.startsWith('te') && "bg-primary/10 text-primary")}
              >
                <span className="font-bold">తెలుగు (Telugu)</span>
                {i18n.language.startsWith('te') && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button asChild size="sm" className="gradient-primary text-primary-foreground border-0 shadow-lg shadow-primary/20 rounded-full px-6">
            <NavLink to="/admissions">{t('hero.applyNow')}</NavLink>
          </Button>
        </div>

        <div className="flex lg:hidden items-center gap-2">
          <button
            className="p-2 rounded-md hover:bg-secondary"
            onClick={() => {
              const langs = ['en', 'hi', 'te'];
              const currentIndex = langs.indexOf(currentLanguageCode);
              const nextLng = langs[(currentIndex + 1) % langs.length];
              changeLanguage(nextLng);
            }}
            aria-label="Toggle language"
          >
            <Globe className="w-5 h-5" />
          </button>
          <button
            className="p-2 rounded-md hover:bg-secondary"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-background animate-fade-in">
          <nav className="container py-4 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-3 rounded-md text-sm font-medium transition-smooth",
                    isActive ? "text-primary bg-secondary" : "text-foreground/80 hover:bg-secondary"
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Button asChild className="mt-2 gradient-primary text-primary-foreground border-0 rounded-full">
              <NavLink to="/admissions" onClick={() => setOpen(false)}>{t('hero.applyNow')}</NavLink>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
