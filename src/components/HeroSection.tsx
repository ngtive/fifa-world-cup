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
    { icon: Trophy, label: "Goals", value: statistics.total_goals, color: "text-gold" },
    { icon: BarChart3, label: "Avg/Match", value: statistics.average_goals.toFixed(2), color: "text-gold" },
    { icon: Users, label: "Attendance", value: statistics.total_attendance.toLocaleString(), color: "text-white/60" },
    { icon: Trophy, label: "Matches", value: `${statistics.completed_matches}/${statistics.total_matches}`, color: "text-white/60" },
  ];

  return (
    <div className="scroll-panel items-center justify-center text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-10">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20">
          <Trophy size={52} className="text-gold" />
        </div>

        <div ref={titleRef}>
          <h1 className="text-6xl sm:text-[5.5rem] font-black text-white tracking-tighter leading-none">
            {tournamentName} <span className="text-gold">{year}</span>
          </h1>
          <div className="flex items-center justify-center gap-3 mt-5">
            <span className="text-sm font-semibold text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
              {stage}
            </span>
            <span className="text-sm text-white/30">
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
                className="stat-pill flex items-center gap-2 bg-charcoal-700 border border-charcoal-600 rounded-xl px-5 py-3"
              >
                <Icon size={16} className={item.color} />
                <span className="text-xs text-white/40">{item.label}</span>
                <span className="text-sm font-bold text-white">{item.value}</span>
              </div>
            );
          })}
        </div>

        <div className="w-full">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/25 mb-4">
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
                  <div className="w-12 h-9 rounded-md overflow-hidden border border-charcoal-600 bg-charcoal-800 flex items-center justify-center">
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
                  <span className="text-[10px] text-white/30 max-w-[60px] truncate">
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
