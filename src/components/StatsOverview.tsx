import type { TournamentStatistics } from "../types";
import { Trophy, Goal, Users, Shield, Ban, AlertTriangle } from "lucide-react";

interface Props {
  stats: TournamentStatistics;
}

const statItems = [
  { key: "total_matches", label: "Total Matches", icon: Trophy, color: "text-gold-400", accent: "from-amber-500/80 to-amber-500/20" },
  { key: "completed_matches", label: "Completed", icon: Trophy, color: "text-emerald-400", accent: "from-emerald-500/80 to-emerald-500/20" },
  { key: "remaining_matches", label: "Remaining", icon: Trophy, color: "text-blue-400", accent: "from-blue-500/80 to-blue-500/20" },
  { key: "total_goals", label: "Total Goals", icon: Goal, color: "text-gold-400", accent: "from-amber-500/80 to-amber-500/20" },
  { key: "average_goals", label: "Avg Goals/Match", icon: Goal, color: "text-emerald-400", accent: "from-emerald-500/80 to-emerald-500/20", fixed: 2 },
  { key: "total_attendance", label: "Total Attendance", icon: Users, color: "text-blue-400", accent: "from-blue-500/80 to-blue-500/20", format: "number" as const },
  { key: "clean_sheets", label: "Clean Sheets", icon: Shield, color: "text-emerald-400", accent: "from-emerald-500/80 to-emerald-500/20" },
  { key: "penalties", label: "Penalties", icon: AlertTriangle, color: "text-gold-400", accent: "from-amber-500/80 to-amber-500/20" },
  { key: "red_cards", label: "Red Cards", icon: Ban, color: "text-red-400", accent: "from-red-500/80 to-red-500/20" },
  { key: "yellow_cards", label: "Yellow Cards", icon: AlertTriangle, color: "text-yellow-400", accent: "from-yellow-500/80 to-yellow-500/20" },
];

export default function StatsOverview({ stats }: Props) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {statItems.map((item) => {
        const Icon = item.icon;
        let value: string | number = stats[item.key as keyof TournamentStatistics];
        if (item.format === "number") {
          value = (value as number).toLocaleString();
        } else if (item.fixed) {
          value = (value as number).toFixed(item.fixed);
        }
        return (
          <div
            key={item.key}
            className="relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/40 hover:border-slate-600 transition-all duration-300"
          >
            <div className={`absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b ${item.accent}`} />
            <div className="flex flex-col pl-3 pr-2 py-2.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Icon size={14} className={item.color} />
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider truncate">
                  {item.label}
                </span>
              </div>
              <p className="text-xl font-bold text-white pl-0.5">{value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
