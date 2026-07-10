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
      className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold border ${
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
    <div className="flex gap-4">
      {groupsWithStandings.map((g) => (
        <div
          key={g.group}
          className="gsap-fade-in flex-shrink-0 w-64 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600 transition-all duration-300"
        >
          <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 px-4 py-3 border-b border-slate-700/50">
            <h3 className="text-sm font-bold text-white tracking-wider">Group {g.group}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-700/30">
                  <th className="text-left px-3 py-2 text-slate-500 font-medium">#</th>
                  <th className="text-left px-3 py-2 text-slate-500 font-medium">Team</th>
                  <th className="text-center px-2 py-2 text-slate-500 font-medium">P</th>
                  <th className="text-center px-2 py-2 text-slate-500 font-medium">W</th>
                  <th className="text-center px-2 py-2 text-slate-500 font-medium">D</th>
                  <th className="text-center px-2 py-2 text-slate-500 font-medium">L</th>
                  <th className="text-center px-2 py-2 text-slate-500 font-medium">GD</th>
                  <th className="text-center px-2 py-2 text-slate-500 font-medium">Pts</th>
                </tr>
              </thead>
              <tbody>
                {g.standings
                  .sort((a, b) => b.points - a.points || b.goal_difference - a.goal_difference)
                  .map((s, idx) => {
                    const qStatus = qualificationStatus(s.team, teams);
                    return (
                      <tr
                        key={s.team}
                        className={`border-b border-slate-700/20 hover:bg-slate-700/20 transition-colors ${
                          idx === 0
                            ? "bg-emerald-500/5"
                            : idx === g.standings.length - 1
                            ? "bg-red-500/5"
                            : ""
                        }`}
                      >
                        <td className="px-3 py-2.5 text-slate-400 font-medium">{idx + 1}</td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            {getFlagUrl(s.team) ? (
                              <img
                                src={getFlagUrl(s.team)}
                                alt=""
                                className="w-5 h-3.5 rounded-sm object-cover flex-shrink-0"
                                loading="lazy"
                              />
                            ) : null}
                            <span className="text-slate-200 font-medium truncate max-w-[80px]">
                              {s.team}
                            </span>
                            {qStatus === "qualified" && (
                              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                Q
                              </span>
                            )}
                            {qStatus === "eliminated" && (
                              <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">
                                E
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="text-center px-2 py-2.5 text-slate-300">{s.played}</td>
                        <td className="text-center px-2 py-2.5 text-emerald-400">{s.wins}</td>
                        <td className="text-center px-2 py-2.5 text-slate-400">{s.draws}</td>
                        <td className="text-center px-2 py-2.5 text-red-400">{s.losses}</td>
                        <td
                          className={`text-center px-2 py-2.5 font-semibold ${
                            s.goal_difference > 0
                              ? "text-emerald-400"
                              : s.goal_difference < 0
                              ? "text-red-400"
                              : "text-slate-400"
                          }`}
                        >
                          {s.goal_difference > 0 ? "+" : ""}
                          {s.goal_difference}
                        </td>
                        <td className="text-center px-2 py-2.5 font-bold text-gold-400">{s.points}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          {g.standings.length > 0 && (
            <div className="px-3 py-2 border-t border-slate-700/30 flex gap-1 items-center">
              <span className="text-[10px] text-slate-500 mr-1">Form:</span>
              {getForm(g.standings[0].team, standings)
                .split("")
                .map((r, i) => (
                  <FormBubble key={i} result={r} />
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
