import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  pgEnum,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ✅ 1. Import all tables from your auth schema
import { user, session, account } from "./auth-schema.ts";

// =================================
//  YOUR APPLICATION TABLES
// =================================

// Enum for lead status
export const leadStatusEnum = pgEnum("lead_status", [
  "PENDING",
  "CONTACTED",
  "RESPONDED",
  "CONVERTED",
  "DO_NOT_CONTACT",
]);

// Campaigns table
export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull().default("Active"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Leads table
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role"),
  email: text("email").notNull(),
  company: text("company"),
  avatarUrl: text("avatar_url"),
  status: leadStatusEnum("status").default("PENDING").notNull(),
  campaignId: integer("campaign_id")
    .notNull()
    .references(() => campaigns.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  lastContactDate: timestamp("last_contact_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// =================================
//  ALL APPLICATION RELATIONS
// =================================
// This section defines how ALL tables in your project are related.

// User Relations (from auth schema)
export const usersRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  leads: many(leads), // A user can have many leads
}));

// Session Relations (from auth schema)
export const sessionsRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

// Campaigns Relations
export const campaignsRelations = relations(campaigns, ({ many }) => ({
  leads: many(leads),
}));

// Leads Relations
export const leadsRelations = relations(leads, ({ one }) => ({
  owner: one(user, {
    fields: [leads.userId],
    references: [user.id],
  }),
  campaign: one(campaigns, {
    fields: [leads.campaignId],
    references: [campaigns.id],
  }),
}));

// Finally, re-export the auth tables so they are available everywhere
export * from "./auth-schema.ts";
