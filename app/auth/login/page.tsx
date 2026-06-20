"use client";

import React, { useState } from "react";
import { useRbacActions } from "@/hooks/use-rbac";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setRole } = useRbacActions();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

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
    } else if (
      trimmedEmail === "jack.thomas@modpizza.com" ||
      trimmedEmail === "dev.lakshay@modpizza.com"
    ) {
      setRole("admin");
      window.location.href = "/dashboard";
    } else {
      setError("Invalid credentials. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F7F7F7] text-slate-900 font-sans flex overflow-hidden">
      
      {/* SVG Clip Path Definition for the Sauce Curve */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <clipPath id="sauce-curve" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 L 1,0 L 1,0.05 Q 0.45,0.65 0,0.85 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* RED CURVED SHAPE - "Sauce" design */}
      <div 
        className="absolute top-0 left-[35%] w-[65%] h-[60%] bg-[#C8102E] z-0 shadow-xl overflow-hidden"
        style={{ clipPath: 'url(#sauce-curve)' }}
      >
        {/* Line art watermark over the red shape */}
        <img src="/images/pizza ing 6.jpg" className="absolute top-[5%] left-[5%] w-[450px] opacity-25 mix-blend-multiply rotate-[15deg] pointer-events-none" alt="Line Art" />
      </div>

      {/* CENTRAL TRANSPARENT PIZZA (Enlarged and centered in the background) */}
      <img 
         src="/images/pizza ing 7 copy.jpg" 
         className="absolute top-1/2 left-[65%] -translate-x-1/2 -translate-y-1/2 w-[850px] xl:w-[1000px] opacity-[0.05] mix-blend-multiply contrast-150 brightness-110 grayscale z-0 pointer-events-none" 
         alt="Center Watermark" 
      />

      {/* LINE ART WATERMARKS OVER OFF-WHITE BACKGROUND */}
      <img src="/images/pizza ing 6.jpg" className="absolute top-[-15%] right-[-10%] w-[450px] opacity-[0.10] mix-blend-multiply -rotate-[30deg] z-0 pointer-events-none" alt="Line Art" />
      <img src="/images/pizza ing 6.jpg" className="absolute bottom-[-15%] right-[-10%] w-[500px] opacity-[0.10] mix-blend-multiply rotate-180 z-0 pointer-events-none" alt="Line Art" />

      {/* LEFT COLUMN 1: WHITE STRIP */}
      <div className="absolute left-0 top-0 bottom-0 w-[12%] lg:w-[15%] bg-white z-10 border-r border-slate-200 overflow-hidden flex items-center justify-center">
         {/* Tiled Line Art Pattern in the empty space */}
         <div className="absolute inset-0 opacity-[0.08] mix-blend-multiply contrast-[1.2] grayscale pointer-events-none" style={{ backgroundImage: "url('/images/pizza ing 8.jpg')", backgroundSize: "250px", backgroundRepeat: "repeat" }}></div>

         {/* Flying ingredients hero graphic - Rotated and scaled to perfectly fill the vertical height */}
         <img 
            src="/images/pizza ing 9.jpg" 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vh] max-w-none opacity-90 mix-blend-multiply contrast-[1.3] brightness-110 grayscale z-30 pointer-events-none -rotate-90" 
            alt="Flying Ingredients" 
            style={{ clipPath: "inset(0 0 12% 0)" }}
         />

         {/* Subtle corner ingredients matching reference */}
         <img src="/images/spinach.png" className="absolute top-[18%] right-[-15px] w-12 drop-shadow-md z-30" alt="Basil" />
      </div>

      {/* LEFT COLUMN 2: DARK OVEN STRIP */}
      <div className="absolute left-[12%] lg:left-[15%] top-0 bottom-0 w-[23%] lg:w-[25%] bg-[#1A1A1C] z-10 shadow-2xl overflow-hidden">
        
        {/* Subtle Sketch Pattern on the Black Background */}
        <div className="absolute inset-0 opacity-[0.06] mix-blend-screen invert pointer-events-none" style={{ backgroundImage: "url('/images/pizza ing 8.jpg')", backgroundSize: "250px", backgroundRepeat: "repeat" }}></div>

        {/* Photo Background */}
        <img 
          src="/images/pizza_banner.png" 
          alt="MOD Pizza" 
          className="absolute top-1/2 left-1/2 w-[140%] xl:w-[130%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-85"
          style={{ 
            filter: "contrast(1.1) saturate(1.2)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)"
          }}
        /><div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#111111] to-transparent z-10"></div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#1A1A1C] to-transparent z-10"></div>

        {/* Header (Now Transparent over image) */}
        <div className="absolute top-0 w-full h-[100px] flex items-center justify-center z-20">
          <h2 className="text-[26px] xl:text-[32px] font-sans font-medium text-white tracking-[0.25em] uppercase drop-shadow-md ml-2">MOD PIZZA</h2>
        </div>
        
      </div>

      {/* RIGHT PANEL - FORM */}
      <div className="absolute left-[35%] lg:left-[40%] right-0 top-0 bottom-0 flex flex-col justify-center items-center z-20">
        
        {/* Added mt-10 to slightly push form down, ensuring it clears the red shape entirely */}
        <div className="w-full max-w-[420px] px-6 xl:px-0 mt-10 xl:mt-16">
          
          <h1 className="text-[30px] sm:text-[34px] font-black text-black mb-8 tracking-tighter uppercase font-heading text-center">
            WELCOME BACK TO MOD!
          </h1>

          <form className="space-y-4" onSubmit={handleLogin}>
            
            <div className="space-y-4">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full rounded-full border border-slate-400 bg-[#EAEAEA] px-5 py-3 text-[14px] font-medium text-slate-900 placeholder:text-slate-700 focus:outline-none focus:border-[#C8102E] focus:bg-white transition-all shadow-inner"
                required
              />
              
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-full border border-slate-400 bg-[#EAEAEA] px-5 py-3 text-[14px] font-medium text-slate-900 placeholder:text-slate-700 focus:outline-none focus:border-[#C8102E] focus:bg-white transition-all shadow-inner"
                required
              />
            </div>

            <div className="flex justify-end pt-1 pb-2">
              <Link href="#" className="text-[12px] font-medium text-slate-700 hover:text-[#C8102E] transition-colors">
                Forgot your password?
              </Link>
            </div>

            {error && (
               <div className="text-white text-[13px] font-bold bg-[#C8102E] rounded-full px-5 py-2 mb-2 text-center shadow-md">
                 {error}
               </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-[#A31621] px-6 py-3.5 text-[15px] font-bold text-white transition-all hover:bg-[#8B101A] active:translate-y-1 shadow-[0_4px_10px_rgba(0,0,0,0.2),0_4px_0_#750f16] flex justify-center items-center gap-2"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : "Log In"}
            </button>



            <div className="text-center mt-8 pt-4">
              <span className="text-[13px] font-medium text-slate-700">Don't have an account? </span>
              <Link href="#" className="text-[13px] font-bold text-[#A31621] hover:text-[#8B101A] transition-colors">SIGN UP</Link>
            </div>

          </form>
        </div>

        {/* FOOTER */}
        <div className="absolute bottom-4 w-full text-center z-10">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
            © {new Date().getFullYear()} MOD Pizza. All Rights Reserved.
          </p>
        </div>

      </div>
    </div>
  );
}
