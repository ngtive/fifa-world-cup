import { useState } from "react";
import type { PrevGame, NextGame, Weather, Referee } from "../types";
import { Calendar, MapPin, Sun, Wind, Droplets, Trophy, Bell } from "lucide-react";
import { getFlagUrl } from "../countryCodes";

interface Props {
  prevGames: PrevGame[];
  nextGames: NextGame[];
  weather: Weather[];
  referees: Referee[];
}

function CompletedMatchCard({ match }: { match: PrevGame }) {
  const isHomeWinner = match.winner === match.home_team;
  const isDraw = match.home_score === match.away_score;
  return (
    <div className="flex-shrink-0 w-72 relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/40 hover:border-slate-600 transition-all duration-300">
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b ${
        isDraw ? "from-slate-500/80 to-slate-500/20" : "from-emerald-500/80 to-emerald-500/20"
      }`} />
      <div className="pl-4 pr-3 py-2.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{match.stage}</span>
          <span className="text-[10px] text-slate-500">{match.match_date}</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-5 rounded overflow-hidden bg-slate-700/40 flex-shrink-0 border border-slate-600/30">
              {getFlagUrl(match.home_team) ? (
                <img src={getFlagUrl(match.home_team)} alt="" className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px]">🏳️</div>
              )}
            </div>
            <span className={`flex-1 text-sm font-medium truncate ${isHomeWinner ? "text-emerald-400" : "text-slate-200"}`}>
              {match.home_team}
            </span>
            <span className={`text-base font-black ${isHomeWinner && !isDraw ? "text-emerald-400" : "text-white"}`}>
              {match.home_score}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-5 rounded overflow-hidden bg-slate-700/40 flex-shrink-0 border border-slate-600/30">
              {getFlagUrl(match.away_team) ? (
                <img src={getFlagUrl(match.away_team)} alt="" className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px]">🏳️</div>
              )}
            </div>
            <span className={`flex-1 text-sm font-medium truncate ${!isHomeWinner && !isDraw ? "text-emerald-400" : "text-slate-200"}`}>
              {match.away_team}
            </span>
            <span className={`text-base font-black ${!isHomeWinner && !isDraw ? "text-emerald-400" : "text-white"}`}>
              {match.away_score}
            </span>
          </div>
        </div>
        {match.winner && !isDraw && (
          <div className="mt-1.5 flex items-center justify-center gap-1 border-t border-slate-700/30 pt-1.5">
            <Trophy size={10} className="text-emerald-400/80" />
            <span className="text-[10px] text-emerald-400/80">{match.winner} won</span>
          </div>
        )}
      </div>
    </div>
  );
}

function findWeather(match: NextGame, weather: Weather[]): Weather | undefined {
  return weather.find((w) => {
    const matchStadium =
      match.home_team === "Spain"
        ? "Los Angeles Stadium"
        : match.home_team === "Norway"
        ? "Miami Stadium"
        : match.home_team === "Argentina"
        ? "Kansas City Stadium"
        : "";
    return w.match_date === match.match_date && w.stadium === matchStadium;
  });
}

function findReferee(match: NextGame, referees: Referee[]): Referee | undefined {
  return referees.find((r) =>
    r.assigned_matches.some((am) => am.includes(match.home_team) && am.includes(match.away_team)),
  );
}

function UpcomingMatchCard({ match, weather, referees }: { match: NextGame; weather: Weather[]; referees: Referee[] }) {
  const w = findWeather(match, weather);
  const ref = findReferee(match, referees);
  return (
    <div className="flex-shrink-0 w-72 relative overflow-hidden rounded-xl border border-emerald-500/30 bg-slate-800/40 hover:border-emerald-500/50 transition-all duration-300">
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-emerald-500/80 to-emerald-500/20" />
      <div className="pl-4 pr-3 py-2.5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">{match.stage}</span>
          <div className="flex items-center gap-1 text-[10px] text-slate-500">
            <Calendar size={10} />
            {match.match_date}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-0.5 flex-1 min-w-0">
            <div className="w-7 h-5 rounded overflow-hidden bg-slate-700/40 border border-slate-600/30 flex-shrink-0">
              {getFlagUrl(match.home_team) ? (
                <img src={getFlagUrl(match.home_team)} alt="" className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px]">🏳️</div>
              )}
            </div>
            <span className="text-[11px] font-medium text-slate-200 truncate max-w-[80px]">{match.home_team}</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
            {match.kickoff_time || "vs"}
          </span>
          <div className="flex flex-col items-center gap-0.5 flex-1 min-w-0">
            <div className="w-7 h-5 rounded overflow-hidden bg-slate-700/40 border border-slate-600/30 flex-shrink-0">
              {getFlagUrl(match.away_team) ? (
                <img src={getFlagUrl(match.away_team)} alt="" className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px]">🏳️</div>
              )}
            </div>
            <span className="text-[11px] font-medium text-slate-200 truncate max-w-[80px]">{match.away_team}</span>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-slate-400 border-t border-slate-700/30 pt-2">
          <span className="flex items-center gap-1">
            <MapPin size={10} />
            {match.stage === "Quarter-finals" && match.home_team === "Spain"
              ? "Los Angeles"
              : match.stage === "Quarter-finals" && match.home_team === "Norway"
              ? "Miami"
              : match.stage === "Quarter-finals" && match.home_team === "Argentina"
              ? "Kansas City"
              : "TBD"}
          </span>
          {ref && (
            <span className="flex items-center gap-1">
              Ref: {ref.name}
            </span>
          )}
        </div>
        {w && (
          <div className="mt-1.5 flex items-center gap-2 text-[10px] bg-slate-700/30 rounded-lg px-2.5 py-1.5">
            <span className="flex items-center gap-1 text-yellow-400">
              <Sun size={10} />
              {w.forecast}
            </span>
            <span className="flex items-center gap-1 text-orange-400">
              <Wind size={10} />
              {w.wind} km/h
            </span>
            <span className="flex items-center gap-1 text-blue-400">
              <Droplets size={10} />
              {w.humidity}%
            </span>
            <span className="text-white font-medium">{w.temperature}&deg;C</span>
          </div>
        )}
        <button className="mt-1.5 w-full flex items-center justify-center gap-1 text-[10px] text-emerald-400/80 hover:text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40 rounded-lg py-1 transition-all duration-200">
          <Bell size={10} />
          <span>Remind Me</span>
        </button>
      </div>
    </div>
  );
}

export default function MatchesHub({ prevGames, nextGames, weather, referees }: Props) {
  const [tab, setTab] = useState<"completed" | "upcoming">("completed");
  return (
    <div className="scroll-panel-wide">
      <div className="flex flex-col h-full px-8">
        <div className="shrink-0 py-4">
          <h2 className="text-2xl font-bold text-white mb-1">Matches Hub</h2>
          <p className="text-sm text-slate-500">
            Completed and upcoming fixtures
          </p>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar py-2">
          <div className="flex gap-1 mb-3 bg-slate-800/60 rounded-lg p-0.5 w-fit border border-slate-700/50">
            <button
              onClick={() => setTab("completed")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                tab === "completed"
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Completed ({prevGames.length})
            </button>
            <button
              onClick={() => setTab("upcoming")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                tab === "upcoming"
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Upcoming ({nextGames.length})
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {tab === "completed"
              ? [...prevGames].reverse().map((m) => <CompletedMatchCard key={m.external_id} match={m} />)
              : nextGames.map((m) => (
                  <UpcomingMatchCard key={m.external_id} match={m} weather={weather} referees={referees} />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
