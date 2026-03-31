import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { slideshowMedia, type MediaItem } from "@/data/mediaData";

const CinematicSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  const current = slideshowMedia[currentIndex];

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      mediaRef.current,
      { opacity: 0, scale: 1.1 },
      { opacity: 1, scale: 1.03, duration: 1.5, ease: "power2.out" }
    ).fromTo(
      captionRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
      "-=0.5"
    );

    // Auto-advance with zoom
    const zoomTl = gsap.to(mediaRef.current, {
      scale: 1.08,
      duration: 5,
      ease: "none",
    });

    const timer = setTimeout(() => {
      gsap.to([mediaRef.current, captionRef.current], {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          setCurrentIndex((prev) => (prev + 1) % slideshowMedia.length);
        },
      });
    }, 5000);

    return () => {
      tl.kill();
      zoomTl.kill();
      clearTimeout(timer);
    };
  }, [currentIndex]);

  return (
    <section ref={sectionRef} className="section-snap relative flex items-center justify-center overflow-hidden section-tint-blush">
      <div className="absolute inset-0 vignette pointer-events-none z-20" />

      {/* Media */}
      <div ref={mediaRef} className="absolute inset-0 z-0 opacity-0">
        {current.type === "image" ? (
          <img
            src={current.src}
            alt={current.caption || ""}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <video
            src={current.src}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            loop
          />
        )}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-deep/50" />

      {/* Caption */}
      <div className="relative z-30 flex flex-col items-center text-center px-6">
        <p
          ref={captionRef}
          className="font-display text-2xl md:text-4xl lg:text-5xl font-light text-foreground italic max-w-3xl leading-relaxed opacity-0"
        >
          {current.caption}
        </p>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slideshowMedia.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full transition-all duration-500 ${
              i === currentIndex ? "bg-gold w-6" : "bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default CinematicSlideshow;
