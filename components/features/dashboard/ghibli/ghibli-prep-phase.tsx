"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChefSVG } from "./ghibli-orders-phase";

export function GhibliPrepPhase() {
  const [prepStep, setPrepStep] = useState<"dough" | "sauce" | "cheese" | "toppings">("dough");

  useEffect(() => {
    const t1 = setTimeout(() => setPrepStep("sauce"), 800);
    const t2 = setTimeout(() => setPrepStep("cheese"), 1600);
    const t3 = setTimeout(() => setPrepStep("toppings"), 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const stepLabel = {
    dough: "Kneading Dough",
    sauce: "Adding Sauce",
    cheese: "Layering Cheese",
    toppings: "Fresh Toppings",
  };

  return (
    <div className="w-[180px] h-[180px] relative overflow-hidden flex items-center justify-center">

      {/* Top-down kitchen desk / wooden pizza peel */}
      <motion.div 
        className="absolute w-[140px] h-[140px] flex items-center justify-center"
        initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
      >
        {/* Peel Handle */}
        <div className="absolute bottom-[-12px] right-[-12px] w-[45px] h-[22px] bg-[#C19A6B] rounded-sm rotate-[45deg] border-2 border-[#A67B5B] shadow-md" />
        
        {/* Peel Paddle */}
        <div className="absolute inset-0 rounded-full bg-[#E6C287] border-4 border-[#C19A6B] shadow-xl overflow-hidden flex items-center justify-center">
          {/* Wood grain texture lines */}
          <div className="absolute w-[120%] h-[120%] opacity-15 flex flex-col justify-evenly rotate-[15deg]">
            <div className="w-full h-[2px] bg-[#5C4033] rounded-full" />
            <div className="w-full h-[1px] bg-[#5C4033] rounded-full ml-4" />
            <div className="w-full h-[2px] bg-[#5C4033] rounded-full -ml-2" />
            <div className="w-full h-[1px] bg-[#5C4033] rounded-full" />
            <div className="w-full h-[2px] bg-[#5C4033] rounded-full ml-2" />
          </div>
        </div>
        
        {/* Pizza being built centered */}
        <div className="absolute w-[116px] h-[116px]">
          
          {/* Dough */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              background: "radial-gradient(circle at 35% 35%, #FFF2CC 0%, #FDE68A 60%, #D97706 100%)",
              boxShadow: "inset 0 0 8px rgba(180,83,9,0.3), 0 4px 10px rgba(0,0,0,0.4)",
            }}
          />

          {/* Sauce */}
          <AnimatePresence>
            {prepStep !== "dough" && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-[10px] rounded-full"
                style={{
                  background: "radial-gradient(circle at 40% 40%, #EF4444 0%, #DC2626 60%, #991B1B 100%)",
                }}
              />
            )}
          </AnimatePresence>

          {/* Cheese */}
          <AnimatePresence>
            {(prepStep === "cheese" || prepStep === "toppings") && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.95, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-[12px] rounded-full bg-[#FFF8DC]"
              />
            )}
          </AnimatePresence>

          {/* Toppings */}
          <AnimatePresence>
            {prepStep === "toppings" && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Tomato slices */}
                {[
                  { x: 35, y: 25 }, { x: 65, y: 55 }, { x: 25, y: 65 },
                  { x: 70, y: 25 }, { x: 45, y: 80 },
                ].map((pos, i) => (
                  <motion.div
                    key={`tomato-${i}`}
                    initial={{ scale: 0, y: -15 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: i * 0.06, type: "spring", stiffness: 400, damping: 18 }}
                    className="absolute w-[18px] h-[18px]"
                    style={{ left: pos.x, top: pos.y }}
                  >
                    <svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="#E53935" /><circle cx="10" cy="10" r="4" fill="#FFCDD2" opacity="0.5" /></svg>
                  </motion.div>
                ))}
                {/* Basil */}
                {[
                  { x: 20, y: 35 }, { x: 50, y: 45 }, { x: 75, y: 75 }, { x: 55, y: 15 },
                ].map((pos, i) => (
                  <motion.div
                    key={`basil-${i}`}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 350, damping: 15 }}
                    className="absolute w-[14px] h-[14px]"
                    style={{ left: pos.x, top: pos.y }}
                  >
                    <svg viewBox="0 0 20 20"><path d="M10,2 Q18,8 14,16 Q10,18 6,16 Q2,8 10,2 Z" fill="#2E7D32" /></svg>
                  </motion.div>
                ))}
                {/* Bell pepper rings */}
                {[
                  { x: 30, y: 48 }, { x: 65, y: 38 }, { x: 40, y: 20 },
                ].map((pos, i) => (
                  <motion.div
                    key={`pepper-${i}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 400 }}
                    className="absolute w-[16px] h-[16px]"
                    style={{ left: pos.x, top: pos.y }}
                  >
                    <svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" fill="none" stroke="#FBC02D" strokeWidth="3" /></svg>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Step label */}
      <motion.div
        key={prepStep}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-[6px] right-[6px] bg-white/95 backdrop-blur-sm text-[9px] font-bold text-[#5D4037] px-2.5 py-1 rounded-md shadow-md border border-stone-100 z-50"
      >
        {stepLabel[prepStep]}
      </motion.div>
    </div>
  );
}
