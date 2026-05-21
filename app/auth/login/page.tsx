"use client";

import React from "react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 -left-1/4 h-[500px] w-[500px] rounded-full bg-modRed blur-[120px]"></div>
        <div className="absolute bottom-0 -right-1/4 h-[500px] w-[500px] rounded-full bg-modRed blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black tracking-tighter text-modRed">
            MTAS <span className="text-white">HQ</span>
          </h1>
          <p className="mt-2 text-sm text-modGrey-300">Global Ad Management Portal</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
          <h2 className="mb-6 text-xl font-semibold">Welcome Back</h2>
          
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-modGrey-300 uppercase tracking-widest mb-1">Email Address</label>
              <input 
                type="email" 
                placeholder="nolan.schleifer@modpizza.com"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-modRed focus:outline-none focus:ring-1 focus:ring-modRed transition-all"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-modGrey-300 uppercase tracking-widest mb-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm focus:border-modRed focus:outline-none focus:ring-1 focus:ring-modRed transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input type="checkbox" className="rounded border-white/10 bg-white/5 text-modRed focus:ring-modRed" />
                <span className="text-modGrey-300 group-hover:text-white transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-modRed hover:underline">Forgot password?</a>
            </div>

            <Link href="/" className="block">
              <button 
                type="button" 
                className="w-full rounded-lg bg-modRed py-3 text-sm font-bold uppercase tracking-widest text-white hover:bg-red-700 transition-all shadow-lg shadow-modRed/20 active:scale-[0.98]"
              >
                Sign In
              </button>
            </Link>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-modGrey-300">
            Internal Use Only • MOD Pizza Branding Standard
          </div>
        </div>
      </div>
    </div>
  );
}
