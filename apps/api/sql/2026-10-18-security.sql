-- 18 Oct 2026 security fixes: append-only audit log, and session start time (180-day absolute limit).
-- Run once.
CREATE TABLE IF NOT EXISTS `audit_log` (
  `id` varchar(36) NOT NULL,
  `actor_id` varchar(36) NOT NULL,
  `action` varchar(60) NOT NULL,
  `record_id` varchar(36) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `audit_log_id` PRIMARY KEY(`id`)
);
ALTER TABLE `sessions` ADD COLUMN `created_at` timestamp NOT NULL DEFAULT (now());
