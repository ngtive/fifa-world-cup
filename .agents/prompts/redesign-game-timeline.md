# Redesign Game Timeline Cards + Scrollable Wrapper

## Goal
Redesign the GameCard component with a new visual style, and wrap the timeline cards in a scrollable centered row so all cards are visible and the timeline line stretches across all cards.

## Files to modify
| # | File | Change |
|---|------|--------|
| 1 | `src/components/GameTimeline.tsx` | Redesign GameCard + add scrollable wrapper + remove card GSAP animation |

## 1. Redesign GameCard

Replace the entire `GameCard` function with a new layout:

### New Card Layout
```
┌─────────────────────────────────┐
│ ▌ STAGE               date      │  ← gradient accent strip on left edge (3px)
│                                  │
│    [🇺🇸 flag]    [🇬🇧 flag]       │  ← large flags w-10 h-8, side by side
│      USA           England       │  ← team names below flags (text-xs, centered)
│                                  │
│           2 - 1                  │  ← score centered between flags (text-xl font-black)
│                                  │
│   🏆 England won                 │  ← footer (or Upcoming + Remind Me)
└─────────────────────────────────┘
```

### Key details
- **Accent strip**: `absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b`
  - Upcoming or winner (not draw): `from-emerald-500/80 to-emerald-500/20`
  - Draw: `from-slate-500/80 to-slate-500/20`
  - Plain completed: `from-slate-600/60 to-slate-600/20`
- **Flags**: `w-10 h-8 rounded-md` (up from `w-8 h-6`), centered with `gap-6`
- **Team names**: `text-xs font-medium max-w-[80px] truncate text-center` below each flag
- **Score**: `text-xl font-black` with dash separator, centered between flag columns. Winner gets `text-emerald-400`
- **Kickoff time**: pill badge `bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20`
- **Footer**: no border-t, integrated into card flow. Trophy + winner text or Upcoming + Remind Me button
- **Height**: Fixed `h-48` retained
- **Width**: `w-64 sm:w-72` retained
- **Container**: `border border-slate-700/50` (consistent border, accent comes from left strip)

## 2. Add Scrollable Wrapper

Current structure clips cards due to `overflow: hidden` on `.scroll-panel-wide`.

New JSX structure for the return:
```jsx
<div ref={containerRef} className="scroll-panel-wide items-center">
  <div className="flex flex-col gap-6 h-full justify-center px-8">
    {/* Title */}
    <div>
      <h2 className="text-2xl font-bold text-white mb-1">Game Timeline</h2>
      <p className="text-sm text-slate-500">Every match in chronological order</p>
    </div>

    {/* Scrollable wrapper */}
    <div className="overflow-x-auto hide-scrollbar flex items-center">
      {/* Inner row — full content width */}
      <div className="relative flex items-center gap-4 min-w-max">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-700/60 -translate-y-1/2" />

        {prevGames.map((game) => (
          <GameCard key={game.external_id} match={game} isUpcoming={false} />
        ))}

        <div
          ref={markerRef}
          className="shrink-0 flex flex-col items-center gap-1 z-10 px-3"
        >
          <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-emerald-400 shadow-lg shadow-emerald-500/30" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider whitespace-nowrap">
            Today
          </span>
        </div>

        {nextGames.map((game) => (
          <GameCard key={game.external_id} match={game} isUpcoming={true} />
        ))}
      </div>
    </div>
  </div>
</div>
```

## 3. Remove Card GSAP Animation

Remove the card-level `gsap.fromTo(cards, ...)` that set `opacity: 0, x: 60`. Cards render visible by default. Keep only the "Today" marker ScrollTrigger animation.

Remove these lines from the useEffect:
```js
const cards = gsap.utils.toArray<HTMLElement>(".timeline-card");
gsap.fromTo(
  cards,
  { opacity: 0, x: 60 },
  {
    opacity: 1,
    x: 0,
    duration: 0.6,
    stagger: 0.12,
    ease: "power2.out",
    scrollTrigger: {
      trigger: el,
      scroller: el.closest(".horizontal-scroll"),
      start: "left 80%",
      toggleActions: "play none none none",
    },
  },
);
```

## Notes
- Import `Bell` from lucide-react (already imported)
- The `.hide-scrollbar` class is defined in `src/index.css`
- The horizontal timeline line (`absolute top-1/2 left-0 right-0`) spans the full `min-w-max` width automatically
