import Dexie, { type EntityTable } from "dexie";
import type { Session, DrillAttempt, SkillProgress, UserProfile } from "@/types";

const db = new Dexie("the-stage") as Dexie & {
  sessions: EntityTable<Session, "id">;
  drillAttempts: EntityTable<DrillAttempt, "id">;
  skillProgress: EntityTable<SkillProgress, "id">;
  userProfile: EntityTable<UserProfile, "id">;
};

db.version(1).stores({
  sessions: "++id, createdAt, type",
  drillAttempts: "++id, sessionId, drillType, createdAt",
  skillProgress: "++id, &level",
  userProfile: "++id",
});

export { db };
