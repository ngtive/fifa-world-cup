import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BarChart3 } from "lucide-react";
import data from "./data";
import { useGsapScrollAnimations } from "./hooks/useGsapScrollAnimations";

gsap.registerPlugin(ScrollTrigger);
import HeroSection from "./components/HeroSection";
import GameTimeline from "./components/GameTimeline";
import StatsOverview from "./components/StatsOverview";
import MatchesHub from "./components/MatchesHub";
import GroupStandings from "./components/GroupStandings";
import PlayerInsights from "./components/PlayerInsights";
import VenueInsights from "./components/VenueInsights";
import BracketView from "./components/BracketView";
import ScrollIndicator from "./components/ScrollIndicator";

import type { FC } from "react";

const SectionHeader: FC<{
  icon: FC<{ size?: number; className?: string }>;
  title: string;
  subtitle?: string;
}> = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
      <Icon size={18} className="text-emerald-400" />
    </div>
    <div>
      <h2 className="text-lg font-bold text-white">{title}</h2>
      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
    </div>
  </div>
);

function App() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [horizontalTween, setHorizontalTween] = useState<gsap.core.Tween | null>(null);
  useGsapScrollAnimations(scrollRef);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".horizontal-track > *");
      if (!panels.length) return;

      const tween = gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: ".horizontal-container",
          scroller: el,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${(panels.length - 1) * 100}%`,
          invalidateOnRefresh: true,
        },
      });

      setHorizontalTween(tween);
    }, el);

    return () => ctx.revert();
  }, []);

  const {
    tournament,
    groups,
    prev_games,
    next_games,
    statistics,
    top_scorers,
    top_assists,
    injuries,
    suspensions,
    stadiums,
    host_cities,
    weather,
    referees,
    tournament_bracket_tree,
    news,
    teams,
  } = data;

  return (
    <div ref={scrollRef} className="horizontal-scroll">
      {/* Panel 1: Hero */}
      <HeroSection
        tournamentName={tournament.name}
        year={tournament.year}
        stage={tournament.stage}
        statistics={statistics}
        groups={groups}
        prevGames={prev_games}
        nextGames={next_games}
      />

      {/* Panel 2: Game Timeline */}
      <GameTimeline prevGames={prev_games} nextGames={next_games} scrollRef={scrollRef} />

      {/* Panel 3: News + Stats */}
      <div className="scroll-panel">
        <SectionHeader icon={BarChart3} title="Tournament Statistics" subtitle="Key numbers from the 2026 FIFA World Cup" />
        <StatsOverview stats={statistics} />
        {news.length > 0 && (
          <div className="mt-6 gsap-fade-in bg-slate-800/40 border border-slate-700/50 rounded-xl px-5 py-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 shrink-0">Latest</span>
              <div className="h-4 w-px bg-slate-700" />
              <div className="flex gap-6 overflow-hidden">
                {news.map((item) => (
                  <a
                    key={item.title}
                    href={item.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-300 hover:text-emerald-400 transition-colors truncate shrink-0 max-w-md"
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Panels 4-8: Horizontal scroll section */}
      <div className="horizontal-container">
        <div className="horizontal-track">
          <MatchesHub prevGames={prev_games} nextGames={next_games} weather={weather} referees={referees} />

          <GroupStandings groups={groups} standings={data.standings} teams={teams} />

          <PlayerInsights
            topScorers={top_scorers}
            topAssists={top_assists}
            injuries={injuries}
            suspensions={suspensions}
          />

          <BracketView bracketTree={tournament_bracket_tree} scrollRef={scrollRef} horizontalTween={horizontalTween} />

          <VenueInsights stadiums={stadiums} hostCities={host_cities} weather={weather} />
        </div>
      </div>

      <ScrollIndicator scrollRef={scrollRef} panelCount={8} horizontalTween={horizontalTween} />
    </div>
  );
}

export default App;
