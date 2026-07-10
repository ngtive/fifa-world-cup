import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Trophy, BarChart3, Users } from "lucide-react";
import { getFlagUrl, getUniqueTeams } from "../countryCodes";
import type { Group, PrevGame, NextGame, TournamentStatistics } from "../types";

interface Props {
  tournamentName: string;
  year: number;
  stage: string;
  statistics: TournamentStatistics;
  groups: Group[];
  prevGames: PrevGame[];
  nextGames: NextGame[];
}

export default function HeroSection({
  tournamentName,
  year,
  stage,
  statistics,
  groups,
  prevGames,
  nextGames,
}: Props) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const flagsRef = useRef<HTMLDivElement>(null);

  const teams = getUniqueTeams(groups, prevGames, nextGames);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(titleRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 });

      if (statsRef.current) {
        const pills = gsap.utils.toArray<HTMLElement>(".stat-pill");
        tl.fromTo(
          pills,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
          "-=0.3",
        );
      }

      if (flagsRef.current) {
        const flagCards = gsap.utils.toArray<HTMLElement>(".flag-card");
        tl.fromTo(
          flagCards,
          { opacity: 0, scale: 0.5, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.04 },
          "-=0.2",
        );
      }

    });

    return () => ctx.revert();
  }, []);

  const statItems = [
    { icon: Trophy, label: "Goals", value: statistics.total_goals, color: "text-gold-400" },
    { icon: BarChart3, label: "Avg/Match", value: statistics.average_goals.toFixed(2), color: "text-emerald-400" },
    { icon: Users, label: "Attendance", value: statistics.total_attendance.toLocaleString(), color: "text-blue-400" },
    { icon: Trophy, label: "Matches", value: `${statistics.completed_matches}/${statistics.total_matches}`, color: "text-emerald-400" },
  ];

  return (
    <div className="scroll-panel items-center justify-center text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-gold-500/20 to-emerald-500/20 border border-gold-500/30">
          <Trophy size={48} className="text-gold-400" />
        </div>

        <div ref={titleRef}>
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight leading-tight">
            {tournamentName} <span className="text-gold-400">{year}</span>
          </h1>
          <div className="flex items-center justify-center gap-3 mt-4">
            <span className="text-sm font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {stage}
            </span>
            <span className="text-sm text-slate-500">
              June 11 — July 19, {year}
            </span>
          </div>
        </div>

        <div ref={statsRef} className="flex flex-wrap justify-center gap-3">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="stat-pill flex items-center gap-2 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl px-4 py-2.5"
              >
                <Icon size={16} className={item.color} />
                <span className="text-xs text-slate-400">{item.label}</span>
                <span className="text-sm font-bold text-white">{item.value}</span>
              </div>
            );
          })}
        </div>

        <div className="w-full">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
            Participating Teams
          </p>
          <div
            ref={flagsRef}
            className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar justify-center flex-wrap"
          >
            {teams.map((team) => {
              const flagUrl = getFlagUrl(team);
              return (
                <div
                  key={team}
                  className="flag-card flex flex-col items-center gap-1.5 flex-shrink-0"
                >
                  <div className="w-12 h-9 rounded-md overflow-hidden border border-slate-700/50 bg-slate-800/40 flex items-center justify-center">
                    {flagUrl ? (
                      <img
                        src={flagUrl}
                        alt={`${team} flag`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-lg">🏳️</span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 max-w-[60px] truncate">
                    {team}
                  </span>
                </div>
              );
            })}
          </div>
        </div>


      </div>
    </div>
  );
}
