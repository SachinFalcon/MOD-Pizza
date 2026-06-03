"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export function GhibliInteractivePizza({ interactive }: { interactive: boolean }) {
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

  // We have 6 slices
  const slices = Array.from({ length: 6 }).map((_, i) => i);

  return (
    <motion.div
      initial={{ rotateX: 0, scale: 1 }}
      animate={{
        rotateX: interactive ? 30 : 0,
        scale: interactive ? 1.1 : 1,
      }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
      className="w-[180px] h-[180px] relative drop-shadow-2xl"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Soft floor shadow */}
      <div className="absolute inset-2 bg-black/40 rounded-full filter blur-[10px] translate-y-4 pointer-events-none z-[-2]" />

      {/* Steam Overlay (Independent of rotation) */}
      {interactive && (
        <div className="absolute inset-[-20px] pointer-events-none z-50">
          {[
            { left: 40, delay: 0 },
            { left: 80, delay: 0.5 },
            { left: 120, delay: 0.2 },
            { left: 60, delay: 0.8 },
            { left: 100, delay: 1.2 },
            { left: 90, delay: 1.6 },
          ].map((st, i) => (
            <motion.div
              key={`steam-${i}`}
              initial={{ y: 80, opacity: 0, scale: 0.5 }}
              animate={{ y: 0, opacity: [0, 0.5, 0], scale: 1.5 }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: st.delay,
                ease: "easeOut",
              }}
              className="absolute w-12 h-12 bg-white/40 rounded-full filter blur-xl"
              style={{ left: st.left }}
            />
          ))}
        </div>
      )}

      {/* Continuously Rotating Pizza Container */}
      <motion.div
        animate={{ rotateZ: interactive ? 360 : 0 }}
        transition={{ 
          duration: 30, // Slow, realistic rotation
          repeat: Infinity, 
          ease: "linear",
        }}
        style={{ transformOrigin: "center center" }}
        className="w-full h-full relative origin-center"
      >
        
        {/* Realistic Dense Cheese Web SVG Layer */}
        {interactive && (
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-visible"
            viewBox="0 0 180 180"
            style={{ transform: "translateZ(-1px)" }}
          >
            {slices.map((idx) => {
              if (hoveredSlice !== idx) return null;
              
              const center = 90;
              const tx = Math.cos((idx * 60 + 30) * Math.PI / 180) * 20;
              const ty = Math.sin((idx * 60 + 30) * Math.PI / 180) * 20;
              
              // Gooey base membrane filling the inner center hole
              const webInner = { x: center + 5 * Math.cos((idx*60+5)*Math.PI/180), y: center + 5 * Math.sin((idx*60+5)*Math.PI/180) };
              const webOuter = { x: center + 5 * Math.cos((idx*60+55)*Math.PI/180), y: center + 5 * Math.sin((idx*60+55)*Math.PI/180) };
              const webInnerP = { x: webInner.x + tx, y: webInner.y + ty };
              const webOuterP = { x: webOuter.x + tx, y: webOuter.y + ty };
              const cp = { x: center + tx/2, y: center + ty/2 + 8 };
              
              const membranePath = `M ${webInner.x} ${webInner.y} L ${webOuter.x} ${webOuter.y} Q ${cp.x} ${cp.y} ${webOuterP.x} ${webOuterP.y} L ${webInnerP.x} ${webInnerP.y} Q ${cp.x} ${cp.y} ${webInner.x} ${webInner.y} Z`;

              // Dense strands spanning across the entire slice gap
              const strands = [
                { a: 5,  r: 60, d: 3, w: 3, c: "#FCE490" },
                { a: 10, r: 50, d: 5, w: 5, c: "#F5D554" },
                { a: 15, r: 40, d: 7, w: 7, c: "#FDE047" },
                { a: 20, r: 30, d: 9, w: 10, c: "#FEF08A" },
                { a: 25, r: 20, d: 11, w: 12, c: "#FCE490" },
                { a: 30, r: 15, d: 13, w: 15, c: "#F5D554" }, // Center thickest
                { a: 35, r: 20, d: 11, w: 12, c: "#FDE047" },
                { a: 40, r: 30, d: 9, w: 10, c: "#FEF08A" },
                { a: 45, r: 40, d: 7, w: 7, c: "#FCE490" },
                { a: 50, r: 50, d: 5, w: 5, c: "#F5D554" },
                { a: 55, r: 60, d: 3, w: 3, c: "#FDE047" },
              ];

              return (
                <g key={`cheese-pulls-${idx}`}>
                  {/* Inner solid web */}
                  <motion.path
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    d={membranePath}
                    fill="#FDE047"
                    style={{ filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.3))" }}
                  />
                  {/* Dense strands */}
                  {strands.map((strand, sIdx) => {
                    const angleRad = (idx * 60 + strand.a) * Math.PI / 180;
                    const ptA = { x: center + strand.r * Math.cos(angleRad), y: center + strand.r * Math.sin(angleRad) };
                    const ptB = { x: ptA.x + tx, y: ptA.y + ty };
                    const ptC = { x: (ptA.x + ptB.x)/2, y: (ptA.y + ptB.y)/2 + strand.d };
                    
                    return (
                      <motion.path
                        key={`strand-${sIdx}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        d={`M ${ptA.x} ${ptA.y} Q ${ptC.x} ${ptC.y} ${ptB.x} ${ptB.y}`}
                        stroke={strand.c}
                        strokeWidth={strand.w}
                        fill="none"
                        strokeLinecap="round"
                        style={{ filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.2))" }}
                      />
                    );
                  })}
                </g>
              );
            })}
          </svg>
        )}

        {/* The 6 Interactive Slices */}
        {slices.map((idx) => {
          const isHovered = hoveredSlice === idx;
          const midAngle = (idx * 60 + 30) * Math.PI / 180;
          const tx = Math.cos(midAngle) * 20;
          const ty = Math.sin(midAngle) * 20;

          return (
            <motion.div
              key={`slice-${idx}`}
              onMouseEnter={() => interactive && setHoveredSlice(idx)}
              onMouseLeave={() => interactive && setHoveredSlice(null)}
              initial={{ rotateZ: idx * 60 }}
              animate={{
                x: isHovered ? tx : 0,
                y: isHovered ? ty : 0,
                scale: isHovered ? 1.05 : 1, 
                rotateZ: idx * 60 + (isHovered ? 2 : 0), 
              }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="absolute inset-0 z-10 origin-center"
              style={{
                cursor: interactive ? "pointer" : "default",
                clipPath: "polygon(50% 50%, 100% 50%, 100% 100%, 78.87% 100%, 50% 50%)",
              }}
            >
              <div 
                className="absolute inset-0 pointer-events-none origin-center flex items-center justify-center"
                style={{
                  transform: `rotateZ(${-idx * 60}deg)`,
                }}
              >
                <div className="w-[150px] h-[150px] rounded-full overflow-hidden relative">
                  <img 
                    src="/images/pizza_banner.png" 
                    alt="Pizza"
                    className="absolute inset-0 w-full h-full object-cover scale-[1.4]"
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
