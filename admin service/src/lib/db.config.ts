import { neon } from "@neondatabase/serverless";

export const sqlDB = neon(process.env.DB_URL as string);