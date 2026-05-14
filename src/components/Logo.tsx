import { Link } from "react-router-dom";
import hcsLogo from "../assets/HCS-Logo-final.png";

const Logo = () => (
  <Link to="/" className="flex items-center gap-2 group">
    <div className="w-12 h-12 transition-smooth group-hover:scale-105">
      <img src={hcsLogo} alt="Hyderabad Central Schools" className="w-full h-full object-contain" />
    </div>
    <div className="leading-tight">
      <p className="font-display font-bold text-base text-primary whitespace-nowrap logo-text">Hyderabad Central Schools</p>
      <p className="text-[11px] tracking-widest uppercase text-muted-foreground logo-subtext">Learn Today, Lead Tomorrow</p>
    </div>
  </Link>
);

export default Logo;
