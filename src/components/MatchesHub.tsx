import { useState } from "react";
import type { PrevGame, NextGame, Weather, Referee } from "../types";
import { Calendar, Clock, MapPin, Sun, Wind, Droplets, ChevronRight, Trophy, Bell } from "lucide-react";
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
    <div className="gsap-fade-in flex-shrink-0 w-64 bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {match.stage}
        </span>
        <span className="text-xs text-slate-500">{match.match_date}</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-6 rounded overflow-hidden bg-slate-700/40 flex-shrink-0">
            {getFlagUrl(match.home_team) ? (
              <img src={getFlagUrl(match.home_team)} alt="" className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs">🏳️</div>
            )}
          </div>
          <span className={`flex-1 text-sm font-medium ${isHomeWinner ? "text-emerald-400" : "text-slate-200"}`}>
            {match.home_team}
          </span>
          <span className={`text-xl font-black ${isHomeWinner && !isDraw ? "text-emerald-400" : "text-white"}`}>
            {match.home_score}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-6 rounded overflow-hidden bg-slate-700/40 flex-shrink-0">
            {getFlagUrl(match.away_team) ? (
              <img src={getFlagUrl(match.away_team)} alt="" className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs">🏳️</div>
            )}
          </div>
          <span className={`flex-1 text-sm font-medium ${!isHomeWinner && !isDraw ? "text-emerald-400" : "text-slate-200"}`}>
            {match.away_team}
          </span>
          <span className={`text-xl font-black ${!isHomeWinner && !isDraw ? "text-emerald-400" : "text-white"}`}>
            {match.away_score}
          </span>
        </div>
      </div>
      {match.winner && !isDraw && (
        <div className="mt-2 flex items-center justify-center gap-1 text-xs text-emerald-400/80 border-t border-slate-700/30 pt-2">
          <Trophy size={12} />
          <span>{match.winner} won</span>
        </div>
      )}
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
    <div className="gsap-fade-in flex-shrink-0 w-72 bg-slate-800/40 border border-emerald-500/30 rounded-xl p-4 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">{match.stage}</span>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Calendar size={12} />
          {match.match_date}
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-6 rounded overflow-hidden bg-slate-700/40 flex-shrink-0">
            {getFlagUrl(match.home_team) ? (
              <img src={getFlagUrl(match.home_team)} alt="" className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs">🏳️</div>
            )}
          </div>
          <span className="flex-1 text-sm font-semibold text-slate-200">{match.home_team}</span>
          <span className="text-sm font-bold text-slate-400 px-2">vs</span>
          <span className="flex-1 text-sm font-semibold text-slate-200 text-right">{match.away_team}</span>
          <div className="w-8 h-6 rounded overflow-hidden bg-slate-700/40 flex-shrink-0">
            {getFlagUrl(match.away_team) ? (
              <img src={getFlagUrl(match.away_team)} alt="" className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs">🏳️</div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400 border-t border-slate-700/30 pt-3">
        {match.kickoff_time && (
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {match.kickoff_time}
          </span>
        )}
        <span className="flex items-center gap-1">
          <MapPin size={12} />
          {match.stage === "Quarter-finals" && match.home_team === "Spain"
            ? "Los Angeles Stadium"
            : match.stage === "Quarter-finals" && match.home_team === "Norway"
            ? "Miami Stadium"
            : match.stage === "Quarter-finals" && match.home_team === "Argentina"
            ? "Kansas City Stadium"
            : "TBD"}
        </span>
        {ref && (
          <span className="flex items-center gap-1">
            <ChevronRight size={12} />
            Ref: {ref.name}
          </span>
        )}
      </div>
      {w && (
        <div className="mt-2 flex items-center gap-3 text-xs bg-slate-700/30 rounded-lg px-3 py-2">
          <span className="flex items-center gap-1 text-yellow-400">
            <Sun size={12} />
            {w.forecast}
          </span>
          <span className="flex items-center gap-1 text-orange-400">
            <Wind size={12} />
            {w.wind} km/h
          </span>
          <span className="flex items-center gap-1 text-blue-400">
            <Droplets size={12} />
            {w.humidity}%
          </span>
          <span className="text-white font-medium">{w.temperature}°C</span>
        </div>
      )}
      <button className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs text-emerald-400/80 hover:text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40 rounded-lg py-1.5 transition-all duration-200">
        <Bell size={12} />
        <span>Remind Me</span>
      </button>
    </div>
  );
}

export default function MatchesHub({ prevGames, nextGames, weather, referees }: Props) {
  const [tab, setTab] = useState<"completed" | "upcoming">("completed");
  return (
    <div>
      <div className="flex gap-1 mb-5 bg-slate-800/60 rounded-xl p-1 w-fit border border-slate-700/50">
        <button
          onClick={() => setTab("completed")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            tab === "completed"
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Completed ({prevGames.length})
        </button>
        <button
          onClick={() => setTab("upcoming")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            tab === "upcoming"
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Upcoming ({nextGames.length})
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto hide-scrollbar py-1">
        {tab === "completed"
          ? [...prevGames]
              .reverse()
              .map((m) => <CompletedMatchCard key={m.external_id} match={m} />)
          : nextGames.map((m) => (
              <UpcomingMatchCard key={m.external_id} match={m} weather={weather} referees={referees} />
            ))}
      </div>
    </div>
  );
}
