#!/bin/sh
# Skickar en loggpost (stdin) till en Slack Incoming Webhook om FIXUS_LOG_WEBHOOK
# finns, i miljön eller i .env.local (git-ignorerad). Utan adress: gör inget.
#
# Regler (CLAUDE.md, "Sessionslogg"): 5 sekunders timeout, ett fel stoppar
# aldrig anroparen (exit 0 alltid), adressen skrivs aldrig ut och hamnar
# aldrig i loggen. Anropas av .githooks/post-commit, scripts/logg-status.sh
# --snapshot och scripts/logg-post.sh.
ROOT=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
cd "$ROOT" || exit 0

hook=${FIXUS_LOG_WEBHOOK:-}
if [ -z "$hook" ] && [ -f .env.local ]; then
  # Bara den raden läses; filen körs aldrig (source:as inte).
  hook=$(sed -n 's/^[[:space:]]*FIXUS_LOG_WEBHOOK[[:space:]]*=[[:space:]]*//p' .env.local \
    | head -n 1 | tr -d '\r' | sed "s/^['\"]//; s/['\"]\$//")
fi
[ -n "$hook" ] || exit 0
command -v curl >/dev/null 2>&1 || exit 0

# stdin -> JSON-strängvärde: \ " och tab escapas, radbrytning blir \n, CR tas bort.
# Tecken för tecken med strängkonkatenering, inte gsub: gsub:s ersättningssträng
# tolkar backslash olika mellan awk-varianter, konkatenering gör det aldrig.
text=$(awk 'BEGIN { ORS = ""; bs = "\\"; q = "\""; tab = "\t"; cr = "\r" }
  { out = ""
    for (i = 1; i <= length($0); i++) {
      c = substr($0, i, 1)
      if (c == bs)       out = out bs bs
      else if (c == q)   out = out bs q
      else if (c == tab) out = out bs "t"
      else if (c == cr)  { }
      else               out = out c
    }
    if (NR > 1) printf "%s", bs "n"
    printf "%s", out }')
[ -n "$text" ] || exit 0

# Kroppen går via stdin, inte som argument: en native curl.exe får sina argument
# omkodade till ANSI-teckentabellen på Windows, och då förstörs åäö och tankstreck.
printf '%s' "{\"text\":\"[FixusConsulting]\\n$text\"}" \
  | curl -sS --max-time 5 -X POST -H 'Content-type: application/json; charset=utf-8' \
      --data-binary @- "$hook" >/dev/null 2>&1 || true
exit 0
