export interface Metadata {
  generated_at: string;
  last_verified_at: string;
  data_version: string;
  sync_status: string;
  model: string;
}

export interface Tournament {
  external_id: string;
  name: string;
  year: number;
  stage: string;
  status: string;
  start_date: string;
  end_date: string;
}

export interface Group {
  group: string;
  teams: string[];
}

export interface Team {
  external_id: string;
  name: string;
  short_name: string;
  fifa_code: string;
  confederation: string;
  group: string;
  qualified: boolean;
  eliminated: boolean;
  ranking: number;
  flag_url: string;
}

export interface PrevGame {
  external_id: string;
  match_number: number;
  stage: string;
  match_date: string;
  status: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  winner: string;
}

export interface NextGame {
  external_id: string;
  match_number: number;
  stage: string;
  match_date: string;
  status: string;
  home_team: string;
  away_team: string;
  kickoff_time?: string;
}

export interface BracketNode {
  node_id: string;
  stage: string;
  match_date: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  winner: string;
  children?: BracketNode[];
}

export interface Standing {
  group: string;
  team: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
  form: string;
}

export interface Player {
  external_id: string;
  name: string;
  team: string;
  position: string;
  age: number;
  club: string;
  captain: boolean;
  shirt_number: number;
}

export interface PlayerStatistic {
  player: string;
  team: string;
  minutes: number;
  appearances: number;
  goals: number;
  assists: number;
  shots: number;
  passes: number;
  tackles: number;
  saves: number;
  clean_sheets: number;
  yellow_cards: number;
  red_cards: number;
}

export interface TopScorer {
  player: string;
  team: string;
  goals: number;
  matches: number;
  minutes: number;
}

export interface TopAssist {
  player: string;
  team: string;
  assists: number;
  matches: number;
}

export interface Injury {
  player: string;
  team: string;
  injury: string;
  status: string;
  expected_return: string;
}

export interface Suspension {
  player: string;
  team: string;
  reason: string;
  matches_remaining: number;
}

export interface Stadium {
  external_id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  surface: string;
  opened: number;
  image: string;
  latitude: number;
  longitude: number;
}

export interface HostCity {
  city: string;
  country: string;
  stadiums: string[];
  next_match: string;
}

export interface Weather {
  city: string;
  stadium: string;
  match_date: string;
  temperature: number;
  humidity: number;
  wind: number;
  forecast: string;
}

export interface Referee {
  name: string;
  country: string;
  assigned_matches: string[];
}

export interface NewsItem {
  title: string;
  summary: string;
  published_at: string;
  source_name: string;
  source_url: string;
  category: string;
}

export interface TournamentStatistics {
  total_matches: number;
  completed_matches: number;
  remaining_matches: number;
  total_goals: number;
  average_goals: number;
  total_attendance: number;
  clean_sheets: number;
  penalties: number;
  red_cards: number;
  yellow_cards: number;
}

export interface Source {
  name: string;
  url: string;
  retrieved_at: string;
}

export interface WorldCupData {
  metadata: Metadata;
  tournament: Tournament;
  groups: Group[];
  teams: Team[];
  prev_games: PrevGame[];
  next_games: NextGame[];
  tournament_bracket_tree: BracketNode;
  standings: Standing[];
  players: Player[];
  player_statistics: PlayerStatistic[];
  top_scorers: TopScorer[];
  top_assists: TopAssist[];
  injuries: Injury[];
  suspensions: Suspension[];
  stadiums: Stadium[];
  host_cities: HostCity[];
  weather: Weather[];
  referees: Referee[];
  news: NewsItem[];
  statistics: TournamentStatistics;
  sources: Source[];
}
