const FLAG_MAP: Record<string, string> = {
  France: "fr",
  Morocco: "ma",
  Spain: "es",
  Belgium: "be",
  Norway: "no",
  England: "gb-eng",
  Argentina: "ar",
  Switzerland: "ch",
  Brazil: "br",
  Mexico: "mx",
  Portugal: "pt",
  "United States": "us",
  Canada: "ca",
  Paraguay: "py",
  Egypt: "eg",
  Colombia: "co",
  "South Africa": "za",
  "South Korea": "kr",
  Czechia: "cz",
  "Bosnia and Herzegovina": "ba",
  Qatar: "qa",
  Haiti: "ht",
  Scotland: "gb-sct",
  Australia: "au",
  Türkiye: "tr",
  Germany: "de",
  Curaçao: "cw",
  "Ivory Coast": "ci",
  Ecuador: "ec",
  Netherlands: "nl",
  Japan: "jp",
  Sweden: "se",
  Tunisia: "tn",
  Iran: "ir",
  "New Zealand": "nz",
  "Cape Verde": "cv",
  "Saudi Arabia": "sa",
  Uruguay: "uy",
  Senegal: "sn",
  Iraq: "iq",
  Algeria: "dz",
  Austria: "at",
  Jordan: "jo",
  "Congo DR": "cd",
  Uzbekistan: "uz",
  Croatia: "hr",
  Panama: "pa",
  Ghana: "gh",
};

export function getFlagUrl(team: string): string {
  const code = FLAG_MAP[team];
  if (!code) return "";
  return `https://flagcdn.com/w80/${code}.png`;
}

export function getUniqueTeams(
  groups: { teams: string[] }[],
  prevGames: { home_team: string; away_team: string }[],
  nextGames: { home_team: string; away_team: string }[],
): string[] {
  const set = new Set<string>();
  for (const g of groups) for (const t of g.teams) set.add(t);
  for (const m of prevGames) {
    set.add(m.home_team);
    set.add(m.away_team);
  }
  for (const m of nextGames) {
    set.add(m.home_team);
    set.add(m.away_team);
  }
  return [...set];
}
