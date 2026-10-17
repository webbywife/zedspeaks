# ZedSpeaks Security

Personal project of Lea Abarentos (not TOIC/DLSL). Live at https://zedspeaks.io.

## Risk tier
**Elevated.** The app is public and serves families of non-verbal children, but the server holds only parents' email addresses. Family photos, saved phrases, settings and everything a child taps or types stay on the device (photos and phrases never leave it; see the voice note below for typed words).

## Data the server keeps, and why

| Data | Why it's needed |
|---|---|
| Parent email | Sign-in, approval, replying to the family |
| Password hash (Argon2id), email sign-in only | Sign-in |
| Role, approved date, active flag | Access control (admin, approval, disabling an account) |
| Session token **hash**, start and expiry time | Keeping a family signed in (90-day sliding window, 180-day absolute limit) |
| Feedback (rating, message, optional reply email) | Improving the app; anonymous unless the parent asks for a reply |
| Sponsor/partner messages (name, organisation, email, message) | Replying to sponsors and collaborators |
| Audit log (time, admin, action, record ID) | Accountability for admin actions |

**Never collected:** names of parents or children, ages, diagnoses, photos, what the child says, location, or tracking/analytics data.

**Typed words:** text typed in the Type tab (and family photo names) is sent by the server to ElevenLabs to be spoken in the character's voice. It is sent without email or account details, is not logged, and the resulting audio is cached by a hash of the text.

## Access model
- **Roles:** stored in the database (`users.role`): `admin` or `caregiver`. The first admin is the email in the `ADMIN_EMAIL` environment variable. There are no shared accounts, and every admin action is in `audit_log` with that admin's ID.
- **Server checks on every route:** `requireAuth` (signed in, active, approved) and `requireAdmin`. Profiles, boards and cells are checked for ownership on every read and write. Client-sent roles, owner IDs and record IDs are never trusted (only whitelisted fields are written).
- **Public routes:** sign-up and sign-in (rate limited), the Support page form (rate limited, honeypot), and the health check.
- **Google sign-in:** scopes `openid email` only, with PKCE; accounts are matched by Google-verified email.

## Hosting and access choices
- Server: Ploi-managed VPS at HostPapa in Buffalo, New York (USA). Families are told this in the Privacy Notice.
- The web app and API share one address (`zedspeaks.io` and `zedspeaks.io/api`), so cookies are first-party: `httpOnly`, `Secure` and `SameSite=Lax`.
- The API listens on `127.0.0.1:3001` only; nginx is the only public entrance. MySQL isn't reachable from outside (firewall).
- Security headers: HSTS, CSP, Referrer-Policy and Permissions-Policy (nginx, web app), plus Hono `secureHeaders` on the API.
- Secrets (database URL, Google client secret, ElevenLabs key) live only in the server's `.env` (mode 600), readable by the `ploi` user and by Ploi account holders. Never in the repository.

## Backup and restore
- A nightly backup at 19:45 server time (`~/bin/zedspeaks-backup.sh`) writes `~/backups/zedspeaks/db-YYYY-MM-DD.sql.gz` and keeps 14 days. Each backup is checked after writing; the log is at `~/backups/zedspeaks/backup.log`.
- **Restore:**
  1. Pause the app by setting `MAINTENANCE=1` in the API environment, then `pm2 restart zed-api --update-env`.
  2. Run `gunzip -c ~/backups/zedspeaks/db-YYYY-MM-DD.sql.gz | mysql --defaults-extra-file=$HOME/.zedspeaks-backup.cnf zedspeaks`.
  3. Remove `MAINTENANCE`, then restart again.
- To do: also copy backups off the server (for example to private Google Drive) every week.

## Retention
- Accounts: kept until the family asks for deletion (via zedspeaks.info@gmail.com); answered within 15 days.
- Sessions: expire after 90 days without use, and in any case after 180 days.
- Feedback and sponsor messages: deleted from the dashboard when no longer needed, or on request.
- Backups: 14 days.

## Kill switch and revoking access
- **Pause everything:** set `MAINTENANCE=1` in the API environment and restart. The API answers 503 except `/health`.
- **Revoke one person:** `UPDATE users SET is_active = 0 WHERE email = '…';` then `DELETE FROM sessions WHERE user_id = (SELECT id FROM users WHERE email = '…');`. Their session stops working on the next request.
- **Remove admin rights:** `UPDATE users SET role = 'caregiver' WHERE email = '…';`, and change `ADMIN_EMAIL` if it was that person.

## Incident contacts
- Owner and admin: Lea Abarentos, zedspeaks.info@gmail.com
- Hosting: Ploi (server panel) and HostPapa (VPS)
- If personal data may have leaked, assess it and, where required, notify the National Privacy Commission (privacy.gov.ph) and the affected families within 72 hours of discovery.

## Deploy order
Commit and push, then build and test locally, then run the security self-review (`SECURITY-REVIEW.md`), then deploy on the server (`git pull`, build, `pm2 restart`).
