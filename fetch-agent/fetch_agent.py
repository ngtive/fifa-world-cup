#!/usr/bin/env python3
"""
FIFA World Cup 2026 — Fetch Agent

Two-step pipeline:
  Step 1: Gemini + Google Search grounding → raw tournament data
  Step 2: Gemini + structured output → validated JSON matching WorldCupData schema

Usage:
  python fetch_agent.py

Requires:
  GEMINI_API_KEY in environment or .env file
"""

from __future__ import annotations

import json
import os
import sys
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types
from google.genai.errors import ClientError

from models import WorldCupData

# ── Config ──────────────────────────────────────────────────────────

MODEL = "gemini-3.5-flash"
OUTPUT_DIR = Path(__file__).parent / "output"
OUTPUT_FILE = OUTPUT_DIR / "worldcup_data.json"
MAX_OUTPUT_TOKENS = 65536

# ── Prompts ─────────────────────────────────────────────────────────

GROUNDING_PROMPT = """\
You are a FIFA World Cup 2026 data analyst. Search the web for the CURRENT state of the \
2026 FIFA World Cup tournament.

Gather ALL of the following data and return it as structured text with clear section headers:

1. TOURNAMENT STATUS: Current stage (group stage / round of 32 / round of 16 / quarter-finals / \
semi-finals / final), start/end dates, overall status.

2. GROUPS: All 12 groups (A–L) with their 4 teams each.

3. TEAMS: For every qualified team — full name, 3-letter code, confederation, group, FIFA ranking, \
whether eliminated, flag URL from flagcdn.com (format: https://flagcdn.com/w80/{iso}.png using \
lowercase ISO 3166-1 alpha-2).

4. COMPLETED MATCHES: All matches played so far — match number, stage, date, home/away teams, \
scores, winner.

5. UPCOMING MATCHES: Next scheduled matches — match number, stage, date, kickoff time.

6. BRACKET: The full knockout bracket tree from Round of 16 → Quarter-finals → Semi-finals → Final \
with match feeders (which R16 matches feed into which QF, etc.).

7. STANDINGS: Group standings for every team — played, wins, draws, losses, goals for, goals \
against, goal difference, points, recent form (W/D/L).

8. PLAYERS: Notable players (captains + stars) from remaining teams — name, team, position, age, \
club, shirt number.

9. PLAYER STATISTICS: Goals, assists, minutes, appearances for top performers.

10. TOP SCORERS: Golden Boot race — player, team, goals, matches, minutes.

11. TOP ASSISTS: Player, team, assists, matches.

12. INJURIES: Known injuries — player, team, injury description, status (Out/Doubtful/Available), \
expected return date.

13. SUSPENSIONS: Suspended players — player, team, reason, matches remaining.

14. STADIUMS: All venues — name, city, country, capacity, surface, year opened, coordinates.

15. HOST CITIES: Cities with their next scheduled match.

16. WEATHER: Forecast for upcoming match venues — temperature, humidity, wind, forecast text.

17. REFEREES: Assigned referees for upcoming matches.

18. NEWS: Latest 5–10 tournament news items with title, summary, source, URL, category.

19. STATISTICS: Aggregate tournament stats — total matches, completed, remaining, total goals, \
average goals, total attendance, clean sheets, penalties, red/yellow cards.

20. SOURCES: List all sources you retrieved data from with name, URL, retrieval timestamp.

Be as comprehensive and accurate as possible. Use the most current data available.
"""

STRUCTURED_PROMPT_TEMPLATE = """\
You are given raw FIFA World Cup 2026 tournament data below. Convert it into a valid JSON \
object that matches the WorldCupData schema exactly.

RULES:
- Every field in the schema must be present. Use empty arrays [] or reasonable defaults for \
missing data.
- Team names in games/standings MUST match names in the teams array.
- Group letters must be A–L. Each group has exactly 4 teams.
- Match numbers must be sequential (1–104). Group stage: 1–96, R32: 97–112 (if applicable), \
R16: 113–120 (or 97–104 without R32), QF: 121–124 (or 105–108), SF: 101–102, 3rd: 103, \
Final: 104.
- For the 2026 World Cup (48 teams, 12 groups): Group stage has 48 teams in 12 groups (A–L), \
each team plays 3 matches. Top 2 per group (24) + 8 best 3rd-place teams advance to Round of 32. \
Then R16 → QF → SF → Final.
- The bracket tree must be a single recursive tree: Final → 2 Semi-finals → 4 Quarter-finals → \
8 Round of 16 (or R32 if applicable).
- Flag URLs should use flagcdn.com: https://flagcdn.com/w80/{iso_code}.png where iso_code is \
lowercase ISO 3166-1 alpha-2.
- Dates must be YYYY-MM-DD. Datetimes must be ISO 8601.
- The metadata.model field should be "Gemini 2.5 Flash + Google Search Grounding".
- Set metadata.generated_at and metadata.last_verified_at to the current UTC timestamp.

RAW DATA:
{raw_data}
"""

