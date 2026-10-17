#!/bin/bash
# Nightly ZedSpeaks database backup (keeps 14 days). Installed to ~/bin by setup-backup.sh.
# Restore:  gunzip -c ~/backups/zedspeaks/db-YYYY-MM-DD.sql.gz | mysql --defaults-extra-file=$HOME/.zedspeaks-backup.cnf zedspeaks
set -euo pipefail
umask 077
mkdir -p "$HOME/backups/zedspeaks"
OUT="$HOME/backups/zedspeaks/db-$(date +%F).sql.gz"
mysqldump --defaults-extra-file="$HOME/.zedspeaks-backup.cnf" --single-transaction --quick --no-tablespaces zedspeaks | gzip -9 > "$OUT.tmp" && mv "$OUT.tmp" "$OUT"
# Check the backup can be read back and has the account tables
gunzip -c "$OUT" | grep -q "CREATE TABLE \`users\`" || { echo "$(date) backup check FAILED: $OUT" >&2; exit 1; }
find "$HOME/backups/zedspeaks" -name "db-*.sql.gz" -mtime +14 -delete
echo "$(date) ok $OUT $(du -h "$OUT" | cut -f1)"
