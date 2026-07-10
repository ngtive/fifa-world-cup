import type { TournamentStatistics } from "../types";
import { Trophy, Goal, Users, Shield, Ban, AlertTriangle } from "lucide-react";

interface Props {
  stats: TournamentStatistics;
}

const statItems = [
  { key: "total_matches", label: "Total Matches", icon: Trophy, color: "text-gold-400" },
  { key: "completed_matches", label: "Completed", icon: Trophy, color: "text-emerald-400" },
  { key: "remaining_matches", label: "Remaining", icon: Trophy, color: "text-blue-400" },
  { key: "total_goals", label: "Total Goals", icon: Goal, color: "text-gold-400" },
  { key: "average_goals", label: "Avg Goals/Match", icon: Goal, color: "text-emerald-400", fixed: 2 },
  { key: "total_attendance", label: "Total Attendance", icon: Users, color: "text-blue-400", format: "number" as const },
  { key: "clean_sheets", label: "Clean Sheets", icon: Shield, color: "text-emerald-400" },
  { key: "penalties", label: "Penalties", icon: AlertTriangle, color: "text-gold-400" },
  { key: "red_cards", label: "Red Cards", icon: Ban, color: "text-red-400" },
  { key: "yellow_cards", label: "Yellow Cards", icon: AlertTriangle, color: "text-yellow-400" },
];

export default function StatsOverview({ stats }: Props) {
  return (
    <div className="grid grid-cols-5 gap-2">
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
            className="gsap-fade-in flex-shrink-0 w-40 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon size={16} className={item.color} />
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {item.label}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        );
      })}
    </div>
  );
}
