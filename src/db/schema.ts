import { pgTable, text, timestamp, uuid, boolean, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const songs = pgTable('songs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  previewUrl: text('preview_url').notNull(),
  fullUrl: text('full_url'),
  lyrics: text('lyrics').notNull(),
  style: text('style').notNull(),
  story: text('story'),
  isPurchased: boolean('is_purchased').default(false).notNull(),
  plays: integer('plays').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  tier: text('tier').notNull(),
  status: text('status').notNull(),
  songsRemaining: integer('songs_remaining').default(0).notNull(),
  renewsAt: timestamp('renews_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Song = typeof songs.$inferSelect;
export type InsertSong = typeof songs.$inferInsert;

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;
