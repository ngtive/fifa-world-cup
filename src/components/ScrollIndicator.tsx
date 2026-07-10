import { useEffect, useState } from "react";
import gsap from "gsap";

interface Props {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  panelCount: number;
  horizontalTween?: gsap.core.Tween | null;
}

export default function ScrollIndicator({ scrollRef, panelCount, horizontalTween }: Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const vh = el.clientHeight;
      const raw = Math.round(el.scrollTop / vh);
      setActive(Math.min(raw, panelCount - 1));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [scrollRef, horizontalTween, panelCount]);

  if (panelCount <= 1) return null;

  const goToPanel = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const vh = el.clientHeight;

    if (idx <= 2) {
      el.scrollTo({ top: idx * vh, behavior: "smooth" });
    } else {
      const startTop = 3 * vh;
      const endTop = startTop + (panelCount - 3) * vh;
      const progress = (idx - 3) / (panelCount - 4);
      el.scrollTo({ top: startTop + progress * (endTop - startTop), behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-50">
      {Array.from({ length: panelCount }, (_, i) => (
        <button
          key={i}
          onClick={() => goToPanel(i)}
          className={`rounded-full transition-all duration-300 ${
            i === active
              ? "w-6 h-2 bg-emerald-400"
              : "w-2 h-2 bg-slate-600 hover:bg-slate-500"
          }`}
          aria-label={`Go to panel ${i + 1}`}
        />
      ))}
    </div>
  );
}
