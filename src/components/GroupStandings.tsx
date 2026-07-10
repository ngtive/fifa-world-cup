import type { Group, Standing, Team } from "../types";
import { getFlagUrl } from "../countryCodes";

interface Props {
  groups: Group[];
  standings: Standing[];
  teams: Team[];
}

function FormBubble({ result }: { result: string }) {
  const colors: Record<string, string> = {
    W: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    D: "bg-slate-500/20 text-slate-300 border-slate-500/40",
    L: "bg-red-500/20 text-red-400 border-red-500/40",
  };
  return (
    <span
      className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[8px] font-bold border ${
        colors[result] || colors.D
      }`}
    >
      {result}
    </span>
  );
}

function qualificationStatus(teamName: string, teams: Team[]): "qualified" | "eliminated" | "none" {
  const team = teams.find((t) => t.name === teamName);
  if (!team) return "none";
  if (team.qualified && !team.eliminated) return "qualified";
  if (team.eliminated) return "eliminated";
  return "none";
}

function getForm(teamName: string, standings: Standing[]): string {
  const s = standings.find((st) => st.team === teamName);
  return s?.form || "";
}

export default function GroupStandings({ groups, standings, teams }: Props) {
  const groupsWithStandings = groups
    .map((g) => {
      const groupStandings = standings.filter((s) => s.group === g.group);
      return { ...g, standings: groupStandings };
    })
    .filter((g) => g.standings.length > 0)
    .sort((a, b) => a.group.localeCompare(b.group));

  return (
    <div className="scroll-panel-wide">
      <div className="flex flex-col h-full px-8">
        <div className="shrink-0 py-4">
          <h2 className="text-2xl font-bold text-white mb-1">Group Standings</h2>
          <p className="text-sm text-slate-500">
            Groups A through L
          </p>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar py-2">
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {groupsWithStandings.map((g) => {
              const sortedStandings = [...g.standings]
                .sort((a, b) => b.points - a.points || b.goal_difference - a.goal_difference);
              const topQualified = qualificationStatus(sortedStandings[0]?.team, teams) === "qualified";
              const bottomEliminated = qualificationStatus(sortedStandings[sortedStandings.length - 1]?.team, teams) === "eliminated";

              const accentGradient = topQualified
                ? "from-emerald-500/80 to-emerald-500/20"
                : bottomEliminated
                ? "from-red-500/80 to-red-500/20"
                : "from-slate-500/80 to-slate-500/20";
              return (
                <div
                  key={g.group}
                  className="flex-shrink-0 w-64 relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/40 hover:border-slate-600 transition-all duration-300"
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b ${accentGradient}`} />
                  <div>
                    <div className="pl-4 pr-3 py-2.5 border-b border-slate-700/30">
                      <h3 className="text-sm font-bold text-white tracking-wider">Group {g.group}</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[11px]">
                        <thead>
                          <tr className="border-b border-slate-700/20">
                            <th className="text-left pl-4 pr-1 py-1.5 text-slate-500 font-medium">#</th>
                            <th className="text-left px-1 py-1.5 text-slate-500 font-medium">Team</th>
                            <th className="text-center px-1 py-1.5 text-slate-500 font-medium">P</th>
                            <th className="text-center px-1 py-1.5 text-slate-500 font-medium">W</th>
                            <th className="text-center px-1 py-1.5 text-slate-500 font-medium">D</th>
                            <th className="text-center px-1 py-1.5 text-slate-500 font-medium">L</th>
                            <th className="text-center px-1 py-1.5 text-slate-500 font-medium">GD</th>
                            <th className="text-center pr-3 pl-1 py-1.5 text-slate-500 font-medium">Pts</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedStandings.map((s, idx) => {
                            const qStatus = qualificationStatus(s.team, teams);
                            return (
                              <tr
                                key={s.team}
                                className={`border-b border-slate-700/15 hover:bg-slate-700/15 transition-colors ${
                                  idx === 0
                                    ? "bg-emerald-500/5"
                                    : idx === sortedStandings.length - 1
                                    ? "bg-red-500/5"
                                    : ""
                                }`}
                              >
                                <td className="pl-4 pr-1 py-2 text-slate-400 font-medium">{idx + 1}</td>
                                <td className="px-1 py-2">
                                  <div className="flex items-center gap-1.5">
                                    {getFlagUrl(s.team) ? (
                                      <img
                                        src={getFlagUrl(s.team)}
                                        alt=""
                                        className="w-4 h-3 rounded-sm object-cover flex-shrink-0"
                                        loading="lazy"
                                      />
                                    ) : null}
                                    <span className="text-slate-200 font-medium truncate max-w-[70px] text-[11px]">
                                      {s.team}
                                    </span>
                                    {qStatus === "qualified" && (
                                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded">Q</span>
                                    )}
                                    {qStatus === "eliminated" && (
                                      <span className="text-[9px] font-bold text-red-400 bg-red-500/10 px-1 py-0.5 rounded">E</span>
                                    )}
                                  </div>
                                </td>
                                <td className="text-center px-1 py-2 text-slate-300">{s.played}</td>
                                <td className="text-center px-1 py-2 text-emerald-400">{s.wins}</td>
                                <td className="text-center px-1 py-2 text-slate-400">{s.draws}</td>
                                <td className="text-center px-1 py-2 text-red-400">{s.losses}</td>
                                <td
                                  className={`text-center px-1 py-2 font-semibold ${
                                    s.goal_difference > 0
                                      ? "text-emerald-400"
                                      : s.goal_difference < 0
                                      ? "text-red-400"
                                      : "text-slate-400"
                                  }`}
                                >
                                  {s.goal_difference > 0 ? "+" : ""}{s.goal_difference}
                                </td>
                                <td className="text-center pr-3 pl-1 py-2 font-bold text-amber-400">{s.points}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {sortedStandings.length > 0 && (
                      <div className="pl-4 pr-3 py-1.5 border-t border-slate-700/20 flex gap-1 items-center">
                        <span className="text-[9px] text-slate-500 mr-0.5">Form:</span>
                        {getForm(sortedStandings[0].team, standings)
                          .split("")
                          .map((r, i) => (
                            <FormBubble key={i} result={r} />
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
