# Utvecklingslogg — Fixus Consulting (fixusconsulting.se)

Bara-lägg-till: nya poster längst ner, äldre poster ändras aldrig. Läsare:
Pierres assistent och ledningsgruppen. Skrivare: varje Claude-session (mallen
nedan, via `scripts/logg-post.sh`), `.githooks/post-commit` (en rad per commit) och
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
- [commit] 381f712 chore/utvecklingslogg Utvecklingslogg för assistenten och ledningsgruppen: loggfil, statusskript, spårade git-hookar och CLAUDE.md-avsnitt

## 2026-09-30 17:03 – automatisk ögonblicksbild

```
Tid:     2026-09-30 17:03
Branch:  chore/utvecklingslogg
Ändrat:  1 filer ej committade
   M docs/logg/UTVECKLINGSLOGG.md
Pushat:  upstream saknas för chore/utvecklingslogg
  1 commits som inte finns på origin/main
  381f712 Utvecklingslogg för assistenten och ledningsgruppen: loggfil, statusskript, spårade git-hookar och CLAUDE.md-avsnitt
Senaste 5 commits:
  381f712 2026-09-30 17:01 Utvecklingslogg för assistenten och ledningsgruppen: loggfil, statusskript, spårade git-hookar och CLAUDE.md-avsnitt
  bccfca1 2026-09-09 22:24 Reposition site as profile + catalogue: person-first hero, three customer-language entries
  e0cff05 2026-06-19 09:10 SEO/AEO: real booking link in HTML, Service schema, title/desc, noindex form
  61b4534 2026-06-18 14:23 Security: self-host fonts + add Content-Security-Policy
  baf7df6 2026-06-18 13:51 Om Pierre: rewrite bio to match the repositioned site
Stash:   tom
```

## 2026-09-30 17:03 – session (Claude i VS Code)
- Gjort: utvecklingsloggen uppsatt: docs/logg/UTVECKLINGSLOGG.md, scripts/logg-status.sh, spårade hookar i .githooks (post-commit loggar varje commit, pre-commit stoppar radering av loggen), .gitattributes (LF + merge=union) och CLAUDE.md med avsnittet "Sessionslogg (obligatoriskt)". Testcommit 381f712 verifierad: commit-raden hamnade i loggen; ögonblicksbilden ovan kommer från samma kommando som Claude Code-hooken kör.
- Läget i dag: sajten är live på fixusconsulting.se; senaste innehållsändring 2026-09-09 (profil + katalog, tre ingångar i kundens språk), allt pushat, inget låg ocommittat före denna session.
- Beslut: loggen gäller FixusConsulting (Hazardlink har en egen, uppsatt av en parallell session i dag). Repot är publikt och GitHub Pages serverar hela roten, så loggen är läsbar på fixusconsulting.se/docs/logg/ – därför aldrig känsligt innehåll här.
- Öppet / nästa steg: Claude Code-hooken (SessionEnd + Stop) i .claude/settings.json väntar på Pierres godkännande av JSON:en; Slack-vidarebefordran bara om Pierre säger ja; sedan merge till main + push. Sajten: BOOKING_URL (kalenderbokning) och CAA-post är fortsatt valfria.
- Git: branch chore/utvecklingslogg, 1 ändrad fil ej committad (loggen), 1 commit ej pushad (upstream saknas), main = origin/main.

## 2026-09-30 17:11 – session (Claude i VS Code)
- Gjort: Claude Code-hooken sparad i .claude/settings.json (SessionEnd + Stop, JSON godkänd av Pierre). Slack-vidarebefordran byggd: scripts/logg-slack.sh (läser FIXUS_LOG_WEBHOOK ur miljön eller .env.local, 5 s timeout, ett fel stoppar aldrig hooken, adressen skrivs aldrig ut), anropad från post-commit, --snapshot och nya scripts/logg-post.sh. Testad mot lokal mottagare: giltig JSON, citat/backslash/tabb/åäö rätt, tyst utan webhook. .gitignore: .env, .env.local.
- Beslut (Pierre): SessionEnd + Stop; Slack ja via FIXUS_LOG_WEBHOOK; merge till main + push trots att loggen blir publikt läsbar på fixusconsulting.se/docs/logg/.
- Öppet / nästa steg: Pierre lägger webhook-adressen i .env.local (aldrig i git). Claude Code-hooken verifieras i nästa session (hookar läses in vid sessionsstart).
- Git: branch chore/utvecklingslogg, 8 ändrade filer ej committade (committas nu, mergas till main och pushas direkt efter), 1 commit ej pushad.
