#!/bin/sh
# Kedjar vidare till en lokal, ospårad hook med samma namn i .git/hooks.
#
# core.hooksPath=.githooks gör att git BARA kör hookarna i den här katalogen.
# Repot har i dag inga lokala hookar, men om ett verktyg (git-lfs, graphify,
# en lokal grind) senare installerar en i .git/hooks skulle den annars tyst
# sluta köra. Anropas sist i varje spårad hook med hookens namn som första
# argument. stdin lämnas orörd och den lokala hooken exec:as, så dess exit-kod
# blir hookens exit-kod.
namn=$1
shift
common=$(git rev-parse --git-common-dir 2>/dev/null) || exit 0
lokal="$common/hooks/$namn"
[ -f "$lokal" ] || exit 0
exec sh "$lokal" "$@"
