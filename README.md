# FIFA World Cup 2026 — Interactive Dashboard

A real-time, horizontally-scrolling dashboard for the 2026 FIFA World Cup built with **React**, **TypeScript**, **Vite**, **Tailwind CSS v4**, and **GSAP**.

## Features

- **Hero Section** — Tournament overview with stats, group count, and live match info
- **Game Timeline** — Scroll-driven horizontal timeline of completed and upcoming fixtures
- **Tournament Statistics** — Key numbers: total goals, attendance, cards, penalties
- **Matches Hub** — Full fixture list with weather and referee details
- **Group Standings** — All 12 groups with form indicators
- **Player & Team Insights** — Top scorers, assists, injuries, suspensions
- **Knockout Bracket** — Interactive bracket tree visualization
- **Host Cities & Venues** — Stadium info, capacity, weather forecasts
- **Live News Ticker** — Latest tournament headlines

All data is extracted in real-time via a **Gemini-powered Python agent** (`fetch-agent/`).

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | React 19 |
| Language | TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| Animation | GSAP + ScrollTrigger |
| Icons | Lucide React |
| Data | Gemini Extraction Agent (Python) |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

## Data Pipeline

The `fetch-agent/` directory contains a Python script that scrapes live tournament data and outputs it to `src/data.ts`. To refresh data:

```bash
cd fetch-agent
pip install -r requirements.txt
python fetch_agent.py
```

Requires a `GEMINI_API_KEY` in `.env`.

## Project Structure

```
src/
  components/   — Panel components (Hero, Timeline, Bracket, etc.)
  hooks/        — GSAP scroll animation hook
  data.ts       — Tournament data (auto-generated)
  types.ts      — TypeScript interfaces
  index.css     — Tailwind + custom animations
  App.tsx       — Main layout with horizontal scroll
fetch-agent/    — Python data extraction agent
```
