import type { Stadium, HostCity, Weather } from "../types";
import { MapPin, Users, Calendar, Sun, Wind } from "lucide-react";

interface Props {
  stadiums: Stadium[];
  hostCities: HostCity[];
  weather: Weather[];
}

export default function VenueInsights({ stadiums, hostCities, weather }: Props) {
  return (
    <div className="scroll-panel-wide">
      <div className="flex flex-col h-full px-8">
        <div className="shrink-0 py-4">
          <h2 className="text-2xl font-bold text-white mb-1">Host Cities & Venues</h2>
          <p className="text-sm text-slate-500">
            Stadiums, weather & upcoming matches
          </p>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar py-2">
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {hostCities.map((city) => {
              const stadium = stadiums.find((s) => s.city === city.city);
              const w = weather.find((wth) => wth.city === city.city);
              return (
                <div
                  key={city.city}
                  className="flex-shrink-0 w-72 relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/40 hover:border-emerald-500/30 transition-all duration-300"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-emerald-500/80 to-emerald-500/20" />
                  <div className="pl-4 pr-3 py-3">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-white">{city.city}</h3>
                        <p className="text-xs text-slate-400">{city.country}</p>
                      </div>
                      <MapPin size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                    </div>
                    {stadium && (
                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <MapPin size={13} className="text-slate-500 shrink-0" />
                          <span className="truncate">{stadium.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Users size={13} className="text-slate-500 shrink-0" />
                          <span className="truncate">{stadium.capacity.toLocaleString()} capacity</span>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-700/30 rounded-lg px-3 py-1.5 mb-2">
                      <Calendar size={12} className="shrink-0" />
                      <span className="truncate">Next: {city.next_match}</span>
                    </div>
                    {w && (
                      <div className="flex items-center gap-3 text-xs bg-slate-700/30 rounded-lg px-3 py-1.5">
                        <span className="flex items-center gap-1 text-yellow-400">
                          <Sun size={12} />
                          {w.forecast}
                        </span>
                        <span className="text-white font-medium">{w.temperature}&deg;C</span>
                        <span className="flex items-center gap-1 text-orange-400">
                          <Wind size={12} />
                          {w.wind} km/h
                        </span>
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
