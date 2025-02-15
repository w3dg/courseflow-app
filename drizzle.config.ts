import { env } from "@/env";
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  verbose: true,
  strict: true,
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
