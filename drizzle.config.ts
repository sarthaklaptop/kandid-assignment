import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/**/*.ts",  // where you’ll define Users, Campaigns, Leads
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,  // pull from env
  },
});