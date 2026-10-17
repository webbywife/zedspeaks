// Append-only audit trail of admin actions (who did what to which record, when).
// Rows are only ever inserted; nothing in the app updates or deletes them.
import { db } from '../db/index.js'
import { auditLog } from '../db/schema.js'

export async function audit(actorId: string, action: string, recordId: string) {
  await db.insert(auditLog).values({ id: crypto.randomUUID(), actorId, action, recordId }).catch((e) => {
    console.error('audit log write failed', e instanceof Error ? e.message : e)
  })
}
