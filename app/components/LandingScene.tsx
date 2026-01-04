"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function easeInOut(t: number) {
  return t * t * (3 - 2 * t); // smoothstep
}

export default function LandingScene({ className = "" }: { className?: string }) {
  const [reduceMotion, setReduceMotion] = useState(false);

  // hedef progress (scroll’dan)
  const [scrollP, setScrollP] = useState(0);

  // animasyon için yumuşatılmış progress
  const smoothPRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // Sahne ölçüleri (dar)
  const sceneW = 220;
  const sceneH = 400;

  // platform sabit Y
  const basePX = sceneW / 2;
  const basePY = sceneH - 110;

  // drone iniş parametreleri
  const startY = 70;
  const landY = basePY - 28;

  // platform sadece X ekseni
  const platformAmp = 56;

  // render state
  const [frame, setFrame] = useState({
    platformX: basePX,
    droneX: basePX,
    droneY: startY,
    droneRot: 0,
    landed: false,
  });

  // scroll progress + reduced motion
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(Boolean(mq?.matches));
    apply();
    mq?.addEventListener?.("change", apply);

    const updateScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const scrollHeight = doc.scrollHeight - window.innerHeight;
      const p = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      setScrollP(clamp01(p));
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);

    return () => {
      mq?.removeEventListener?.("change", apply);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  // platform X fonksiyonu (tek eksen)
  const platformXAt = (p: number) => {
    const w1 = Math.sin(2 * Math.PI * (p * 1.1));
    const w2 = Math.sin(2 * Math.PI * (p * 3.3) + 1.15);
    const x = basePX + platformAmp * (0.62 * w1 + 0.38 * w2);
    return clamp(x, 36, sceneW - 36);
  };

  const update = () => {
    const target = scrollP; // ham scroll

    // Daha hızlı yumuşatma
    smoothPRef.current += (target - smoothPRef.current) * 0.18;

    // SNAP: scroll %98+ ise direkt 1’e sabitle (altta kesin eşleşsin)
    if (target >= 0.98) smoothPRef.current = 1;

    // platform/drone hesabında kullanılacak progress
    const pSmooth = smoothPRef.current;
    const pUsed = target >= 0.92 ? target : pSmooth; // son kısımda ham scroll’u kullan

    // platform sadece X ekseni
    const px = platformXAt(pUsed);

    // Drone X: yaklaşma + hizalama + touchdown (platformun ORTASINA KİLİT)
    const approachEnd = 0.65;
    const alignEnd = 0.92;

    let dx = basePX;

    // yaklaşma
    const tApproach = clamp01(pUsed / approachEnd);
    dx = lerp(basePX, px, easeInOut(tApproach) * 0.75);

    // hizalama
    if (pUsed > approachEnd) {
      const tAlign = clamp01((pUsed - approachEnd) / (alignEnd - approachEnd));
      dx = lerp(dx, px, easeInOut(tAlign));
    }

    // Kilitleme koşulu ham scroll’a göre: scroll %92+ ise kesin px
    if (target >= alignEnd) dx = px;

    // drone Y: iniş + touchdown bounce
    const touchdownStart = alignEnd;
    const descendEase = easeInOut(clamp01(pUsed / touchdownStart));
    let dy = lerp(startY, landY, descendEase);

    let landed = target >= touchdownStart;
    if (landed) {
      const local = clamp01((pUsed - touchdownStart) / (1 - touchdownStart));
      const bounce = Math.sin(local * Math.PI) * (1 - local);
      dy = landY - 10 * bounce;
    }

    // drone rotasyon: çok hafif yatış
    const dp = 0.002;
    const p1 = clamp01(pUsed - dp);
    const p2 = clamp01(pUsed + dp);
    const v = platformXAt(p2) - platformXAt(p1);
    const drot = clamp(v * 0.35, -8, 8);

    setFrame({
      platformX: px,
      droneX: dx,
      droneY: dy,
      droneRot: drot,
      landed,
    });

    rafRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    if (reduceMotion) return;
    rafRef.current = requestAnimationFrame(update);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion, scrollP]);

  // Reduce motion: sabit görüntü
  const staticFrame = useMemo(() => {
    const px = basePX;
    return {
      platformX: px,
      droneX: px,
      droneY: landY,
      droneRot: 0,
      landed: true,
    };
  }, [basePX, landY]);

  const f = reduceMotion ? staticFrame : frame;

  return (
    <div className={["relative", className].join(" ")}>
      <div className="relative h-[440px] w-[220px] overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/30 shadow-2xl backdrop-blur">
        {/* arka gradient */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(900px circle at 20% 15%, rgba(255,255,255,0.10), rgba(0,0,0,0) 55%), radial-gradient(800px circle at 80% 60%, rgba(255,255,255,0.06), rgba(0,0,0,0) 60%)",
          }}
        />

        {/* grid */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.35) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* başlık panel */}
        <div className="absolute left-4 top-4 rounded-xl border border-zinc-800/70 bg-zinc-950/60 px-3 py-2 backdrop-blur">
          <div className="text-[11px] text-zinc-400">Landing Demo</div>
          <div className="mt-0.5 text-sm font-semibold text-zinc-100">
            Scroll-synced landing
          </div>
        </div>

        {/* sahne */}
        <div className="absolute inset-0">
          {/* Platform */}
          <div
            className="absolute"
            style={{
              transform: `translate(${f.platformX - sceneW / 2}px, ${basePY}px)`,
              transition: reduceMotion ? "none" : "transform 60ms linear",
            }}
          >
            <div className="relative h-12 w-40 rounded-2xl border border-zinc-700/80 bg-zinc-950/70 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
              <div className="absolute left-3 top-3 h-[2px] w-20 rounded-full bg-zinc-200/25" />
              <div className="absolute right-4 top-3 h-6 w-6 rounded-full border border-zinc-200/25" />
            </div>
            <div className="mx-auto mt-2 h-2 w-28 rounded-full bg-black/40 blur-[6px]" />
          </div>

          {/* Drone */}
          <div
            className="absolute"
            style={{
              transform: `translate(${f.droneX - 34}px, ${f.droneY}px) rotate(${f.droneRot}deg)`,
              transition: reduceMotion ? "none" : "transform 60ms linear",
            }}
          >
            <div className="relative">
              <div
                className="absolute -inset-6 rounded-full blur-2xl opacity-35"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.20), rgba(0,0,0,0))",
                }}
              />

              <div className="flex items-center justify-center">
                <svg width="68" height="44" viewBox="0 0 140 90">
                  <path
                    d="M52 44 L18 18"
                    stroke="rgba(255,255,255,0.75)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M88 44 L122 18"
                    stroke="rgba(255,255,255,0.75)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M52 50 L18 78"
                    stroke="rgba(255,255,255,0.75)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M88 50 L122 78"
                    stroke="rgba(255,255,255,0.75)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />

                  {[
                    { cx: 18, cy: 18 },
                    { cx: 122, cy: 18 },
                    { cx: 18, cy: 78 },
                    { cx: 122, cy: 78 },
                  ].map((r, i) => (
                    <g key={i} className={reduceMotion ? "" : "spin"}>
                      <circle
                        cx={r.cx}
                        cy={r.cy}
                        r="16"
                        fill="rgba(255,255,255,0.10)"
                      />
                      <path
                        d={`M${r.cx} ${r.cy - 16} L${r.cx} ${r.cy + 16}`}
                        stroke="rgba(255,255,255,0.70)"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <path
                        d={`M${r.cx - 16} ${r.cy} L${r.cx + 16} ${r.cy}`}
                        stroke="rgba(255,255,255,0.70)"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    </g>
                  ))}

                  <rect
                    x="52"
                    y="32"
                    width="36"
                    height="26"
                    rx="10"
                    fill="rgba(255,255,255,0.90)"
                  />
                  <circle cx="70" cy="56" r="5" fill="rgba(0,0,0,0.65)" />
                </svg>
              </div>

              <div className="mt-2 flex justify-center">
                <span className="rounded-full border border-zinc-700/70 bg-zinc-950/70 px-3 py-1 text-[11px] text-zinc-200">
                  {reduceMotion ? "Static" : f.landed ? "Touchdown" : "Approach"}
                </span>
              </div>
            </div>
          </div>

          {/* iniş çizgisi */}
          <div
            className="absolute left-0 top-0"
            style={{
              transform: `translate(${f.droneX}px, ${f.droneY + 38}px)`,
              transition: reduceMotion ? "none" : "transform 60ms linear",
            }}
          >
            <div className="h-28 w-[2px] bg-gradient-to-b from-zinc-200/0 via-zinc-200/25 to-zinc-200/0" />
          </div>
        </div>

        <style>{`
          @keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
          .spin { transform-box: fill-box; transform-origin: center; animation: spin 0.55s linear infinite; }
        `}</style>

        {/* alt açıklama panel */}
        <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-zinc-800/70 bg-zinc-950/60 px-3 py-2 text-[11px] text-zinc-300 backdrop-blur">
          Scroll down to land. Platform moves only on X-axis.
        </div>
      </div>
    </div>
  );
}
