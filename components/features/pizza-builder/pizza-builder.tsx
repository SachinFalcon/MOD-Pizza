"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Play, RotateCcw, Flame, ChefHat, Sparkles, Plus, Check } from "lucide-react";
import { toast } from "sonner";

// --- TYPES & INTERFACES ---
type Phase = "selection" | "flattening" | "saucing" | "cheesing" | "toppings" | "baking" | "interactive";

interface ToppingDef {
  id: string;
  name: string;
  max: number;
  unit: string;
  color: string;
  gradient: string[];
}

interface PlacedTopping {
  id: string; // unique instance id
  type: string; // 'chicken' | 'onions' | 'olives' | 'peppers'
  x: number; // 2D local x coordinate
  y: number; // 2D local y coordinate
  rotation: number;
  scale: number;
  delay: number; // fall stagger delay
}

// --- CONFIGURATION ---
const TOPPING_DEFS: ToppingDef[] = [
  { id: "chicken", name: "Chicken", max: 300, unit: "g", color: "#C68B59", gradient: ["#DCA77A", "#8A542A"] },
  { id: "onions", name: "Onions", max: 100, unit: "g", color: "#D946EF", gradient: ["#FDA4AF", "#C084FC"] },
  { id: "olives", name: "Olives", max: 80, unit: "g", color: "#1E293B", gradient: ["#475569", "#0F172A"] },
  { id: "peppers", name: "Bell Peppers", max: 100, unit: "g", color: "#22C55E", gradient: ["#4ADE80", "#15803D"] }
];