# ── Helpers ─────────────────────────────────────────────────────────


def get_retry_after(err: ClientError) -> int | None:
    """Extract recommended wait seconds from a 429 error."""
    # Check Retry-After header
    if hasattr(err, "response") and err.response is not None:
        val = err.response.headers.get("Retry-After")
        if val is not None:
            try:
                return int(val)
            except ValueError:
                pass
    # Check error details from the API response body
    try:
        body = err.response.json()
        for detail in (body.get("error") or body).get("details", []):
            delay = detail.get("retryDelay") or detail.get("retry_delay")
            if delay:
                import re
                match = re.search(r"(\d+)s", str(delay))
                if match:
                    return int(match.group(1))
    except Exception:
        pass
    return None


def get_api_key() -> str:
    load_dotenv()
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        print("Error: GEMINI_API_KEY not set.", file=sys.stderr)
        print("Set it in your environment or create fetch-agent/.env with:", file=sys.stderr)
        print("  GEMINI_API_KEY=your_api_key_here", file=sys.stderr)
        sys.exit(1)
    return key


def step1_grounding(client: genai.Client) -> str:
    """Step 1: Use Gemini + Google Search to fetch real-time tournament data."""
    print("[Step 1/2] Fetching live data via Google Search grounding...")

    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=GROUNDING_PROMPT,
            config=types.GenerateContentConfig(
                tools=[types.Tool(google_search=types.GoogleSearch())],
                temperature=0.2,
                max_output_tokens=MAX_OUTPUT_TOKENS,
            ),
        )
    except ClientError as e:
        if e.code == 429:
            wait = get_retry_after(e) or 60
            print(f"  Rate limited (429). Retry after ~{wait}s", file=sys.stderr)
            sys.exit(1)
        raise

    text = response.text
    if not text:
        print("Error: Step 1 returned empty response.", file=sys.stderr)
        sys.exit(1)

    # Log grounding metadata
    candidate = response.candidates[0]
    grounding = getattr(candidate, "grounding_metadata", None)
    if grounding:
        queries = getattr(grounding, "web_search_queries", []) or []
        chunks = getattr(grounding, "grounding_chunks", []) or []
        print(f"  Search queries: {len(queries)}")
        print(f"  Sources retrieved: {len(chunks)}")

    print(f"  Response length: {len(text)} chars")
    return text


def step2_structured(client: genai.Client, raw_data: str) -> WorldCupData:
    """Step 2: Use Gemini structured output to parse into WorldCupData schema."""
    print("[Step 2/2] Converting to structured JSON...")

    prompt = STRUCTURED_PROMPT_TEMPLATE.format(raw_data=raw_data)

    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=WorldCupData,
                temperature=0.0,
                max_output_tokens=MAX_OUTPUT_TOKENS,
            ),
        )
    except ClientError as e:
        if e.code == 429:
            wait = get_retry_after(e) or 60
            print(f"  Rate limited (429). Retry after ~{wait}s", file=sys.stderr)
            sys.exit(1)
        raise

    parsed: WorldCupData | None = response.parsed
    if parsed is None:
        print("Error: Step 2 returned unparseable response.", file=sys.stderr)
        print(f"Raw response text: {response.text[:500]}", file=sys.stderr)
        sys.exit(1)

    print(f"  Parsed successfully: {len(parsed.teams)} teams, {len(parsed.prev_games)} completed matches")
    return parsed


def save_output(data: WorldCupData) -> Path:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output = data.model_dump(mode="json")
    # Convert date/datetime objects to strings for JSON serialization
    json_str = json.dumps(output, indent=2, default=str)
    OUTPUT_FILE.write_text(json_str)
    print(f"  Saved to {OUTPUT_FILE}")
    return OUTPUT_FILE


# ── Main ────────────────────────────────────────────────────────────


def main() -> None:
    print("FIFA World Cup 2026 — Fetch Agent")
    print("=" * 40)

    api_key = get_api_key()
    client = genai.Client(api_key=api_key)

    # Step 1: Grounded fetch
    raw_data = step1_grounding(client)

    # Step 2: Structured output
    data = step2_structured(client, raw_data)

    # Save
    path = save_output(data)

    print("=" * 40)
    print(f"Done. Output: {path}")
    print(f"Teams: {len(data.teams)}")
    print(f"Completed matches: {len(data.prev_games)}")
    print(f"Upcoming matches: {len(data.next_games)}")
    print(f"Standings: {len(data.standings)}")
    print(f"Players: {len(data.players)}")
    print(f"Top scorers: {len(data.top_scorers)}")


if __name__ == "__main__":
    main()
