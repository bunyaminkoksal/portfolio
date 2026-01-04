"use client";

import { useEffect, useMemo, useState } from "react";

type SectionItem = { id: string; label: string };
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

export default function RadarHUD({ className = "" }: { className?: string }) {
  const sections: SectionItem[] = useMemo(
    () => [
      { id: "deneyim", label: "Deneyim" },
      { id: "projeler", label: "Projeler" },
      { id: "egitim", label: "Eğitim" },
      { id: "yetenekler", label: "Yetenekler" },
      { id: "sertifikalar", label: "Sertifikalar" },
    ],
    []
  );

  const [progress, setProgress] = useState(0);
  const [activeLabel, setActiveLabel] = useState("Deneyim");

  // Radar "blip" noktaları
  const blips = useMemo(
    () => [
      { x: 0.68, y: 0.28, s: 1.0 },
      { x: 0.33, y: 0.42, s: 0.8 },
      { x: 0.58, y: 0.62, s: 0.9 },
      { x: 0.42, y: 0.72, s: 0.7 },
    ],
    []
  );

  useEffect(() => {
    let raf = 0;

    const updateProgress = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const scrollHeight = doc.scrollHeight - window.innerHeight;
      setProgress(clamp01(scrollHeight > 0 ? scrollTop / scrollHeight : 0));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // aktif section
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (visible?.target?.id) {
          const found = sections.find((s) => s.id === visible.target.id);
          if (found) setActiveLabel(found.label);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0.08, 0.15, 0.25, 0.4] }
    );

    els.forEach((el) => io.observe(el));

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      io.disconnect();
    };
  }, [sections]);

  const deg = Math.round(progress * 360);

  return (
    <div
      className={[
        "w-[220px] rounded-3xl border border-white/10 bg-black/30 p-3 shadow-2xl backdrop-blur",
        className,
      ].join(" ")}
    >
      <style>{`
        @keyframes radarGlow { 0%,100%{opacity:.55} 50%{opacity:.9} }
        @keyframes blipPing { 0%{transform:translate(-50%,-50%) scale(.55);opacity:.95} 100%{transform:translate(-50%,-50%) scale(1.75);opacity:0} }
        @keyframes flicker { 0%,100%{opacity:.65} 50%{opacity:1} }
      `}</style>

      {/* Header */}
      <div className="mb-2 flex items-start justify-between">
        <div>
          <div className="text-[10px] tracking-wide text-white/55">Telemetry</div>
          <div className="text-[13px] font-semibold text-white/90">{activeLabel}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-white/55">Scroll</div>
          <div className="text-[13px] font-semibold tabular-nums text-white/90">
            {Math.round(progress * 100)}%
          </div>
        </div>
      </div>

      {/* Radar */}
      <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-full border border-emerald-300/25 bg-black">
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,.55)_70%,rgba(0,0,0,.88)_100%)]" />

        {/* Grid */}
        <svg className="absolute inset-0" viewBox="0 0 100 100" aria-hidden="true">
          <defs>
            <radialGradient id="rg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(16,185,129,0.26)" />
              <stop offset="60%" stopColor="rgba(16,185,129,0.12)" />
              <stop offset="100%" stopColor="rgba(16,185,129,0.05)" />
            </radialGradient>

            <filter id="softGlow">
              <feGaussianBlur stdDeviation="0.9" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle cx="50" cy="50" r="50" fill="url(#rg)" />

          {[18, 32, 46].map((r) => (
            <circle
              key={r}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke="rgba(16,185,129,0.22)"
              strokeWidth="0.9"
            />
          ))}

          <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(16,185,129,0.18)" strokeWidth="0.9" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(16,185,129,0.18)" strokeWidth="0.9" />

          {[...Array(12)].map((_, i) => {
            const a = (i * Math.PI) / 6;
            const x1 = 50 + Math.cos(a) * 49;
            const y1 = 50 + Math.sin(a) * 49;
            const x2 = 50 + Math.cos(a) * 44;
            const y2 = 50 + Math.sin(a) * 44;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(16,185,129,0.18)"
                strokeWidth="0.9"
              />
            );
          })}

          <circle cx="50" cy="50" r="1.6" fill="rgba(16,185,129,0.95)" filter="url(#softGlow)" />
        </svg>

        {/* Sweep */}
        <div
          className="absolute inset-0"
          style={{
            transform: `rotate(${deg}deg)`,
            transformOrigin: "50% 50%",
            transition: "transform 80ms linear",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(16,185,129,0.00) 0deg, rgba(16,185,129,0.00) 300deg, rgba(16,185,129,0.30) 336deg, rgba(16,185,129,0.00) 360deg)",
              animation: "radarGlow 2.2s ease-in-out infinite",
              mixBlendMode: "screen",
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 h-[50%] w-[2px] -translate-x-1/2 -translate-y-full rounded-full"
            style={{
              background:
                "linear-gradient(to top, rgba(16,185,129,0.0), rgba(16,185,129,0.95))",
              boxShadow: "0 0 18px rgba(16,185,129,0.55)",
            }}
          />
        </div>

        {/* Blips */}
        {blips.map((b, idx) => (
          <div
            key={idx}
            className="absolute"
            style={{
              left: `${b.x * 100}%`,
              top: `${b.y * 100}%`,
              width: 10,
              height: 10,
            }}
          >
            <div
              className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: "rgba(16,185,129,0.95)",
                boxShadow: "0 0 12px rgba(16,185,129,0.55)",
                opacity: 0.75,
                animation: "flicker 1.8s ease-in-out infinite",
                animationDelay: `${idx * 0.3}s`,
                transform: `translate(-50%,-50%) scale(${b.s})`,
              }}
            />
            <div
              className="absolute left-1/2 top-1/2 h-5 w-5 rounded-full border"
              style={{
                borderColor: "rgba(16,185,129,0.35)",
                animation: "blipPing 1.8s ease-out infinite",
                animationDelay: `${idx * 0.45}s`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Bottom pills */}
      <div className="mt-2 flex gap-2">
        <div className="flex-1 rounded-xl border border-white/10 bg-white/5 px-2 py-2 text-center text-[10px] text-white/70">
          GPS <span className="text-emerald-200/90">LOCK</span>
        </div>
        <div className="flex-1 rounded-xl border border-white/10 bg-white/5 px-2 py-2 text-center text-[10px] text-white/70">
          LINK <span className="text-emerald-200/90">OK</span>
        </div>
        <div className="flex-1 rounded-xl border border-white/10 bg-white/5 px-2 py-2 text-center text-[10px] text-white/70">
          BAT{" "}
          <span className="text-emerald-200/90">
            {Math.max(12, Math.round(98 - progress * 18))}%
          </span>
        </div>
      </div>
    </div>
  );
}
