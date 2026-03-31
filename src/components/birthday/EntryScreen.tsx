import { useRef, useState } from "react";
import gsap from "gsap";

interface EntryScreenProps {
  onEnter: () => void;
}

const EntryScreen = ({ onEnter }: EntryScreenProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<number[]>([]);

  const handleClick = () => {
    // Dramatic exit
    const tl = gsap.timeline({ onComplete: onEnter });

    tl.to(ringRef.current, {
      scale: 20,
      opacity: 0,
      duration: 1.4,
      ease: "power3.in",
    })
      .to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
        },
        "-=0.6"
      );
  };

  // Pulse ripple on hover
  const addRipple = () => {
    setRipples((prev) => [...prev, Date.now()]);
    setTimeout(() => setRipples((prev) => prev.slice(1)), 1500);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-40 flex items-center justify-center bg-deep grain overflow-hidden"
    >
      <div className="absolute inset-0 vignette pointer-events-none" />

      {/* Rotating orbit rings */}
      <div className="absolute w-[280px] h-[280px] md:w-[360px] md:h-[360px] rounded-full border border-gold/10 animate-[spin_25s_linear_infinite]" />
      <div className="absolute w-[340px] h-[340px] md:w-[440px] md:h-[440px] rounded-full border border-gold/5 animate-[spin_35s_linear_infinite_reverse]" />

      {/* Ripple effects */}
      {ripples.map((id) => (
        <div
          key={id}
          className="absolute w-24 h-24 rounded-full border border-gold/30"
          style={{
            animation: "entry-ripple 1.5s ease-out forwards",
          }}
        />
      ))}

      {/* Center button */}
      <div
        ref={ringRef}
        className="relative flex flex-col items-center gap-6 cursor-pointer group"
        onClick={handleClick}
        onMouseEnter={addRipple}
      >
        {/* Outer glow ring */}
        <div className="absolute -inset-8 rounded-full bg-gold/5 blur-2xl group-hover:bg-gold/10 transition-all duration-1000" />

        {/* Main play button */}
        <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-gold/40 flex items-center justify-center group-hover:border-gold/70 transition-all duration-700 group-hover:shadow-[0_0_40px_hsl(var(--gold)/0.2)]">
          <div className="absolute inset-0 rounded-full bg-gold/5 group-hover:bg-gold/10 transition-all duration-700" />
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-gold/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <svg
              className="w-6 h-6 text-gold ml-1 group-hover:scale-110 transition-transform duration-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Label */}
        <p className="font-body text-[10px] md:text-xs tracking-[0.5em] uppercase text-muted-foreground group-hover:text-gold transition-colors duration-700">
          click to see.
        </p>
      </div>

      {/* Corner accent lines */}
      <div className="absolute top-8 left-8 w-12 h-px bg-gradient-to-r from-gold/30 to-transparent" />
      <div className="absolute top-8 left-8 h-12 w-px bg-gradient-to-b from-gold/30 to-transparent" />
      <div className="absolute bottom-8 right-8 w-12 h-px bg-gradient-to-l from-gold/30 to-transparent" />
      <div className="absolute bottom-8 right-8 h-12 w-px bg-gradient-to-t from-gold/30 to-transparent" />
    </div>
  );
};

export default EntryScreen;
