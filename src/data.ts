import type { WorldCupData } from './types';

const data: WorldCupData = {
  "metadata": {
    "generated_at": "2026-07-10T11:45:00Z",
    "last_verified_at": "2026-07-10T11:45:00Z",
    "data_version": "1.0.0",
    "sync_status": "synced",
    "model": "Gemini Real-Time Extraction Agent"
  },
  "tournament": {
    "external_id": "fwc_2026",
    "name": "FIFA World Cup",
    "year": 2026,
    "stage": "Quarter-finals",
    "status": "Ongoing",
    "start_date": "2026-06-11",
    "end_date": "2026-07-19"
  },
  "groups": [
    { "group": "A", "teams": ["Mexico", "South Africa", "South Korea", "Czechia"] },
    { "group": "B", "teams": ["Canada", "Bosnia and Herzegovina", "Qatar", "Switzerland"] },
    { "group": "C", "teams": ["Brazil", "Morocco", "Haiti", "Scotland"] },
    { "group": "D", "teams": ["United States", "Paraguay", "Australia", "Türkiye"] },
    { "group": "E", "teams": ["Germany", "Curaçao", "Ivory Coast", "Ecuador"] },
    { "group": "F", "teams": ["Netherlands", "Japan", "Sweden", "Tunisia"] },
    { "group": "G", "teams": ["Belgium", "Egypt", "Iran", "New Zealand"] },
    { "group": "H", "teams": ["Spain", "Cape Verde", "Saudi Arabia", "Uruguay"] },
    { "group": "I", "teams": ["France", "Senegal", "Iraq", "Norway"] },
    { "group": "J", "teams": ["Argentina", "Algeria", "Austria", "Jordan"] },
    { "group": "K", "teams": ["Portugal", "Congo DR", "Colombia", "Uzbekistan"] },
    { "group": "L", "teams": ["England", "Croatia", "Panama", "Ghana"] }
  ],
  "teams": [
    { "external_id": "fra", "name": "France", "short_name": "FRA", "fifa_code": "FRA", "confederation": "UEFA", "group": "I", "qualified": true, "eliminated": false, "ranking": 2, "flag_url": "https://example.com/flags/fra.png" },
    { "external_id": "mar", "name": "Morocco", "short_name": "MAR", "fifa_code": "MAR", "confederation": "CAF", "group": "C", "qualified": true, "eliminated": true, "ranking": 13, "flag_url": "https://example.com/flags/mar.png" },
    { "external_id": "esp", "name": "Spain", "short_name": "ESP", "fifa_code": "ESP", "confederation": "UEFA", "group": "H", "qualified": true, "eliminated": false, "ranking": 3, "flag_url": "https://example.com/flags/esp.png" },
    { "external_id": "bel", "name": "Belgium", "short_name": "BEL", "fifa_code": "BEL", "confederation": "UEFA", "group": "G", "qualified": true, "eliminated": false, "ranking": 6, "flag_url": "https://example.com/flags/bel.png" },
    { "external_id": "nor", "name": "Norway", "short_name": "NOR", "fifa_code": "NOR", "confederation": "UEFA", "group": "I", "qualified": true, "eliminated": false, "ranking": 44, "flag_url": "https://example.com/flags/nor.png" },
    { "external_id": "eng", "name": "England", "short_name": "ENG", "fifa_code": "ENG", "confederation": "UEFA", "group": "L", "qualified": true, "eliminated": false, "ranking": 4, "flag_url": "https://example.com/flags/eng.png" },
    { "external_id": "arg", "name": "Argentina", "short_name": "ARG", "fifa_code": "ARG", "confederation": "CONMEBOL", "group": "J", "qualified": true, "eliminated": false, "ranking": 1, "flag_url": "https://example.com/flags/arg.png" },
    { "external_id": "sui", "name": "Switzerland", "short_name": "SUI", "fifa_code": "SUI", "confederation": "UEFA", "group": "B", "qualified": true, "eliminated": false, "ranking": 19, "flag_url": "https://example.com/flags/sui.png" }
  ],
  "prev_games": [
    { "external_id": "match_89", "match_number": 89, "stage": "Round of 16", "match_date": "2026-07-04", "status": "Completed", "home_team": "Paraguay", "away_team": "France", "home_score": 0, "away_score": 1, "winner": "France" },
    { "external_id": "match_90", "match_number": 90, "stage": "Round of 16", "match_date": "2026-07-04", "status": "Completed", "home_team": "Canada", "away_team": "Morocco", "home_score": 0, "away_score": 3, "winner": "Morocco" },
    { "external_id": "match_91", "match_number": 91, "stage": "Round of 16", "match_date": "2026-07-05", "status": "Completed", "home_team": "Brazil", "away_team": "Norway", "home_score": 1, "away_score": 2, "winner": "Norway" },
    { "external_id": "match_92", "match_number": 92, "stage": "Round of 16", "match_date": "2026-07-05", "status": "Completed", "home_team": "Mexico", "away_team": "England", "home_score": 2, "away_score": 3, "winner": "England" },
    { "external_id": "match_93", "match_number": 93, "stage": "Round of 16", "match_date": "2026-07-06", "status": "Completed", "home_team": "Portugal", "away_team": "Spain", "home_score": 0, "away_score": 1, "winner": "Spain" },
    { "external_id": "match_94", "match_number": 94, "stage": "Round of 16", "match_date": "2026-07-06", "status": "Completed", "home_team": "United States", "away_team": "Belgium", "home_score": 1, "away_score": 4, "winner": "Belgium" },
    { "external_id": "match_95", "match_number": 95, "stage": "Round of 16", "match_date": "2026-07-07", "status": "Completed", "home_team": "Argentina", "away_team": "Egypt", "home_score": 3, "away_score": 2, "winner": "Argentina" },
    { "external_id": "match_96", "match_number": 96, "stage": "Round of 16", "match_date": "2026-07-07", "status": "Completed", "home_team": "Switzerland", "away_team": "Colombia", "home_score": 0, "away_score": 0, "winner": "Switzerland" },
    { "external_id": "match_97", "match_number": 97, "stage": "Quarter-finals", "match_date": "2026-07-09", "status": "Completed", "home_team": "France", "away_team": "Morocco", "home_score": 2, "away_score": 0, "winner": "France" }
  ],
  "next_games": [
    { "external_id": "match_98", "match_number": 98, "stage": "Quarter-finals", "match_date": "2026-07-10", "status": "Scheduled", "home_team": "Spain", "away_team": "Belgium", "kickoff_time": "15:00 ET" },
    { "external_id": "match_99", "match_number": 99, "stage": "Quarter-finals", "match_date": "2026-07-11", "status": "Scheduled", "home_team": "Norway", "away_team": "England", "kickoff_time": "17:00 ET" },
    { "external_id": "match_100", "match_number": 100, "stage": "Quarter-finals", "match_date": "2026-07-11", "status": "Scheduled", "home_team": "Argentina", "away_team": "Switzerland", "kickoff_time": "21:00 ET" }
  ],
  "tournament_bracket_tree": {
    "node_id": "match_104", "stage": "Final", "match_date": "2026-07-19", "home_team": "Winner Match 101", "away_team": "Winner Match 102", "home_score": 0, "away_score": 0, "winner": "",
    "children": [
      {
        "node_id": "match_101", "stage": "Semi-finals", "match_date": "2026-07-14", "home_team": "France", "away_team": "Winner Match 98", "home_score": 0, "away_score": 0, "winner": "",
        "children": [
          {
            "node_id": "match_97", "stage": "Quarter-finals", "match_date": "2026-07-09", "home_team": "France", "away_team": "Morocco", "home_score": 2, "away_score": 0, "winner": "France",
            "children": [
              { "node_id": "match_89", "stage": "Round of 16", "match_date": "2026-07-04", "home_team": "Paraguay", "away_team": "France", "home_score": 0, "away_score": 1, "winner": "France" },
              { "node_id": "match_90", "stage": "Round of 16", "match_date": "2026-07-04", "home_team": "Canada", "away_team": "Morocco", "home_score": 0, "away_score": 3, "winner": "Morocco" }
            ]
          },
          {
            "node_id": "match_98", "stage": "Quarter-finals", "match_date": "2026-07-10", "home_team": "Spain", "away_team": "Belgium", "home_score": 0, "away_score": 0, "winner": "",
            "children": [
              { "node_id": "match_93", "stage": "Round of 16", "match_date": "2026-07-06", "home_team": "Portugal", "away_team": "Spain", "home_score": 0, "away_score": 1, "winner": "Spain" },
              { "node_id": "match_94", "stage": "Round of 16", "match_date": "2026-07-06", "home_team": "United States", "away_team": "Belgium", "home_score": 1, "away_score": 4, "winner": "Belgium" }
            ]
          }
        ]
      },
      {
        "node_id": "match_102", "stage": "Semi-finals", "match_date": "2026-07-15", "home_team": "Winner Match 99", "away_team": "Winner Match 100", "home_score": 0, "away_score": 0, "winner": "",
        "children": [
          {
            "node_id": "match_99", "stage": "Quarter-finals", "match_date": "2026-07-11", "home_team": "Norway", "away_team": "England", "home_score": 0, "away_score": 0, "winner": "",
            "children": [
              { "node_id": "match_91", "stage": "Round of 16", "match_date": "2026-07-05", "home_team": "Brazil", "away_team": "Norway", "home_score": 1, "away_score": 2, "winner": "Norway" },
              { "node_id": "match_92", "stage": "Round of 16", "match_date": "2026-07-05", "home_team": "Mexico", "away_team": "England", "home_score": 2, "away_score": 3, "winner": "England" }
            ]
          },
          {
            "node_id": "match_100", "stage": "Quarter-finals", "match_date": "2026-07-11", "home_team": "Argentina", "away_team": "Switzerland", "home_score": 0, "away_score": 0, "winner": "",
            "children": [
              { "node_id": "match_95", "stage": "Round of 16", "match_date": "2026-07-07", "home_team": "Argentina", "away_team": "Egypt", "home_score": 3, "away_score": 2, "winner": "Argentina" },
              { "node_id": "match_96", "stage": "Round of 16", "match_date": "2026-07-07", "home_team": "Switzerland", "away_team": "Colombia", "home_score": 0, "away_score": 0, "winner": "Switzerland" }
            ]
          }
        ]
      }
    ]
  },
  "standings": [
    { "group": "I", "team": "France", "played": 3, "wins": 3, "draws": 0, "losses": 0, "goals_for": 6, "goals_against": 2, "goal_difference": 4, "points": 9, "form": "WWW" },
    { "group": "I", "team": "Norway", "played": 3, "wins": 2, "draws": 0, "losses": 1, "goals_for": 5, "goals_against": 3, "goal_difference": 2, "points": 6, "form": "LWW" },
    { "group": "J", "team": "Argentina", "played": 3, "wins": 3, "draws": 0, "losses": 0, "goals_for": 8, "goals_against": 1, "goal_difference": 7, "points": 9, "form": "WWW" },
    { "group": "G", "team": "Belgium", "played": 3, "wins": 1, "draws": 2, "losses": 0, "goals_for": 7, "goals_against": 3, "goal_difference": 4, "points": 5, "form": "DDW" }
  ],
  "players": [
    { "external_id": "player_messi", "name": "Lionel Messi", "team": "Argentina", "position": "Midfielder", "age": 39, "club": "Inter Miami CF", "captain": true, "shirt_number": 10 },
    { "external_id": "player_mbappe", "name": "Kylian Mbappé", "team": "France", "position": "Forward", "age": 27, "club": "Real Madrid", "captain": true, "shirt_number": 10 },
    { "external_id": "player_haaland", "name": "Erling Haaland", "team": "Norway", "position": "Forward", "age": 25, "club": "Manchester City", "captain": false, "shirt_number": 9 },
    { "external_id": "player_kane", "name": "Harry Kane", "team": "England", "position": "Forward", "age": 32, "club": "Bayern Munich", "captain": true, "shirt_number": 9 }
  ],
  "player_statistics": [
    { "player": "Kylian Mbappé", "team": "France", "minutes": 430, "appearances": 5, "goals": 8, "assists": 2, "shots": 22, "passes": 140, "tackles": 2, "saves": 0, "clean_sheets": 0, "yellow_cards": 0, "red_cards": 0 },
    { "player": "Lionel Messi", "team": "Argentina", "minutes": 390, "appearances": 4, "goals": 8, "assists": 1, "shots": 18, "passes": 165, "tackles": 1, "saves": 0, "clean_sheets": 0, "yellow_cards": 0, "red_cards": 0 }
  ],
  "top_scorers": [
    { "player": "Kylian Mbappé", "team": "France", "goals": 8, "matches": 5, "minutes": 430 },
    { "player": "Lionel Messi", "team": "Argentina", "goals": 8, "matches": 4, "minutes": 390 },
    { "player": "Erling Haaland", "team": "Norway", "goals": 7, "matches": 4, "minutes": 360 },
    { "player": "Harry Kane", "team": "England", "goals": 6, "matches": 4, "minutes": 360 }
  ],
  "top_assists": [
    { "player": "Michael Olise", "team": "France", "assists": 5, "matches": 5 },
    { "player": "Brahim Díaz", "team": "Morocco", "assists": 4, "matches": 5 },
    { "player": "Bruno Guimarães", "team": "Brazil", "assists": 4, "matches": 5 },
    { "player": "Martin Ødegaard", "team": "Norway", "assists": 3, "matches": 4 }
  ],
  "injuries": [
    { "player": "Kylian Mbappé", "team": "France", "injury": "Minor ankle injury", "status": "Doubtful", "expected_return": "2026-07-14" },
    { "player": "Marc Guéhi", "team": "England", "injury": "Minor hamstring injury", "status": "Doubtful", "expected_return": "2026-07-11" },
    { "player": "Nico Williams", "team": "Spain", "injury": "Groin problem", "status": "Doubtful", "expected_return": "2026-07-10" }
  ],
  "suspensions": [
    { "player": "Jarell Quansah", "team": "England", "reason": "Red card vs Mexico (serious foul play)", "matches_remaining": 2 }
  ],
  "stadiums": [
    { "external_id": "los_angeles_stadium", "name": "Los Angeles Stadium", "city": "Inglewood", "country": "United States", "capacity": 70000, "surface": "Artificial", "opened": 2020, "image": "https://example.com/stadiums/sofi.png", "latitude": 33.9534, "longitude": -118.339 },
    { "external_id": "boston_stadium", "name": "Boston Stadium", "city": "Foxborough", "country": "United States", "capacity": 65878, "surface": "Artificial", "opened": 2002, "image": "https://example.com/stadiums/gillette.png", "latitude": 42.0909, "longitude": -71.2643 },
    { "external_id": "miami_stadium", "name": "Miami Stadium", "city": "Miami Gardens", "country": "United States", "capacity": 64767, "surface": "Grass", "opened": 1987, "image": "https://example.com/stadiums/hardrock.png", "latitude": 25.958, "longitude": -80.2389 },
    { "external_id": "kansas_city_stadium", "name": "Kansas City Stadium", "city": "Kansas City", "country": "United States", "capacity": 76416, "surface": "Grass", "opened": 1972, "image": "https://example.com/stadiums/arrowhead.png", "latitude": 39.0489, "longitude": -94.484 }
  ],
  "host_cities": [
    { "city": "Inglewood", "country": "United States", "stadiums": ["Los Angeles Stadium"], "next_match": "Spain vs Belgium (Quarter-finals)" },
    { "city": "Miami Gardens", "country": "United States", "stadiums": ["Miami Stadium"], "next_match": "Norway vs England (Quarter-finals)" },
    { "city": "Kansas City", "country": "United States", "stadiums": ["Kansas City Stadium"], "next_match": "Argentina vs Switzerland (Quarter-finals)" }
  ],
  "weather": [
    { "city": "Inglewood", "stadium": "Los Angeles Stadium", "match_date": "2026-07-10", "temperature": 29.0, "humidity": 60.0, "wind": 10.0, "forecast": "Sunny" },
    { "city": "Miami Gardens", "stadium": "Miami Stadium", "match_date": "2026-07-11", "temperature": 34.0, "humidity": 75.0, "wind": 12.0, "forecast": "Hot and humid" },
    { "city": "Kansas City", "stadium": "Kansas City Stadium", "match_date": "2026-07-11", "temperature": 32.0, "humidity": 65.0, "wind": 8.0, "forecast": "Clear and warm" }
  ],
  "referees": [
    { "name": "Michael Oliver", "country": "England", "assigned_matches": ["Spain vs Belgium"] },
    { "name": "Clément Turpin", "country": "France", "assigned_matches": ["Norway vs England"] },
    { "name": "João Pinheiro", "country": "Portugal", "assigned_matches": ["Argentina vs Switzerland"] },
    { "name": "César Ramos", "country": "Mexico", "assigned_matches": ["France vs Morocco"] }
  ],
  "news": [
    { "title": "France 2-0 Morocco: Mbappe and Dembélé seal semifinal spot", "summary": "France advanced to their third consecutive World Cup semifinal with a 2-0 victory over Morocco, thanks to goals from Kylian Mbappé and Ousmane Dembélé.", "published_at": "2026-07-09T23:30:00Z", "source_name": "Al Jazeera", "source_url": "https://www.aljazeera.com/sports/2026/7/9/france-2-0-morocco-fifa-world-cup-2026-quarterfinal-live", "category": "Match Report" },
    { "title": "Michael Oliver appointed to referee Spain vs Belgium quarterfinal", "summary": "English referee Michael Oliver has been assigned to oversee the highly anticipated quarterfinal clash between Spain and Belgium in Los Angeles.", "published_at": "2026-07-10T10:00:00Z", "source_name": "FIFA Match Centre", "source_url": "https://www.fifa.com", "category": "Tournament News" }
  ],
  "statistics": {
    "total_matches": 104,
    "completed_matches": 97,
    "remaining_matches": 7,
    "total_goals": 282,
    "average_goals": 2.91,
    "total_attendance": 6323395,
    "clean_sheets": 45,
    "penalties": 12,
    "red_cards": 5,
    "yellow_cards": 180
  },
  "sources": [
    { "name": "FIFA Official Website", "url": "https://www.fifa.com", "retrieved_at": "2026-07-10T11:45:00Z" },
    { "name": "Al Jazeera Sports", "url": "https://www.aljazeera.com", "retrieved_at": "2026-07-10T11:45:00Z" }
  ]
};

export default data;