export function PizzaBuilder() {
  // --- STATE ---
  const [phase, setPhase] = useState<Phase>("selection");
  const [quantities, setQuantities] = useState<Record<string, number>>({
    chicken: 0,
    onions: 0,
    olives: 0,
    peppers: 0
  });
  
  // Selection/Prep board flying ingredients (Phase 1)
  const [flyingIngredients, setFlyingIngredients] = useState<Array<{ id: string; type: string; x: number; y: number }>>([]);
  
  // Placed toppings on pizza (Phase 2 & 3)
  const [placedToppings, setPlacedToppings] = useState<PlacedTopping[]>([]);
  
  // Interactive Slice Hover (Phase 3)
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);
  
  // Silky smooth hover progress tracking (for synchronous CSS translation and SVG cheese pull)
  const [hoverProgresses, setHoverProgresses] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  
  // Continuous rotation angle in 3D
  const [rotationAngle, setRotationAngle] = useState(0);
  
  // Ref pointers for canvas animations
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const steamCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const rotationTimerRef = useRef<number | null>(null);

  // --- DERIVED INGREDIENT QUANTITIES ---
  const activeToppingTypes = useMemo(() => {
    return Object.keys(quantities).filter((key) => quantities[key] > 0);
  }, [quantities]);

  const hasIngredients = activeToppingTypes.length > 0;

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
          // Smooth ease-out interpolation
          const diff = target - val;
          if (Math.abs(diff) < 0.01) return target;
          return val + diff * 0.16;
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
        // 5 degrees per second
        setRotationAngle((prev) => (prev + (delta * 0.005)) % 360);
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

  // --- EFFECT: CANVAS CHEESE SNOWFALL (PHASE 2) ---
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

    // Set canvas dimensions matching container
    canvas.width = 400;
    canvas.height = 400;

    interface CheeseParticle {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      length: number;
      angle: number;
      spin: number;
    }

    const particles: CheeseParticle[] = [];
    const maxParticles = 180;
    const landedCheese: Array<{ x: number; y: number; r: number; length: number; angle: number }> = [];

    // Pre-populate some cheese
    let frames = 0;

    const animate = () => {
      ctx.clearRect(0, 0, 400, 400);

      // Draw accumulated cheese background glow/opacity
      ctx.fillStyle = "rgba(255, 254, 230, 0.4)";
      ctx.beginPath();
      ctx.arc(200, 200, 115, 0, Math.PI * 2);
      ctx.fill();

      // Draw already landed cheese shreds
      ctx.strokeStyle = "#FFFEE6";
      ctx.lineWidth = 2.5;
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

      // Generate new falling cheese particles
      if (particles.length < maxParticles && frames < 120) {
        // Falling cheese particles
        for (let i = 0; i < 3; i++) {
          particles.push({
            x: 80 + Math.random() * 240,
            y: -20 - Math.random() * 40,
            z: 0,
            vx: -0.5 + Math.random() * 1.0,
            vy: 3.5 + Math.random() * 2.0,
            vz: 0,
            length: 6 + Math.random() * 8,
            angle: Math.random() * Math.PI * 2,
            spin: -0.05 + Math.random() * 0.1
          });
        }
      }

      // Update and draw particles
      ctx.strokeStyle = "#FFFEE6";
      ctx.lineWidth = 2;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;

        // Draw particle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.beginPath();
        ctx.moveTo(-p.length / 2, 0);
        ctx.lineTo(p.length / 2, 0);
        ctx.stroke();
        ctx.restore();

        // Check if landed (y-coordinate reaches the pizza plane)
        // Pizza center is (200, 200), radius is 115.
        const dx = p.x - 200;
        const dy = p.y - 200;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (p.y >= 80 && p.y <= 320 && dist <= 118) {
          // Lands on pizza!
          if (landedCheese.length < 350) {
            landedCheese.push({
              x: p.x,
              y: p.y,
              r: dist,
              length: p.length,
              angle: p.angle
            });
          }
          particles.splice(i, 1);
        } else if (p.y > 420) {
          // Off screen
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

  // --- EFFECT: CANVAS STEAM SYSTEM (PHASE 3) ---
  useEffect(() => {
    if (phase !== "interactive") {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const canvas = steamCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

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
      ctx.clearRect(0, 0, 400, 400);

      // Generate random steam particles on the pizza
      if (particles.length < 25 && Math.random() < 0.2) {
        // Polar coordinates inside pizza radius (r < 110)
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * 110;
        particles.push({
          x: 200 + r * Math.cos(angle),
          y: 200 + r * Math.sin(angle),
          vx: -0.3 + Math.random() * 0.6,
          vy: -0.6 - Math.random() * 0.8,
          size: 3 + Math.random() * 5,
          alpha: 0,
          life: 0,
          maxLife: 60 + Math.random() * 40
        });
      }

      // Update and draw steam
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        // Calculate opacity (fade in, then fade out)
        const halfLife = p.maxLife / 2;
        if (p.life < halfLife) {
          p.alpha = (p.life / halfLife) * 0.12;
        } else {
          p.alpha = (1 - (p.life - halfLife) / halfLife) * 0.12;
        }

        // Slow expansion
        p.size += 0.12;

        // Draw fuzzy steam puff
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

  // --- HANDLER: INGREDIENT SLIDER CHANGE & FLY-IN EFFECT (PHASE 1) ---
  const handleQuantityChange = (type: string, value: number) => {
    const prevVal = quantities[type];
    setQuantities((prev) => ({ ...prev, [type]: value }));

    // Only spawn a flying graphic if we increase the amount
    if (value > prevVal) {
      const id = `${type}-${Date.now()}-${Math.random()}`;
      // Fly from slider position (approx left: 100, top: based on index)
      const index = TOPPING_DEFS.findIndex((t) => t.id === type);
      const startX = 60;
      const startY = 180 + index * 65;

      // Target position in the ingredients prep board (center-right, around x: 280, y: 200)
      const targetX = 250 + Math.random() * 80;
      const targetY = 140 + Math.random() * 120;

      setFlyingIngredients((prev) => [...prev, { id, type, x: startX, y: startY }]);

      // Animate the flight trajectory using setTimeout triggers
      setTimeout(() => {
        setFlyingIngredients((prev) =>
          prev.map((item) => (item.id === id ? { ...item, x: targetX, y: targetY } : item))
        );
      }, 50);

      // Remove fly animation element and add to stationary storage
      setTimeout(() => {
        setFlyingIngredients((prev) => prev.filter((item) => item.id !== id));
      }, 600);
    }
  };

  // --- CINEMATIC ANIMATION TIMELINE ENGINE (PHASE 2) ---
  const startPreparationSequence = () => {
    if (!hasIngredients) {
      toast.warning("Please select some ingredients first!");
      return;
    }

    // Step 1: Pre-calculate toppings scatter layout
    const toppingsList: PlacedTopping[] = [];
    
    Object.keys(quantities).forEach((type) => {
      const qty = quantities[type];
      if (qty === 0) return;

      // 1-to-1 ratio of slider value to visual piece count, capped for canvas spacing
      const pieceCount = Math.max(3, Math.min(16, Math.ceil(qty / 15)));
      
      for (let i = 0; i < pieceCount; i++) {
        // Compute random point inside circle r < 105 (avoid center r < 25)
        const angle = Math.random() * Math.PI * 2;
        const radiusRange = 35 + Math.random() * 70;
        const x = 200 + radiusRange * Math.cos(angle);
        const y = 200 + radiusRange * Math.sin(angle);
        
        toppingsList.push({
          id: `${type}-${i}-${Math.random()}`,
          type,
          x,
          y,
          rotation: Math.random() * 360,
          scale: 0.8 + Math.random() * 0.3,
          delay: Math.random() * 1200 // dynamic fly stagger delay
        });
      }
    });

    setPlacedToppings(toppingsList);
    setPhase("flattening");
    toast.info("1. Flattening the gourmet dough ball...", { duration: 2000 });

    // Timeline Transitions
    setTimeout(() => {
      setPhase("saucing");
      toast.info("2. Swirling rich vine-ripened tomato sauce...", { duration: 2000 });
    }, 2500);

    setTimeout(() => {
      setPhase("cheesing");
      toast.info("3. Showering fresh shredded mozzarella...", { duration: 2000 });
    }, 5000);

    setTimeout(() => {
      setPhase("toppings");
      toast.info("4. Placing gourmet toppings in patterns...", { duration: 2000 });
    }, 7500);

    setTimeout(() => {
      setPhase("baking");
      toast.info("5. Baking in the brick oven (melting & crisping)...", { duration: 2500 });
    }, 10000);

    setTimeout(() => {
      setPhase("interactive");
      toast.success("Ready! Hover over slices to explore!", { duration: 4000 });
    }, 13000);
  };

  const skipSequence = () => {
    // Generate layout instantly
    const toppingsList: PlacedTopping[] = [];
    Object.keys(quantities).forEach((type) => {
      const qty = quantities[type];
      if (qty === 0) return;
      const pieceCount = Math.max(3, Math.min(16, Math.ceil(qty / 15)));
      for (let i = 0; i < pieceCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radiusRange = 35 + Math.random() * 70;
        toppingsList.push({
          id: `${type}-${i}-${Math.random()}`,
          type,
          x: 200 + radiusRange * Math.cos(angle),
          y: 200 + radiusRange * Math.sin(angle),
          rotation: Math.random() * 360,
          scale: 0.8 + Math.random() * 0.3,
          delay: 0
        });
      }
    });
    setPlacedToppings(toppingsList);
    setPhase("interactive");
    toast.success("Design completed! Enjoy the interactive 3D rotation.", { duration: 3000 });
  };

  const resetBuilder = () => {
    setPhase("selection");
    setQuantities({ chicken: 0, onions: 0, olives: 0, peppers: 0 });
    setPlacedToppings([]);
    setHoveredSlice(null);
    setHoverProgresses([0, 0, 0, 0, 0, 0]);
  };

  // --- CHEESE PULL PATH CALCULATION ENGINE ---
  const cheesePullPaths = useMemo(() => {
    if (phase !== "interactive") return [];

    const H = 25; // max translation gap
    const center = { x: 200, y: 200 };
    const paths: Array<{ d: string; strokeWidth: number; opacity: number; color: string }> = [];

    // Loop through the 6 cuts between slice j and j+1
    for (let j = 0; j < 6; j++) {
      const pCurrent = hoverProgresses[j];
      const pNext = hoverProgresses[(j + 1) % 6];
      
      // Calculate individual slice active pull values
      const progress = Math.max(pCurrent, pNext);
      if (progress < 0.05) continue; // Skip rendering if gap is closed

      const cutAngleDeg = j * 60 + 30;
      const cutAngleRad = (cutAngleDeg * Math.PI) / 180;

      // Slice translation details
      const angleCurrent = (j * 60 * Math.PI) / 180;
      const angleNext = ((((j + 1) % 6) * 60) * Math.PI) / 180;

      const txCurrent = pCurrent * H * Math.cos(angleCurrent);
      const tyCurrent = pCurrent * H * Math.sin(angleCurrent);

      const txNext = pNext * H * Math.cos(angleNext);
      const tyNext = pNext * H * Math.sin(angleNext);

      // Generate 4 strands + 1 central web structure
      const strandRadii = [40, 65, 90, 115];

      // Draw central cheese membrane (web) between r = 20 and r = 45
      const aInner = { x: center.x + 20 * Math.cos(cutAngleRad) + txCurrent, y: center.y + 20 * Math.sin(cutAngleRad) + tyCurrent };
      const aOuter = { x: center.x + 45 * Math.cos(cutAngleRad) + txCurrent, y: center.y + 45 * Math.sin(cutAngleRad) + tyCurrent };
      const bInner = { x: center.x + 20 * Math.cos(cutAngleRad) + txNext, y: center.y + 20 * Math.sin(cutAngleRad) + tyNext };
      const bOuter = { x: center.x + 45 * Math.cos(cutAngleRad) + txNext, y: center.y + 45 * Math.sin(cutAngleRad) + tyNext };

      const cInner = {
        x: (aInner.x + bInner.x) / 2 - 8 * Math.cos(cutAngleRad) * (1 - progress * 0.5),
        y: (aInner.y + bInner.y) / 2 - 8 * Math.sin(cutAngleRad) * (1 - progress * 0.5)
      };
      const cOuter = {
        x: (aOuter.x + bOuter.x) / 2 - 12 * Math.cos(cutAngleRad) * (1 - progress * 0.5),
        y: (aOuter.y + bOuter.y) / 2 - 12 * Math.sin(cutAngleRad) * (1 - progress * 0.5)
      };

      const membranePath = `M ${aInner.x} ${aInner.y} L ${aOuter.x} ${aOuter.y} Q ${cOuter.x} ${cOuter.y} ${bOuter.x} ${bOuter.y} L ${bInner.x} ${bInner.y} Q ${cInner.x} ${cInner.y} ${aInner.x} ${aInner.y} Z`;

      paths.push({
        d: membranePath,
        strokeWidth: 0,
        opacity: 0.9 * (1 - progress * 0.2),
        color: "#FFE9A3"
      });

      // Individual cheese strings
      strandRadii.forEach((r, idx) => {
        const ptA = {
          x: center.x + r * Math.cos(cutAngleRad) + txCurrent,
          y: center.y + r * Math.sin(cutAngleRad) + tyCurrent
        };
        const ptB = {
          x: center.x + r * Math.cos(cutAngleRad) + txNext,
          y: center.y + r * Math.sin(cutAngleRad) + tyNext
        };

        // Sag control point pulling inward toward pizza center
        const sagScale = 12 + idx * 4;
        const ptC = {
          x: (ptA.x + ptB.x) / 2 - sagScale * Math.cos(cutAngleRad) * (1 - progress * 0.5),
          y: (ptA.y + ptB.y) / 2 - sagScale * Math.sin(cutAngleRad) * (1 - progress * 0.5)
        };

        // Cheese thinning effect: width drops as progress increases
        const baseWidth = 5.5 - idx * 0.8;
        const currentWidth = Math.max(1, baseWidth * (1 - progress * 0.6));

        paths.push({
          d: `M ${ptA.x} ${ptA.y} Q ${ptC.x} ${ptC.y} ${ptB.x} ${ptB.y}`,
          strokeWidth: currentWidth,
          opacity: 0.95,
          color: "#FFF2CC"
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
            <defs>
              <linearGradient id="chkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E6B89C" />
                <stop offset="60%" stopColor="#A86E43" />
                <stop offset="100%" stopColor="#693B16" />
              </linearGradient>
            </defs>
            <path
              d="M 5 9 C 3 13, 5 19, 12 20 C 16 20, 21 17, 21 12 C 21 8, 16 4, 12 4 C 8 4, 6 6, 5 9 Z"
              fill="url(#chkGrad)"
            />
            {/* Grill marks */}
            <line x1="8" y1="10" x2="12" y2="14" stroke="#3A1E08" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
            <line x1="11" y1="9" x2="15" y2="13" stroke="#3A1E08" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
            <line x1="14" y1="8" x2="18" y2="12" stroke="#3A1E08" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
          </svg>
        );
      case "onions":
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <ellipse cx="12" cy="12" rx="10" ry="6.5" fill="none" stroke="#D946EF" strokeWidth="3" />
            <ellipse cx="12" cy="12" rx="8" ry="5" fill="none" stroke="#FDA4AF" strokeWidth="1.5" opacity="0.75" />
          </svg>
        );
      case "olives":
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <defs>
              <linearGradient id="olvGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5E6B7E" />
                <stop offset="100%" stopColor="#0B0F19" />
              </linearGradient>
            </defs>
            <circle cx="12" cy="12" r="9" fill="url(#olvGrad)" />
            <circle cx="12" cy="12" r="3.5" fill="#2E1A1A" /> {/* center hole */}
            <circle cx="9" cy="9" r="1.2" fill="#FFF" opacity="0.8" /> {/* specular highlight */}
          </svg>
        );
      case "peppers":
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <defs>
              <linearGradient id="pepGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4ADE80" />
                <stop offset="100%" stopColor="#166534" />
              </linearGradient>
            </defs>
            {/* Curved crescent bell pepper slice */}
            <path
              d="M 5 11 C 4 7, 9 4, 15 4 C 18 4, 20 6, 18 8 C 16 10, 12 9, 10 11 C 8 13, 9 16, 6 18 C 4.5 19, 5 15, 5 11 Z"
              fill="url(#pepGrad)"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-gradient-to-br from-[#7A0D12] via-[#A91D22] to-[#3B0709] rounded-3xl shadow-2xl border border-white/10 p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-stretch relative overflow-hidden select-none">
      
      {/* Decorative ambient glowing lights */}
      <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] bg-white/5 rounded-full filter blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-red-500/10 rounded-full filter blur-[80px] pointer-events-none" />

      {/* --- COLUMN 1: INTERACTIVE USER PANEL & STATE TRACKER --- */}
      <div className="w-full lg:w-[400px] flex flex-col justify-between z-10 shrink-0 bg-black/25 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        
        {/* Header */}
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/10 shadow-inner">
              <ChefHat size={20} className="text-[#FFC107]" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading tracking-wider text-white uppercase flex items-center">
                Gourmet Pizza
                <span className="ml-2 px-2 py-0.5 text-[9px] font-sans font-bold bg-[#FFD700] text-black rounded-full uppercase tracking-tighter">3D PRO</span>
              </h2>
              <p className="text-xs text-white/60 font-medium">Create, Bake & Slice Interactively</p>
            </div>
          </div>
          <div className="h-px bg-white/10 my-5" />
        </div>

        {/* Dynamic Panels according to state machine */}
        <div className="flex-1 flex flex-col justify-start">
          
          {phase === "selection" ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white tracking-wide uppercase flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#FFC107]" />
                  Select Ingredients
                </h3>
                <p className="text-xs text-white/50 leading-relaxed">Adjust quantities to craft your recipe. 3D representation ingredients will fly to the side.</p>
              </div>

              {/* Sliders */}
              <div className="space-y-5">
                {TOPPING_DEFS.map((topping) => {
                  const val = quantities[topping.id];
                  const hasVal = val > 0;
                  return (
                    <div key={topping.id} className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className={`font-bold transition-colors ${hasVal ? "text-white" : "text-white/60"}`}>
                          {topping.name}
                        </span>
                        <span className={`font-bold transition-all ${hasVal ? "text-[#FFD700] scale-105" : "text-white/40"}`}>
                          {val} {topping.unit}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="range"
                          min="0"
                          max={topping.max}
                          step={topping.id === "chicken" ? 25 : 10}
                          value={val}
                          onChange={(e) => handleQuantityChange(topping.id, parseInt(e.target.value, 10))}
                          className="flex-1 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FFD700] hover:bg-white/15 transition-all outline-none"
                        />
                        <button
                          onClick={() => handleQuantityChange(topping.id, val === 0 ? topping.max / 2 : 0)}
                          className={`h-7 w-7 rounded-lg flex items-center justify-center border transition-all ${
                            hasVal 
                              ? "bg-white/10 border-white/20 text-[#FFD700]" 
                              : "bg-transparent border-white/10 text-white/40 hover:border-white/20"
                          }`}
                        >
                          {hasVal ? <Check size={14} /> : <Plus size={14} />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Added items list */}
              <div className="bg-white/5 border border-white/5 rounded-xl p-3.5 mt-2">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-2">Recipe Tray</span>
                {hasIngredients ? (
                  <div className="flex flex-wrap gap-2">
                    {activeToppingTypes.map((t) => (
                      <span key={t} className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white/10 border border-white/10 rounded-full text-xs text-white font-semibold capitalize">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#FFD700] animate-pulse" />
                        <span>{t}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-white/30 italic block py-0.5">Empty. Add ingredients above...</span>
                )}
              </div>
            </div>
          ) : (
            /* Cinematic Prep Progress Display */
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-sm font-semibold text-white tracking-wide uppercase">Preparation Phase</h3>
              <div className="space-y-4">
                {[
                  { id: "flattening", label: "Dough Shaping" },
                  { id: "saucing", label: "Tomato Base Application" },
                  { id: "cheesing", label: "Cheese Layering" },
                  { id: "toppings", label: "Toppings Distribution" },
                  { id: "baking", label: "Brick Oven Baking" },
                  { id: "interactive", label: "Baked & Interactive" }
                ].map((step, idx) => {
                  const stepOrder = ["flattening", "saucing", "cheesing", "toppings", "baking", "interactive"];
                  const currentIdx = stepOrder.indexOf(phase);
                  const isDone = currentIdx > idx;
                  const isActive = phase === step.id;
                  
                  return (
                    <div 
                      key={step.id} 
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                        isActive 
                          ? "bg-white/10 border-white/20 text-[#FFD700] shadow-md shadow-black/10 scale-102"
                          : isDone
                            ? "bg-transparent border-white/5 text-white/50 opacity-80"
                            : "bg-transparent border-transparent text-white/25 opacity-40"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isDone 
                            ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400" 
                            : isActive 
                              ? "bg-[#FFD700]/20 border border-[#FFD700]/30 text-[#FFD700]" 
                              : "bg-white/5 border border-white/5 text-white/30"
                        }`}>
                          {isDone ? "✓" : idx + 1}
                        </div>
                        <span className="text-xs font-bold tracking-wide">{step.label}</span>
                      </div>
                      
                      {isActive && (
                        <div className="flex space-x-1 items-center shrink-0">
                          {step.id === "baking" ? (
                            <Flame size={14} className="text-[#FF5722] animate-bounce" />
                          ) : (
                            <div className="flex space-x-0.5">
                              <span className="h-1.5 w-1.5 bg-[#FFD700] rounded-full animate-bounce delay-100" />
                              <span className="h-1.5 w-1.5 bg-[#FFD700] rounded-full animate-bounce delay-200" />
                              <span className="h-1.5 w-1.5 bg-[#FFD700] rounded-full animate-bounce delay-300" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Buttons Section */}
        <div className="space-y-3 mt-6 pt-4 border-t border-white/10">
          {phase === "selection" ? (
            <div className="flex flex-col gap-2">
              <button
                onClick={startPreparationSequence}
                disabled={!hasIngredients}
                className={`w-full py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center space-x-2 transition-all active:scale-98 ${
                  hasIngredients
                    ? "bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/20 hover:bg-[#FFC107] cursor-pointer"
                    : "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed"
                }`}
              >
                <Play size={14} fill="currentColor" />
                <span>Animate Preparation</span>
              </button>
              
              <button
                onClick={skipSequence}
                disabled={!hasIngredients}
                className={`w-full py-2.5 rounded-xl font-bold uppercase tracking-wider text-[10px] flex items-center justify-center space-x-2 transition-all active:scale-98 ${
                  hasIngredients
                    ? "bg-white/10 hover:bg-white/15 text-white border border-white/10 cursor-pointer"
                    : "bg-transparent text-white/10 border border-transparent cursor-not-allowed"
                }`}
              >
                <span>Skip to 3D Pull</span>
              </button>
            </div>
          ) : phase === "interactive" ? (
            <button
              onClick={resetBuilder}
              className="w-full py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center space-x-2 transition-all active:scale-98 cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Reset & Create New</span>
            </button>
          ) : (
            <button
              onClick={skipSequence}
              className="w-full py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center transition-all active:scale-98 cursor-pointer"
            >
              <span>Skip Animation</span>
            </button>
          )}
        </div>
      </div>

      {/* --- COLUMN 2: 3D GRAPHIC WORKSPACE AREA --- */}
      <div className="flex-1 min-h-[400px] md:min-h-[500px] flex items-center justify-center relative overflow-hidden bg-black/15 border border-white/5 rounded-2xl p-4">
        
        {/* Phase 1 Ingredient Selection: Flying/Hovering representation */}
        {phase === "selection" && (
          <div className="absolute inset-0 pointer-events-none select-none z-20">
            {/* Flying icons */}
            {flyingIngredients.map((item) => (
              <div
                key={item.id}
                className="absolute w-10 h-10 transition-all duration-500 ease-out z-40 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${item.x}px`,
                  top: `${item.y}px`,
                  filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.3))"
                }}
              >
                {renderToppingVector(item.type)}
              </div>
            ))}

            {/* Stationary chopping board representation showing selected counts */}
            <div className="absolute right-6 top-6 bg-white/5 border border-white/10 rounded-xl p-4 w-44 backdrop-blur-md animate-in slide-in-from-right-4 duration-300">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block mb-2 text-center border-b border-white/5 pb-1">
                Prep Chopboard
              </span>
              <div className="space-y-3.5">
                {TOPPING_DEFS.map((t) => {
                  const qty = quantities[t.id];
                  return (
                    <div key={t.id} className="flex justify-between items-center text-xs">
                      <span className="text-white/60 capitalize flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full border border-white/20" style={{ backgroundColor: t.color }} />
                        {t.name}
                      </span>
                      <span className="text-white font-bold">{qty > 0 ? `${qty}g` : "—"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 3D PERSPECTIVE CANVASES AND STRUCTURAL RENDERER */}
        <div 
          className="perspective-[1000px] w-[400px] h-[400px] flex items-center justify-center relative"
          style={{ transform: "scale(1.1)" }}
        >
          <div
            className={`w-[400px] h-[400px] relative transform-style-3d origin-center ${
              phase === "baking" ? "animate-oven-slide" : ""
            }`}
            style={{
              transform: phase === "interactive" 
                ? `rotateX(42deg) rotateZ(${rotationAngle}deg)`
                : phase === "baking"
                  ? "rotateX(20deg) scale(0.65) translateY(-50px) rotateY(-5deg)"
                  : "rotateX(20deg)",
              transition: "transform 1s cubic-bezier(0.25, 0.8, 0.25, 1)"
            }}
          >
            {/* --- PIZZA UNDER-BOARD / WOOD PEEL --- */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none transform-style-3d z-0">
              {/* Wooden Board Shadow */}
              <div className="absolute w-[360px] h-[360px] rounded-full bg-black/35 blur-xl transform translate-z-[-20px] translate-y-3" />
              
              {/* Elegant Wood Pizza Peel */}
              <div 
                className="absolute w-[340px] h-[340px] rounded-full border border-[#D5A070]/20 flex items-center justify-center transform translate-z-[-12px]"
                style={{
                  background: "radial-gradient(circle, #DFB185 40%, #B88555 100%)",
                  boxShadow: "inset 0 0 25px rgba(0,0,0,0.3)"
                }}
              >
                {/* Wood Grains (radial SVG ring filters) */}
                <div className="absolute inset-2 rounded-full border border-black/5 opacity-30" />
                <div className="absolute inset-6 rounded-full border border-black/5 opacity-25" />
                <div className="absolute inset-12 rounded-full border border-black/5 opacity-20" />
                <div className="absolute inset-20 rounded-full border border-black/5 opacity-15" />
                
                {/* Board handle (extends off to the bottom-left in board axis) */}
                <div 
                  className="absolute w-[180px] h-[40px] origin-right right-[320px] top-[150px] rounded-l-lg border-y border-l border-[#B88555] transform rotate-[135deg]"
                  style={{
                    background: "linear-gradient(to right, #B88555, #DFB185)",
                    boxShadow: "5px 5px 15px rgba(0,0,0,0.2)"
                  }}
                />
              </div>
            </div>

            {/* --- CORE PIZZA BODY --- */}
            {/* If in interactive state, we render 6 separate wedges. Otherwise we render the whole pizza base. */}
            {phase !== "interactive" ? (
              <div className="absolute inset-0 flex items-center justify-center transform-style-3d z-10">
                {/* Whole Pizza Base */}
                <div className="relative w-[300px] h-[300px] transform-style-3d">
                  
                  {/* Crust Layer (Raw or Baked based on phase) */}
                  <div 
                    className="absolute inset-0 rounded-full transition-all duration-[2000ms]"
                    style={{
                      background: phase === "baking"
                        ? "radial-gradient(circle, #EAD4B4 70%, #B87A43 90%, #6E3F15 100%)"
                        : "radial-gradient(circle, #F4ECE1 75%, #DFD5C2 95%, #C2B6A2 100%)",
                      boxShadow: phase === "baking"
                        ? "0 10px 25px rgba(0,0,0,0.4), inset 0 0 15px rgba(110,63,21,0.5)"
                        : "0 8px 18px rgba(0,0,0,0.2), inset 0 0 10px rgba(0,0,0,0.15)",
                      transform: phase === "flattening" ? "scale(0.1)" : "scale(1)",
                      transition: phase === "flattening" ? "transform 2s cubic-bezier(0.175, 0.885, 0.32, 1.2)" : "all 2s ease"
                    }}
                  >
                    {/* Char spots when baked */}
                    {phase === "baking" && (
                      <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none opacity-80 animate-fade-in">
                        <div className="absolute top-4 left-24 w-4 h-3 bg-[#42220F] rounded-full filter blur-[1px] rotate-45" />
                        <div className="absolute top-20 right-8 w-3 h-5 bg-[#33190A] rounded-full filter blur-[0.5px] -rotate-12" />
                        <div className="absolute bottom-12 left-16 w-5 h-4 bg-[#42220F] rounded-full filter blur-[1px] rotate-12" />
                        <div className="absolute bottom-2 right-28 w-4 h-4 bg-[#33190A] rounded-full filter blur-[0.5px] rotate-45" />
                        <div className="absolute top-40 left-4 w-3 h-3 bg-[#241105] rounded-full filter blur-[0.5px]" />
                      </div>
                    )}
                  </div>

                  {/* Tomato Sauce Swirl Overlay */}
                  {(phase === "saucing" || phase === "cheesing" || phase === "toppings" || phase === "baking") && (
                    <div className="absolute inset-[15px] rounded-full overflow-hidden z-20 pointer-events-none">
                      {/* Swirling Spiral Path */}
                      <svg viewBox="0 0 300 300" className="w-full h-full">
                        <defs>
                          <radialGradient id="sauceGrad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#C92A2A" />
                            <stop offset="70%" stopColor="#9C1A1C" />
                            <stop offset="100%" stopColor="#760D0E" />
                          </radialGradient>
                        </defs>
                        {phase === "saucing" ? (
                          <path
                            d="M 150 150 A 15 15 0 0 1 165 150 A 30 30 0 0 1 120 150 A 45 45 0 0 1 195 150 A 60 60 0 0 1 90 150 A 75 75 0 0 1 225 150 A 90 90 0 0 1 60 150 A 105 105 0 0 1 255 150 A 115 115 0 0 1 35 150"
                            fill="none"
                            stroke="url(#sauceGrad)"
                            strokeWidth="28"
                            strokeLinecap="round"
                            strokeDasharray="1800"
                            strokeDashoffset="1800"
                            className="animate-sauce-swirl"
                          />
                        ) : (
                          // Solid sauce base layer
                          <circle cx="150" cy="150" r="118" fill="url(#sauceGrad)" className="animate-fade-in" />
                        )}
                      </svg>
                    </div>
                  )}

                  {/* Cheese Canvas Overlay (Mozzarella Shower) */}
                  {phase === "cheesing" && (
                    <canvas 
                      ref={canvasRef} 
                      className="absolute inset-[15px] w-[270px] h-[270px] z-30 pointer-events-none rounded-full" 
                    />
                  )}

                  {/* Melted Bubbly Cheese Base (Fades in during baking) */}
                  {(phase === "toppings" || phase === "baking") && (
                    <div 
                      className="absolute inset-[18px] rounded-full z-28 transition-all duration-[2500ms]"
                      style={{
                        background: phase === "baking"
                          ? "radial-gradient(circle, #FFF2CC 0%, #FFD966 60%, #E29B12 100%)"
                          : "radial-gradient(circle, #FFFEE6 0%, #F4F1D6 100%)",
                        opacity: phase === "toppings" ? 0.9 : 1,
                        boxShadow: phase === "baking" 
                          ? "inset 0 0 10px rgba(0,0,0,0.2)" 
                          : "none"
                      }}
                    >
                      {/* Cheese bubbling toasted pockets during bake */}
                      {phase === "baking" && (
                        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none opacity-85">
                          <div className="absolute top-10 left-16 w-8 h-6 bg-[#C27E12]/30 border border-[#9C6005]/20 rounded-full filter blur-[1px] animate-pulse" />
                          <div className="absolute top-32 right-12 w-6 h-5 bg-[#C27E12]/30 border border-[#9C6005]/20 rounded-full filter blur-[1px] animate-pulse delay-500" />
                          <div className="absolute bottom-20 left-20 w-10 h-8 bg-[#A2620A]/40 border border-[#8C4F03]/35 rounded-full filter blur-[0.5px] animate-pulse" />
                          <div className="absolute bottom-10 right-24 w-7 h-5 bg-[#C27E12]/35 border border-[#9C6005]/20 rounded-full filter blur-[1px] animate-pulse delay-200" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Flying Toppings Sequence */}
                  {(phase === "toppings" || phase === "baking") && (
                    <div className="absolute inset-0 z-40 pointer-events-none">
                      {placedToppings.map((top) => (
                        <div
                          key={top.id}
                          className="absolute w-[24px] h-[24px] transform -translate-x-1/2 -translate-y-1/2"
                          style={{
                            left: `${(top.x / 400) * 100}%`,
                            top: `${(top.y / 400) * 100}%`,
                            transform: `rotateZ(${top.rotation}deg) scale(${top.scale})`,
                            filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.3))",
                            animation: phase === "toppings" 
                              ? `toppingDrop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.25) forwards` 
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
                </div>
              </div>
            ) : (
              /* --- INTERACTIVE PHASE: SLICED PIZZA + CHEESE PULL SYSTEM --- */
              <div className="absolute inset-0 flex items-center justify-center transform-style-3d z-10">
                {/* 6 Independent Slices */}
                {Array.from({ length: 6 }).map((_, idx) => {
                  const pVal = hoverProgresses[idx];
                  const H = 24; // outward translation max (px)
                  const angleRad = ((idx * 60) * Math.PI) / 180;
                  
                  // radial translation coordinates
                  const tx = pVal * H * Math.cos(angleRad);
                  const ty = pVal * H * Math.sin(angleRad);

                  return (
                    <div
                      key={idx}
                      className="absolute inset-0 transform-style-3d cursor-pointer"
                      style={{
                        transform: `translate3d(${tx}px, ${ty}px, 0px) rotateZ(${idx * 60}deg)`,
                        transition: "transform 0.05s linear", // instant response to state hook animation
                        // Wedge Clip Path (60-deg sector aligned along East direction in local rotated coordinates)
                        clipPath: "polygon(50% 50%, 82.48% 31.25%, 85.3% 36.8%, 86.8% 43.1%, 87.5% 50%, 86.8% 56.9%, 85.3% 63.2%, 82.48% 68.75%)",
                        zIndex: hoveredSlice === idx ? 30 : 15
                      }}
                      onMouseEnter={() => setHoveredSlice(idx)}
                      onMouseLeave={() => setHoveredSlice(null)}
                    >
                      {/* Slice Crust and Toppings Container */}
                      <div className="absolute inset-0 transform-style-3d">
                        {/* Crust Wedge */}
                        <div 
                          className="absolute inset-[50px] w-[300px] h-[300px] rounded-full transform -translate-x-[50px] -translate-y-[50px]"
                          style={{
                            background: "radial-gradient(circle, #EAD4B4 70%, #B87A43 90%, #6E3F15 100%)",
                            boxShadow: "inset 0 0 15px rgba(110,63,21,0.5)"
                          }}
                        >
                          {/* Baked spot markings */}
                          <div className="absolute inset-0 rounded-full overflow-hidden opacity-75">
                            <div className="absolute top-4 left-24 w-4 h-3 bg-[#42220F] rounded-full filter blur-[1px] rotate-45" />
                            <div className="absolute top-20 right-8 w-3 h-5 bg-[#33190A] rounded-full filter blur-[0.5px] -rotate-12" />
                            <div className="absolute bottom-12 left-16 w-5 h-4 bg-[#42220F] rounded-full filter blur-[1px] rotate-12" />
                            <div className="absolute bottom-2 right-28 w-4 h-4 bg-[#33190A] rounded-full filter blur-[0.5px] rotate-45" />
                            <div className="absolute top-40 left-4 w-3 h-3 bg-[#241105] rounded-full filter blur-[0.5px]" />
                          </div>
                        </div>

                        {/* Tomato Sauce wedge */}
                        <div 
                          className="absolute inset-[65px] w-[270px] h-[270px] rounded-full transform -translate-x-[65px] -translate-y-[65px]"
                          style={{
                            background: "radial-gradient(circle, #C92A2A 70%, #9C1A1C 90%, #760D0E 100%)"
                          }}
                        />

                        {/* Melted Bubbly Cheese Wedge */}
                        <div 
                          className="absolute inset-[68px] w-[264px] h-[264px] rounded-full transform -translate-x-[68px] -translate-y-[68px]"
                          style={{
                            background: "radial-gradient(circle, #FFF2CC 0%, #FFD966 60%, #E29B12 100%)",
                            boxShadow: "inset 0 0 8px rgba(0,0,0,0.15)"
                          }}
                        >
                          {/* Bubbles */}
                          <div className="absolute inset-0 rounded-full overflow-hidden opacity-85">
                            <div className="absolute top-10 left-16 w-8 h-6 bg-[#C27E12]/30 border border-[#9C6005]/20 rounded-full filter blur-[1px] animate-pulse" />
                            <div className="absolute top-32 right-12 w-6 h-5 bg-[#C27E12]/30 border border-[#9C6005]/20 rounded-full filter blur-[1px] animate-pulse delay-500" />
                            <div className="absolute bottom-20 left-20 w-10 h-8 bg-[#A2620A]/40 border border-[#8C4F03]/35 rounded-full filter blur-[0.5px] animate-pulse" />
                            <div className="absolute bottom-10 right-24 w-7 h-5 bg-[#C27E12]/35 border border-[#9C6005]/20 rounded-full filter blur-[1px] animate-pulse delay-200" />
                          </div>
                        </div>

                        {/* Scattered Topping instances (Cut path handles clipping automatically) */}
                        <div className="absolute inset-0">
                          {placedToppings.map((top) => (
                            <div
                              key={top.id}
                              className="absolute w-[24px] h-[24px] transform -translate-x-1/2 -translate-y-1/2"
                              style={{
                                left: `${(top.x / 400) * 100}%`,
                                top: `${(top.y / 400) * 100}%`,
                                // Counteract the slice container Z-rotation so toppings remain upright in local board space
                                transform: `rotateZ(${top.rotation - idx * 60}deg) scale(${top.scale})`,
                                filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.3))"
                              }}
                            >
                              {renderToppingVector(top.type)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* SVG Cheese Pull Overlay (Inside 3D space, rotated and tilted along with board) */}
                <svg 
                  className="absolute inset-0 w-[400px] h-[400px] pointer-events-none select-none z-25"
                  viewBox="0 0 400 400"
                >
                  <defs>
                    {/* Shadow for cheese strands to pop */}
                    <filter id="cheeseShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#3B0709" floodOpacity="0.5" />
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
                      filter="url(#cheeseShadow)"
                    />
                  ))}
                </svg>
              </div>
            )}
            
            {/* Steam canvas overlay (Phase 3 only) */}
            {phase === "interactive" && (
              <canvas 
                ref={steamCanvasRef}
                className="absolute inset-0 w-[400px] h-[400px] z-50 pointer-events-none select-none"
                style={{
                  // Keep steam canvas pointing upright in screen space relative to rotated pizza
                  transform: `rotateZ(${-rotationAngle}deg) rotateX(-42deg)`,
                  transformOrigin: "center"
                }}
              />
            )}

          </div>
        </div>

        {/* BRICK OVEN BACKDROP GRAPHIC (PHASE 2 BAKING) */}
        {phase === "baking" && (
          <div className="absolute inset-0 bg-[#120405]/95 flex flex-col items-center justify-center z-30 animate-in fade-in duration-500">
            {/* Oven fire glow */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#E65100] via-[#FF8F00]/40 to-transparent opacity-80" />
            <div className="absolute w-[280px] h-[280px] rounded-full bg-gradient-radial from-[#FF3D00]/30 to-transparent filter blur-2xl animate-pulse" />

            {/* Brick arch outline */}
            <div className="relative border-4 border-amber-950/40 border-b-0 w-[320px] h-[220px] rounded-t-full bg-gradient-to-b from-stone-900 to-stone-950 p-6 flex flex-col items-center justify-end shadow-2xl overflow-hidden">
              <div className="absolute top-2 w-[90%] h-6 bg-amber-950/20 border-b border-white/5 rounded-t-full" />
              
              {/* Fiery elements */}
              <div className="flex space-x-2 items-end mb-4 z-10">
                <Flame size={48} className="text-[#FF3D00] animate-bounce" />
                <Flame size={64} className="text-[#FF8F00] animate-bounce delay-150" />
                <Flame size={40} className="text-[#FFAB00] animate-bounce delay-300" />
              </div>
              <span className="text-white text-xs font-bold uppercase tracking-[0.25em] z-10 text-[#FF8F00] animate-pulse">
                Wood-Fired Baking...
              </span>
            </div>
          </div>
        )}

        {/* Slice Hover Guide Message */}
        {phase === "interactive" && (
          <div className="absolute bottom-6 bg-black/45 border border-white/10 rounded-full px-5 py-2 text-xs text-white/90 font-medium tracking-wide flex items-center gap-2 pointer-events-none animate-in slide-in-from-bottom-4 delay-200">
            <Sparkles size={13} className="text-[#FFD700]" />
            Hover over a slice to experience the cheese pull!
          </div>
        )}
      </div>

      {/* CSS STYLES FOR THE ROTATING BOARD AND SPRINGS */}
      <style jsx global>{`
        /* Sauce Swirling Animation */
        @keyframes sauceSwirl {
          from {
            stroke-dashoffset: 1800;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-sauce-swirl {
          animation: sauceSwirl 2.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        /* Toppings dropping with gravity bounce */
        @keyframes toppingDrop {
          0% {
            transform: rotateZ(var(--tw-rotate, 0deg)) scale(2.2) translateY(-250px);
            opacity: 0;
          }
          65% {
            transform: rotateZ(var(--tw-rotate, 0deg)) scale(1.05) translateY(5px);
            opacity: 1;
          }
          85% {
            transform: rotateZ(var(--tw-rotate, 0deg)) scale(0.95) translateY(-3px);
          }
          100% {
            transform: rotateZ(var(--tw-rotate, 0deg)) scale(1) translateY(0);
            opacity: 1;
          }
        }

        /* Oven sliding in/out movement */
        @keyframes ovenSlide {
          0% {
            transform: rotateX(20deg) scale(1) translateX(0);
          }
          20% {
            transform: rotateX(20deg) scale(0.7) translateX(300px);
            opacity: 0;
          }
          22% {
            transform: rotateX(20deg) scale(0.6) translateX(-300px);
            opacity: 0;
          }
          35% {
            transform: rotateX(20deg) scale(0.65) translateY(-50px) rotateY(-5deg) translateX(0);
            opacity: 1;
          }
          85% {
            transform: rotateX(20deg) scale(0.65) translateY(-50px) rotateY(-5deg) translateX(0);
            opacity: 1;
          }
          95% {
            transform: rotateX(20deg) scale(0.7) translateX(-300px);
            opacity: 0;
          }
          97% {
            transform: rotateX(42deg) scale(0.9) translateX(300px);
            opacity: 0;
          }
          100% {
            transform: rotateX(42deg) scale(1) translateX(0);
            opacity: 1;
          }
        }
        .animate-oven-slide {
          animation: ovenSlide 3s cubic-bezier(0.3, 0.8, 0.3, 1) forwards;
        }

        /* Ambient fade animations */
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .scale-102 {
          transform: scale(1.02);
        }
      `}</style>

    </div>
  );
}
