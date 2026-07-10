import type { Group, Standing, Team } from "../types";
import { getFlagUrl } from "../countryCodes";

interface Props {
  groups: Group[];
  standings: Standing[];
  teams: Team[];
}

function FormBubble({ result }: { result: string }) {
  const colors: Record<string, string> = {
    W: "bg-gold/15 text-gold border-gold/30",
    D: "bg-charcoal-600 text-white/40 border-charcoal-500",
    L: "bg-red-500/15 text-red-400 border-red-500/30",
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
      <div className="flex flex-col h-full px-10">
        <div className="shrink-0 py-5">
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-1">Group Standings</h2>
          <p className="text-sm text-white/30">
            Groups A through L
          </p>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar py-2">
          <div className="flex gap-5 overflow-x-auto hide-scrollbar scroll-snap-x pb-2">
            {groupsWithStandings.map((g) => {
              const sortedStandings = [...g.standings]
                .sort((a, b) => b.points - a.points || b.goal_difference - a.goal_difference);
              const topQualified = qualificationStatus(sortedStandings[0]?.team, teams) === "qualified";
              const bottomEliminated = qualificationStatus(sortedStandings[sortedStandings.length - 1]?.team, teams) === "eliminated";

              return (
                <div
                  key={g.group}
                  className="flex-shrink-0 w-64 scroll-snap-start relative overflow-hidden rounded-xl border border-charcoal-600 bg-charcoal-800 hover:bg-charcoal-700 transition-all duration-300"
                >
                  <div>
                    <div className="pl-4 pr-3 py-2.5 border-b border-charcoal-600">
                      <h3 className="text-sm font-bold text-white tracking-wider">Group {g.group}</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[11px]">
                        <thead>
                          <tr className="border-b border-charcoal-600">
                            <th className="text-left pl-4 pr-1 py-1.5 text-white/30 font-medium">#</th>
                            <th className="text-left px-1 py-1.5 text-white/30 font-medium">Team</th>
                            <th className="text-center px-1 py-1.5 text-white/30 font-medium">P</th>
                            <th className="text-center px-1 py-1.5 text-white/30 font-medium">W</th>
                            <th className="text-center px-1 py-1.5 text-white/30 font-medium">D</th>
                            <th className="text-center px-1 py-1.5 text-white/30 font-medium">L</th>
                            <th className="text-center px-1 py-1.5 text-white/30 font-medium">GD</th>
                            <th className="text-center pr-3 pl-1 py-1.5 text-white/30 font-medium">Pts</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedStandings.map((s, idx) => {
                            const qStatus = qualificationStatus(s.team, teams);
                            return (
                              <tr
                                key={s.team}
                                className={`border-b border-charcoal-600/50 hover:bg-charcoal-700/50 transition-colors ${
                                  idx === 0
                                    ? "bg-gold/5"
                                    : idx === sortedStandings.length - 1
                                    ? "bg-red-500/5"
                                    : ""
                                }`}
                              >
                                <td className="pl-4 pr-1 py-2 text-white/30 font-medium">{idx + 1}</td>
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
                                    <span className="text-white/80 font-medium truncate max-w-[70px] text-[11px]">
                                      {s.team}
                                    </span>
                                    {qStatus === "qualified" && (
                                      <span className="text-[9px] font-bold text-gold bg-gold/10 px-1 py-0.5 rounded">Q</span>
                                    )}
                                    {qStatus === "eliminated" && (
                                      <span className="text-[9px] font-bold text-red-400 bg-red-500/10 px-1 py-0.5 rounded">E</span>
                                    )}
                                  </div>
                                </td>
                                <td className="text-center px-1 py-2 text-white/50">{s.played}</td>
                                <td className="text-center px-1 py-2 text-gold">{s.wins}</td>
                                <td className="text-center px-1 py-2 text-white/35">{s.draws}</td>
                                <td className="text-center px-1 py-2 text-red-400">{s.losses}</td>
                                <td
                                  className={`text-center px-1 py-2 font-semibold ${
                                    s.goal_difference > 0
                                      ? "text-gold"
                                      : s.goal_difference < 0
                                      ? "text-red-400"
                                      : "text-white/35"
                                  }`}
                                >
                                  {s.goal_difference > 0 ? "+" : ""}{s.goal_difference}
                                </td>
                                <td className="text-center pr-3 pl-1 py-2 font-bold text-gold">{s.points}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {sortedStandings.length > 0 && (
                      <div className="pl-4 pr-3 py-1.5 border-t border-charcoal-600 flex gap-1 items-center">
                        <span className="text-[9px] text-white/25 mr-0.5">Form:</span>
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
