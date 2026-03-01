import { db } from "./db";
import {
  books,
  libraryItems,
  reviews,
  users,
  cartItems,
  orders,
  orderItems,
  type Book,
  type InsertBook,
  type LibraryItem,
  type InsertLibraryItem,
  type Review,
  type InsertReview,
  type User,
  type CartItem,
  type Order,
  type OrderItem,
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getBooks(): Promise<Book[]>;
  getBook(id: number): Promise<Book | undefined>;
  createBook(book: InsertBook): Promise<Book>;
  getLibraryItems(userId: number): Promise<(LibraryItem & { book: Book })[]>;
  addToLibrary(item: InsertLibraryItem): Promise<LibraryItem>;
  updateLibraryProgress(id: number, userId: number, progress: number): Promise<LibraryItem | undefined>;
  getLibraryItem(userId: number, bookId: number): Promise<LibraryItem | undefined>;
  getReviews(bookId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  getUser(id: number): Promise<User | undefined>;
  getCartItems(userId: number): Promise<(CartItem & { book: Book })[]>;
  addToCart(userId: number, bookId: number): Promise<CartItem>;
  removeFromCart(userId: number, bookId: number): Promise<void>;
  clearCart(userId: number): Promise<void>;
  getCartItem(userId: number, bookId: number): Promise<CartItem | undefined>;
  createOrder(userId: number, total: number, receiptNumber: string, items: { bookId: number; price: number }[]): Promise<Order & { orderItems: (OrderItem & { book: Book })[] }>;
  getOrders(userId: number): Promise<(Order & { orderItems: (OrderItem & { book: Book })[] })[]>;
  getOrder(id: number, userId: number): Promise<(Order & { orderItems: (OrderItem & { book: Book })[] }) | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getBooks(): Promise<Book[]> {
    return await db.select().from(books);
  }

  async getBook(id: number): Promise<Book | undefined> {
    const [book] = await db.select().from(books).where(eq(books.id, id));
    return book;
  }

  async createBook(insertBook: InsertBook): Promise<Book> {
    const result = await db.insert(books).values(insertBook).$returningId();
    const [book] = await db.select().from(books).where(eq(books.id, result[0].id));
    return book;
  }

  async getLibraryItems(userId: number): Promise<(LibraryItem & { book: Book })[]> {
    const items = await db
      .select()
      .from(libraryItems)
      .where(eq(libraryItems.userId, userId))
      .leftJoin(books, eq(libraryItems.bookId, books.id));
    return items
      .filter((item): item is { library_items: LibraryItem; books: Book } => !!item.books)
      .map((item) => ({ ...item.library_items, book: item.books }));
  }

  async addToLibrary(item: InsertLibraryItem): Promise<LibraryItem> {
    const result = await db.insert(libraryItems).values(item).$returningId();
    const [newItem] = await db.select().from(libraryItems).where(eq(libraryItems.id, result[0].id));
    return newItem;
  }

  async updateLibraryProgress(id: number, userId: number, progress: number): Promise<LibraryItem | undefined> {
    await db.update(libraryItems).set({ readingProgress: progress }).where(and(eq(libraryItems.id, id), eq(libraryItems.userId, userId)));
    const [updated] = await db.select().from(libraryItems).where(and(eq(libraryItems.id, id), eq(libraryItems.userId, userId)));
    return updated;
  }

  async getLibraryItem(userId: number, bookId: number): Promise<LibraryItem | undefined> {
    const [item] = await db.select().from(libraryItems).where(and(eq(libraryItems.userId, userId), eq(libraryItems.bookId, bookId)));
    return item;
  }

  async getReviews(bookId: number): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.bookId, bookId));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const result = await db.insert(reviews).values(review).$returningId();
    const [newReview] = await db.select().from(reviews).where(eq(reviews.id, result[0].id));
    return newReview;
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  // ── Cart ──────────────────────────────────────────────────────────
  async getCartItems(userId: number): Promise<(CartItem & { book: Book })[]> {
    const items = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.userId, userId))
      .leftJoin(books, eq(cartItems.bookId, books.id));
    return items
      .filter((item): item is { cart_items: CartItem; books: Book } => !!item.books)
      .map((item) => ({ ...item.cart_items, book: item.books }));
  }

  async addToCart(userId: number, bookId: number): Promise<CartItem> {
    const result = await db.insert(cartItems).values({ userId, bookId }).$returningId();
    const [item] = await db.select().from(cartItems).where(eq(cartItems.id, result[0].id));
    return item;
  }

  async removeFromCart(userId: number, bookId: number): Promise<void> {
    await db.delete(cartItems).where(and(eq(cartItems.userId, userId), eq(cartItems.bookId, bookId)));
  }

  async clearCart(userId: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  async getCartItem(userId: number, bookId: number): Promise<CartItem | undefined> {
    const [item] = await db.select().from(cartItems).where(and(eq(cartItems.userId, userId), eq(cartItems.bookId, bookId)));
    return item;
  }

  // ── Orders ────────────────────────────────────────────────────────
  async createOrder(
    userId: number,
    total: number,
    receiptNumber: string,
    items: { bookId: number; price: number }[]
  ): Promise<Order & { orderItems: (OrderItem & { book: Book })[] }> {
    const orderResult = await db.insert(orders).values({ userId, total, receiptNumber, status: "completed" }).$returningId();
    const orderId = orderResult[0].id;
    for (const item of items) {
      await db.insert(orderItems).values({ orderId, bookId: item.bookId, price: item.price });
    }
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
    const fullItems = await this.getOrderItems(orderId);
    return { ...order, orderItems: fullItems };
  }

  async getOrders(userId: number): Promise<(Order & { orderItems: (OrderItem & { book: Book })[] })[]> {
    const userOrders = await db.select().from(orders).where(eq(orders.userId, userId));
    const result = [];
    for (const order of userOrders) {
      const items = await this.getOrderItems(order.id);
      result.push({ ...order, orderItems: items });
    }
    return result.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getOrder(id: number, userId: number): Promise<(Order & { orderItems: (OrderItem & { book: Book })[] }) | undefined> {
    const [order] = await db.select().from(orders).where(and(eq(orders.id, id), eq(orders.userId, userId)));
    if (!order) return undefined;
    const items = await this.getOrderItems(order.id);
    return { ...order, orderItems: items };
  }

  private async getOrderItems(orderId: number): Promise<(OrderItem & { book: Book })[]> {
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId))
      .leftJoin(books, eq(orderItems.bookId, books.id));
    return items
      .filter((item): item is { order_items: OrderItem; books: Book } => !!item.books)
      .map((item) => ({ ...item.order_items, book: item.books }));
  }
}

export const storage = new DatabaseStorage();