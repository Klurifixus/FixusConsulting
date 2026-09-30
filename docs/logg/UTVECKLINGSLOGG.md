# Utvecklingslogg — Fixus Consulting (fixusconsulting.se)

Bara-lägg-till: nya poster längst ner, äldre poster ändras aldrig. Läsare:
Pierres assistent och ledningsgruppen. Skrivare: varje Claude-session (mallen
nedan), `.githooks/post-commit` (en rad per commit) och
`scripts/logg-status.sh --snapshot` (automatisk ögonblicksbild från Claude
Code-hooken). Loggen visar även det som bara finns lokalt och inte är pushat.

Aldrig nycklar, lösenord, tokens, personnummer eller kunddata här.

Mall för en sessionspost (max 8 rader):

    ## 2026-10-01 14:05 – session (Claude i VS Code)
    - Gjort: …
    - Beslut: …
    - Öppet / nästa steg: …
    - Git: branch X, N ändrade filer ej committade, M commits ej pushade

Rader som automatiken lägger till:

    - [commit] <kort hash> <branch> <rubrik>
    ## <tid> – automatisk ögonblicksbild   (följt av utdata från scripts/logg-status.sh)

---
