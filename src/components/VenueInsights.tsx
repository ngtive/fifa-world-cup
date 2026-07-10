import type { Stadium, HostCity, Weather } from "../types";
import { MapPin, Users, Calendar, Sun, Wind } from "lucide-react";

interface Props {
  stadiums: Stadium[];
  hostCities: HostCity[];
  weather: Weather[];
}

export default function VenueInsights({ stadiums, hostCities, weather }: Props) {
  return (
    <div className="flex gap-4 overflow-x-auto hide-scrollbar py-1">
      {hostCities.map((city) => {
        const stadium = stadiums.find((s) => s.city === city.city);
        const w = weather.find((wth) => wth.city === city.city);
        return (
          <div
            key={city.city}
            className="gsap-fade-in flex-shrink-0 w-72 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{city.city}</h3>
                <p className="text-xs text-slate-400">{city.country}</p>
              </div>
              <MapPin size={20} className="text-emerald-400" />
            </div>
            {stadium && (
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <MapPin size={14} className="text-slate-500" />
                  {stadium.name}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Users size={14} className="text-slate-500" />
                  {stadium.capacity.toLocaleString()} capacity · {stadium.surface} · Est. {stadium.opened}
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-700/30 rounded-lg px-3 py-2 mb-3">
              <Calendar size={12} />
              Next: {city.next_match}
            </div>
            {w && (
              <div className="flex items-center gap-3 text-xs bg-slate-700/30 rounded-lg px-3 py-2">
                <span className="flex items-center gap-1 text-yellow-400">
                  <Sun size={12} />
                  {w.forecast}
                </span>
                <span className="text-white font-medium">{w.temperature}°C</span>
                <span className="flex items-center gap-1 text-orange-400">
                  <Wind size={12} />
                  {w.wind} km/h
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
