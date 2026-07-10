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
    <div className="flex-shrink-0 w-72 scroll-snap-start relative overflow-hidden rounded-xl border border-charcoal-600 bg-charcoal-800 hover:bg-charcoal-700 transition-all duration-300">
      <div className="pl-4 pr-3 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/35">{match.stage}</span>
          <span className="text-[10px] text-white/25">{match.match_date}</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-5 rounded overflow-hidden bg-charcoal-700 flex-shrink-0 border border-charcoal-600/50">
              {getFlagUrl(match.home_team) ? (
                <img src={getFlagUrl(match.home_team)} alt="" className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px]">🏳️</div>
              )}
            </div>
            <span className={`flex-1 text-sm font-semibold truncate ${isHomeWinner ? "text-gold" : "text-white/80"}`}>
              {match.home_team}
            </span>
            <span className={`text-base font-black ${isHomeWinner && !isDraw ? "text-gold" : "text-white"}`}>
              {match.home_score}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-5 rounded overflow-hidden bg-charcoal-700 flex-shrink-0 border border-charcoal-600/50">
              {getFlagUrl(match.away_team) ? (
                <img src={getFlagUrl(match.away_team)} alt="" className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px]">🏳️</div>
              )}
            </div>
            <span className={`flex-1 text-sm font-semibold truncate ${!isHomeWinner && !isDraw ? "text-gold" : "text-white/80"}`}>
              {match.away_team}
            </span>
            <span className={`text-base font-black ${!isHomeWinner && !isDraw ? "text-gold" : "text-white"}`}>
              {match.away_score}
            </span>
          </div>
        </div>
        {match.winner && !isDraw && (
          <div className="mt-2 flex items-center justify-center gap-1 border-t border-charcoal-600 pt-2">
            <Trophy size={10} className="text-gold/60" />
            <span className="text-[10px] text-gold/60">{match.winner} won</span>
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
    <div className="flex-shrink-0 w-72 scroll-snap-start relative overflow-hidden rounded-xl border border-gold/20 bg-charcoal-800 hover:border-gold/40 transition-all duration-300">
      <div className="pl-4 pr-3 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gold">{match.stage}</span>
          <div className="flex items-center gap-1 text-[10px] text-white/25">
            <Calendar size={10} />
            {match.match_date}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-0.5 flex-1 min-w-0">
            <div className="w-7 h-5 rounded overflow-hidden bg-charcoal-700 border border-charcoal-600/50 flex-shrink-0">
              {getFlagUrl(match.home_team) ? (
                <img src={getFlagUrl(match.home_team)} alt="" className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px]">🏳️</div>
              )}
            </div>
            <span className="text-[11px] font-medium text-white/70 truncate max-w-[80px]">{match.home_team}</span>
          </div>
          <span className="text-[11px] font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-full border border-gold/20 shrink-0">
            {match.kickoff_time || "vs"}
          </span>
          <div className="flex flex-col items-center gap-0.5 flex-1 min-w-0">
            <div className="w-7 h-5 rounded overflow-hidden bg-charcoal-700 border border-charcoal-600/50 flex-shrink-0">
              {getFlagUrl(match.away_team) ? (
                <img src={getFlagUrl(match.away_team)} alt="" className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px]">🏳️</div>
              )}
            </div>
            <span className="text-[11px] font-medium text-white/70 truncate max-w-[80px]">{match.away_team}</span>
          </div>
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[10px] text-white/35 border-t border-charcoal-600 pt-2">
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
          <div className="mt-2 flex items-center gap-2 text-[10px] bg-charcoal-700 rounded-lg px-2.5 py-1.5">
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
        <button className="mt-2 w-full flex items-center justify-center gap-1 text-[10px] text-gold/60 hover:text-gold border border-gold/20 hover:border-gold/40 rounded-lg py-1 transition-all duration-200">
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
      <div className="flex flex-col h-full px-10">
        <div className="shrink-0 py-5">
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-1">Matches Hub</h2>
          <p className="text-sm text-white/30">
            Completed and upcoming fixtures
          </p>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar py-2">
          <div className="flex gap-1 mb-4 bg-charcoal-700 rounded-lg p-0.5 w-fit border border-charcoal-600">
            <button
              onClick={() => setTab("completed")}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                tab === "completed"
                  ? "bg-gold text-charcoal-950 shadow-lg shadow-gold/20"
                  : "text-white/40 hover:text-white"
              }`}
            >
              Completed ({prevGames.length})
            </button>
            <button
              onClick={() => setTab("upcoming")}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                tab === "upcoming"
                  ? "bg-gold text-charcoal-950 shadow-lg shadow-gold/20"
                  : "text-white/40 hover:text-white"
              }`}
            >
              Upcoming ({nextGames.length})
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar scroll-snap-x pb-2">
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
