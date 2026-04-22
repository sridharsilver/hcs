import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

const Logo = () => (
  <Link to="/" className="flex items-center gap-2 group">
    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-card transition-smooth group-hover:scale-105">
      <GraduationCap className="w-6 h-6 text-primary-foreground" />
    </div>
    <div className="leading-tight">
      <p className="font-display font-bold text-base text-primary">Hyderabad Central</p>
      <p className="text-[11px] tracking-widest uppercase text-muted-foreground">Schools</p>
    </div>
  </Link>
);

export default Logo;
