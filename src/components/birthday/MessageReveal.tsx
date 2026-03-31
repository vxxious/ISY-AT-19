import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personalMessage } from "@/data/mediaData";

gsap.registerPlugin(ScrollTrigger);

const MessageReveal = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Label fades in as section enters
      gsap.fromTo(
        labelRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 60%", end: "top 30%", scrub: 1 },
        }
      );

      if (textRef.current) {
        const words = personalMessage.split(" ");
        textRef.current.innerHTML = words
          .map((w) => `<span class="inline-block opacity-0 blur-[4px] mr-[0.3em] transition-none">${w}</span>`)
          .join("");

        const spans = gsap.utils.toArray<HTMLElement>(textRef.current.querySelectorAll("span"));
        const totalWords = spans.length;
        // Spread words across enough scroll distance for smooth pacing
        const scrollRange = totalWords * 28;

        spans.forEach((span, i) => {
          const wordStart = 120 + i * (scrollRange / totalWords);
          gsap.to(span, {
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.3,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `top+=${wordStart}px top`,
              end: `top+=${wordStart + 30}px top`,
              scrub: 0.5,
            },
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const wordCount = personalMessage.split(" ").length;
  const scrollHeight = Math.max(400, wordCount * 28 + 300);

  return (
    <section
      ref={sectionRef}
      className="relative cinema-gradient"
      style={{ height: `${scrollHeight}px` }}
    >
      <div className="absolute inset-0 vignette pointer-events-none" />

      <div
        ref={containerRef}
        className="sticky top-0 h-screen flex items-center justify-center px-6"
      >
        <div className="max-w-2xl mx-auto text-center">
          <span
            ref={labelRef}
            className="font-body text-xs tracking-[0.5em] uppercase text-gold/60 block mb-8 animate-float"
          >
            A letter for you
          </span>
          <p
            ref={textRef}
            className="font-display text-xl md:text-2xl lg:text-3xl font-light text-foreground/90 leading-loose tracking-wide"
          />
        </div>
      </div>
    </section>
  );
};

export default MessageReveal;
