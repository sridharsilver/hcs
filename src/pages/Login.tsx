import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, LogIn, Mail, Lock, ShieldCheck, ArrowLeft, Building2 } from 'lucide-react';
import Logo from '@/components/Logo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page they were trying to visit, or default to admin dashboard
  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden font-sans">
      {/* Left Panel: Brand & Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0a192f] p-12 flex-col justify-between overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-blue-600/30 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-indigo-600/20 blur-[150px] rounded-full animate-pulse delay-1000" />
        </div>

        {/* High-quality background image with overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-40 mix-blend-overlay scale-110"
          style={{ 
            backgroundImage: `url('/Users/sridharsilver/.gemini/antigravity/brain/d5a6b1f5-4362-45d3-977d-b92ffeef38e9/school_login_bg_1778942821845.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 flex flex-col gap-4"
        >
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 w-fit shadow-2xl shadow-blue-500/10">
            <Logo />
          </div>
          <div className="mt-12">
            <h2 className="text-5xl font-display font-bold text-white leading-tight">
              Empowering the <br />
              <span className="text-blue-400">Next Generation</span>
            </h2>
            <p className="text-blue-100/70 mt-6 text-lg max-w-md leading-relaxed">
              Managing excellence across all campuses. Access your unified command center for students, faculty, and school operations.
            </p>
          </div>
        </motion.div>

        <div className="relative z-10 flex items-center gap-8 text-blue-200/50">
          <div className="flex flex-col gap-1">
            <span className="text-2xl font-bold text-white">5,200+</span>
            <span className="text-[10px] uppercase tracking-widest font-bold">Students Enrolled</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex flex-col gap-1">
            <span className="text-2xl font-bold text-white">320+</span>
            <span className="text-[10px] uppercase tracking-widest font-bold">Expert Faculty</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex flex-col gap-1">
            <span className="text-2xl font-bold text-white">3</span>
            <span className="text-[10px] uppercase tracking-widest font-bold">Main Campuses</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 lg:px-24 bg-slate-50 relative">
        <Link 
          to="/" 
          className="absolute top-8 left-8 lg:left-12 flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-semibold text-sm group"
        >
          <div className="p-2 rounded-full group-hover:bg-primary/5 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </div>
          Back to Website
        </Link>

        <div className="w-full max-w-sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="lg:hidden mb-8 flex justify-center">
              <div className="bg-white rounded-2xl p-3 shadow-xl border border-slate-200/50 scale-90">
                <Logo />
              </div>
            </div>
            <div className="mb-10 text-center lg:text-left">
              <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Admin Portal</h1>
              <p className="text-slate-500 mt-2 font-medium">Please enter your credentials to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-semibold ml-1 text-sm">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@hcschools.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white border-slate-200 text-slate-900 pl-12 h-12 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-300 shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <Label htmlFor="password" title="Password" className="text-slate-700 font-semibold text-sm">Password</Label>
                  <button type="button" className="text-xs font-bold text-primary hover:underline">Forgot password?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white border-slate-200 text-slate-900 pl-12 h-12 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-300 shadow-sm"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] gap-3 mt-4"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    Sign In to Dashboard
                  </>
                )}
              </Button>
            </form>

            <div className="mt-10 p-4 rounded-2xl bg-slate-100 border border-slate-200/50 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Security Note</span>
                <span className="text-xs text-slate-600 font-medium">IP logging and 256-bit encryption active.</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">
          &copy; {new Date().getFullYear()} Hyderabad Central Schools &bull; System v2.4.0
        </div>
      </div>
    </div>
  );
};

export default Login;
