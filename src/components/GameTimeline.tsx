import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Trophy, Bell } from "lucide-react";
import { getFlagUrl } from "../countryCodes";
import type { PrevGame, NextGame } from "../types";

interface Props {
  prevGames: PrevGame[];
  nextGames: NextGame[];
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

function GameCard({
  match,
  isUpcoming,
}: {
  match: PrevGame | NextGame;
  isUpcoming: boolean;
}) {
  const isCompleted = !isUpcoming && "winner" in match && "home_score" in match;
  const prevMatch = isCompleted ? (match as PrevGame) : null;
  const isHomeWinner = prevMatch?.winner === prevMatch?.home_team;
  const isDraw = prevMatch
    ? prevMatch.home_score === prevMatch.away_score
    : false;

  const accentGradient =
    isUpcoming || (prevMatch?.winner && !isDraw)
      ? "from-emerald-500/80 to-emerald-500/20"
      : isDraw
        ? "from-slate-500/80 to-slate-500/20"
        : "from-slate-600/60 to-slate-600/20";

  return (
    <div
      className={`timeline-card w-full h-28 rounded-xl border border-slate-700/50 overflow-hidden transition-all duration-300 relative ${
        isUpcoming
          ? "bg-slate-800/40 hover:border-emerald-500/50"
          : "bg-slate-800/40 hover:border-slate-600"
      }`}
    >
      {/* Gradient accent strip on left */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b ${accentGradient}`}
      />

        <div className="flex flex-col h-full pl-3 pr-2 py-2">
        {/* Header: stage + date */}
        <div className="flex items-center justify-between mb-1">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider ${
              isUpcoming ? "text-emerald-400" : "text-slate-400"
            }`}
          >
            {match.stage}
          </span>
          <span className="text-[10px] text-slate-500">{match.match_date}</span>
        </div>

        {/* Flags + names side by side, score centered */}
        <div className="flex items-center justify-center gap-3 mb-auto">
          {/* Home */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-6 rounded overflow-hidden bg-slate-700/40 border border-slate-600/30 flex items-center justify-center">
              {getFlagUrl(match.home_team) ? (
                <img
                  src={getFlagUrl(match.home_team)}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="text-sm">🏳️</span>
              )}
            </div>
            <span
              className={`text-xs font-medium max-w-[80px] truncate text-center ${
                isHomeWinner && !isDraw && !isUpcoming
                  ? "text-emerald-400"
                  : "text-slate-300"
              }`}
            >
              {match.home_team}
            </span>
          </div>

          {/* Score / kickoff / vs */}
          {prevMatch ? (
            <div className="flex items-center gap-1">
              <span
                className={`text-lg font-black ${isHomeWinner && !isDraw ? "text-emerald-400" : "text-white"}`}
              >
                {prevMatch.home_score}
              </span>
              <span className="text-xs font-bold text-slate-500">-</span>
              <span
                className={`text-lg font-black ${!isHomeWinner && !isDraw ? "text-emerald-400" : "text-white"}`}
              >
                {prevMatch.away_score}
              </span>
            </div>
          ) : isUpcoming && "kickoff_time" in match ? (
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {(match as NextGame).kickoff_time}
            </span>
          ) : (
            <span className="text-xs font-bold text-slate-500">vs</span>
          )}

          {/* Away */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-6 rounded overflow-hidden bg-slate-700/40 border border-slate-600/30 flex items-center justify-center">
              {getFlagUrl(match.away_team) ? (
                <img
                  src={getFlagUrl(match.away_team)}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="text-sm">🏳️</span>
              )}
            </div>
            <span
              className={`text-[10px] font-medium max-w-[60px] truncate text-center ${
                !isHomeWinner && !isDraw && !isUpcoming && prevMatch?.winner
                  ? "text-emerald-400"
                  : "text-slate-300"
              }`}
            >
              {match.away_team}
            </span>
          </div>
        </div>

        {/* Footer */}
        {prevMatch?.winner && !isDraw && (
          <div className="flex items-center justify-center gap-1 text-[9px] text-emerald-400/80">
            <Trophy size={8} />
            <span>{prevMatch.winner} won</span>
          </div>
        )}
        {isUpcoming && (
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-emerald-400/80">Upcoming</span>
            <button className="flex items-center gap-1 text-[9px] text-emerald-400/80 hover:text-emerald-400 transition-colors">
              <Bell size={8} />
              <span>Remind Me</span>
            </button>
          </div>
        )}
    </div>
    </div>
  );
}

export default function GameTimeline({ prevGames, nextGames }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      if (markerRef.current) {
        gsap.fromTo(
          markerRef.current,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: markerRef.current,
              scroller: el.closest(".horizontal-scroll"),
              start: "left 85%",
              toggleActions: "play none none none",
            },
          },
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="scroll-panel-wide">
      <div className="flex flex-col h-full px-8">
        <div className="shrink-0 py-4">
          <h2 className="text-2xl font-bold text-white mb-1">Game Timeline</h2>
          <p className="text-sm text-slate-500">
            Every match in chronological order
          </p>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar py-2">
          <div className="grid grid-cols-3 gap-3">
            {prevGames.map((game) => (
              <GameCard key={game.external_id} match={game} isUpcoming={false} />
            ))}

            <div
              ref={markerRef}
              className="col-span-3 flex items-center gap-3 py-2"
            >
              <div className="flex-1 h-px bg-slate-700/60" />
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-emerald-400 shadow-lg shadow-emerald-500/30" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Today
                </span>
              </div>
              <div className="flex-1 h-px bg-slate-700/60" />
            </div>

            {nextGames.map((game) => (
              <GameCard key={game.external_id} match={game} isUpcoming={true} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
