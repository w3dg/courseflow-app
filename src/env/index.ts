import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

dotenvExpand.expand(dotenv.config());

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

export const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
};
