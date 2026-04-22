import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import Logo from "./Logo";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground mt-20">
    <div className="container py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
      <div>
        <div className="bg-background rounded-xl p-3 inline-block mb-4">
          <Logo />
        </div>
        <p className="text-sm text-primary-foreground/75 leading-relaxed">
          Nurturing curious minds and confident leaders since 1998. Three campuses across Hyderabad, one shared vision of excellence.
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
        <h4 className="font-display font-semibold mb-4 text-base">Quick Links</h4>
        <ul className="space-y-2 text-sm text-primary-foreground/80">
          {[
            ["About Us", "/about"],
            ["Academics", "/academics"],
            ["Admissions", "/admissions"],
            ["Our Branches", "/branches"],
            ["Gallery", "/gallery"],
            ["Contact", "/contact"],
          ].map(([label, to]) => (
            <li key={to}><Link to={to} className="hover:text-accent transition-smooth">{label}</Link></li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-display font-semibold mb-4 text-base">Our Campuses</h4>
        <ul className="space-y-2 text-sm text-primary-foreground/80">
          <li><Link to="/branches" className="hover:text-accent transition-smooth">Banjara Hills</Link></li>
          <li><Link to="/branches" className="hover:text-accent transition-smooth">Kukatpally</Link></li>
          <li><Link to="/branches" className="hover:text-accent transition-smooth">Secunderabad</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-display font-semibold mb-4 text-base">Get in Touch</h4>
        <ul className="space-y-3 text-sm text-primary-foreground/80">
          <li className="flex gap-3"><MapPin className="w-4 h-4 mt-0.5 shrink-0 text-accent" /> Road No. 12, Banjara Hills, Hyderabad 500034</li>
          <li className="flex gap-3"><Phone className="w-4 h-4 mt-0.5 shrink-0 text-accent" /> +91 40 2354 1100</li>
          <li className="flex gap-3"><Mail className="w-4 h-4 mt-0.5 shrink-0 text-accent" /> info@hcschools.in</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-primary-foreground/10">
      <div className="container py-5 text-xs text-primary-foreground/65 flex flex-col md:flex-row justify-between gap-2">
        <p>© {new Date().getFullYear()} Hyderabad Central Schools. All rights reserved.</p>
        <p>Crafted with care for the next generation of learners.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
