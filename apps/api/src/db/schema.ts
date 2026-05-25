import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ── Enums ────────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum('user_role', [
  'aac_user',
  'caregiver',
  'therapist',
  'admin',
])

export const accessRequestStatusEnum = pgEnum('access_request_status', [
  'pending',
  'approved',
  'denied',
])

// ── Auth (Lucia) ──────────────────────────────────────────────────────────────

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  username: text('username').unique(),
  passwordHash: text('password_hash'),
  googleId: text('google_id').unique(),
  name: text('name').notNull(),
  role: userRoleEnum('role').default('caregiver').notNull(),
  approvedAt: timestamp('approved_at'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
})

// ── Email PINs ────────────────────────────────────────────────────────────────

export const emailPins = pgTable('email_pins', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  pinHash: text('pin_hash').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ── Access Requests ───────────────────────────────────────────────────────────

export const accessRequests = pgTable('access_requests', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  applicantName: text('applicant_name').notNull(),
  relation: text('relation').notNull(),           // e.g. "Parent", "Therapist"
  reason: text('reason').notNull(),
  diagnosis: text('diagnosis'),                    // optional
  status: accessRequestStatusEnum('status').default('pending').notNull(),
  reviewedAt: timestamp('reviewed_at'),
  reviewedBy: text('reviewed_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ── AAC Profiles ──────────────────────────────────────────────────────────────

export const aacProfiles = pgTable('aac_profiles', {
  id: text('id').primaryKey(),
  caregiverId: text('caregiver_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  gridCols: integer('grid_cols').default(5).notNull(),
  gridRows: integer('grid_rows').default(4).notNull(),
  fontScale: integer('font_scale').default(100).notNull(),     // percent
  ttsVoiceUri: text('tts_voice_uri'),
  ttsRate: integer('tts_rate').default(85).notNull(),          // stored ×100 (0.85 → 85)
  ttsPitch: integer('tts_pitch').default(115).notNull(),       // 1.15 → 115
  ttsVolume: integer('tts_volume').default(100).notNull(),
  lockPin: text('lock_pin'),
  highContrast: boolean('high_contrast').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ── Boards ────────────────────────────────────────────────────────────────────

export const boards = pgTable('boards', {
  id: text('id').primaryKey(),
  profileId: text('profile_id')
    .notNull()
    .references(() => aacProfiles.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  isHome: boolean('is_home').default(false).notNull(),
  parentBoardId: text('parent_board_id'),         // self-reference for sub-boards
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ── Cells ─────────────────────────────────────────────────────────────────────

export const cells = pgTable('cells', {
  id: text('id').primaryKey(),
  boardId: text('board_id')
    .notNull()
    .references(() => boards.id, { onDelete: 'cascade' }),
  position: integer('position').notNull(),        // 0-indexed slot in the grid
  label: text('label').notNull(),
  spokenText: text('spoken_text').notNull(),
  iconUrl: text('icon_url'),                       // ARASAAC URL or custom photo
  bgColor: text('bg_color').default('#ffffff'),
  linkBoardId: text('link_board_id'),              // navigate to sub-board on tap
  customAudioUrl: text('custom_audio_url'),        // caregiver-recorded voice
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ── Communication Logs ────────────────────────────────────────────────────────

export const communicationLogs = pgTable('communication_logs', {
  id: text('id').primaryKey(),
  profileId: text('profile_id')
    .notNull()
    .references(() => aacProfiles.id, { onDelete: 'cascade' }),
  spokenText: text('spoken_text').notNull(),
  boardId: text('board_id'),
  cellIds: jsonb('cell_ids').$type<string[]>().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ── Visual Schedules ──────────────────────────────────────────────────────────

export const schedules = pgTable('schedules', {
  id: text('id').primaryKey(),
  profileId: text('profile_id')
    .notNull()
    .references(() => aacProfiles.id, { onDelete: 'cascade' }),
  label: text('label').notNull(),
  iconUrl: text('icon_url'),
  scheduledTime: text('scheduled_time'),           // HH:MM
  daysOfWeek: jsonb('days_of_week').$type<number[]>().default([]),  // 0=Sun…6=Sat
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ── Profile–Therapist Link ────────────────────────────────────────────────────

export const profileTherapists = pgTable('profile_therapists', {
  profileId: text('profile_id')
    .notNull()
    .references(() => aacProfiles.id, { onDelete: 'cascade' }),
  therapistId: text('therapist_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  canSuggest: boolean('can_suggest').default(false).notNull(),
  linkedAt: timestamp('linked_at').defaultNow().notNull(),
})

// ── Relations ─────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  profiles: many(aacProfiles),
}))

export const aacProfilesRelations = relations(aacProfiles, ({ one, many }) => ({
  caregiver: one(users, { fields: [aacProfiles.caregiverId], references: [users.id] }),
  boards: many(boards),
  logs: many(communicationLogs),
  schedules: many(schedules),
}))

export const boardsRelations = relations(boards, ({ one, many }) => ({
  profile: one(aacProfiles, { fields: [boards.profileId], references: [aacProfiles.id] }),
  cells: many(cells),
}))

export const cellsRelations = relations(cells, ({ one }) => ({
  board: one(boards, { fields: [cells.boardId], references: [boards.id] }),
}))
