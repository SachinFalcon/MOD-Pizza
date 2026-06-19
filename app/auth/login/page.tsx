"use client";

import React, { useState } from "react";
import { useRbacActions } from "@/hooks/use-rbac";
import { Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setRole } = useRbacActions();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    if (password.trim() !== "password123") {
      setError("Invalid credentials. Please try again.");
      setIsLoading(false);
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedEmail === "dev.sachin@modpizza.com") {
      setRole("editor");
      window.location.href = "/dashboard";
    } else if (trimmedEmail === "dev.ajay@modpizza.com") {
      setRole("publisher");
      window.location.href = "/dashboard";
    } else if (trimmedEmail === "jack.thomas@modpizza.com" || trimmedEmail === "dev.lakshay@modpizza.com") {
      setRole("admin");
      window.location.href = "/dashboard";
    } else {
      setError("Invalid credentials. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-slate-900 selection:bg-modRed selection:text-white font-sans overflow-hidden">
      
      {/* LEFT PANEL - PREMIUM HERO IMAGE */}
      <div className="relative hidden lg:flex w-[55%] items-end justify-start overflow-hidden bg-slate-900">
        
        {/* Animated Background Image (Ken Burns Effect) */}
        <div 
          className="absolute inset-0 z-0 bg-[url('/images/pizza_banner.png')] bg-cover bg-center opacity-80"
          style={{ animation: 'kenburns 25s ease-out infinite alternate' }}
        ></div>
        
        {/* Gradient Overlay for Text Readability & Premium Feel */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent mix-blend-multiply"></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-modRed/80 via-transparent to-transparent mix-blend-overlay"></div>

        {/* Floating Abstract Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-modRed/30 rounded-full blur-[120px] z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-modOrange/20 rounded-full blur-[100px] z-10 animate-pulse" style={{ animationDuration: '12s' }}></div>

        {/* Hero Content */}
        <div className="relative z-20 p-16 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-modOrange animate-pulse"></span>
            Global Ad Management
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-6 font-heading uppercase drop-shadow-xl">
            Command Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-modOrange to-modRed">
              Campaigns
            </span>
          </h1>
          <p className="text-lg text-white/80 font-medium leading-relaxed max-w-lg mb-8 drop-shadow-md">
            The central hub for creating, managing, and distributing MOD Pizza's digital marketing assets across our global network of outlets.
          </p>
          
          <div className="flex items-center gap-6">
            <div className="flex -space-x-4">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" className="w-12 h-12 rounded-full border-2 border-slate-900 object-cover" alt="User" />
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" className="w-12 h-12 rounded-full border-2 border-slate-900 object-cover" alt="User" />
              <img src="/images/BMW_S_1000_RR_Winglet_4_cb2f77e0e7.png" className="w-12 h-12 rounded-full border-2 border-slate-900 object-cover bg-white" alt="User" />
            </div>
            <div className="text-sm font-semibold text-white">
              <span className="text-modOrange">Join the team.</span><br />
              <span className="text-white/60">Over 1,200 active campaigns.</span>
            </div>
          </div>
        </div>

        {/* CSS for Ken Burns */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes kenburns {
            0% { transform: scale(1) translate(0, 0); }
            50% { transform: scale(1.05) translate(-1%, -1%); }
            100% { transform: scale(1.1) translate(-2%, -2%); }
          }
        `}} />
      </div>

      {/* RIGHT PANEL - CLEAN LOGIN FORM */}
      <div className="w-full lg:w-[45%] flex items-center justify-center relative bg-white lg:rounded-l-3xl lg:-ml-6 z-30 shadow-[-20px_0_40px_rgba(0,0,0,0.1)]">
        
        {/* Minimalist Grid Background */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        <div className="relative z-10 w-full max-w-[400px] px-8 py-12 animate-in fade-in zoom-in-95 duration-700">
          
          {/* Logo Area */}
          <div className="mb-12">
            <div className="flex items-center space-x-1.5 mb-2">
              <span className="text-3xl font-black text-modRed tracking-tighter">MTAS</span>
              <span className="text-3xl font-black text-slate-900 tracking-tighter">HQ</span>
            </div>
            <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">Portal Login</p>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight">Welcome back</h2>
          
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                Email Address
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@modpizza.com"
                className="w-full rounded-xl border-2 border-slate-100 bg-slate-50/50 px-4 py-3.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:border-modRed focus:bg-white focus:outline-none focus:ring-4 focus:ring-modRed/10 transition-all duration-300"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  Password
                </label>
                <a href="#" className="text-[11px] font-bold text-modRed hover:text-red-800 transition-colors">Forgot?</a>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border-2 border-slate-100 bg-slate-50/50 px-4 py-3.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-modRed focus:bg-white focus:outline-none focus:ring-4 focus:ring-modRed/10 transition-all duration-300 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-all duration-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 text-red-600 text-xs font-bold bg-red-50 border border-red-100 rounded-lg p-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div>
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="group relative w-full overflow-hidden rounded-xl bg-slate-900 px-4 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-modRed hover:shadow-[0_8px_25px_-8px_rgba(169,29,34,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Portal</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>

            <div className="pt-6">
              <label className="flex items-center space-x-3 cursor-pointer group w-fit">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" className="peer w-5 h-5 rounded border-2 border-slate-200 text-modRed focus:ring-modRed/20 transition-all cursor-pointer checked:border-modRed" />
                </div>
                <span className="text-sm font-semibold text-slate-500 group-hover:text-slate-900 transition-colors">Keep me signed in</span>
              </label>
            </div>
          </form>

          <div className="mt-16 pt-8 border-t border-slate-100 text-left">
            <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase leading-relaxed">
              Internal Use Only <br/>
              © {new Date().getFullYear()} MOD Super Fast Pizza, LLC.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
