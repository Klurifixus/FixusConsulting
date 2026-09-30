#!/bin/sh
# Lägger en sessionspost (stdin) längst ner i utvecklingsloggen och skickar
# den vidare till Slack (scripts/logg-slack.sh, tyst om ingen webhook finns).
#
# Användning (posten enligt mallen i loggens huvud, max 8 rader):
#   sh scripts/logg-post.sh <<'EOF'
#   - Gjort: …
#   - Beslut: …
#   - Öppet / nästa steg: …
#   - Git: …
#   EOF
# Börjar posten inte med en "## …"-rubrik läggs
# "## <datum tid> – session (Claude i VS Code)" till automatiskt.
set -u
ROOT=$(git rev-parse --show-toplevel 2>/dev/null) || {
  echo "logg-post: inte i ett git-repo" >&2
  exit 1
}
cd "$ROOT" || exit 1
LOGG="docs/logg/UTVECKLINGSLOGG.md"

post=$(cat)
[ -n "$post" ] || { echo "logg-post: tom post, inget skrivet" >&2; exit 2; }
case "$post" in
  "## "*) ;;
  *) post="## $(date '+%Y-%m-%d %H:%M') – session (Claude i VS Code)
$post" ;;
esac

mkdir -p "$(dirname "$LOGG")"
printf '\n%s\n' "$post" >> "$LOGG"
printf '%s\n' "$post" | sh scripts/logg-slack.sh || true
echo "logg-post: posten tillagd i $LOGG"
