import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import Logo from "./Logo";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4 items-start">
        <div className="min-w-0">
          <div className="bg-white rounded-xl p-3 inline-flex mb-6">
            <Logo />
          </div>
          <p className="text-sm text-primary-foreground/75 leading-relaxed">
            {t('footer.tagline')}
          </p>
          <div className="flex gap-3 mt-5">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
              <a key={i} href="#" aria-label="social" className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-smooth">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4 text-base">{t('footer.quickLinks')}</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            {[
              [t('nav.home'), "/"],
              [t('nav.about'), "/about"],
              [t('nav.academics'), "/academics"],
              [t('nav.admissions'), "/admissions"],
              [t('nav.gallery'), "/gallery"],
              [t('nav.contact'), "/contact"],
            ].map(([label, to]) => (
              <li key={to}><Link to={to} className="hover:text-accent transition-smooth">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4 text-base">{t('footer.ourCampuses')}</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/branches" className="hover:text-accent transition-smooth">Balkampet</Link></li>
            <li><Link to="/branches" className="hover:text-accent transition-smooth">Kukatpally</Link></li>
            <li><Link to="/branches" className="hover:text-accent transition-smooth">Fathenagar</Link></li>
            <li><Link to="/admin/dashboard" className="hover:text-accent transition-smooth">{t('nav.admin')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4 text-base">{t('footer.getInTouch')}</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li className="flex gap-3"><MapPin className="w-4 h-4 mt-0.5 shrink-0 text-accent" /> {t('footer.address')}</li>
            <li className="flex gap-3"><Phone className="w-4 h-4 mt-0.5 shrink-0 text-accent" /> +91 40 2354 1100</li>
            <li className="flex gap-3"><Mail className="w-4 h-4 mt-0.5 shrink-0 text-accent" /> info@hcschools.in</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container py-5 text-xs text-primary-foreground/65 flex flex-col md:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} Hyderabad Central Schools. {t('footer.rights')}</p>
          <p>{t('footer.crafted')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
