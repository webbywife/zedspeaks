import type { Session, SessionUser } from './session.js'

export type AppEnv = {
  Variables: {
    user: SessionUser
    session: Session
  }
}
