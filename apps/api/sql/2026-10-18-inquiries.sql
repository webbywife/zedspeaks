-- 18 Oct 2026: Support page form (sponsors, schools, collaborators). Run once; safe to re-run.
CREATE TABLE IF NOT EXISTS `inquiries` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `organisation` varchar(150),
  `email` varchar(255) NOT NULL,
  `kind` varchar(40) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `inquiries_id` PRIMARY KEY(`id`)
);
