import { useMemo } from "react";

const AmbientSparkles = () => {
  const particles = useMemo(() =>
    Array.from({ length: 30 }).map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1.5 + Math.random() * 3,
      delay: Math.random() * 12,
      driftDuration: 15 + Math.random() * 20,
      twinkleDuration: 2 + Math.random() * 3,
      driftX: (Math.random() - 0.5) * 60,
      driftY: -(20 + Math.random() * 40),
      opacity: 0.15 + Math.random() * 0.35,
    })), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, hsl(var(--gold)) 0%, hsl(var(--gold) / 0.3) 60%, transparent 100%)`,
            boxShadow: `0 0 ${p.size * 3}px hsl(var(--gold) / 0.3)`,
            opacity: 0,
            animation: `sparkle-drift ${p.driftDuration}s ${p.delay}s linear infinite, sparkle-twinkle ${p.twinkleDuration}s ${p.delay}s ease-in-out infinite`,
            '--drift-x': `${p.driftX}px`,
            '--drift-y': `${p.driftY}px`,
            '--sparkle-opacity': p.opacity,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export default AmbientSparkles;
