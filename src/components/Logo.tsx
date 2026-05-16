import { Link } from "react-router-dom";
import hcsLogo from "../assets/HCS-Logo-final.png";
import { useSettings } from "@/contexts/SettingsContext";

const Logo = () => {
  const { settings } = useSettings();

  const logoSrc = settings?.logoUrl || hcsLogo;
  const schoolName = settings?.schoolName || "Hyderabad Central Schools";
  const schoolTagline = settings?.schoolTagline || "Learn Today, Lead Tomorrow";

  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="w-12 h-12 transition-smooth group-hover:scale-105">
        <img src={logoSrc} alt={schoolName} className="w-full h-full object-contain" />
      </div>
      <div className="leading-tight">
        <p className="font-display font-bold text-base text-primary whitespace-nowrap logo-text">
          {schoolName}
        </p>
        <p className="text-[11px] tracking-widest uppercase text-muted-foreground logo-subtext">
          {schoolTagline}
        </p>
      </div>
    </Link>
  );
};

export default Logo;
