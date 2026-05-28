import { Lucia } from 'lucia'
import { DrizzleMySQLAdapter } from '@lucia-auth/adapter-drizzle'
import { db } from '../db'
import { sessions, users } from '../db/schema'

const adapter = new DrizzleMySQLAdapter(db, sessions, users)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  },
  getUserAttributes(attrs) {
    return {
      email: attrs.email,
      name: attrs.name,
      role: attrs.role,
      isActive: attrs.is_active,
    }
  },
})

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: {
      email: string
      name: string
      role: 'aac_user' | 'caregiver' | 'therapist' | 'admin'
      is_active: boolean
    }
  }
}
