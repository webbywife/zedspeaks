// Password hashing with Argon2id, using the same settings the old library (oslo) used,
// so every existing password keeps working.
import { hash, verify } from '@node-rs/argon2'

const OPTIONS = { memoryCost: 19456, timeCost: 2, outputLen: 32, parallelism: 1 }

export const hashPassword = (password: string) => hash(password.normalize('NFKC'), OPTIONS)

export const verifyPassword = (stored: string, password: string) =>
  verify(stored, password.normalize('NFKC')).catch(() => false)
