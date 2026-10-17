# ZedSpeaks Security Review

- **Date:** 18 October 2026
- **Reviewer:** Claude (AI-assisted self-review), for Lea Abarentos
- **Commit:** `fb94491` (main), live at https://zedspeaks.io
- **Checklist:** `~/Desktop/Security-Checklist.md` (OWASP Top 10:2025, ASVS 5.0, WSTG, access control, data protection, platform, privacy, operations, documentation)
- **Risk tier:** **Elevated**. The app holds only parents' email addresses, but its users are families of children with disabilities and it is public on the internet. Family photos and what children say stay on the device and are not processed by the server.
- **Result: FAIL.** There are 2 open High findings (#1 cross-family write in the cells route, #2 no database backups). No Critical findings.

## Summary

The core of ZedSpeaks is in good shape. Sign-in uses hashed session tokens in httpOnly, Secure, SameSite cookies and Argon2id passwords. Server checks protect the admin, profile and board routes. The app collects only email addresses, escapes all output, and has 0 known vulnerable production dependencies. **The #1 thing to fix is the `PUT /cells` route**, which lets any signed-in family write cells into another family's board by adding a `boardId` field. **Second is backups:** today a server or disk failure would lose every account.

## Findings

| # | Severity | Standard(s) | File:Line | Issue | One-line fix |
|---|---|---|---|---|---|
| 1 | **High** | A01, ASVS V8.2 (record-level), WSTG-ATHZ-04 | `apps/api/src/routes/cells.ts:41` | Client-sent `boardId`/`id` inside each cell overrides the checked board (`...cell` spread last) | Copy only allowed fields; set `boardId` last |
| 2 | **High** | Ops §8, ASVS V14 (data protection) | server | No scheduled MySQL backups, no tested restore | Nightly `mysqldump` to a private folder plus a restore drill |
| 3 | Medium | A07, ASVS V6.3 (anti-automation), WSTG-ATHN-03 | `apps/api/src/routes/auth.ts:81` | No rate limit or lockout on `/auth/login` | Per-IP and per-email limit (e.g. 10 per 15 min) |
| 4 | Medium | A06, ASVS V2 (business logic), WSTG-BUSL-05 | `apps/api/src/routes/auth.ts:26` | No rate limit on `/auth/register` (spam sign-ups, admin email flood) | Per-IP limit (e.g. 5 per hour) |
| 5 | Medium | A01 (SSRF), A10, ASVS V1 | `apps/api/src/routes/symbols.ts:11,15` | Public, unauthenticated proxy; `lang` goes unencoded into the upstream URL path. The app no longer uses it | Remove the route (unused) |
| 6 | Medium | Data protection §5, ASVS V16 (logging) | `apps/api/src/index.ts:19` | Request logger writes full URLs, including Google `code`/`state` on the callback | Log the path only, no query string |
| 7 | Medium | Ops §8, A09 | whole API | No audit log for admin actions (approve, deny, delete feedback or inquiries) and no alerting | Append-only `audit_log` table (time, actor, action, record) |
| 8 | Medium | A02, ASVS V3.4 (headers), WSTG-CONF-07 | nginx, zedspeaks.io site | Web pages lack HSTS, Content-Security-Policy, Referrer-Policy and Permissions-Policy (the API has them) | Add headers in the zed.abarentos.com nginx config |
| 9 | Medium | A08, Secrets §5 | server git remotes | Deploys pull with a shared personal GitHub token embedded in the remote URL (known issue) | Read-only deploy key per repo, then revoke the token |
| 10 | Low | Secrets §5 | server `apps/api/../.env` | `.env` is mode `664` (group-writable, world-readable) | `chmod 600 .env` |
| 11 | Low | ASVS V7.3 (session timeouts) | `apps/api/src/lib/session.ts:15` | Sliding 90-day session with no absolute limit | Add an absolute cap (e.g. 180 days) |
| 12 | Low | Data protection §5 | `apps/api/src/lib/email.ts:50` | Admin notification email contains the applicant's email (record content) | Send only "a new request is waiting" plus the dashboard link |
| 13 | Low | Ops §8 | deploy process | Deploys run `git pull main` (live head), not a pinned tag; no kill switch | Tag releases and deploy tags; add a `MAINTENANCE=1` env switch |
| 14 | Low | A02 | server | API (3001) and MySQL (3306) listen on all interfaces. The firewall blocks them (verified from outside), but there is no second layer | Bind to `127.0.0.1` |
| 15 | Low | ASVS V8 | `apps/api/src/middleware/auth.ts:8` | `requireAuth` doesn't re-check `approvedAt` (today no session is ever issued before approval) | Check `approvedAt` in `readSession` too |
| 16 | Info | Docs §9 | repo root | `SECURITY.md` is missing (tier, fields, roles, backup, retention, contacts) | Add it (template in this review) |

### Confirmed vs potential

- **Confirmed in code:** #1, #3, #4, #5, #6, #11, #12, #15.
- **Confirmed on the server (read-only checks):** #2 (crontab has no ZedSpeaks backup), #8 (response headers), #10 (`ls -la`), #14 (`ss -ltn`, plus an external probe returned no connection).
- **Process or potential:** #7, #9, #13, #16. #9 depends on how the GitHub token is scoped. I assumed it is the shared `webbywife` token recorded earlier.

## Details

### #1 Cross-family write in `PUT /cells` (High)
**Why it matters:** the route checks that you own `body.boardId`, then spreads each client cell last. A cell like `{"boardId":"<someone else's board>","label":"…"}` is written into another family's board.
**Vulnerable:**
```ts
body.cells.map((cell) => ({ id: crypto.randomUUID(), boardId: body.boardId, ...cell }))
```
**Secure:**
```ts
body.cells.map((cell) => ({
  position: Number(cell.position), label: String(cell.label).slice(0, 255),
  spokenText: String(cell.spokenText).slice(0, 500), iconUrl: cell.iconUrl ?? null,
  bgColor: cell.bgColor ?? null, id: crypto.randomUUID(), boardId: body.boardId,
}))
// and check ownsBoard() for any linkBoardId
```
**Habit:** never spread request bodies into database writes; list the fields.

### #2 No backups (High)
**Why it matters:** one disk failure or bad command loses every family's account. The server already backs up another project (`t2g-backup.sh`), so the same pattern can be reused.
**Fix:** a nightly `mysqldump zedspeaks | gzip` to `~/backups/zedspeaks/`, keeping 14 days, plus an off-server copy. Write down the restore steps and test them once.
**Habit:** no live database without a tested restore.

### #3 / #4 Brute force and spam (Medium)
**Why it matters:** password guessing against families' accounts, and floods of fake sign-ups. Admin accounts are Google-only, so they can't be password-guessed.
**Fix:** reuse the in-memory limiter pattern from `feedback.ts` and `inquiries.ts`, keyed by `x-real-ip` and email.
**Habit:** every public form gets a rate limit.

### #5 Unused public proxy (Medium)
`/symbols/search` forwards to `api.arasaac.org` with `lang` inserted raw into the path (`../` traversal on that host). The app doesn't call it anymore.
**Fix:** delete the route (or allowlist `lang` to `^[a-z]{2}$` and require sign-in).
**Habit:** remove endpoints when features are removed.

### #6 OAuth codes in logs (Medium)
Seen in `pm2 logs`: `GET /auth/google/callback?state=…&code=…`. The codes are single-use and protected by PKCE, so the impact is low, but tokens shouldn't be logged.
**Fix:** a custom logger that prints `method path status ms` without the query string.

### #8 Missing headers on the web app (Medium)
**Fix:** add these to the zedspeaks.io nginx server block: `Strict-Transport-Security "max-age=31536000; includeSubDomains"`, a `Content-Security-Policy` that allows self, plus `data:`/`blob:` for images and audio and ElevenLabs-free (all audio is same-origin), `Referrer-Policy strict-origin-when-cross-origin` and `Permissions-Policy camera=(self), microphone=()`.

The remaining findings are covered in the table, each with a one-line fix.

## Pass / fail by standard

| Standard | Result | Notes |
|---|---|---|
| OWASP Top 10:2025 | **FAIL** | A01 (#1). A02, A03, A04, A05 and A10 pass. A07 and A09 partial |
| ASVS 5.0 | **FAIL** | V8 record-level (#1), V6 anti-automation (#3). Sessions, crypto and output encoding pass |
| WSTG | **FAIL** | ATHZ-04 fails (#1), ATHN-03 fails (#3). SESS, INPV, ERRH and CRYP pass |
| Access control (§4) | **FAIL** | #1. Admin is server-checked; roles live in the DB; no shared accounts |
| Data protection (§5) | Partial | #6, #10, #12. No PII in URLs; HTTPS-only calls; no `eval`/`innerHTML` |
| Platform / OAuth (§6) | **PASS** | Scopes are `openid email` only; no Google ID stored; secrets in env |
| Privacy (§7) | Partial | Minimal data, privacy notice and consent are in place. Missing breach detection and a documented field list (`SECURITY.md`) |
| Operations (§8) | **FAIL** | #2 backups, #7 audit log, #13 pinning and kill switch |
| Documentation (§9) | **FAIL** | `SECURITY.md` is missing (this review is the first step) |

## What was done well

- **Privacy by design:** only emails are kept; child photos and speech never leave the device; Google sign-in requests only `openid email`; there is a plain-language RA 10173 notice with consent.
- **Solid session and password handling:** 32-byte random tokens stored as SHA-256 hashes, httpOnly, Secure and SameSite=Lax cookies, Argon2id passwords, and server-side field whitelisting on profiles and boards.
