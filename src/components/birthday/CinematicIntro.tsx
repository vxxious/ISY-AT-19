import { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";

interface CinematicIntroProps {
  onComplete: () => void;
}

const NameSparkleBurst = () => {
  const particles = useMemo(() =>
    Array.from({ length: 24 }).map((_, i) => {
      const angle = (i / 24) * 360 + (Math.random() - 0.5) * 15;
      const dist = 40 + Math.random() * 140;
      return {
        angle,
        dist,
        size: 2 + Math.random() * 5,
        delay: Math.random() * 0.5,
        duration: 0.7 + Math.random() * 0.6,
        isGold: Math.random() > 0.4,
      };
    }), []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            width: p.size,
            height: p.size,
            background: p.isGold
              ? `radial-gradient(circle, hsl(var(--gold)) 0%, transparent 70%)`
              : `radial-gradient(circle, hsl(var(--blush)) 0%, transparent 70%)`,
            borderRadius: '50%',
            boxShadow: p.isGold
              ? `0 0 ${p.size * 3}px hsl(var(--gold) / 0.5)`
              : `0 0 ${p.size * 3}px hsl(var(--blush) / 0.5)`,
            animation: `sparkle-burst ${p.duration}s ${p.delay}s ease-out forwards`,
            '--burst-x': `${Math.cos(p.angle * Math.PI / 180) * p.dist}px`,
            '--burst-y': `${Math.sin(p.angle * Math.PI / 180) * p.dist}px`,
            opacity: 0,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

const CinematicIntro = ({ onComplete }: CinematicIntroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const ageRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLParagraphElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [showSparkleBurst, setShowSparkleBurst] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 1.2,
          ease: "power2.inOut",
          onComplete,
        });
      },
    });

    // Initial flash
    tl.fromTo(
      flashRef.current,
      { opacity: 0 },
      { opacity: 0.15, duration: 0.3, ease: "power4.in" }
    )
      .to(flashRef.current, { opacity: 0, duration: 0.8, ease: "power2.out" })

      // Name entrance — big scale down with blur clear
      .fromTo(
        nameRef.current,
        { opacity: 0, scale: 2.5, filter: "blur(20px)", letterSpacing: "0.5em" },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          letterSpacing: "0.15em",
          duration: 2,
          ease: "power3.out",
          onComplete: () => setShowSparkleBurst(true),
        },
        "-=0.4"
      )

      // Expanding ring behind age
      .fromTo(
        ringRef.current,
        { scale: 0, opacity: 0.6 },
        { scale: 3, opacity: 0, duration: 1.8, ease: "power2.out" },
        "-=0.8"
      )

      // Age number — punchy scale with bounce
      .fromTo(
        ageRef.current,
        { opacity: 0, scale: 0, filter: "blur(12px)" },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "back.out(2)",
          onComplete: () => {
            // Heartbeat pulse loop on the age number
            gsap.to(ageRef.current, {
              scale: 1.06,
              duration: 0.4,
              ease: "power2.inOut",
              yoyo: true,
              repeat: -1,
              repeatDelay: 0.6,
            });
          },
        },
        "-=1.4"
      )

      // Subtitle fade up
      .fromTo(
        lineRef.current,
        { opacity: 0, y: 30, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.5, ease: "power2.out" },
        "-=0.3"
      )

      // Hold
      .to({}, { duration: 1.8 });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-deep grain"
    >
      <div className="absolute inset-0 vignette pointer-events-none" />

      {/* Flash overlay */}
      <div
        ref={flashRef}
        className="absolute inset-0 bg-gold pointer-events-none opacity-0"
      />

      {/* Expanding ring */}
      <div
        ref={ringRef}
        className="absolute w-32 h-32 rounded-full border-2 border-gold/40 opacity-0 pointer-events-none"
      />

      {/* Sparkle burst around name */}
      {showSparkleBurst && <NameSparkleBurst />}

      <h1
        ref={nameRef}
        className="font-display text-6xl md:text-8xl lg:text-9xl font-light text-gold glow-gold opacity-0"
      >
        Isioma
      </h1>
      <span
        ref={ageRef}
        className="mt-4 font-display text-8xl md:text-[10rem] lg:text-[12rem] font-light text-blush glow-blush opacity-0"
      >
        19
      </span>
      <p
        ref={lineRef}
        className="mt-6 font-body text-sm md:text-base tracking-[0.3em] uppercase text-muted-foreground opacity-0"
      >
        19 years of becoming, 19 years of brilliance
      </p>
    </div>
  );
};

export default CinematicIntro;
