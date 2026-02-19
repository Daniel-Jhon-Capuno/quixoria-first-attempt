import { db } from "./db";
import {
  books,
  libraryItems,
  reviews,
  users,
  type Book,
  type InsertBook,
  type LibraryItem,
  type InsertLibraryItem,
  type Review,
  type InsertReview,
  type User,
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

// Re-export auth storage interface for compatibility
export { authStorage } from "./replit_integrations/auth/storage";

export interface IStorage {
  // Books
  getBooks(): Promise<Book[]>;
  getBook(id: number): Promise<Book | undefined>;
  createBook(book: InsertBook): Promise<Book>;

  // Library
  getLibraryItems(userId: string): Promise<(LibraryItem & { book: Book })[]>;
  addToLibrary(item: InsertLibraryItem): Promise<LibraryItem>;
  updateLibraryProgress(id: number, userId: string, progress: number): Promise<LibraryItem | undefined>;
  getLibraryItem(userId: string, bookId: number): Promise<LibraryItem | undefined>;

  // Reviews
  getReviews(bookId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // User (from auth)
  getUser(id: string): Promise<User | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Books
  async getBooks(): Promise<Book[]> {
    return await db.select().from(books);
  }

  async getBook(id: number): Promise<Book | undefined> {
    const [book] = await db.select().from(books).where(eq(books.id, id));
    return book;
  }

  async createBook(insertBook: InsertBook): Promise<Book> {
    const [book] = await db.insert(books).values(insertBook).returning();
    return book;
  }

  // Library
  async getLibraryItems(userId: string): Promise<(LibraryItem & { book: Book })[]> {
    const items = await db
      .select()
      .from(libraryItems)
      .where(eq(libraryItems.userId, userId))
      .leftJoin(books, eq(libraryItems.bookId, books.id));
    
    // Filter out items where book might be null (shouldn't happen with FKs but good for types)
    return items
      .filter((item): item is { library_items: LibraryItem; books: Book } => !!item.books)
      .map((item) => ({ ...item.library_items, book: item.books }));
  }

  async addToLibrary(item: InsertLibraryItem): Promise<LibraryItem> {
    const [newItem] = await db.insert(libraryItems).values(item).returning();
    return newItem;
  }

  async updateLibraryProgress(id: number, userId: string, progress: number): Promise<LibraryItem | undefined> {
    const [updated] = await db
      .update(libraryItems)
      .set({ progress, lastRead: new Date() })
      .where(and(eq(libraryItems.id, id), eq(libraryItems.userId, userId)))
      .returning();
    return updated;
  }

  async getLibraryItem(userId: string, bookId: number): Promise<LibraryItem | undefined> {
    const [item] = await db
      .select()
      .from(libraryItems)
      .where(and(eq(libraryItems.userId, userId), eq(libraryItems.bookId, bookId)));
    return item;
  }

  // Reviews
  async getReviews(bookId: number): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.bookId, bookId));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }

  // User
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
}

export const storage = new DatabaseStorage();
