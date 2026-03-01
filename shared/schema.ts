import {
  mysqlTable,
  int,
  varchar,
  text,
  decimal,
  timestamp,
  boolean,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = mysqlTable("users", {
  id:              int("id").primaryKey().autoincrement(),
  username:        varchar("username", { length: 255 }).notNull().unique(),
  password:        varchar("password", { length: 255 }).notNull(),
  email:           varchar("email", { length: 255 }),
  firstName:       varchar("first_name", { length: 255 }),
  lastName:        varchar("last_name", { length: 255 }),
  profileImageUrl: varchar("profile_image_url", { length: 512 }),
  createdAt:       timestamp("created_at").defaultNow(),
  updatedAt:       timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const books = mysqlTable("books", {
  id:          int("id").primaryKey().autoincrement(),
  title:       varchar("title", { length: 512 }).notNull(),
  author:      varchar("author", { length: 255 }).notNull(),
  description: text("description"),
  coverUrl:    varchar("cover_url", { length: 512 }),
  price:       int("price").notNull().default(0),
  genre:       varchar("genre", { length: 100 }),
  rating:      decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  createdAt:   timestamp("created_at").defaultNow(),
});

export const libraryItems = mysqlTable("library_items", {
  id:              int("id").primaryKey().autoincrement(),
  userId:          int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  bookId:          int("book_id").notNull().references(() => books.id, { onDelete: "cascade" }),
  readingProgress: int("reading_progress").default(0),
  isFinished:      boolean("is_finished").default(false),
  addedAt:         timestamp("added_at").defaultNow(),
  finishedAt:      timestamp("finished_at"),
});

export const reviews = mysqlTable("reviews", {
  id:        int("id").primaryKey().autoincrement(),
  userId:    int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  bookId:    int("book_id").notNull().references(() => books.id, { onDelete: "cascade" }),
  rating:    int("rating").notNull(),
  comment:   text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const cartItems = mysqlTable("cart_items", {
  id:      int("id").primaryKey().autoincrement(),
  userId:  int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  bookId:  int("book_id").notNull().references(() => books.id, { onDelete: "cascade" }),
  addedAt: timestamp("added_at").defaultNow(),
});

export const orders = mysqlTable("orders", {
  id:            int("id").primaryKey().autoincrement(),
  userId:        int("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  total:         int("total").notNull(),
  status:        varchar("status", { length: 50 }).default("completed"),
  receiptNumber: varchar("receipt_number", { length: 100 }).notNull(),
  createdAt:     timestamp("created_at").defaultNow(),
});

export const orderItems = mysqlTable("order_items", {
  id:      int("id").primaryKey().autoincrement(),
  orderId: int("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  bookId:  int("book_id").notNull().references(() => books.id, { onDelete: "cascade" }),
  price:   int("price").notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  libraryItems: many(libraryItems),
  reviews:      many(reviews),
  cartItems:    many(cartItems),
  orders:       many(orders),
}));

export const booksRelations = relations(books, ({ many }) => ({
  libraryItems: many(libraryItems),
  reviews:      many(reviews),
  cartItems:    many(cartItems),
  orderItems:   many(orderItems),
}));

export const libraryItemsRelations = relations(libraryItems, ({ one }) => ({
  user: one(users, { fields: [libraryItems.userId], references: [users.id] }),
  book: one(books, { fields: [libraryItems.bookId], references: [books.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
  book: one(books, { fields: [reviews.bookId], references: [books.id] }),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, { fields: [cartItems.userId], references: [users.id] }),
  book: one(books, { fields: [cartItems.bookId], references: [books.id] }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user:       one(users, { fields: [orders.userId], references: [users.id] }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  book:  one(books, { fields: [orderItems.bookId], references: [books.id] }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username:  true,
  password:  true,
  email:     true,
  firstName: true,
  lastName:  true,
});
export const insertBookSchema = createInsertSchema(books).omit({ id: true, createdAt: true });
export const insertLibraryItemSchema = createInsertSchema(libraryItems).omit({ id: true, addedAt: true });
export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCartItemSchema = createInsertSchema(cartItems).omit({ id: true, addedAt: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });

// Types
export type User         = typeof users.$inferSelect;
export type InsertUser   = z.infer<typeof insertUserSchema>;
export type Book         = typeof books.$inferSelect;
export type InsertBook   = z.infer<typeof insertBookSchema>;
export type LibraryItem  = typeof libraryItems.$inferSelect;
export type InsertLibraryItem = z.infer<typeof insertLibraryItemSchema>;
export type Review       = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type CartItem     = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type Order        = typeof orders.$inferSelect;
export type InsertOrder  = z.infer<typeof insertOrderSchema>;
export type OrderItem    = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;