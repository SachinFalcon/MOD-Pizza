"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChefSVG } from "./ghibli-orders-phase";

export function GhibliBakePhase() {
  const [step, setStep] = useState<"approaching" | "sliding" | "baking" | "done">("approaching");

  useEffect(() => {
    const t1 = setTimeout(() => setStep("sliding"), 500);
    const t2 = setTimeout(() => setStep("baking"), 1200);
    const t3 = setTimeout(() => setStep("done"), 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div
      className="w-[180px] h-[180px] relative flex items-center justify-center overflow-hidden"
      style={{ perspective: "500px", perspectiveOrigin: "50% 45%" }}
    >
      <div
        className="w-full h-full relative"
        style={{ transform: "rotateX(8deg)", transformStyle: "preserve-3d" }}
      >

        {/* ====== BRICK OVEN (right side) ====== */}
        <div className="absolute right-0 top-[5px] w-[110px] h-[140px] z-0">
          <svg viewBox="0 0 110 140" className="w-full h-full">
            <defs>
              <linearGradient id="brickG" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#A0522D" />
                <stop offset="100%" stopColor="#6B3410" />
              </linearGradient>
              <radialGradient id="ovenInt" cx="50%" cy="60%" r="55%">
                <stop offset="0%" stopColor="#1a0f08" />
                <stop offset="100%" stopColor="#0a0604" />
              </radialGradient>
              <radialGradient id="fGlow" cx="50%" cy="80%" r="50%">
                <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#FF4500" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Brick wall */}
            <rect x="0" y="0" width="110" height="140" rx="4" fill="url(#brickG)" />
            {[20, 40, 100, 115, 128].map((y, i) => (
              <line key={`h${i}`} x1="0" y1={y} x2="110" y2={y} stroke="#5C3317" strokeWidth="0.8" opacity="0.35" />
            ))}
            
            {/* Arch opening */}
            <path d="M 12 108 L 12 55 Q 12 20 55 20 Q 98 20 98 55 L 98 108 Z" fill="url(#ovenInt)" />
            <path d="M 10 110 L 10 53 Q 10 15 55 15 Q 100 15 100 53 L 100 110" fill="none" stroke="#9E8E82" strokeWidth="4" />

            {/* Oven floor */}
            <rect x="12" y="100" width="86" height="10" fill="#5C4033" />

            {/* Ember glow */}
            <motion.rect
              x="15" y="95" width="80" height="18" rx="2"
              fill="url(#fGlow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: step === "baking" ? [0.3, 0.7, 0.3] : step === "done" ? 0.2 : 0 }}
              transition={{ duration: 2, repeat: step === "baking" ? Infinity : 0, ease: "easeInOut" }}
            />

            {/* Small flames */}
            {[28, 50, 72].map((x, i) => (
              <motion.path
                key={`fl${i}`}
                d={`M ${x} 102 Q ${x - 3} 92 ${x} 88 Q ${x + 3} 92 ${x} 102`}
                fill="#FF6B35"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: step === "baking" || step === "done" ? [0.4, 0.8, 0.4] : 0,
                  scaleY: step === "baking" ? [0.5, 1, 0.5] : 0.3,
                }}
                transition={{ duration: 1.2, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: `${x}px 102px` }}
              />
            ))}

            {/* Ledge */}
            <rect x="5" y="108" width="100" height="6" rx="2" fill="#7A6A5E" />
            <rect x="3" y="114" width="104" height="8" rx="2" fill="#6B5B4F" />
            
            {/* Keystone */}
            <path d="M 51 13 L 55 7 L 59 13" fill="#9E8E82" />
          </svg>
        </div>

        {/* ====== CHEF with pizza peel (left side) ====== */}
        <motion.div
          className="absolute left-[-15px] bottom-[30px] z-10"
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <ChefSVG pose="holding-peel" size={90} />
        </motion.div>

        {/* ====== PIZZA PEEL (long handle + paddle) ====== */}
        <motion.div
          className="absolute z-15"
          initial={{ x: -20, y: 65, rotate: 0 }}
          animate={{
            x: step === "approaching" ? -15 : step === "sliding" ? 38 : -15,
            y: step === "approaching" ? 65 : step === "sliding" ? 60 : 65,
            rotate: step === "sliding" ? -3 : 0,
          }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Peel handle */}
          <svg viewBox="0 0 120 50" width="120" height="50" className="drop-shadow-md">
            {/* Handle */}
            <rect x="0" y="20" width="65" height="8" rx="3" fill="#8B6914" />
            <rect x="0" y="22" width="65" height="3" rx="1" fill="#A07D1A" opacity="0.5" />
            {/* Paddle */}
            <ellipse cx="90" cy="25" rx="28" ry="22" fill="#C4A35A" />
            <ellipse cx="90" cy="25" rx="26" ry="20" fill="#D4B56A" />
            <ellipse cx="90" cy="23" rx="22" ry="16" fill="#DFC07A" opacity="0.3" />
          </svg>

          {/* Pizza on the peel */}
          <motion.div
            className="absolute right-[3px] top-[0px] w-[48px] h-[48px] rounded-full overflow-hidden"
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.4)", transform: "rotateX(60deg) translateY(-5px)" }}
            initial={{ opacity: 1 }}
            animate={{
              opacity: step === "baking" || step === "done" ? 0 : 1,
              scale: step === "sliding" ? 0.9 : 1,
            }}
            transition={{ duration: 0.4 }}
          >
            <img
              src="/images/pizza_banner.png"
              alt="Pizza"
              className="w-full h-full object-cover scale-[1.5]"
            />
          </motion.div>
        </motion.div>

        {/* ====== PIZZA inside oven (appears after sliding) ====== */}
        <AnimatePresence>
          {(step === "baking" || step === "done") && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute right-[20px] top-[60px] w-[50px] h-[50px] rounded-full overflow-hidden z-5"
              style={{
                boxShadow: step === "baking" ? "0 0 15px rgba(255,107,53,0.5)" : "0 2px 8px rgba(0,0,0,0.3)",
                transform: "rotateX(60deg) translateY(10px)",
              }}
            >
              <img
                src="/images/pizza_banner.png"
                alt="Pizza baking"
                className="w-full h-full object-cover scale-[1.5]"
              />
              {/* Baking overlay */}
              <motion.div
                className="absolute inset-0 bg-orange-500/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: step === "baking" ? [0.1, 0.3, 0.1] : 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== STEAM when done ====== */}
        <AnimatePresence>
          {step === "done" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute right-[22px] top-[35px] z-20 pointer-events-none"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={`steam-${i}`}
                  className="absolute"
                  style={{ left: i * 14 }}
                  initial={{ opacity: 0 }}
                  animate={{ y: [0, -20], opacity: [0.4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
                >
                  <svg viewBox="0 0 10 20" width="8" height="16">
                    <path d="M5,18 Q2,12 5,8 Q8,4 5,0" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
