import { useEffect, useState } from "react";

interface Props {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  panelCount: number;
}

export default function ScrollIndicator({ scrollRef, panelCount }: Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth);
      setActive(idx);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [scrollRef]);

  if (panelCount <= 1) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-50">
      {Array.from({ length: panelCount }, (_, i) => (
        <button
          key={i}
          onClick={() => {
            scrollRef.current?.scrollTo({
              left: i * scrollRef.current.clientWidth,
              behavior: "smooth",
            });
          }}
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
