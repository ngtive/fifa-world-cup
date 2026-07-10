import type { TopScorer, TopAssist, Injury, Suspension } from "../types";
import { Goal, Shield, Activity, Ban, AlertCircle } from "lucide-react";

interface Props {
  topScorers: TopScorer[];
  topAssists: TopAssist[];
  injuries: Injury[];
  suspensions: Suspension[];
}

export default function PlayerInsights({ topScorers, topAssists, injuries, suspensions }: Props) {
  return (
    <div className="flex gap-4 overflow-x-auto hide-scrollbar py-1">
      <div className="gsap-fade-in flex-shrink-0 w-64 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-all duration-300">
        <div className="flex items-center gap-2 mb-4">
          <Goal size={16} className="text-gold-400" />
          <h3 className="text-sm font-bold text-white">Top Scorers</h3>
        </div>
        <div className="space-y-3">
          {topScorers.map((s, i) => (
            <div key={s.player} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    i === 0 ? "bg-gold-500/20 text-gold-400" : "bg-slate-700/50 text-slate-400"
                  }`}
                >
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-200">{s.player}</p>
                  <p className="text-[10px] text-slate-500">
                    {s.team} · {s.matches} matches
                  </p>
                </div>
              </div>
              <span className="text-lg font-bold text-gold-400">{s.goals}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="gsap-fade-in flex-shrink-0 w-64 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-all duration-300">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={16} className="text-blue-400" />
          <h3 className="text-sm font-bold text-white">Top Assists</h3>
        </div>
        <div className="space-y-3">
          {topAssists.map((s, i) => (
            <div key={s.player} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    i === 0 ? "bg-blue-500/20 text-blue-400" : "bg-slate-700/50 text-slate-400"
                  }`}
                >
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-200">{s.player}</p>
                  <p className="text-[10px] text-slate-500">
                    {s.team} · {s.matches} matches
                  </p>
                </div>
              </div>
              <span className="text-lg font-bold text-blue-400">{s.assists}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="gsap-fade-in flex-shrink-0 w-64 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-all duration-300">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={16} className="text-red-400" />
          <h3 className="text-sm font-bold text-white">Injuries</h3>
        </div>
        {injuries.length === 0 ? (
          <p className="text-sm text-slate-500">No injuries reported</p>
        ) : (
          <div className="space-y-3">
            {injuries.map((inj) => (
              <div key={inj.player} className="bg-slate-700/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-200">{inj.player}</span>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      inj.status === "Doubtful"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {inj.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{inj.injury}</p>
                <p className="text-[10px] text-slate-500 mt-1">Expected return: {inj.expected_return}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="gsap-fade-in flex-shrink-0 w-64 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-all duration-300">
        <div className="flex items-center gap-2 mb-4">
          <Ban size={16} className="text-red-400" />
          <h3 className="text-sm font-bold text-white">Suspensions</h3>
        </div>
        {suspensions.length === 0 ? (
          <p className="text-sm text-slate-500">No active suspensions</p>
        ) : (
          <div className="space-y-3">
            {suspensions.map((sus) => (
              <div key={sus.player} className="bg-slate-700/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle size={12} className="text-red-400" />
                  <span className="text-sm font-medium text-slate-200">{sus.player}</span>
                  <span className="text-[10px] font-bold text-white bg-red-500/20 px-1.5 py-0.5 rounded">
                    {sus.matches_remaining} match{sus.matches_remaining > 1 ? "es" : ""}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{sus.reason}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
