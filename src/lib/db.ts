import { neon } from "@neondatabase/serverless";

// Create a safe wrapper so we don't crash at build time if the env var is missing during Next.js static resolution
const databaseUrl =
  process.env.DATABASE_URL ||
  "postgres://placeholder_user:placeholder_password@placeholder_host/placeholder_db";

export const sql = neon(databaseUrl);
