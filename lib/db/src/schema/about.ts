import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const aboutTable = pgTable("about", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default(""),
  tagline: text("tagline").notNull().default(""),
  intro: text("intro").notNull().default(""),
  bio: text("bio").notNull().default(""),
  avatarUrl: text("avatar_url"),
  emailNewsletter: text("email_newsletter").notNull().default(""),
  blueskyUrl: text("bluesky_url").notNull().default(""),
  rssUrl: text("rss_url").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type About = typeof aboutTable.$inferSelect;
