"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type SectionItem = { id: string; label: string };
type SectionPos = { id: string; label: string; t: number }; // 0..1

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

export default function ScrollFlyer() {
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
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "deneyim");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [sectionTs, setSectionTs] = useState<SectionPos[]>([]);
  const scrollHeightRef = useRef(1);

  // Görsel alan
  const H = 600;
  const W = 64;

  // En üstten en alta
  const trackTop = 0;
  const trackHeight = H;

  // Drone taşma önleme
  const droneSafePadding = 62;

  // ✅ YÖRÜNGEYİ SOLA KAYDIR
  // eski: baseX=46 idi → şimdi 40
  const baseX = 30;
  const minX = 6;
  const maxX = 50;

  const xAt = (t: number) => {
    if (reduceMotion) return baseX;
    const envelope = Math.sin(Math.PI * t); // uçlarda 0
    const amp = 14 * envelope;
    const x = baseX + amp * Math.sin(t * Math.PI * 2.4 + 0.8);
    return clamp(x, minX, maxX);
  };

  const yAt = (t: number) => trackTop + t * trackHeight;

  const angleAt = (t: number) => {
    if (reduceMotion) return 0;
    const dt = 0.008;
    const t1 = clamp01(t - dt);
    const t2 = clamp01(t + dt);

    const x1 = xAt(t1);
    const x2 = xAt(t2);
    const y1 = yAt(t1);
    const y2 = yAt(t2);

    const dx = x2 - x1;
    const dy = y2 - y1;

    const rad = Math.atan2(dx, dy);
    const deg = (rad * 180) / Math.PI;
    return clamp(deg, -10, 10);
  };

  const relaxT = (items: SectionPos[], minGapPx = 28) => {
    const minGapT = minGapPx / trackHeight;
    const sorted = [...items].sort((a, b) => a.t - b.t);

    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const cur = sorted[i];
      if (cur.t - prev.t < minGapT) cur.t = prev.t + minGapT;
    }

    for (let i = sorted.length - 2; i >= 0; i--) {
      const next = sorted[i + 1];
      const cur = sorted[i];
      if (next.t > 1) next.t = 1;
      if (next.t - cur.t < minGapT) cur.t = next.t - minGapT;
    }

    for (const it of sorted) it.t = clamp01(it.t);

    const map = new Map(sorted.map((s) => [s.id, s]));
    return items.map((x) => map.get(x.id) ?? x);
  };

  const pathD = useMemo(() => {
    const steps = 80;
    const pts = Array.from({ length: steps + 1 }, (_, i) => {
      const t = i / steps;
      return { x: xAt(t), y: yAt(t) };
    });

    let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)} `;
    for (let i = 1; i < pts.length - 1; i++) {
      const p = pts[i];
      const n = pts[i + 1];
      const mx = ((p.x + n.x) / 2).toFixed(2);
      const my = ((p.y + n.y) / 2).toFixed(2);
      d += `Q ${p.x.toFixed(2)} ${p.y.toFixed(2)} ${mx} ${my} `;
    }
    const last = pts[pts.length - 1];
    d += `Q ${pts[pts.length - 2].x.toFixed(2)} ${pts[
      pts.length - 2
    ].y.toFixed(2)} ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
    return d;
  }, [reduceMotion]);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(Boolean(mq?.matches));
    apply();
    mq?.addEventListener?.("change", apply);

    let raf = 0;

    const updateScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const scrollHeight = doc.scrollHeight - window.innerHeight;

      scrollHeightRef.current = Math.max(1, scrollHeight);
      setProgress(clamp01(scrollHeight > 0 ? scrollTop / scrollHeight : 0));
    };

    const computeSectionTs = () => {
      const sh = scrollHeightRef.current;
      const items: SectionPos[] = [];

      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;

        const top = el.getBoundingClientRect().top + window.scrollY;
        const t = clamp01(top / sh);
        items.push({ id: s.id, label: s.label, t });
      }

      setSectionTs(relaxT(items, 28));
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        updateScroll();
        computeSectionTs();
      });
    };

    updateScroll();
    computeSectionTs();

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0)
          )[0];
        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0.08, 0.15, 0.25, 0.4] }
    );

    els.forEach((el) => io.observe(el));

    const t = window.setTimeout(() => computeSectionTs(), 500);

    return () => {
      window.clearTimeout(t);
      mq?.removeEventListener?.("change", apply);
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      io.disconnect();
    };
  }, [sections]);

  // Drone t: altta taşmayı engelle
  const droneT = useMemo(() => {
    const maxT = clamp01((trackHeight - droneSafePadding) / trackHeight);
    return clamp(progress, 0, maxT);
  }, [progress]);

  const droneX = useMemo(() => xAt(droneT), [droneT, reduceMotion]);
  const droneY = useMemo(() => yAt(droneT), [droneT]);
  const droneAngle = useMemo(() => angleAt(droneT), [droneT, reduceMotion]);

  // progress için
  const dash = useMemo(() => {
    const total = 1000;
    const on = clamp01(progress) * total;
    return { on, total };
  }, [progress]);

  const handleJump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const DroneIcon = () => (
    <svg width="26" height="26" viewBox="0 0 64 64" className="text-zinc-100">
      <rect x="24" y="26" width="16" height="12" rx="4" fill="currentColor" opacity="0.95" />
      <path d="M28 30 L12 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      <path d="M36 30 L52 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      <path d="M28 34 L12 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      <path d="M36 34 L52 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      <g className={reduceMotion ? "" : "rotor"}>
        <circle cx="12" cy="18" r="6" fill="currentColor" opacity="0.18" />
        <path d="M12 12 L12 24" stroke="currentColor" strokeWidth="2" opacity="0.9" />
        <path d="M6 18 L18 18" stroke="currentColor" strokeWidth="2" opacity="0.9" />
      </g>
      <g className={reduceMotion ? "" : "rotor"}>
        <circle cx="52" cy="18" r="6" fill="currentColor" opacity="0.18" />
        <path d="M52 12 L52 24" stroke="currentColor" strokeWidth="2" opacity="0.9" />
        <path d="M46 18 L58 18" stroke="currentColor" strokeWidth="2" opacity="0.9" />
      </g>
      <g className={reduceMotion ? "" : "rotor"}>
        <circle cx="12" cy="50" r="6" fill="currentColor" opacity="0.18" />
        <path d="M12 44 L12 56" stroke="currentColor" strokeWidth="2" opacity="0.9" />
        <path d="M6 50 L18 50" stroke="currentColor" strokeWidth="2" opacity="0.9" />
      </g>
      <g className={reduceMotion ? "" : "rotor"}>
        <circle cx="52" cy="50" r="6" fill="currentColor" opacity="0.18" />
        <path d="M52 44 L52 56" stroke="currentColor" strokeWidth="2" opacity="0.9" />
        <path d="M46 50 L58 50" stroke="currentColor" strokeWidth="2" opacity="0.9" />
      </g>
      <circle cx="32" cy="38" r="2" fill="white" opacity="0.9" />
    </svg>
  );

  return (
    // sağda ortalı
    <div className="fixed right-2 top-1/2 -translate-y-1/2 z-30 hidden md:block pointer-events-none">
      <style>{`
        @keyframes rotorSpin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
        @keyframes floaty { 0%,100%{ transform: translateY(0px);} 50%{ transform: translateY(-2px);} }
        svg .rotor { transform-box: fill-box; transform-origin: center; animation: rotorSpin 0.7s linear infinite; }
      `}</style>

      <div className="relative h-[600px] w-16">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="absolute inset-0">
          <defs>
            <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* ✅ ARTIK ÜSTÜ KESMİYORUZ → noktalar en üstten başlar */}
            <mask id="trailMask">
              <rect x="0" y="0" width={W} height={H} fill="black" />
              <path
                d={pathD}
                fill="none"
                stroke="white"
                strokeWidth={10}
                strokeLinecap="round"
                pathLength={1000}
                strokeDasharray={`${dash.on} ${dash.total}`}
              />
            </mask>
          </defs>

          {/* Base dotted path (tam boy) */}
          <path
            d={pathD}
            fill="none"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeDasharray="1 10"
          />

          {/* Progress dotted trail */}
          <path
            d={pathD}
            fill="none"
            stroke="rgba(255,255,255,0.80)"
            strokeWidth={3.8}
            strokeLinecap="round"
            strokeDasharray="1 14"
            filter="url(#glow)"
            mask="url(#trailMask)"
          />

          {/* Start/End caps */}
          <circle cx={xAt(0)} cy={yAt(0)} r="3" fill="rgba(120,120,130,0.35)" />
          <circle cx={xAt(1)} cy={yAt(1)} r="3" fill="rgba(120,120,130,0.35)" />
        </svg>

        {/* Section marker’lar */}
        {sectionTs.map((s) => {
          const isActive = s.id === activeId;
          const px = xAt(s.t);
          const py = yAt(s.t);

          return (
            <div key={s.id} className="absolute inset-0" style={{ transform: `translate(${px}px, ${py}px)` }}>
              <button
                onClick={() => handleJump(s.id)}
                className="group pointer-events-auto absolute right-0 flex items-center gap-2"
                style={{ transform: "translate(-6px, -6px)" }}
                title={s.label}
              >
                <span
                  className={[
                    "text-[11px] leading-none transition-all",
                    isActive
                      ? "opacity-100 translate-x-0 text-zinc-100"
                      : "opacity-0 translate-x-1 text-zinc-400 group-hover:opacity-80",
                  ].join(" ")}
                >
                  <span className="rounded-full border border-zinc-700/70 bg-zinc-900/70 px-2 py-1 backdrop-blur">
                    {s.label}
                  </span>
                </span>

                <span
                  className={[
                    "h-2.5 w-2.5 rounded-full border transition-all",
                    isActive
                      ? "border-zinc-200 bg-zinc-100 shadow-[0_0_14px_rgba(255,255,255,0.30)]"
                      : "border-zinc-600 bg-zinc-900",
                  ].join(" ")}
                />
              </button>
            </div>
          );
        })}

        {/* Drone */}
        <div className="absolute inset-0" style={{ transform: `translate(${droneX}px, ${droneY}px)` }}>
          <div
            className="absolute pointer-events-none"
            style={{
              transform: `translate(-52px, -18px) rotate(${droneAngle}deg)`,
              transition: reduceMotion ? undefined : "transform 90ms ease-out",
            }}
          >
            <div
              className="absolute -inset-5 rounded-full blur-xl opacity-45"
              style={{
                background: "radial-gradient(circle, rgba(255,255,255,0.22), rgba(0,0,0,0))",
              }}
            />
            <div
              className={[
                "relative rounded-2xl border border-zinc-700/80 bg-zinc-900/75 px-3 py-2 shadow-xl backdrop-blur",
                reduceMotion ? "" : "animate-[floaty_3s_ease-in-out_infinite]",
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <DroneIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
