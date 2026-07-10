from __future__ import annotations

import datetime as _dt
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field

date = _dt.date
datetime = _dt.datetime


class SyncStatus(str, Enum):
    synced = "synced"
    partial = "partial"
    stale = "stale"
    error = "error"


class TournamentStatus(str, Enum):
    upcoming = "Upcoming"
    ongoing = "Ongoing"
    completed = "Completed"


class Confederation(str, Enum):
    UEFA = "UEFA"
    CONMEBOL = "CONMEBOL"
    CONCACAF = "CONCACAF"
    CAF = "CAF"
    AFC = "AFC"
    OFC = "OFC"


class GroupLetter(str, Enum):
    A = "A"
    B = "B"
    C = "C"
    D = "D"
    E = "E"
    F = "F"
    G = "G"
    H = "H"
    I = "I"
    J = "J"
    K = "K"
    L = "L"


class MatchStage(str, Enum):
    group_stage = "Group stage"
    round_of_32 = "Round of 32"
    round_of_16 = "Round of 16"
    quarter_finals = "Quarter-finals"
    semi_finals = "Semi-finals"
    third_place = "Third place"
    final = "Final"


class MatchStatus(str, Enum):
    upcoming = "Upcoming"
    scheduled = "Scheduled"
    in_progress = "In progress"
    completed = "Completed"


class PlayerPosition(str, Enum):
    goalkeeper = "Goalkeeper"
    defender = "Defender"
    midfielder = "Midfielder"
    forward = "Forward"


class InjuryStatus(str, Enum):
    out = "Out"
    doubtful = "Doubtful"
    available = "Available"


class NewsCategory(str, Enum):
    match_report = "Match Report"
    tournament_news = "Tournament News"
    injury_update = "Injury Update"
    transfer_rumour = "Transfer Rumour"
    bracket_analysis = "Bracket Analysis"


class PitchSurface(str, Enum):
    grass = "Grass"
    artificial = "Artificial"


# ── Metadata ────────────────────────────────────────────────────────


class Metadata(BaseModel):
    generated_at: datetime = Field(description="ISO 8601 timestamp of when the data was generated")
    last_verified_at: datetime = Field(description="ISO 8601 timestamp of when data was last verified")
    data_version: str = Field(description="Semver version string, e.g. 1.0.0")
    sync_status: SyncStatus = Field(description="Data freshness status")
    model: str = Field(description="Name of the model or agent that generated this data")


# ── Tournament ──────────────────────────────────────────────────────


class Tournament(BaseModel):
    external_id: str = Field(description="Unique tournament ID, e.g. fwc_2026")
    name: str = Field(description="Full tournament name")
    year: int = Field(description="Tournament year")
    stage: str = Field(description="Current tournament stage")
    status: TournamentStatus = Field(description="Overall tournament status")
    start_date: date = Field(description="Tournament start date")
    end_date: date = Field(description="Tournament end date")


# ── Groups ──────────────────────────────────────────────────────────


class Group(BaseModel):
    group: GroupLetter = Field(description="Group letter A–L")
    teams: list[str] = Field(description="Exactly 4 team names", min_length=4, max_length=4)


# ── Teams ───────────────────────────────────────────────────────────


class Team(BaseModel):
    external_id: str = Field(description="ISO 3166-1 alpha-3 lowercase code")
    name: str = Field(description="Full team name")
    short_name: str = Field(description="3-letter uppercase short code")
    fifa_code: str = Field(description="FIFA 3-letter code")
    confederation: Confederation = Field(description="FIFA confederation")
    group: GroupLetter = Field(description="Group letter")
    qualified: bool = Field(description="Whether the team is in the tournament")
    eliminated: bool = Field(description="Whether the team has been eliminated")
    ranking: int = Field(description="Current FIFA world ranking", ge=1)
    flag_url: str = Field(description="Flag image URL")


# ── Games ───────────────────────────────────────────────────────────


class PrevGame(BaseModel):
    external_id: str = Field(description="Unique match ID")
    match_number: int = Field(description="Sequential match number (1–104)", ge=1, le=104)
    stage: MatchStage = Field(description="Tournament stage")
    match_date: date = Field(description="Match date")
    status: str = Field(description="Completed or In progress")
    home_team: str = Field(description="Home team name")
    away_team: str = Field(description="Away team name")
    home_score: int = Field(description="Home team final score", ge=0)
    away_score: int = Field(description="Away team final score", ge=0)
    winner: str = Field(description="Winner team name or empty string")


class NextGame(BaseModel):
    external_id: str = Field(description="Unique match ID")
    match_number: int = Field(description="Sequential match number", ge=1, le=104)
    stage: str = Field(description="Tournament stage")
    match_date: date = Field(description="Match date")
    status: str = Field(description="Always Scheduled")
    home_team: str = Field(description="Home team name")
    away_team: str = Field(description="Away team name")
    kickoff_time: Optional[str] = Field(default=None, description="Kickoff time with timezone")


# ── Bracket ─────────────────────────────────────────────────────────


class BracketNode(BaseModel):
    node_id: str = Field(description="Match ID for this bracket node")
    stage: str = Field(description="Bracket stage")
    match_date: date = Field(description="Match date")
    home_team: str = Field(description="Team name or 'Winner Match XX'")
    away_team: str = Field(description="Team name or 'Winner Match XX'")
    home_score: int = Field(description="Home score (0 if not yet played)", ge=0)
    away_score: int = Field(description="Away score (0 if not yet played)", ge=0)
    winner: str = Field(description="Winner name or empty string")
    children: Optional[list["BracketNode"]] = Field(
        default=None,
        description="Exactly 2 child bracket nodes",
    )


