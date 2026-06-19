"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import Link from "next/link";
import { GhibliOrdersPhase } from "./ghibli-orders-phase";
import { GhibliPrepPhase } from "./ghibli-prep-phase";
import { GhibliBakePhase } from "./ghibli-bake-phase";
import { GhibliInteractivePizza } from "./ghibli-interactive-pizza";

export type BannerPhase = "orders" | "prep" | "bake" | "reveal" | "interactive";

export function GhibliBanner() {
  const [phase, setPhase] = useState<BannerPhase>("orders");

  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];

    const runSequence = () => {
      setPhase("orders");
      timeouts.push(setTimeout(() => setPhase("prep"), 4000));
      timeouts.push(setTimeout(() => setPhase("bake"), 8000));
      timeouts.push(setTimeout(() => setPhase("reveal"), 11000));
      timeouts.push(setTimeout(() => setPhase("interactive"), 12000));
    };

    // Run first time
    runSequence();

    // Loop every 32 seconds (12s for animation + 20s resting on interactive phase)
    const loopInterval = setInterval(() => {
      // clear any stray timeouts before restarting
      timeouts.forEach(clearTimeout);
      timeouts = [];
      runSequence();
    }, 32000);

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(loopInterval);
    };
  }, []);

  const isRevealed = phase === "reveal" || phase === "interactive";

  return (
    <div
      className="rounded-xl p-6 lg:p-8 text-white relative overflow-hidden shadow-2xl h-full flex items-center min-h-[220px] group transition-all"
      style={{
        background: 'radial-gradient(circle at 70% 50%, #E53935 0%, #C62828 50%, #8E0000 100%)',
      }}
    >
      {/* SVG Noise Overlay for painted Ghibli texture */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
          backgroundSize: '150px 150px'
        }}
      />

      {/* Preload the interactive pizza image to prevent hitch during phase transition */}
      <img src="/images/pizza_banner.png" alt="preload" className="hidden" aria-hidden="true" />

      <div className="relative z-10 w-full h-full flex items-center justify-between gap-6">

        {/* LEFT HALF: Static CTA — always visible */}
        <div className="relative z-20 w-full max-w-[320px] shrink-0 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h3
              className="text-[22px] sm:text-[24px] lg:text-[26px] font-black leading-tight tracking-tight text-white"
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
            >
              Create Campaigns for Approval
            </h3>
            <p className="text-[13px] sm:text-[14px] text-white/80 mt-2 font-medium leading-relaxed" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.2)" }}>
              Design and submit campaigns for review to get them live across outlets.
            </p>
            <Link
              href="/campaigns"
              className="mt-5 sm:mt-6 flex items-center justify-center space-x-2.5 px-6 py-2.5 md:py-3 bg-white/10 backdrop-blur-md border border-white/40 text-white rounded-lg text-[15px] font-bold hover:bg-white/20 hover:-translate-y-1 transition-all active:scale-95 w-full sm:w-auto sm:min-w-[220px] cursor-pointer"
            >
              <Plus className="w-5 h-5" strokeWidth={2} />
              <span>Create New Campaign</span>
            </Link>
          </motion.div>
        </div>

        {/* RIGHT HALF: Pizza Animation Container */}
        <div className="flex-1 flex items-center justify-center min-w-0">
          <motion.div
            layout
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            className={`relative flex items-center select-none origin-center scale-[0.85] sm:scale-[0.95] md:scale-[0.95] lg:scale-[1.05] xl:scale-110 ${phase === "interactive" ? "pointer-events-auto z-30" : "pointer-events-none z-10"}`}
          >
            <div className="relative flex items-center font-black text-white leading-none">

              {/* Letter M */}
              <AnimatePresence>
                {isRevealed && (
                  <motion.span
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative z-0 -mr-6 text-[120px] lg:text-[130px] font-black tracking-tighter"
                    style={{ transformOrigin: "right" }}
                  >
                    M
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Central Animation Area (The Pizza 'O') */}
              <div className="w-[160px] h-[160px] lg:w-[180px] lg:h-[180px] relative z-10 shrink-0 flex items-center justify-center">
                <AnimatePresence>
                  {phase === "orders" && (
                    <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4, ease: "easeInOut" }} className="w-full h-full flex items-center justify-center absolute inset-0">
                      <GhibliOrdersPhase />
                    </motion.div>
                  )}
                  {phase === "prep" && (
                    <motion.div key="prep" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4, ease: "easeInOut" }} className="w-full h-full flex items-center justify-center absolute inset-0">
                      <GhibliPrepPhase />
                    </motion.div>
                  )}
                  {phase === "bake" && (
                    <motion.div key="bake"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="w-full h-full flex items-center justify-center absolute inset-0"
                    >
                      <GhibliBakePhase />
                    </motion.div>
                  )}
                  {isRevealed && (
                    <motion.div key="interactive"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="w-full h-full flex items-center justify-center absolute inset-0"
                    >
                      <GhibliInteractivePizza interactive={phase === "interactive"} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Letter D */}
              <AnimatePresence>
                {isRevealed && (
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative z-0 -ml-6 text-[120px] lg:text-[130px] font-black tracking-tighter"
                    style={{ transformOrigin: "left" }}
                  >
                    D
                  </motion.span>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
