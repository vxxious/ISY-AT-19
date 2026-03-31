import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PopParticle = ({ x, y, color }: { x: number; y: number; color: string }) => (
  <div className="absolute pointer-events-none z-50" style={{ left: x, top: y }}>
    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (i / 8) * 360;
      const dist = 20 + Math.random() * 30;
      return (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 3 + Math.random() * 4,
            height: 3 + Math.random() * 4,
            backgroundColor: color,
            animation: `pop-particle 0.5s ease-out forwards`,
            transform: `translate(-50%, -50%)`,
            '--pop-x': `${Math.cos(angle * Math.PI / 180) * dist}px`,
            '--pop-y': `${Math.sin(angle * Math.PI / 180) * dist}px`,
          } as React.CSSProperties}
        />
      );
    })}
  </div>
);

const StarBurst = () => {
  const stars = useMemo(() => 
    Array.from({ length: 20 }).map((_, i) => ({
      angle: (i / 20) * 360 + Math.random() * 18,
      dist: 60 + Math.random() * 120,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 0.4,
      duration: 0.6 + Math.random() * 0.5,
    })), []);

  return (
    <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center">
      {stars.map((s, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            width: s.size,
            height: s.size,
            background: `radial-gradient(circle, hsl(var(--gold)) 0%, transparent 70%)`,
            borderRadius: '50%',
            boxShadow: `0 0 ${s.size * 2}px hsl(var(--gold) / 0.6)`,
            animation: `sparkle-burst ${s.duration}s ${s.delay}s ease-out forwards`,
            '--burst-x': `${Math.cos(s.angle * Math.PI / 180) * s.dist}px`,
            '--burst-y': `${Math.sin(s.angle * Math.PI / 180) * s.dist}px`,
            opacity: 0,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

const Confetti = () => {
  const pieces = useMemo(() => {
    const colors = [
      "hsl(var(--gold))",
      "hsl(var(--blush))",
      "hsl(var(--gold) / 0.7)",
      "hsl(var(--blush-soft))",
      "hsl(var(--muted-foreground) / 0.4)",
    ];
    const shapes = ["circle", "rect", "strip"] as const;
    return Array.from({ length: 60 }).map((_, i) => ({
      color: colors[i % colors.length],
      shape: shapes[i % shapes.length],
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 4,
      rotate: Math.random() * 720 - 360,
      sway: (Math.random() - 0.5) * 120,
      size: 4 + Math.random() * 8,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-30">
      {pieces.map((p, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: `-3%`,
            width: p.shape === "strip" ? p.size * 0.4 : p.size,
            height: p.shape === "strip" ? p.size * 2 : p.shape === "rect" ? p.size * 0.7 : p.size,
            borderRadius: p.shape === "circle" ? "50%" : "1px",
            backgroundColor: p.color,
            opacity: 0.85,
            animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
};

const Balloon = ({ left, delay, color, size, id, onPop }: { left: string; delay: number; color: string; size: number; id: number; onPop: (id: number, e: React.MouseEvent) => void }) => (
  <div
    className="absolute bottom-[-20%] cursor-pointer z-20"
    style={{
      left,
      animation: `balloon-rise ${10 + Math.random() * 4}s ${delay}s ease-out forwards`,
      opacity: 0,
    }}
    onClick={(e) => onPop(id, e)}
  >
    <svg width={size} height={size * 1.4} viewBox="0 0 40 56" fill="none">
      <ellipse cx="20" cy="18" rx="16" ry="18" fill={color} opacity="0.8" />
      <ellipse cx="20" cy="18" rx="16" ry="18" fill="url(#bs)" opacity="0.35" />
      <polygon points="20,36 18,38 22,38" fill={color} opacity="0.6" />
      <path d="M20 38 Q18 44 20 50 Q22 44 20 38" stroke={color} strokeWidth="0.6" fill="none" opacity="0.4" />
      <defs>
        <radialGradient id="bs" cx="35%" cy="30%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.7" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  </div>
);

const FinalScene = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const [showEffects, setShowEffects] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);
  const [poppedBalloons, setPoppedBalloons] = useState<Set<number>>(new Set());
  const [popEffects, setPopEffects] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 50%",
        onEnter: () => {
          setShowEffects(true);
          setTimeout(() => setShowSparkle(true), 800);
        },
      });

      gsap.fromTo(
        titleRef.current,
        { opacity: 0, scale: 0.8, filter: "blur(20px)" },
        {
          opacity: 1, scale: 1, filter: "blur(0px)", duration: 2, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 60%", end: "top 20%", scrub: 1 },
        }
      );

      gsap.fromTo(
        subRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1.5,
          scrollTrigger: { trigger: sectionRef.current, start: "top 40%", end: "top 10%", scrub: 1 },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handlePop = useCallback((id: number, e: React.MouseEvent) => {
    if (poppedBalloons.has(id)) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const section = sectionRef.current?.getBoundingClientRect();
    const x = rect.left + rect.width / 2 - (section?.left || 0);
    const y = rect.top + rect.height / 3 - (section?.top || 0);
    const color = balloons[id]?.color || "hsl(340 40% 60%)";
    
    setPoppedBalloons(prev => new Set(prev).add(id));
    setPopEffects(prev => [...prev, { id, x, y, color }]);
    
    const el = e.currentTarget as HTMLElement;
    gsap.to(el, { scale: 1.3, opacity: 0, duration: 0.15, ease: "power2.in" });
    
    setTimeout(() => setPopEffects(prev => prev.filter(p => p.id !== id)), 600);
  }, [poppedBalloons]);

  const balloons = [
    { left: "5%", delay: 0.2, color: "hsl(340 40% 60%)", size: 38 },
    { left: "15%", delay: 1.0, color: "hsl(40 60% 55%)", size: 30 },
    { left: "30%", delay: 0.6, color: "hsl(340 30% 70%)", size: 42 },
    { left: "50%", delay: 1.4, color: "hsl(24 55% 50%)", size: 34 },
    { left: "70%", delay: 0.4, color: "hsl(340 45% 55%)", size: 36 },
    { left: "85%", delay: 1.1, color: "hsl(40 70% 60%)", size: 32 },
    { left: "92%", delay: 1.8, color: "hsl(340 35% 65%)", size: 28 },
  ];

  return (
    <section ref={sectionRef} className="section-snap relative flex items-center justify-center overflow-hidden section-tint-warm">
      <div className="absolute inset-0 vignette pointer-events-none z-10" />

      {showEffects && (
        <>
          <Confetti />
          {balloons.map((b, i) => !poppedBalloons.has(i) && (
            <Balloon key={i} {...b} id={i} onPop={handlePop} />
          ))}
          {popEffects.map(p => (
            <PopParticle key={`pop-${p.id}`} x={p.x} y={p.y} color={p.color} />
          ))}
        </>
      )}

      {showSparkle && <StarBurst />}

      {/* Celebration glow */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20 animate-pulse-glow"
        style={{
          background: "radial-gradient(circle, hsl(var(--gold) / 0.3) 0%, hsl(var(--blush) / 0.1) 50%, transparent 70%)",
        }}
      />

      <div className="relative z-20 text-center px-6">
        <h2
          ref={titleRef}
          className="font-display text-5xl md:text-8xl lg:text-9xl font-light text-gold glow-gold leading-tight"
        >
          Happy 19th
          <br />
          Birthday
        </h2>
        <p
          ref={subRef}
          className="mt-8 font-display text-xl md:text-2xl text-blush font-light italic"
        >
          Isioma, May this year bring you endless joy, unforgettable adventures, and all the love you deserve. Keep shining bright and being unapologetically you. Happy birthday!
        </p>
      </div>
    </section>
  );
};

export default FinalScene;
