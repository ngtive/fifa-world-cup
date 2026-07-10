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
    <div className="scroll-panel-wide">
      <div className="flex flex-col h-full px-8">
        <div className="shrink-0 py-4">
          <h2 className="text-2xl font-bold text-white mb-1">Player & Team Insights</h2>
          <p className="text-sm text-slate-500">
            Scorers, assists, injuries & suspensions
          </p>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar py-2">
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {/* Top Scorers */}
            <div className="flex-shrink-0 w-64 relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/40 hover:border-slate-600 transition-all duration-300">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-amber-500/80 to-amber-500/20" />
              <div className="pl-4 pr-3 py-3">
                <div className="flex items-center gap-2 mb-3">
                  <Goal size={15} className="text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Top Scorers</h3>
                </div>
                <div className="space-y-2.5">
                  {topScorers.map((s, i) => (
                    <div key={s.player} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            i === 0 ? "bg-amber-500/20 text-amber-400" : "bg-slate-700/50 text-slate-400"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-200 truncate">{s.player}</p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {s.team} &middot; {s.matches} matches
                          </p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-amber-400 shrink-0 ml-2">{s.goals}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Assists */}
            <div className="flex-shrink-0 w-64 relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/40 hover:border-slate-600 transition-all duration-300">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-blue-500/80 to-blue-500/20" />
              <div className="pl-4 pr-3 py-3">
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={15} className="text-blue-400" />
                  <h3 className="text-sm font-bold text-white">Top Assists</h3>
                </div>
                <div className="space-y-2.5">
                  {topAssists.map((s, i) => (
                    <div key={s.player} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                            i === 0 ? "bg-blue-500/20 text-blue-400" : "bg-slate-700/50 text-slate-400"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-200 truncate">{s.player}</p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {s.team} &middot; {s.matches} matches
                          </p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-blue-400 shrink-0 ml-2">{s.assists}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Injuries */}
            <div className="flex-shrink-0 w-64 relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/40 hover:border-slate-600 transition-all duration-300">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-red-500/80 to-red-500/20" />
              <div className="pl-4 pr-3 py-3">
                <div className="flex items-center gap-2 mb-3">
                  <Activity size={15} className="text-red-400" />
                  <h3 className="text-sm font-bold text-white">Injuries</h3>
                </div>
                {injuries.length === 0 ? (
                  <p className="text-sm text-slate-500">No injuries reported</p>
                ) : (
                  <div className="space-y-2.5">
                    {injuries.map((inj) => (
                      <div key={inj.player} className="bg-slate-700/30 rounded-lg px-3 py-2">
                        <div className="flex items-center justify-between mb-0.5">
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
                        <p className="text-[10px] text-slate-500 mt-0.5">Expected return: {inj.expected_return}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Suspensions */}
            <div className="flex-shrink-0 w-64 relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/40 hover:border-slate-600 transition-all duration-300">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-rose-500/80 to-rose-500/20" />
              <div className="pl-4 pr-3 py-3">
                <div className="flex items-center gap-2 mb-3">
                  <Ban size={15} className="text-rose-400" />
                  <h3 className="text-sm font-bold text-white">Suspensions</h3>
                </div>
                {suspensions.length === 0 ? (
                  <p className="text-sm text-slate-500">No active suspensions</p>
                ) : (
                  <div className="space-y-2.5">
                    {suspensions.map((sus) => (
                      <div key={sus.player} className="bg-slate-700/30 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2 mb-0.5">
                          <AlertCircle size={12} className="text-rose-400 shrink-0" />
                          <span className="text-sm font-medium text-slate-200 truncate">{sus.player}</span>
                          <span className="text-[10px] font-bold text-white bg-rose-500/20 px-1.5 py-0.5 rounded shrink-0">
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
          </div>
        </div>
      </div>
    </div>
  );
}
