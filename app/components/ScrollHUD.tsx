"use client";

import { useEffect, useMemo, useState } from "react";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

type Section = { id: string; label: string };

export default function ScrollHUD() {
  const sections: Section[] = useMemo(
    () => [
      { id: "deneyim", label: "Deneyim" },
      { id: "projeler", label: "Projeler" },
      { id: "egitim", label: "Eğitim" },
      { id: "yetenekler", label: "Yetenekler" },
      { id: "sertifikalar", label: "Sertifikalar" },
    ],
    []
  );

  const [p, setP] = useState(0);
  const [active, setActive] = useState(sections[0]?.label ?? "—");

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const scrollHeight = doc.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      setP(clamp01(progress));

      const threshold = 140;
      let current = sections[0]?.label ?? "—";
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= threshold) current = s.label;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections]);

  const mode = p < 0.66 ? "Approach" : p < 0.92 ? "Align" : "Touchdown";

  return (
    <div className="fixed right-6 top-24 z-40 hidden lg:block pointer-events-none">
      <div className="w-[200px] rounded-2xl border border-[rgba(var(--border),0.18)] bg-[rgba(var(--surface),0.72)] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] text-[rgb(var(--muted))]">Telemetry</div>
            <div className="mt-1 text-sm font-semibold text-[rgb(var(--text))]">
              {active}
            </div>
            <div className="mt-1 text-[11px] text-[rgba(var(--accent),0.95)]">
              {mode}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[11px] text-[rgb(var(--muted))]">Scroll</div>
            <div className="mt-1 font-mono text-sm text-[rgb(var(--text))]">
              {Math.round(p * 100)}%
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full"
              style={{
                width: `${p * 100}%`,
                background:
                  "linear-gradient(90deg, rgba(34,211,238,0.95), rgba(129,140,248,0.95))",
              }}
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] text-[rgb(var(--muted))]">
          <div className="rounded-lg border border-[rgba(var(--border),0.14)] bg-white/5 px-2 py-1">
            GPS <span className="text-[rgba(var(--accent),0.95)]">LOCK</span>
          </div>
          <div className="rounded-lg border border-[rgba(var(--border),0.14)] bg-white/5 px-2 py-1">
            LINK <span className="text-[rgba(var(--accent),0.95)]">OK</span>
          </div>
          <div className="rounded-lg border border-[rgba(var(--border),0.14)] bg-white/5 px-2 py-1">
            BAT <span className="text-[rgba(var(--accent),0.95)]">98%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
