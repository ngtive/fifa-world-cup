# Fix Panel Sizing + Remove Footer + Add Remind Me Button

## Goal
Every section should be exactly 100vw × 100vh, content fits inside the box, remove footer, add placeholder Remind Me button on upcoming games.

## Files to modify

| # | File | Change |
|---|------|--------|
| 1 | `src/index.css` | Fix `.scroll-panel-wide` → 100vw × 100vh, `overflow: hidden`. Add `height: 100vh` to `.scroll-panel`. |
| 2 | `src/App.tsx` | Remove footer (Panel 9). |
| 3 | `src/components/GameTimeline.tsx` | Add placeholder "Remind Me" button to `GameCard` when `isUpcoming`. No logic — just UI. |
| 4 | `src/components/MatchesHub.tsx` | Add placeholder "Remind Me" button to `UpcomingMatchCard`. No logic — just UI. |

## Details

### 1. CSS (`src/index.css`)

`.scroll-panel-wide` currently has `flex: 0 0 auto` / `min-width: 100vw` — panels grow beyond viewport.
Change to:
```css
.scroll-panel-wide {
  flex: 0 0 100vw;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  box-sizing: border-box;
}
```

Add `height: 100vh; height: 100dvh;` to `.scroll-panel` for consistency.

### 2. Remove Footer (`src/App.tsx`)

Delete Panel 9 (the last `<div className="scroll-panel items-center justify-center">` block with FIFA data source links).

### 3. Remind Me button (`GameTimeline.tsx`)

Add a placeholder "Remind Me" button inside `GameCard` when `isUpcoming` is true. Button is visual-only — no onclick handler, no backend logic yet. Style: small pill button with `Bell` icon from lucide-react, emerald theme to match upcoming card style.

### 4. Remind Me button (`MatchesHub.tsx`)

Same placeholder button in `UpcomingMatchCard`. Visual-only, no logic.

## Notes
- No `.ics` utility file — backend will handle that later
- Button does nothing on click for now
