import { eq } from "drizzle-orm";
import { db, userTable } from "../db";

export const getUserByMastoId = (id: string) => {
  return db.select().from(userTable).where(eq(userTable.id, id)).get();
};

type InsertUserArgs = {
  id: string;
  displayName: string;
};

export const insertUser = ({ displayName, id }: InsertUserArgs) => {
  const values = { id, name: displayName };

  return db.insert(userTable).values(values).returning().get();
};
