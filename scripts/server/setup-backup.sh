#!/bin/bash
# One-time setup on the server: run from /home/ploi/api.zed.abarentos.com
set -euo pipefail
umask 077
# Database login for the backup, readable only by this user (taken from the API's .env)
URL=$(grep -E '^ *DATABASE_URL=' .env | head -1 | cut -d= -f2- | tr -d ' "')
USER=$(echo "$URL" | sed -E 's#.*//([^:]+):.*#\1#'); PASS=$(echo "$URL" | sed -E 's#.*//[^:]+:([^@]*)@.*#\1#')
printf '[client]\nuser=%s\npassword=%s\nhost=127.0.0.1\n' "$USER" "$PASS" > "$HOME/.zedspeaks-backup.cnf"
chmod 600 "$HOME/.zedspeaks-backup.cnf" .env
mkdir -p "$HOME/bin" "$HOME/backups/zedspeaks"
cp scripts/server/zedspeaks-backup.sh "$HOME/bin/" && chmod 700 "$HOME/bin/zedspeaks-backup.sh"
# Nightly at 19:45 server time, next to the existing Travel2gether backup
( crontab -l 2>/dev/null | grep -v zedspeaks-backup.sh; echo '45 19 * * * $HOME/bin/zedspeaks-backup.sh >> $HOME/backups/zedspeaks/backup.log 2>&1' ) | crontab -
# First backup now, as a test
"$HOME/bin/zedspeaks-backup.sh"
echo "Backups installed. .env and the backup login are now private (600)."
