import { useEffect, useRef, useState, useCallback } from "react";
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

const Balloon = ({ left, delay, color, size, id, onPop }: { left: string; delay: number; color: string; size: number; id: number; onPop: (id: number, e: React.MouseEvent) => void }) => (
  <div
    className="absolute bottom-[-15%] cursor-pointer z-20"
    style={{
      left,
      animation: `balloon-rise ${8 + Math.random() * 4}s ${delay}s ease-out forwards`,
      opacity: 0,
    }}
    onClick={(e) => onPop(id, e)}
  >
    <svg width={size} height={size * 1.4} viewBox="0 0 40 56" fill="none">
      <ellipse cx="20" cy="18" rx="16" ry="18" fill={color} opacity="0.75" />
      <ellipse cx="20" cy="18" rx="16" ry="18" fill="url(#balloon-shine)" opacity="0.4" />
      <polygon points="20,36 18,38 22,38" fill={color} opacity="0.6" />
      <line x1="20" y1="38" x2="20" y2="56" stroke={color} strokeWidth="0.8" opacity="0.5" />
      <defs>
        <radialGradient id="balloon-shine" cx="35%" cy="30%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.6" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  </div>
);

const HeroScene = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [poppedBalloons, setPoppedBalloons] = useState<Set<number>>(new Set());
  const [popEffects, setPopEffects] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax background
      gsap.to(bgRef.current, {
        yPercent: 30,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.fromTo(
        nameRef.current,
        { opacity: 0, y: 60, filter: "blur(15px)" },
        {
          opacity: 1, y: 0, filter: "blur(0px)", duration: 2, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", end: "top 20%", scrub: 1 },
        }
      );
      gsap.fromTo(
        subRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1.5, ease: "power2.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 60%", end: "top 10%", scrub: 1 },
        }
      );
      gsap.to(glowRef.current, {
        scale: 1.3, opacity: 0.6,
        scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 2 },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const balloons = [
    { left: "8%", delay: 0.5, color: "hsl(340 40% 60%)", size: 32 },
    { left: "22%", delay: 1.2, color: "hsl(40 60% 55%)", size: 28 },
    { left: "75%", delay: 0.8, color: "hsl(340 30% 65%)", size: 36 },
    { left: "88%", delay: 1.8, color: "hsl(24 55% 50%)", size: 30 },
    { left: "45%", delay: 2.2, color: "hsl(340 45% 55%)", size: 26 },
    { left: "60%", delay: 0.3, color: "hsl(40 70% 65%)", size: 34 },
  ];

  return (
    <section ref={sectionRef} className="section-snap relative flex items-center justify-center overflow-hidden section-tint-warm">
      {/* Parallax background layer */}
      <div
        ref={bgRef}
        className="absolute inset-0 -top-[15%] -bottom-[15%] cinema-gradient"
      />

      <div className="absolute inset-0 vignette pointer-events-none z-10" />

      {/* Glow orb */}
      <div
        ref={glowRef}
        className="absolute w-[500px] h-[500px] rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, hsl(var(--gold) / 0.15) 0%, transparent 70%)",
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-gold/20 animate-float"
          style={{
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            left: `${10 + i * 11}%`,
            top: `${15 + (i % 4) * 20}%`,
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${4 + i * 0.8}s`,
          }}
        />
      ))}

      {/* Balloons */}
      {balloons.map((b, i) => !poppedBalloons.has(i) && (
        <Balloon key={i} {...b} id={i} onPop={handlePop} />
      ))}
      {popEffects.map(p => (
        <PopParticle key={`pop-${p.id}`} x={p.x} y={p.y} color={p.color} />
      ))}

      <div className="relative z-20 text-center px-6 max-w-4xl">
        <h1
          ref={nameRef}
          className="font-display text-7xl md:text-9xl lg:text-[11rem] font-light tracking-wide text-gold glow-gold leading-none"
        >
          Isioma
        </h1>
        <p
          ref={subRef}
          className="mt-8 font-body text-base md:text-lg tracking-[0.25em] uppercase text-muted-foreground"
        >
          Nineteen years of light, love, and becoming
        </p>
      </div>
    </section>
  );
};

export default HeroScene;
