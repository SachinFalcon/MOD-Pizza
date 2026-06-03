"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Sparkles, RotateCcw, Check } from "lucide-react";

// --- TYPES & INTERFACES ---
type Phase = "receipt" | "flattening" | "saucing" | "cheesing" | "toppings" | "baking" | "interactive";

interface PlacedTopping {
  id: string;
  type: string; // 'chicken' | 'onions' | 'olives' | 'peppers'
  x: number;
  y: number;
  rotation: number;
  scale: number;
  delay: number;
}

export function DashboardPizza() {
  const [phase, setPhase] = useState<Phase>("receipt");
  const [activeReceiptChecks, setActiveReceiptChecks] = useState<Record<string, boolean>>({
    chicken: false,
    onions: false,
    olives: false,
    peppers: false
  });
  
  // Placed toppings on pizza
  const [placedToppings, setPlacedToppings] = useState<PlacedTopping[]>([]);
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  const [hoverProgresses, setHoverProgresses] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isTaDa, setIsTaDa] = useState(false);

  // Refs for canvases
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const steamCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const rotationTimerRef = useRef<number | null>(null);

  // --- EFFECT: HOVER PROGRESS SMOOTH INTERPOLATION (SPRING-LIKE) ---
  useEffect(() => {
    let animId: number;
    const updateProgresses = () => {
      setHoverProgresses((prev) => {
        let changed = false;
        const next = prev.map((val, idx) => {
          const target = hoveredSlice === idx ? 1 : 0;
          if (val === target) return val;
          changed = true;
          const diff = target - val;
          if (Math.abs(diff) < 0.01) return target;
          return val + diff * 0.06;
        });
        return changed ? next : prev;
      });
      animId = requestAnimationFrame(updateProgresses);
    };
    animId = requestAnimationFrame(updateProgresses);
    return () => cancelAnimationFrame(animId);
  }, [hoveredSlice]);

  // --- EFFECT: SLOW CONTINUOUS ROTATION IN INTERACTIVE PHASE ---
  useEffect(() => {
    if (phase === "interactive") {
      let lastTime = performance.now();
      const rotate = (time: number) => {
        const delta = time - lastTime;
        lastTime = time;
        setRotationAngle((prev) => (prev + (delta * 0.006)) % 360);
        rotationTimerRef.current = requestAnimationFrame(rotate);
      };
      rotationTimerRef.current = requestAnimationFrame(rotate);
    } else {
      setRotationAngle(0);
      if (rotationTimerRef.current) {
        cancelAnimationFrame(rotationTimerRef.current);
      }
    }
    return () => {
      if (rotationTimerRef.current) {
        cancelAnimationFrame(rotationTimerRef.current);
      }
    };
  }, [phase]);

  // --- EFFECT: CANVAS CHEESE SNOWFALL (PHASE 4 - cheesing) ---
  useEffect(() => {
    if (phase !== "cheesing") {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 180;
    canvas.height = 180;

    interface CheeseParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      length: number;
      angle: number;
      spin: number;
    }

    const particles: CheeseParticle[] = [];
    const maxParticles = 95;
    const landedCheese: Array<{ x: number; y: number; length: number; angle: number }> = [];
    let frames = 0;

    const animate = () => {
      ctx.clearRect(0, 0, 180, 180);

      // Accumulating base cheese color glow
      ctx.fillStyle = "rgba(255, 254, 230, 0.45)";
      ctx.beginPath();
      ctx.arc(90, 90, 52, 0, Math.PI * 2);
      ctx.fill();

      // Draw landed cheese shreds
      ctx.strokeStyle = "#FFFEE6";
      ctx.lineWidth = 1.5;
      landedCheese.forEach((c) => {
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.angle);
        ctx.beginPath();
        ctx.moveTo(-c.length / 2, 0);
        ctx.lineTo(c.length / 2, 0);
        ctx.stroke();
        ctx.restore();
      });

      // Spawn falling shreds
      if (particles.length < maxParticles && frames < 90) {
        for (let i = 0; i < 2; i++) {
          particles.push({
            x: 35 + Math.random() * 110,
            y: -10 - Math.random() * 20,
            vx: -0.3 + Math.random() * 0.6,
            vy: 2.2 + Math.random() * 1.0,
            length: 4 + Math.random() * 4,
            angle: Math.random() * Math.PI * 2,
            spin: -0.04 + Math.random() * 0.08
          });
        }
      }

      // Update falling shreds
      ctx.strokeStyle = "#FFFEE6";
      ctx.lineWidth = 1.2;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.beginPath();
        ctx.moveTo(-p.length / 2, 0);
        ctx.lineTo(p.length / 2, 0);
        ctx.stroke();
        ctx.restore();

        const dx = p.x - 90;
        const dy = p.y - 90;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (p.y >= 35 && p.y <= 145 && dist <= 53) {
          if (landedCheese.length < 180) {
            landedCheese.push({
              x: p.x,
              y: p.y,
              length: p.length,
              angle: p.angle
            });
          }
          particles.splice(i, 1);
        } else if (p.y > 190) {
          particles.splice(i, 1);
        }
      }

      frames++;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [phase]);

  // --- EFFECT: CANVAS FIRE BURNING ON PIZZA (PHASE 6 - baking) ---
  useEffect(() => {
    if (phase !== "baking") {
      if (animationFrameRef.current && phase !== "cheesing") {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 180;
    canvas.height = 180;

    interface FireParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      life: number;
      maxLife: number;
      isSpark: boolean;
    }

    const particles: FireParticle[] = [];
    let frame = 0;

    const animate = () => {
      ctx.clearRect(0, 0, 180, 180);

      // screen composite blending makes overlapping fires glow intense white
      ctx.globalCompositeOperation = "screen";

      // Spawn flames (within pizza area r < 65 for ALL OVER)
      if (frame < 130) {
        // Spawn 6 fire flames per frame for more intensity
        for (let i = 0; i < 6; i++) {
          const angle = Math.random() * Math.PI * 2;
          const r = Math.random() * 65;
          particles.push({
            x: 90 + r * Math.cos(angle),
            y: 90 + r * Math.sin(angle),
            vx: -0.8 + Math.random() * 1.6,
            vy: -1.8 - Math.random() * 2.5,
            size: 15 + Math.random() * 20,
            alpha: 0.9 + Math.random() * 0.1,
            life: 0,
            maxLife: 20 + Math.floor(Math.random() * 15),
            isSpark: false
          });
        }

        // Spawn flying spark embers
        if (Math.random() < 0.8) {
          for(let i=0; i<2; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = Math.random() * 65;
            particles.push({
              x: 90 + r * Math.cos(angle),
              y: 90 + r * Math.sin(angle),
              vx: -3.0 + Math.random() * 6.0,
              vy: -3.5 - Math.random() * 3.0,
              size: 1.5 + Math.random() * 2.5,
              alpha: 1,
              life: 0,
              maxLife: 25 + Math.floor(Math.random() * 25),
              isSpark: true
            });
          }
        }
      }

      // Update fire particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const ratio = p.life / p.maxLife;

        if (p.isSpark) {
          p.vy += 0.07; // gravity
          p.alpha = 1 - ratio;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 171, 0, ${p.alpha})`;
          ctx.fill();
        } else {
          p.size = p.size * 0.94;
          p.alpha = 1 - ratio;

          let color = "rgba(255, 255, 255, 0)";
          if (ratio < 0.2) {
            color = `rgba(255, 255, 255, ${p.alpha})`; // White hot
          } else if (ratio < 0.45) {
            color = `rgba(255, 200, 0, ${p.alpha})`; // Gold yellow
          } else if (ratio < 0.75) {
            color = `rgba(255, 80, 0, ${p.alpha})`; // Bright orange
          } else {
            color = `rgba(200, 10, 10, ${p.alpha * 0.5})`; // Crimson red fading
          }

          ctx.beginPath();
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          grad.addColorStop(0, color);
          grad.addColorStop(0.5, color);
          grad.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = grad;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        if (p.life >= p.maxLife || p.y < 0) {
          particles.splice(i, 1);
        }
      }

      frame++;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [phase]);

  // --- EFFECT: CANVAS STEAM SYSTEM (PHASE 7 - interactive) ---
  useEffect(() => {
    if (phase !== "interactive") {
      if (animationFrameRef.current && phase !== "cheesing" && phase !== "baking") {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const canvas = steamCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 180;
    canvas.height = 180;

    interface SteamParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      life: number;
      maxLife: number;
    }

    const particles: SteamParticle[] = [];

    const animate = () => {
      ctx.clearRect(0, 0, 180, 180);

      // Spawn thick steam waves
      if (particles.length < 16 && Math.random() < 0.2) {
        particles.push({
          x: 40 + Math.random() * 100,
          y: 50 + Math.random() * 60,
          vx: -0.2 + Math.random() * 0.4,
          vy: -0.7 - Math.random() * 0.8,
          size: 5 + Math.random() * 8,
          alpha: 0,
          life: 0,
          maxLife: 60 + Math.random() * 40
        });
      }

      // Update and draw steam
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx + Math.sin(p.life * 0.06) * 0.5;
        p.y += p.vy;
        p.life++;

        const halfLife = p.maxLife / 2;
        if (p.life < halfLife) {
          p.alpha = (p.life / halfLife) * 0.28;
        } else {
          p.alpha = (1 - (p.life - halfLife) / halfLife) * 0.28;
        }

        p.size += 0.12;

        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, p.size * 0.1, p.x, p.y, p.size);
        grad.addColorStop(0, `rgba(255, 255, 255, ${p.alpha})`);
        grad.addColorStop(0.5, `rgba(240, 240, 240, ${p.alpha * 0.5})`);
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.life >= p.maxLife || p.y < 0) {
          particles.splice(i, 1);
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [phase]);

  // --- AUTOMATIC SEQUENCE INITIALIZATION ---
  const runSequence = () => {
    // Phase 1: Receipt HUD
    setPhase("receipt");
    setActiveReceiptChecks({ chicken: false, onions: false, olives: false, peppers: false });
    
    // Stagger checkmarks on the receipt ticket
    setTimeout(() => setActiveReceiptChecks((prev) => ({ ...prev, chicken: true })), 500);
    setTimeout(() => setActiveReceiptChecks((prev) => ({ ...prev, onions: true })), 1000);
    setTimeout(() => setActiveReceiptChecks((prev) => ({ ...prev, olives: true })), 1500);
    setTimeout(() => setActiveReceiptChecks((prev) => ({ ...prev, peppers: true })), 2000);

    // Phase 2: Dough flattening
    setTimeout(() => setPhase("flattening"), 2800);

    // Phase 3: Sauce swirl
    setTimeout(() => setPhase("saucing"), 4500);

    // Phase 4: Cheesing
    setTimeout(() => setPhase("cheesing"), 6500);

    // Phase 5: Toppings
    setTimeout(() => {
      const toppings: PlacedTopping[] = [];
      const types = ["chicken", "onions", "olives", "peppers"];
      
      types.forEach((type) => {
        const count = 5 + Math.floor(Math.random() * 3);
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const radius = 16 + Math.random() * 34;
          toppings.push({
            id: `${type}-${i}-${Math.random()}`,
            type,
            x: 90 + radius * Math.cos(angle),
            y: 90 + radius * Math.sin(angle),
            rotation: Math.random() * 360,
            scale: 0.8 + Math.random() * 0.3,
            delay: Math.random() * 600
          });
        }
      });
      setPlacedToppings(toppings);
      setPhase("toppings");
    }, 8500);

    // Phase 6: Baking (Fire wave)
    setTimeout(() => setPhase("baking"), 10500);

    // Phase 7: Interactive rotating cuts (Tataaa!)
    setTimeout(() => {
      setPhase("interactive");
      setIsTaDa(true);
      setTimeout(() => setIsTaDa(false), 600);
    }, 13200);
  };

  useEffect(() => {
    runSequence();
  }, []);

  // --- CHEESE PULL PATH CALCULATION ENGINE ---
  const cheesePullPaths = useMemo(() => {
    if (phase !== "interactive") return [];

    const H = 10; // max outward gap
    const center = { x: 90, y: 90 };
    const paths: Array<{ d: string; strokeWidth: number; opacity: number; color: string }> = [];

    for (let j = 0; j < 6; j++) {
      const pCurrent = hoverProgresses[j];
      const pNext = hoverProgresses[(j + 1) % 6];
      const progress = Math.max(pCurrent, pNext);
      if (progress < 0.05) continue;

      const cutAngleDeg = j * 60 + 30;
      const cutAngleRad = (cutAngleDeg * Math.PI) / 180;

      const angleCurrent = (j * 60 * Math.PI) / 180;
      const angleNext = ((((j + 1) % 6) * 60) * Math.PI) / 180;

      const txCurrent = pCurrent * H * Math.cos(angleCurrent);
      const tyCurrent = pCurrent * H * Math.sin(angleCurrent);

      const txNext = pNext * H * Math.cos(angleNext);
      const tyNext = pNext * H * Math.sin(angleNext);

      // Cheese membrane (web)
      const aInner = { x: center.x + 10 * Math.cos(cutAngleRad) + txCurrent, y: center.y + 10 * Math.sin(cutAngleRad) + tyCurrent };
      const aOuter = { x: center.x + 22 * Math.cos(cutAngleRad) + txCurrent, y: center.y + 22 * Math.sin(cutAngleRad) + tyCurrent };
      const bInner = { x: center.x + 10 * Math.cos(cutAngleRad) + txNext, y: center.y + 10 * Math.sin(cutAngleRad) + tyNext };
      const bOuter = { x: center.x + 22 * Math.cos(cutAngleRad) + txNext, y: center.y + 22 * Math.sin(cutAngleRad) + tyNext };

      const cInner = {
        x: (aInner.x + bInner.x) / 2 - 4 * Math.cos(cutAngleRad) * (1 - progress * 0.5),
        y: (aInner.y + bInner.y) / 2 - 4 * Math.sin(cutAngleRad) * (1 - progress * 0.5)
      };
      const cOuter = {
        x: (aOuter.x + bOuter.x) / 2 - 6 * Math.cos(cutAngleRad) * (1 - progress * 0.5),
        y: (aOuter.y + bOuter.y) / 2 - 6 * Math.sin(cutAngleRad) * (1 - progress * 0.5)
      };

      paths.push({
        d: `M ${aInner.x} ${aInner.y} L ${aOuter.x} ${aOuter.y} Q ${cOuter.x} ${cOuter.y} ${bOuter.x} ${bOuter.y} L ${bInner.x} ${bInner.y} Q ${cInner.x} ${cInner.y} ${aInner.x} ${aInner.y} Z`,
        strokeWidth: 0,
        opacity: 0.9 * (1 - progress * 0.2),
        color: "#FCE490"
      });

      // Strands
      const strandRadii = [22, 38, 54];
      strandRadii.forEach((r, idx) => {
        const ptA = { x: center.x + r * Math.cos(cutAngleRad) + txCurrent, y: center.y + r * Math.sin(cutAngleRad) + tyCurrent };
        const ptB = { x: center.x + r * Math.cos(cutAngleRad) + txNext, y: center.y + r * Math.sin(cutAngleRad) + tyNext };

        const sag = 6 + idx * 2;
        const ptC = {
          x: (ptA.x + ptB.x) / 2 - sag * Math.cos(cutAngleRad) * (1 - progress * 0.5),
          y: (ptA.y + ptB.y) / 2 - sag * Math.sin(cutAngleRad) * (1 - progress * 0.5)
        };

        const baseWidth = 3.2 - idx * 0.6;
        const currentWidth = Math.max(0.6, baseWidth * (1 - progress * 0.6));

        paths.push({
          d: `M ${ptA.x} ${ptA.y} Q ${ptC.x} ${ptC.y} ${ptB.x} ${ptB.y}`,
          strokeWidth: currentWidth,
          opacity: 0.95,
          color: "#F5D554"
        });
      });
    }

    return paths;
  }, [phase, hoverProgresses]);

  // --- RENDERING SUB-ELEMENTS ---
  const renderToppingVector = (type: string) => {
    switch (type) {
      case "chicken":
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path
              d="M 5 9 C 3 13, 5 19, 12 20 C 16 20, 21 17, 21 12 C 21 8, 16 4, 12 4 C 8 4, 6 6, 5 9 Z"
              fill="url(#chkG)"
            />
            <line x1="8" y1="10" x2="12" y2="14" stroke="#3A1E08" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            <line x1="13" y1="8" x2="17" y2="12" stroke="#3A1E08" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          </svg>
        );
      case "onions":
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <ellipse cx="12" cy="12" rx="10" ry="6" fill="none" stroke="#D946EF" strokeWidth="3.2" />
            <ellipse cx="12" cy="12" rx="7.5" ry="4.5" fill="none" stroke="#FDA4AF" strokeWidth="1.5" opacity="0.8" />
          </svg>
        );
      case "olives":
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <circle cx="12" cy="12" r="9" fill="url(#olvG)" />
            <circle cx="12" cy="12" r="3" fill="#2E1A1A" />
            <circle cx="9" cy="9" r="1" fill="#FFF" opacity="0.8" />
          </svg>
        );
      case "peppers":
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path
              d="M 5 11 C 4 7, 9 4, 15 4 C 18 4, 20 6, 18 8 C 16 10, 12 9, 10 11 C 8 13, 9 16, 6 18 C 4.5 19, 5 15, 5 11 Z"
              fill="url(#pepG)"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full relative pointer-events-auto select-none flex items-center justify-center">
      
      {/* GLOBAL SVGS DEF GRADIENTS */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <linearGradient id="chkG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DFAC87" />
            <stop offset="100%" stopColor="#7E471C" />
          </linearGradient>
          <linearGradient id="olvG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <linearGradient id="pepG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ADE80" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
          <radialGradient id="sauceG" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C92A2A" />
            <stop offset="80%" stopColor="#9C1A1C" />
            <stop offset="100%" stopColor="#6C090A" />
          </radialGradient>
        </defs>
      </svg>

      {/* --- HUD TICKET OVERLAY (PHASE 1) --- */}
      {phase === "receipt" && (
        <div className="absolute right-[195px] top-1/2 -translate-y-1/2 w-[160px] p-3 rounded-xl border border-white/10 bg-black/45 backdrop-blur-md text-white font-sans text-xs select-none shadow-2xl z-50 animate-hud-slide">
          <div className="text-center font-bold tracking-[0.2em] text-[#FFD700] border-b border-white/10 pb-1.5 mb-2 uppercase text-[9px]">
            Pizza Order #94
          </div>
          <div className="space-y-2.5">
            {[
              { id: "chicken", label: "Chicken (150g)" },
              { id: "onions", label: "Onions (50g)" },
              { id: "olives", label: "Olives (30g)" },
              { id: "peppers", label: "Peppers (40g)" }
            ].map((item) => (
              <div key={item.id} className="flex justify-between items-center text-[10px]">
                <span className="text-white/70">{item.label}</span>
                <div className={`h-4.5 w-4.5 rounded-full flex items-center justify-center border transition-all ${
                  activeReceiptChecks[item.id]
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                    : "bg-white/5 border-white/5 text-transparent"
                }`}>
                  <Check size={9} strokeWidth={3} />
                </div>
              </div>
            ))}
          </div>
          <div className="h-0.5 w-full bg-white/5 my-2.5 rounded-full overflow-hidden">
            <div className="h-full bg-[#FFD700] animate-hud-progress" />
          </div>
          <span className="text-[9px] text-white/40 block text-center uppercase tracking-widest">Prepping Tray...</span>
        </div>
      )}

      {/* --- 3D RENDER CANVAS BODY --- */}
      <div className={`${isTaDa ? "animate-tada-bounce" : ""} ${phase !== "receipt" && phase !== "interactive" ? "animate-chef-working" : ""}`}>
        <div 
          className="w-[180px] h-[180px] relative transform-style-3d origin-center"
          style={{
            transform: phase === "interactive" 
              ? `rotateX(42deg) rotateZ(${rotationAngle}deg)`
              : phase === "baking"
                ? "rotateX(20deg) scale(0.95)"
                : "rotateX(20deg)",
            transition: "transform 1s cubic-bezier(0.25, 0.8, 0.25, 1)"
          }}
        >
          {/* PEEL BOARD */}
          <div className="absolute inset-0 flex items-center justify-center transform-style-3d z-0 pointer-events-none select-none">
            <div className="absolute w-[170px] h-[170px] rounded-full bg-black/35 blur-md transform translate-z-[-8px] translate-y-1.5" />
            <div 
              className="absolute w-[160px] h-[160px] rounded-full flex items-center justify-center transform translate-z-[-6px]"
              style={{
                background: "radial-gradient(circle, #DFB185 30%, #B88555 100%)",
                boxShadow: "inset 0 0 12px rgba(0,0,0,0.35)"
              }}
            >
              <div className="absolute inset-1 rounded-full border border-black/5 opacity-20" />
              <div className="absolute inset-3 rounded-full border border-black/5 opacity-15" />
              
              {/* handle */}
              <div 
                className="absolute w-[90px] h-[22px] origin-right right-[152px] top-[69px] rounded-l-md transform rotate-[135deg]"
                style={{
                  background: "linear-gradient(to right, #B88555, #DFB185)",
                  boxShadow: "2px 2px 6px rgba(0,0,0,0.25)"
                }}
              />
            </div>
          </div>

          {/* PIZZA SURFACE */}
          {phase !== "interactive" ? (
            <div className="absolute inset-0 flex items-center justify-center transform-style-3d z-10">
              <div className="relative w-[140px] h-[140px] transform-style-3d">
                
                {/* Crust base */}
                <div 
                  className="absolute inset-0 rounded-full transition-all duration-[2000ms]"
                  style={{
                    background: phase === "baking"
                      ? "radial-gradient(circle, #EAD4B4 70%, #B87A43 90%, #6E3F15 100%)"
                      : "radial-gradient(circle, #F4ECE1 75%, #DFD5C2 95%, #C2B6A2 100%)",
                    boxShadow: phase === "baking"
                      ? "0 4px 10px rgba(0,0,0,0.35), inset 0 0 6px rgba(110,63,21,0.5)"
                      : "0 3px 6px rgba(0,0,0,0.15), inset 0 0 4px rgba(0,0,0,0.1)",
                    transform: phase === "receipt" || phase === "flattening" ? "scale(0.1)" : "scale(1)",
                    transition: phase === "flattening" ? "transform 1.7s cubic-bezier(0.175, 0.885, 0.32, 1.2)" : "all 1.7s ease"
                  }}
                >
                  {/* Baked Leopard Char Spots */}
                  {phase === "baking" && (
                    <div className="absolute inset-0 rounded-full overflow-hidden opacity-75 animate-fade-in">
                      <div className="absolute top-2 left-12 w-2 h-1.5 bg-[#42220F] rounded-full filter blur-[0.5px] rotate-45" />
                      <div className="absolute top-10 right-4 w-1.5 h-2.5 bg-[#33190A] rounded-full filter blur-[0.5px] -rotate-12" />
                      <div className="absolute bottom-6 left-8 w-2.5 h-2 bg-[#42220F] rounded-full filter blur-[0.5px] rotate-12" />
                    </div>
                  )}
                </div>

                {/* Sauce Swirl */}
                {(phase === "saucing" || phase === "cheesing" || phase === "toppings" || phase === "baking") && (
                  <div className="absolute inset-[6px] rounded-full overflow-hidden z-20 pointer-events-none">
                    <svg viewBox="0 0 140 140" className="w-full h-full">
                      {phase === "saucing" ? (
                        <path
                          d="M 70 70 A 7 7 0 0 1 77 70 A 14 14 0 0 1 56 70 A 21 21 0 0 1 91 70 A 28 28 0 0 1 42 70 A 35 35 0 0 1 105 70 A 42 42 0 0 1 28 70 A 49 49 0 0 1 119 70"
                          fill="none"
                          stroke="url(#sauceG)"
                          strokeWidth="14"
                          strokeLinecap="round"
                          strokeDasharray="900"
                          strokeDashoffset="900"
                          className="animate-sauce-swirl-banner"
                        />
                      ) : (
                        <circle cx="70" cy="70" r="56" fill="url(#sauceG)" className="animate-fade-in" />
                      )}
                    </svg>
                  </div>
                )}

                {/* Baked / Raw melted cheese plate */}
                {(phase === "toppings" || phase === "baking") && (
                  <div 
                    className="absolute inset-[8px] rounded-full z-28 transition-all duration-[2000ms]"
                    style={{
                      background: phase === "baking"
                        ? "radial-gradient(circle, #FFF2CC 0%, #FFD966 60%, #E29B12 100%)"
                        : "radial-gradient(circle, #FFFEE6 0%, #F4F1D6 100%)",
                      opacity: phase === "toppings" ? 0.95 : 1
                    }}
                  >
                    {/* bubble animations */}
                    {phase === "baking" && (
                      <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none opacity-80">
                        <div className="absolute top-4 left-8 w-4 h-3 bg-[#C27E12]/30 border border-[#9C6005]/20 rounded-full filter blur-[0.5px] animate-pulse" />
                        <div className="absolute bottom-6 left-10 w-5 h-4 bg-[#A2620A]/40 border border-[#8C4F03]/30 rounded-full filter blur-[0.5px] animate-pulse" />
                        <div className="absolute top-14 right-6 w-3 h-2.5 bg-[#C27E12]/35 border border-[#9C6005]/20 rounded-full filter blur-[0.5px] animate-pulse delay-200" />
                      </div>
                    )}
                  </div>
                )}

                {/* Toppings placing */}
                {(phase === "toppings" || phase === "baking") && (
                  <div className="absolute inset-0 z-40 pointer-events-none">
                    {placedToppings.map((top) => (
                      <div
                        key={top.id}
                        className="absolute w-[11px] h-[11px] transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `${(top.x / 180) * 100}%`,
                          top: `${(top.y / 180) * 100}%`,
                          transform: `rotateZ(${top.rotation}deg) scale(${top.scale})`,
                          filter: "drop-shadow(0 1.5px 3px rgba(0,0,0,0.3))",
                          animation: phase === "toppings"
                            ? "toppingDrop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.2) forwards"
                            : "none",
                          animationDelay: `${top.delay}ms`,
                          opacity: phase === "toppings" ? 0 : 1
                        }}
                      >
                        {renderToppingVector(top.type)}
                      </div>
                    ))}
                  </div>
                )}

                {/* Pulsing hot heat glow overlay during bake */}
                {phase === "baking" && (
                  <div className="absolute inset-0 rounded-full bg-orange-600/25 mix-blend-color-dodge animate-pulse pointer-events-none z-42" />
                )}

                {/* Particle canvas for Cheese Snow & Baking Flames */}
                {(phase === "cheesing" || phase === "baking") && (
                  <canvas 
                    ref={canvasRef} 
                    className="absolute inset-[6px] w-[128px] h-[128px] z-45 pointer-events-none rounded-full" 
                  />
                )}

              </div>
            </div>
          ) : (
            /* --- PHASE 7 INTERACTIVE WEDGES & CHEESE PULLS --- */
            <div className="absolute inset-0 flex items-center justify-center transform-style-3d z-10">
              {Array.from({ length: 6 }).map((_, idx) => {
                const pVal = hoverProgresses[idx];
                const H = 10; // radial offset gap
                const angleRad = ((idx * 60) * Math.PI) / 180;
                const tx = pVal * H * Math.cos(angleRad);
                const ty = pVal * H * Math.sin(angleRad);

                return (
                  <div
                    key={idx}
                    className="absolute inset-0 transform-style-3d cursor-pointer"
                    style={{
                      transform: `translate3d(${tx}px, ${ty}px, 0px) rotateZ(${idx * 60}deg)`,
                      transition: "transform 0.05s linear",
                      zIndex: hoveredSlice === idx ? 30 : 15
                    }}
                    onMouseEnter={() => setHoveredSlice(idx)}
                    onMouseLeave={() => setHoveredSlice(null)}
                  >
                    {/* Clipped Pizza Slice Container */}
                    <div 
                      className="absolute inset-0"
                      style={{
                        clipPath: "polygon(50% 50%, 83.68% 30.56%, 86.6% 36.1%, 88.2% 42.8%, 88.89% 50%, 88.2% 57.2%, 86.6% 63.9%, 83.68% 69.44%)",
                      }}
                    >
                      {/* Slice Container - Rotated Back to Top for Image Alignment */}
                      <div 
                        className="absolute inset-0 transform-style-3d pointer-events-none"
                        style={{
                          transform: `rotateZ(${-idx * 60}deg)`,
                          transformOrigin: "center center"
                        }}
                      >
                        {/* Original Pizza image */}
                        <img 
                          src="/images/pizza 2.png" 
                          alt="Pizza"
                          className="absolute inset-[20px] w-[140px] h-[140px] rounded-full object-cover transition-opacity duration-300"
                          style={{
                            opacity: hoveredSlice === idx ? 0 : 1
                          }}
                        />
                        
                        {/* Cheese Pull Image on Hover */}
                        <img 
                          src="/images/cheese dip slice.jpg" 
                          alt="Cheese Pull"
                          className="absolute inset-[20px] w-[140px] h-[140px] rounded-full object-cover transition-opacity duration-300"
                          style={{
                            opacity: hoveredSlice === idx ? 1 : 0
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* SVG Cheese Pull strands overlay */}
              <svg 
                className="absolute inset-0 w-[180px] h-[180px] pointer-events-none select-none z-25"
                viewBox="0 0 180 180"
              >
                <defs>
                  <filter id="cheeseSh" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#3B0709" floodOpacity="0.4" />
                  </filter>
                </defs>
                {cheesePullPaths.map((p, idx) => (
                  <path
                    key={idx}
                    d={p.d}
                    fill={p.strokeWidth === 0 ? p.color : "none"}
                    stroke={p.strokeWidth > 0 ? p.color : "none"}
                    strokeWidth={p.strokeWidth}
                    strokeLinecap="round"
                    opacity={p.opacity}
                    filter="url(#cheeseSh)"
                  />
                ))}
              </svg>
            </div>
          )}

          {/* Steam canvas overlay (Phase 7 only) */}
          {phase === "interactive" && (
            <canvas 
              ref={steamCanvasRef}
              className="absolute inset-0 w-[180px] h-[180px] z-50 pointer-events-none select-none"
              style={{
                transform: `rotateZ(${-rotationAngle}deg) rotateX(-42deg)`,
                transformOrigin: "center"
              }}
            />
          )}
        </div>
      </div>

      {/* --- REPLAY BUTTON HUDS (INTERACTIVE STATE ONLY) --- */}
      {phase === "interactive" && (
        <button 
          onClick={runSequence}
          className="absolute bottom-[-15px] p-1.5 bg-black/40 hover:bg-black/60 text-white/70 hover:text-white border border-white/10 hover:border-white/20 rounded-full transition-all cursor-pointer z-50 active:scale-90"
          title="Watch Cook Show Again"
        >
          <RotateCcw size={10} />
        </button>
      )}

      {/* CSS STYLES SPECIFIC TO THE BANNER PIZZA MOVEMENT */}
      <style jsx global>{`
        /* Sauce Swirling for Banner Pizza */
        @keyframes sauceSwirlBanner {
          from { stroke-dashoffset: 900; }
          to { stroke-dashoffset: 0; }
        }
        .animate-sauce-swirl-banner {
          animation: sauceSwirlBanner 1.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        /* HUD list entry animation */
        @keyframes hudSlide {
          from {
            opacity: 0;
            transform: translateY(-50%) translateX(25px);
          }
          to {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
        }
        .animate-hud-slide {
          animation: hudSlide 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* HUD checklist progress bar timer */
        @keyframes hudProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-hud-progress {
          animation: hudProgress 2.8s linear forwards;
        }

        /* Chef working bounce */
        @keyframes chefWork {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-2.5px) rotate(-0.5deg); }
          50% { transform: translateY(1.5px) rotate(0.5deg); }
          75% { transform: translateY(-1.5px) rotate(-0.25deg); }
        }
        .animate-chef-working {
          animation: chefWork 1.2s ease-in-out infinite;
          transform-origin: center;
        }

        /* Tada scale bounce wrapper */
        @keyframes tadaBounce {
          0% { transform: scale(0.9); }
          40% { transform: scale(1.15); filter: brightness(1.25); }
          65% { transform: scale(0.98); }
          100% { transform: scale(1.0); }
        }
        .animate-tada-bounce {
          animation: tadaBounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          transform-origin: center;
        }
      `}</style>

    </div>
  );
}
