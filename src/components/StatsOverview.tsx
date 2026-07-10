import type { TournamentStatistics } from "../types";
import { Trophy, Goal, Users, Shield, Ban, AlertTriangle } from "lucide-react";

interface Props {
  stats: TournamentStatistics;
}

const statItems = [
  { key: "total_matches", label: "Total Matches", icon: Trophy, color: "text-gold" },
  { key: "completed_matches", label: "Completed", icon: Trophy, color: "text-white/60" },
  { key: "remaining_matches", label: "Remaining", icon: Trophy, color: "text-white/40" },
  { key: "total_goals", label: "Total Goals", icon: Goal, color: "text-gold" },
  { key: "average_goals", label: "Avg Goals/Match", icon: Goal, color: "text-white/60", fixed: 2 },
  { key: "total_attendance", label: "Total Attendance", icon: Users, color: "text-white/40", format: "number" as const },
  { key: "clean_sheets", label: "Clean Sheets", icon: Shield, color: "text-white/60" },
  { key: "penalties", label: "Penalties", icon: AlertTriangle, color: "text-gold" },
  { key: "red_cards", label: "Red Cards", icon: Ban, color: "text-red-400" },
  { key: "yellow_cards", label: "Yellow Cards", icon: AlertTriangle, color: "text-yellow-400" },
];

export default function StatsOverview({ stats }: Props) {
  return (
    <div className="grid grid-cols-5 gap-4">
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
            className="relative overflow-hidden rounded-xl border border-charcoal-600 bg-charcoal-800 hover:bg-charcoal-700 transition-all duration-300"
          >
            <div className="flex flex-col pl-4 pr-3 py-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Icon size={14} className={item.color} />
                <span className="text-[10px] font-medium text-white/35 uppercase tracking-wider truncate">
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
