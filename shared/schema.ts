import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Import auth models to export them
export * from "./models/auth";
import { users } from "./models/auth";

// Books Table
export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  description: text("description").notNull(),
  coverUrl: text("cover_url").notNull(),
  price: integer("price").notNull(), // In cents
  genre: text("genre").notNull(),
  rating: integer("rating").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Library Items Table (Books owned by users)
export const libraryItems = pgTable("library_items", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // References auth.users.id
  bookId: integer("book_id").notNull().references(() => books.id),
  progress: integer("progress").default(0), // Percentage
  lastRead: timestamp("last_read").defaultNow(),
  isFavorite: boolean("is_favorite").default(false),
});

// Reviews Table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // References auth.users.id
  bookId: integer("book_id").notNull().references(() => books.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const booksRelations = relations(books, ({ many }) => ({
  libraryItems: many(libraryItems),
  reviews: many(reviews),
}));

export const libraryItemsRelations = relations(libraryItems, ({ one }) => ({
  book: one(books, {
    fields: [libraryItems.bookId],
    references: [books.id],
  }),
  user: one(users, {
    fields: [libraryItems.userId],
    references: [users.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  book: one(books, {
    fields: [reviews.bookId],
    references: [books.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

// Schemas
export const insertBookSchema = createInsertSchema(books).omit({ id: true, createdAt: true, rating: true });
export const insertLibraryItemSchema = createInsertSchema(libraryItems).omit({ id: true, lastRead: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true });

// Types
export type Book = typeof books.$inferSelect;
export type InsertBook = z.infer<typeof insertBookSchema>;
export type LibraryItem = typeof libraryItems.$inferSelect;
export type InsertLibraryItem = z.infer<typeof insertLibraryItemSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

// API Types
export type BookResponse = Book;
export type LibraryItemResponse = LibraryItem & { book: Book };
export type ReviewResponse = Review & { user?: { username: string; avatarUrl: string } }; // Mocked user info for now or joined

export type CreateReviewRequest = {
  rating: number;
  comment?: string;
};

export type UpdateProgressRequest = {
  progress: number;
};
