import { env } from "@/env";
import * as schema from "@/db/schema";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle({
  schema: schema,
  connection: {
    connectionString: env.DATABASE_URL,
  },
});
