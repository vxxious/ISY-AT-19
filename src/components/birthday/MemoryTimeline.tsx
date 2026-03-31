import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { timelineChapters } from "@/data/mediaData";

gsap.registerPlugin(ScrollTrigger);

const MemoryTimeline = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".timeline-chapter").forEach((chapter) => {
        gsap.fromTo(
          chapter.querySelector(".chapter-title"),
          { opacity: 0, x: -40 },
          {
            opacity: 1, x: 0, duration: 1.2, ease: "power3.out",
            scrollTrigger: { trigger: chapter, start: "top 75%", end: "top 40%", scrub: 1 },
          }
        );

        gsap.utils.toArray<HTMLElement>(chapter.querySelectorAll(".timeline-item")).forEach((item, i) => {
          const isEven = i % 2 === 0;
          gsap.fromTo(
            item,
            { opacity: 0, y: 50, x: isEven ? -30 : 30 },
            {
              opacity: 1, y: 0, x: 0, duration: 1, ease: "power2.out",
              scrollTrigger: { trigger: item, start: "top 80%", end: "top 50%", scrub: 1 },
            }
          );
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24 px-6 section-tint-deep">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-6xl font-light text-gold glow-gold">
            Memories
          </h2>
          <div className="w-16 h-px bg-gold/30 mx-auto mt-6" />
        </div>

        {timelineChapters.map((chapter, ci) => (
          <div key={ci} className="timeline-chapter mb-20 last:mb-0">
            <h3 className="chapter-title font-display text-2xl md:text-3xl text-blush font-light mb-12 tracking-wide">
              {chapter.title}
            </h3>

            <div className="space-y-10">
              {chapter.items.map((item, ii) => {
                const isEven = ii % 2 === 0;
                return (
                  <div
                    key={ii}
                    className={`timeline-item flex flex-col ${
                      isEven ? "md:flex-row" : "md:flex-row-reverse"
                    } items-center gap-8 md:gap-12`}
                  >
                    <div className="w-full md:w-1/2 overflow-hidden rounded-lg">
                      <img
                        src={item.src}
                        alt={item.text}
                        className="w-full h-64 md:h-80 object-cover hover:scale-105 transition-transform duration-1000"
                        loading="lazy"
                      />
                    </div>
                    <div className="w-full md:w-1/2">
                      <p className="font-display text-xl md:text-2xl font-light text-foreground/80 italic leading-relaxed">
                        "{item.text}"
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MemoryTimeline;
