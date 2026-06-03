"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ORDERS = [
  { id: 1, text: "#81 Margherita" },
  { id: 2, text: "#82 Pepperoni" },
  { id: 3, text: "#83 Gourmet MOD" },
  { id: 4, text: "#84 BBQ Chicken" },
];

export function GhibliOrdersPhase() {
  const [step, setStep] = useState<"reading" | "selected" | "ingredients">("reading");

  useEffect(() => {
    const t1 = setTimeout(() => setStep("selected"), 1200);
    const t2 = setTimeout(() => setStep("ingredients"), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      
      {/* Chef on the left, reading orders */}
      <motion.div
        className="absolute left-0 bottom-[10px] z-20"
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <ChefSVG pose="reading" size={90} />
      </motion.div>

      {/* Order tickets on the right */}
      <div className="absolute right-[5px] top-[10px] w-[90px] flex flex-col items-end gap-1.5">
        <AnimatePresence>
          {step !== "ingredients" && ORDERS.map((order, i) => {
            const isTarget = order.id === 3;
            const isFaded = step === "selected" && !isTarget;

            return (
              <motion.div
                key={order.id}
                initial={{ x: 30, opacity: 0 }}
                animate={{
                  x: 0,
                  opacity: isFaded ? 0.25 : 1,
                  scale: step === "selected" && isTarget ? 1.1 : 1,
                }}
                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                transition={{ delay: i * 0.1, duration: 0.3, ease: "easeOut" }}
                className={`px-2 py-1.5 rounded text-[8px] font-bold font-mono whitespace-nowrap border ${ step === "selected" && isTarget ? " bg-[rgba(255,255,255,0.75)] text-[#B71C1C] border-[#e53935] " : "bg-white/90 text-[#5D4037] border-white/50" }`}
              >
                {order.text}
                {step === "selected" && isTarget && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-1 text-[#e53935]"
                  >
                    ✓
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Ingredients card */}
        <AnimatePresence>
          {step === "ingredients" && (
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-[100px] bg-[rgba(255,255,255,0.75)] rounded-lg p-2.5 border border-stone-200"
            >
              <h4 className="text-[8px] font-black text-[#5D4037] uppercase tracking-wider mb-1.5 border-b border-stone-100 pb-1">
                Prep List
              </h4>
              <div className="flex flex-col gap-1">
                {[
                  { emoji: "🫓", label: "Dough" },
                  { emoji: "🍅", label: "Sauce" },
                  { emoji: "🧀", label: "Cheese" },
                  { emoji: "🫑", label: "Toppings" },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 + idx * 0.05, duration: 0.2 }}
                    className="flex items-center gap-1.5 text-[8px] font-semibold text-[#5D4037]"
                  >
                    <span>{item.emoji}</span>
                    <span>{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ====== Reusable Chef SVG ======
function ChefSVG({ pose, size = 80 }: { pose: "reading" | "kneading" | "holding-peel" | "celebrating"; size?: number }) {
  // ViewBox 0 0 100 140. Character is a side-profile facing RIGHT, matching the reference image.
  return (
    <svg viewBox="0 0 100 140" width={size} height={size * 1.4} className="drop-shadow-lg">
      <defs>
        <linearGradient id="skin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FADBB7" />
          <stop offset="100%" stopColor="#E0B68A" />
        </linearGradient>
        <linearGradient id="coat" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#EAEAEA" />
        </linearGradient>
        <linearGradient id="hat" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#D9D9D9" />
        </linearGradient>
      </defs>

      {/* Pants */}
      <path d="M 40 90 L 40 125 L 50 125 L 50 90 Z" fill="#333" />
      <path d="M 55 90 L 55 125 L 65 125 L 65 90 Z" fill="#333" />

      {/* Shoes (Brownish/Grey) */}
      <ellipse cx="45" cy="128" rx="10" ry="4" fill="#555" />
      <ellipse cx="60" cy="128" rx="10" ry="4" fill="#555" />
      <path d="M 35 128 L 55 128 L 55 132 L 35 132 Z" fill="#444" />
      <path d="M 50 128 L 70 128 L 70 132 L 50 132 Z" fill="#444" />

      {/* Body (Baggy Coat) */}
      <path d="M 35 45 C 20 50, 15 80, 25 100 C 40 105, 70 105, 80 95 C 85 80, 80 50, 65 45 Z" fill="url(#coat)" stroke="#CCC" strokeWidth="1" />
      {/* Coat line details */}
      <path d="M 25 100 Q 50 105 80 95" fill="none" stroke="#CCC" strokeWidth="1.5" />
      <path d="M 45 45 L 45 95" fill="none" stroke="#DDD" strokeWidth="1" />

      {/* Left Arm (Behind) depending on pose */}
      {pose === "reading" && (
        <path d="M 50 50 C 30 60, 30 75, 45 80" fill="none" stroke="url(#coat)" strokeWidth="12" strokeLinecap="round" />
      )}
      {pose === "kneading" && (
        <path d="M 45 50 C 35 60, 45 80, 65 85" fill="none" stroke="url(#coat)" strokeWidth="12" strokeLinecap="round" />
      )}
      {pose === "holding-peel" && (
        <path d="M 45 50 C 35 65, 45 70, 55 70" fill="none" stroke="url(#coat)" strokeWidth="12" strokeLinecap="round" />
      )}
      {pose === "celebrating" && (
        <path d="M 45 50 C 35 40, 35 25, 40 20" fill="none" stroke="url(#coat)" strokeWidth="12" strokeLinecap="round" />
      )}

      {/* Neck */}
      <rect x="48" y="38" width="12" height="10" fill="url(#skin)" />
      
      {/* Collar */}
      <path d="M 45 42 L 62 42 L 58 48 L 48 48 Z" fill="#FFF" stroke="#CCC" strokeWidth="1" />

      {/* Head */}
      <ellipse cx="52" cy="28" rx="12" ry="14" fill="url(#skin)" />

      {/* Big Nose! */}
      <path d="M 60 22 C 85 22, 95 32, 85 35 C 75 38, 65 35, 60 33 Z" fill="url(#skin)" />
      <path d="M 60 22 C 85 22, 95 32, 85 35" fill="none" stroke="#C9986A" strokeWidth="0.8" />

      {/* Ear */}
      <ellipse cx="44" cy="28" rx="3" ry="5" fill="url(#skin)" stroke="#C9986A" strokeWidth="0.5" />

      {/* Eye (sleepy half-closed) */}
      <circle cx="58" cy="22" r="1.5" fill="#333" />
      <path d="M 54 20 Q 58 18 62 20" fill="none" stroke="#333" strokeWidth="1.5" />

      {/* Goatee / Mustache */}
      <path d="M 58 38 C 55 42, 60 46, 62 45 C 65 42, 62 38, 58 38 Z" fill="#5C4033" />
      <path d="M 64 34 Q 67 36, 65 39" fill="none" stroke="#5C4033" strokeWidth="2.5" strokeLinecap="round" />

      {/* Hat (Leaning back to the left) */}
      <path d="M 40 18 L 62 18 L 60 5 L 42 5 Z" fill="#FFF" stroke="#E0E0E0" strokeWidth="1" />
      <path d="M 38 12 C -5 -5, 10 -25, 45 -15 C 65 -5, 75 5, 60 15 Z" fill="url(#hat)" />
      {/* Hat crease lines */}
      <path d="M 25 -5 Q 35 0 40 10" fill="none" stroke="#DDD" strokeWidth="1.5" />
      <path d="M 40 -10 Q 45 -5 48 8" fill="none" stroke="#DDD" strokeWidth="1.5" />

      {/* Right Arm (Front) depending on pose */}
      {pose === "reading" && (
        <g>
          <path d="M 60 50 C 70 60, 75 75, 65 80" fill="none" stroke="url(#coat)" strokeWidth="12" strokeLinecap="round" />
          <circle cx="65" cy="80" r="4.5" fill="url(#skin)" />
          {/* Ticket in hand */}
          <rect x="65" y="70" width="15" height="20" fill="#FFF" stroke="#CCC" strokeWidth="1" transform="rotate(15 65 70)" />
          <line x1="68" y1="75" x2="75" y2="75" stroke="#333" strokeWidth="1" transform="rotate(15 65 70)" />
          <line x1="68" y1="78" x2="73" y2="78" stroke="#333" strokeWidth="1" transform="rotate(15 65 70)" />
        </g>
      )}
      {pose === "kneading" && (
        <g>
          <path d="M 60 50 C 70 60, 75 80, 80 85" fill="none" stroke="url(#coat)" strokeWidth="12" strokeLinecap="round" />
          <circle cx="80" cy="85" r="4.5" fill="url(#skin)" />
        </g>
      )}
      {pose === "holding-peel" && (
        <g>
          <path d="M 60 50 C 65 60, 75 65, 85 65" fill="none" stroke="url(#coat)" strokeWidth="12" strokeLinecap="round" />
          {/* Left hand (back) on peel */}
          <circle cx="55" cy="70" r="4.5" fill="url(#skin)" />
          {/* Right hand (front) on peel */}
          <circle cx="85" cy="65" r="4.5" fill="url(#skin)" />
        </g>
      )}
      {pose === "celebrating" && (
        <g>
          <path d="M 60 50 C 75 40, 80 25, 75 15" fill="none" stroke="url(#coat)" strokeWidth="12" strokeLinecap="round" />
          <circle cx="75" cy="15" r="4.5" fill="url(#skin)" />
        </g>
      )}
    </svg>
  );
}

export { ChefSVG };
