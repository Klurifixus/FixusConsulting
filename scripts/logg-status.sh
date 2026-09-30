#!/bin/sh
# Ögonblicksbild av git-läget för utvecklingsloggen (docs/logg/UTVECKLINGSLOGG.md).
#
# Skriver ut: datum och tid, branch, antal ändrade filer (upp till 15 namn),
# commits som inte är pushade, de 5 senaste commitsen och stash-listan.
# Aldrig diffinnehåll, aldrig innehåll ur .env-filer: bara filnamn och
# commit-rubriker.
#
# Användning:
#   sh scripts/logg-status.sh             skriv ögonblicksbilden till stdout
#   sh scripts/logg-status.sh --snapshot  lägg till den längst ner i loggen under
#                                         rubriken "## <tid> – automatisk
#                                         ögonblicksbild". Hoppar över om inget
#                                         ändrats sedan förra automatiska
#                                         ögonblicksbilden (annars fyller Stop-
#                                         hooken loggen med dubbletter).
set -u

ROOT=$(git rev-parse --show-toplevel 2>/dev/null) || {
  echo "logg-status: inte i ett git-repo" >&2
  exit 1
}
cd "$ROOT" || exit 1
LOGG="docs/logg/UTVECKLINGSLOGG.md"
MAX_FILER=15

snapshot() {
  branch=$(git symbolic-ref --short -q HEAD 2>/dev/null) \
    || branch="(detached $(git rev-parse --short HEAD 2>/dev/null))"

  echo "Tid:     $(date '+%Y-%m-%d %H:%M')"
  echo "Branch:  $branch"

  # Ändrade filer: antal + upp till MAX_FILER rader ur git status --short.
  status=$(git status --short 2>/dev/null)
  if [ -z "$status" ]; then
    echo "Ändrat:  0 filer (arbetsträdet rent)"
  else
    n=$(printf '%s\n' "$status" | grep -c .)
    echo "Ändrat:  $n filer ej committade"
    printf '%s\n' "$status" | head -n "$MAX_FILER" | sed 's/^/  /'
    if [ "$n" -gt "$MAX_FILER" ]; then
      echo "  ... och $((n - MAX_FILER)) till"
    fi
  fi

  # Ej pushade commits. Tål att upstream saknas.
  if upstream=$(git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null); then
    unpushed=$(git log --oneline '@{u}..HEAD' 2>/dev/null)
    if [ -z "$unpushed" ]; then
      echo "Pushat:  allt (inget före $upstream)"
    else
      echo "Pushat:  $(printf '%s\n' "$unpushed" | grep -c .) commits ej pushade till $upstream"
      printf '%s\n' "$unpushed" | sed 's/^/  /'
    fi
  else
    echo "Pushat:  upstream saknas för $branch"
    if git rev-parse --verify -q origin/main >/dev/null 2>&1; then
      ahead=$(git rev-list --count origin/main..HEAD 2>/dev/null || echo '?')
      echo "  $ahead commits som inte finns på origin/main"
      git log --oneline origin/main..HEAD 2>/dev/null | head -n 15 | sed 's/^/  /'
    fi
  fi

  echo "Senaste 5 commits:"
  git log -5 --format='  %h %ad %s' --date=format:'%Y-%m-%d %H:%M' 2>/dev/null

  stash=$(git stash list 2>/dev/null)
  if [ -z "$stash" ]; then
    echo "Stash:   tom"
  else
    echo "Stash:   $(printf '%s\n' "$stash" | grep -c .) poster"
    printf '%s\n' "$stash" | sed 's/^/  /'
  fi
}

case "${1:-}" in
  "")
    snapshot
    ;;
  --snapshot)
    # Fingeravtryck av läget, loggfilen själv undantagen (den blir ändrad av
    # varje tillägg och skulle annars ge exakt en dubblett per körning).
    fp=$( {
      git symbolic-ref -q HEAD 2>/dev/null
      git rev-parse HEAD 2>/dev/null
      git status --short -- . ":!$LOGG" 2>/dev/null
      git stash list 2>/dev/null
    } | git hash-object --stdin)
    fp_fil="$(git rev-parse --git-dir)/utvecklingslogg.last-snapshot"
    if [ "$fp" = "$(cat "$fp_fil" 2>/dev/null)" ]; then
      exit 0
    fi
    block=$(
      printf '## %s – automatisk ögonblicksbild\n\n```\n' "$(date '+%Y-%m-%d %H:%M')"
      snapshot
      printf '```'
    )
    mkdir -p "$(dirname "$LOGG")"
    printf '\n%s\n' "$block" >> "$LOGG"
    printf '%s\n' "$fp" > "$fp_fil"
    # Vidare till Slack om FIXUS_LOG_WEBHOOK finns; ett fel stoppar aldrig hooken.
    printf '%s\n' "$block" | sh scripts/logg-slack.sh || true
    ;;
  *)
    echo "Användning: sh scripts/logg-status.sh [--snapshot]" >&2
    exit 2
    ;;
esac
