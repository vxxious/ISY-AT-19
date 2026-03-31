import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface EndingSceneProps {
  onReplay: () => void;
}

const EndingScene = ({ onReplay }: EndingSceneProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0 },
        {
          opacity: 1, duration: 2,
          scrollTrigger: { trigger: sectionRef.current, start: "top 50%", end: "top 20%", scrub: 1 },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-snap relative flex items-center justify-center section-tint-blush">
      <div className="absolute inset-0 vignette pointer-events-none" />

      <div ref={contentRef} className="relative text-center px-6 opacity-0">
        <p className="font-display text-2xl md:text-4xl font-light text-foreground/60 italic mb-12">
          With love, well wishes always.
        </p>
        <div className="w-12 h-px bg-gold/30 mx-auto mb-12" />
        <button
          onClick={onReplay}
          className="font-body text-xs tracking-[0.4em] uppercase text-muted-foreground hover:text-gold transition-colors duration-700 border border-border/30 hover:border-gold/30 px-8 py-3 rounded-full"
        >
          Replay
        </button>
      </div>
    </section>
  );
};

export default EndingScene;