# ── Standings ───────────────────────────────────────────────────────


class Standing(BaseModel):
    group: GroupLetter
    team: str
    played: int = Field(ge=0, le=3)
    wins: int = Field(ge=0)
    draws: int = Field(ge=0)
    losses: int = Field(ge=0)
    goals_for: int = Field(ge=0)
    goals_against: int = Field(ge=0)
    goal_difference: int = Field(description="goals_for minus goals_against")
    points: int = Field(ge=0, description="wins * 3 + draws")
    form: str = Field(description="Last up to 3 group matches, e.g. WWW")


# ── Players ─────────────────────────────────────────────────────────


class Player(BaseModel):
    external_id: str = Field(description="Unique player ID")
    name: str = Field(description="Full player name")
    team: str = Field(description="Team name")
    position: PlayerPosition = Field(description="Player position")
    age: int = Field(ge=16, le=45)
    club: str = Field(description="Club team name")
    captain: bool
    shirt_number: int = Field(ge=1, le=99)


class PlayerStatistic(BaseModel):
    player: str
    team: str
    minutes: int = Field(ge=0)
    appearances: int = Field(ge=0)
    goals: int = Field(ge=0)
    assists: int = Field(ge=0)
    shots: int = Field(ge=0)
    passes: int = Field(ge=0)
    tackles: int = Field(ge=0)
    saves: int = Field(ge=0)
    clean_sheets: int = Field(ge=0)
    yellow_cards: int = Field(ge=0)
    red_cards: int = Field(ge=0)


class TopScorer(BaseModel):
    player: str
    team: str
    goals: int = Field(ge=1)
    matches: int = Field(ge=1)
    minutes: int = Field(ge=1)


class TopAssist(BaseModel):
    player: str
    team: str
    assists: int = Field(ge=1)
    matches: int = Field(ge=1)


# ── Injuries & Suspensions ──────────────────────────────────────────


class Injury(BaseModel):
    player: str
    team: str
    injury: str = Field(description="Description of the injury")
    status: InjuryStatus = Field(description="Player availability status")
    expected_return: date = Field(description="Expected return date")


class Suspension(BaseModel):
    player: str
    team: str
    reason: str = Field(description="Reason for suspension")
    matches_remaining: int = Field(ge=1, description="Number of matches remaining")


# ── Venues ──────────────────────────────────────────────────────────


class Stadium(BaseModel):
    external_id: str = Field(description="Unique stadium ID")
    name: str = Field(description="Stadium name")
    city: str = Field(description="City name")
    country: str = Field(description="Country name")
    capacity: int = Field(ge=10000, description="Seating capacity")
    surface: PitchSurface = Field(description="Pitch surface type")
    opened: int = Field(description="Year the stadium opened")
    image: str = Field(description="Stadium image URL")
    latitude: float = Field(description="Latitude coordinate")
    longitude: float = Field(description="Longitude coordinate")


class HostCity(BaseModel):
    city: str
    country: str
    stadiums: list[str] = Field(description="Stadium names in this city")
    next_match: str = Field(description="Next match description")


class Weather(BaseModel):
    city: str
    stadium: str
    match_date: date
    temperature: float = Field(description="Temperature in Celsius")
    humidity: float = Field(description="Humidity percentage")
    wind: float = Field(description="Wind speed in km/h")
    forecast: str = Field(description="Text forecast")


# ── Referees ────────────────────────────────────────────────────────


class Referee(BaseModel):
    name: str = Field(description="Referee full name")
    country: str = Field(description="Referee nationality")
    assigned_matches: list[str] = Field(description="List of assigned matches")


# ── News ────────────────────────────────────────────────────────────


class NewsItem(BaseModel):
    title: str = Field(description="News headline")
    summary: str = Field(description="2–3 sentence summary")
    published_at: datetime = Field(description="ISO 8601 publish timestamp")
    source_name: str = Field(description="Source publication name")
    source_url: str = Field(description="Source article URL")
    category: NewsCategory = Field(description="News category")


# ── Statistics ──────────────────────────────────────────────────────


class TournamentStatistics(BaseModel):
    total_matches: int = Field(description="Total matches in the tournament (104)")
    completed_matches: int = Field(description="Matches played so far")
    remaining_matches: int = Field(description="Matches left to play")
    total_goals: int = Field(ge=0, description="Total goals scored")
    average_goals: float = Field(description="Goals per match average")
    total_attendance: int = Field(ge=0, description="Cumulative attendance")
    clean_sheets: int = Field(ge=0)
    penalties: int = Field(ge=0, description="Penalty kicks awarded")
    red_cards: int = Field(ge=0)
    yellow_cards: int = Field(ge=0)


# ── Sources ─────────────────────────────────────────────────────────


class Source(BaseModel):
    name: str = Field(description="Source name")
    url: str = Field(description="Source URL")
    retrieved_at: datetime = Field(description="ISO 8601 timestamp")


# ── Root ────────────────────────────────────────────────────────────


class WorldCupData(BaseModel):
    metadata: Metadata
    tournament: Tournament
    groups: list[Group]
    teams: list[Team]
    prev_games: list[PrevGame]
    next_games: list[NextGame]
    tournament_bracket_tree: BracketNode
    standings: list[Standing]
    players: list[Player]
    player_statistics: list[PlayerStatistic]
    top_scorers: list[TopScorer]
    top_assists: list[TopAssist]
    injuries: list[Injury]
    suspensions: list[Suspension]
    stadiums: list[Stadium]
    host_cities: list[HostCity]
    weather: list[Weather]
    referees: list[Referee]
    news: list[NewsItem]
    statistics: TournamentStatistics
    sources: list[Source]
