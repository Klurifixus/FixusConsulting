# Fixus Consulting — arbetsregler för Claude

Repot är den statiska webbplatsen för https://fixusconsulting.se/ (HTML + CSS +
JS, inget byggsteg), publicerad med GitHub Pages från `main`/root. Struktur,
lokal körning och domän/DNS står i [README.md](README.md). "Uppdatera sajten"
betyder commit + push till `main`; en lokal ändring är aldrig "live".

## Sessionslogg (obligatoriskt)

Utvecklingsloggen `docs/logg/UTVECKLINGSLOGG.md` är assistentens och
ledningsgruppens fönster mot vad som händer i utvecklingen, även det som bara
finns lokalt och inte är pushat (Pierre-beslut 2026-09-30).

- **I slutet av varje uppgift eller session:** lägg till en post längst ner i
  `docs/logg/UTVECKLINGSLOGG.md` enligt mallen i filens huvud. Kort och
  sakligt, max 8 rader: vad som gjordes, vilka beslut som togs, vad som är
  öppet och git-läget. Git-läget tar du fram med `sh scripts/logg-status.sh`.
- **Bara-lägg-till:** nya poster längst ner, äldre poster ändras aldrig.
- **Aldrig i loggen:** nycklar, lösenord, tokens, personnummer eller kunddata.
- **Commit:** loggfilen committas tillsammans med arbetet när det committas.
  Den får ligga ocommittad, men den får aldrig raderas
  (`.githooks/pre-commit` stoppar en sådan commit).
- **Automatik:** `.githooks/post-commit` lägger en `- [commit]`-rad per commit,
  och Claude Code-hooken i `.claude/settings.json` kör
  `sh scripts/logg-status.sh --snapshot` vid sessionsslut (och som skyddsnät
  vid Stop), vilket lägger en automatisk ögonblicksbild när git-läget ändrats.
  Hookarna i `.githooks/` kräver `git config core.hooksPath .githooks` en gång
  per klon.
