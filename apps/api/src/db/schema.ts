import {
  mysqlTable,
  text,
  timestamp,
  boolean,
  int,
  json,
  mysqlEnum,
  varchar,
} from 'drizzle-orm/mysql-core'
import { relations } from 'drizzle-orm'

// ── Enums ────────────────────────────────────────────────────────────────────

const userRoleValues = ['aac_user', 'caregiver', 'therapist', 'admin'] as const
const accessRequestStatusValues = ['pending', 'approved', 'denied'] as const

// ── Auth (Lucia) ──────────────────────────────────────────────────────────────

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  username: varchar('username', { length: 20 }).unique(),
  passwordHash: text('password_hash'),
  googleId: varchar('google_id', { length: 255 }).unique(),
  name: varchar('name', { length: 255 }).notNull(),
  role: mysqlEnum('role', userRoleValues).default('caregiver').notNull(),
  approvedAt: timestamp('approved_at'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const sessions = mysqlTable('sessions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
})

// ── Email PINs ────────────────────────────────────────────────────────────────

export const emailPins = mysqlTable('email_pins', {
  id: varchar('id', { length: 36 }).primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  pinHash: text('pin_hash').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ── Access Requests ───────────────────────────────────────────────────────────

export const accessRequests = mysqlTable('access_requests', {
  id: varchar('id', { length: 36 }).primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  applicantName: varchar('applicant_name', { length: 255 }).notNull(),
  relation: varchar('relation', { length: 100 }).notNull(),
  reason: text('reason').notNull(),
  diagnosis: text('diagnosis'),
  status: mysqlEnum('status', accessRequestStatusValues).default('pending').notNull(),
  reviewedAt: timestamp('reviewed_at'),
  reviewedBy: varchar('reviewed_by', { length: 36 }).references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ── AAC Profiles ──────────────────────────────────────────────────────────────

export const aacProfiles = mysqlTable('aac_profiles', {
  id: varchar('id', { length: 36 }).primaryKey(),
  caregiverId: varchar('caregiver_id', { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  avatarUrl: text('avatar_url'),
  gridCols: int('grid_cols').default(5).notNull(),
  gridRows: int('grid_rows').default(4).notNull(),
  fontScale: int('font_scale').default(100).notNull(),
  ttsVoiceUri: text('tts_voice_uri'),
  ttsRate: int('tts_rate').default(85).notNull(),
  ttsPitch: int('tts_pitch').default(115).notNull(),
  ttsVolume: int('tts_volume').default(100).notNull(),
  lockPin: varchar('lock_pin', { length: 10 }),
  highContrast: boolean('high_contrast').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ── Boards ────────────────────────────────────────────────────────────────────

export const boards = mysqlTable('boards', {
  id: varchar('id', { length: 36 }).primaryKey(),
  profileId: varchar('profile_id', { length: 36 })
    .notNull()
    .references(() => aacProfiles.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  isHome: boolean('is_home').default(false).notNull(),
  parentBoardId: varchar('parent_board_id', { length: 36 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ── Cells ─────────────────────────────────────────────────────────────────────

export const cells = mysqlTable('cells', {
  id: varchar('id', { length: 36 }).primaryKey(),
  boardId: varchar('board_id', { length: 36 })
    .notNull()
    .references(() => boards.id, { onDelete: 'cascade' }),
  position: int('position').notNull(),
  label: varchar('label', { length: 255 }).notNull(),
  spokenText: text('spoken_text').notNull(),
  iconUrl: text('icon_url'),
  bgColor: varchar('bg_color', { length: 20 }).default('#ffffff'),
  linkBoardId: varchar('link_board_id', { length: 36 }),
  customAudioUrl: text('custom_audio_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ── Communication Logs ────────────────────────────────────────────────────────

export const communicationLogs = mysqlTable('communication_logs', {
  id: varchar('id', { length: 36 }).primaryKey(),
  profileId: varchar('profile_id', { length: 36 })
    .notNull()
    .references(() => aacProfiles.id, { onDelete: 'cascade' }),
  spokenText: text('spoken_text').notNull(),
  boardId: varchar('board_id', { length: 36 }),
  cellIds: json('cell_ids').$type<string[]>().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ── Visual Schedules ──────────────────────────────────────────────────────────

export const schedules = mysqlTable('schedules', {
  id: varchar('id', { length: 36 }).primaryKey(),
  profileId: varchar('profile_id', { length: 36 })
    .notNull()
    .references(() => aacProfiles.id, { onDelete: 'cascade' }),
  label: varchar('label', { length: 255 }).notNull(),
  iconUrl: text('icon_url'),
  scheduledTime: varchar('scheduled_time', { length: 5 }),
  daysOfWeek: json('days_of_week').$type<number[]>().default([]),
  sortOrder: int('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ── Profile–Therapist Link ────────────────────────────────────────────────────

export const profileTherapists = mysqlTable('profile_therapists', {
  profileId: varchar('profile_id', { length: 36 })
    .notNull()
    .references(() => aacProfiles.id, { onDelete: 'cascade' }),
  therapistId: varchar('therapist_id', { length: 36 })
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
