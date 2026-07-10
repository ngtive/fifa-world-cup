# Build Plan: Horizontal-Scrolling FIFA World Cup Dashboard

## Architecture Decisions
- **Scroll**: CSS `overflow-x: auto` on a full-viewport container — no scroll-jacking
- **Scrollbar**: Hidden entirely (all browsers)
- **Mobile**: Same horizontal scroll, no vertical fallback — touch-friendly with `-webkit-overflow-scrolling: touch`
- **Flags**: `flagcdn.com/w80/{iso}.png` — reliable, no API key, instant load
- **Animations**: GSAP 3.15 + ScrollTrigger, driven by horizontal scroll position via `scroller` option

---

## Files to Create

| # | File | Purpose |
|---|---|---|
| 1 | `src/countryCodes.ts` | Team name → ISO code map + `getFlagUrl()` helper |
| 2 | `src/components/HeroSection.tsx` | Full-viewport hero: title, stats, team flags carousel, GSAP entrance |
| 3 | `src/components/GameTimeline.tsx` | Horizontal timeline of `prev_games` + `next_games`, cards on a connector line, ScrollTrigger stagger |
| 4 | `src/hooks/useGsapScrollAnimations.ts` | Hook: registers ScrollTrigger on horizontal container, targets `.gsap-fade-in` elements, cleans up on unmount |

## Files to Modify

| # | File | Changes |
|---|---|---|
| 5 | `src/index.css` | Add `.horizontal-scroll`, `.scroll-panel`, `.hide-scrollbar` utility classes; update `body` to `overflow: hidden` |
| 6 | `src/App.tsx` | Wrap all content in `<div class="horizontal-scroll" ref={ref}>`, reorder sections left→right: Hero → GameTimeline → Stats → Matches → Standings → Players → Bracket → Venues, add scroll indicator, wire `useGsapScrollAnimations` |
| 7 | `src/components/StatsOverview.tsx` | Grid → horizontal flex row, `flex-shrink-0` cards |
| 8 | `src/components/MatchesHub.tsx` | Card grid → horizontal flex row for horizontal layout |
| 9 | `index.html` | Add `overflow-hidden` classes to `<html>` and `<body>` |

---

## Component Details

### `src/countryCodes.ts`
- `FLAG_MAP: Record<string, string>` mapping all ~48 team names to ISO codes
- `getFlagUrl(team: string): string` returning `https://flagcdn.com/w80/{code}.png`
- Fallback to a generic globe icon for unknown teams

### `src/components/HeroSection.tsx`
- **Layout**: Full `100vw` panel, vertically centered
- **Content**: Tournament title + year (large), stage badge, stat pills (goals, attendance, matches played), horizontal row of unique team flags from all groups
- **Flags row**: `overflow-x-auto` within the hero for many teams, each flag is a `40x30` rounded card with team name below
- **GSAP**: `gsap.from()` timeline on mount — title fades up, stats stagger, flags scale+fade from bottom with 0.05s stagger

### `src/components/GameTimeline.tsx`
- **Layout**: Full `100vw` panel with a horizontal connector line (CSS `::after` on the container)
- **Cards**: Each game is a `flex-shrink-0` card (~280px wide) containing: date, stage badge, two team flags + names, score or "vs", winner highlight (green)
- **Order**: All `prev_games` (completed) left-to-right chronologically, then `next_games` (upcoming) with a "TODAY" marker between them
- **GSAP ScrollTrigger**: Each card targets via `scrollTrigger: { trigger: card, scroller: container, start: "left 85%", horizontal: true }` — animates `opacity: 0->1, x: 60->0` with stagger

### `src/hooks/useGsapScrollAnimations.ts`
- Accepts `containerRef: RefObject<HTMLDivElement>`
- On mount, uses `gsap.context()` to find all `.gsap-fade-in` elements and create ScrollTrigger animations
- Each element animates from `opacity: 0, x: 80` with `scrollTrigger: { scroller: containerRef.current, start: "left 80%" }`
- Cleanup: `ctx.revert()` on unmount

---

## CSS Architecture (`src/index.css` additions)
```css
/* Hide scrollbar globally */
.hide-scrollbar { scrollbar-width: none; }
.hide-scrollbar::-webkit-scrollbar { display: none; }

/* Horizontal scroll container */
.horizontal-scroll {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  height: 100vh;
  height: 100dvh;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.horizontal-scroll::-webkit-scrollbar { display: none; }

/* Each section panel */
.scroll-panel {
  flex: 0 0 100vw;
  min-height: 100vh;
  min-height: 100dvh;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
}

/* Panels that need more width (timeline, matches) */
.scroll-panel-wide {
  flex: 0 0 auto;
  min-width: 100vw;
  width: max-content;
}

/* Body/html no vertical scroll */
html, body, #root { height: 100%; overflow: hidden; margin: 0; }
```

---

## Animation Matrix

| Element | Trigger | GSAP Animation |
|---|---|---|
| Hero title | `onMount` | `from({ opacity: 0, y: 40, duration: 0.8, ease: "power3.out" })` |
| Hero stats | `onMount` | `from({ opacity: 0, y: 20, stagger: 0.1 })` |
| Hero flags | `onMount` | `from({ opacity: 0, scale: 0.5, y: 30, stagger: 0.04 })` |
| Timeline cards | ScrollTrigger horizontal | `from({ opacity: 0, x: 60, stagger: 0.15 })` |
| Section panels | ScrollTrigger horizontal | `from({ opacity: 0, x: 80 })` |
| Stat cards | ScrollTrigger horizontal | `from({ opacity: 0, y: 30, stagger: 0.08 })` |

---

## Mobile Considerations
- No vertical fallback — same horizontal scroll, touch-friendly
- Touch scroll momentum via `-webkit-overflow-scrolling: touch`
- Cards/panels scale down via responsive Tailwind classes (`w-48 sm:w-56 md:w-64`)
- Hero flags row uses horizontal scroll within the panel
- Touch targets are at least 44px
