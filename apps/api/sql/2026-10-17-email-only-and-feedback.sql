-- 17 Oct 2026: email-only accounts (RA 10173 data minimisation) + feedback table.
-- Run once on the server database. Safe to re-run.

CREATE TABLE IF NOT EXISTS `feedback` (
  `id` varchar(36) NOT NULL,
  `rating` int,
  `message` text,
  `reply_email` varchar(255),
  `created_at` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `feedback_id` PRIMARY KEY(`id`)
);

-- Forget names, usernames and Google IDs collected before: we keep only emails now
UPDATE `users` SET `name` = '', `username` = NULL, `google_id` = NULL;
UPDATE `access_requests` SET `applicant_name` = '', `relation` = '';

-- Sessions from the retired sign-in library no longer work; clear them
DELETE FROM `sessions`;
