import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, requireAuth } from "./auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupAuth(app);
  registerAuthRoutes(app);

  // ── Books ──────────────────────────────────────────────────────────
  app.get(api.books.list.path, async (req, res) => {
    const books = await storage.getBooks();
    res.json(books);
  });

  app.get(api.books.get.path, async (req, res) => {
    const book = await storage.getBook(Number(req.params.id));
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  });

  app.post(api.books.create.path, async (req, res) => {
    try {
      const input = api.books.create.input.parse(req.body);
      const book = await storage.createBook(input);
      res.status(201).json(book);
    } catch (err) {
      if (err instanceof z.ZodError)
        return res.status(400).json({ message: err.errors[0].message });
      throw err;
    }
  });

  // ── Library ────────────────────────────────────────────────────────
  app.get(api.library.list.path, requireAuth, async (req: any, res) => {
    try {
      const items = await storage.getLibraryItems(req.user.id);
      res.json(items);
    } catch (err) {
      console.error("GET LIBRARY ERROR:", err);
      res.status(500).json({ message: (err as Error).message });
    }
  });

  app.post(api.library.add.path, requireAuth, async (req: any, res) => {
    try {
      const { bookId } = api.library.add.input.parse(req.body);
      const existing = await storage.getLibraryItem(req.user.id, bookId);
      if (existing) return res.status(400).json({ message: "Book already in library" });
      const item = await storage.addToLibrary({ userId: req.user.id, bookId, readingProgress: 0, isFinished: false });
      res.status(201).json(item);
    } catch (err) {
      console.error("ADD TO LIBRARY ERROR:", err);
      res.status(500).json({ message: (err as Error).message });
    }
  });

  app.patch(api.library.updateProgress.path, requireAuth, async (req: any, res) => {
    try {
      const { progress } = api.library.updateProgress.input.parse(req.body);
      const updated = await storage.updateLibraryProgress(Number(req.params.id), req.user.id, progress);
      if (!updated) return res.status(404).json({ message: "Library item not found" });
      res.json(updated);
    } catch (err) {
      console.error("UPDATE PROGRESS ERROR:", err);
      res.status(500).json({ message: (err as Error).message });
    }
  });

  // ── Reviews ────────────────────────────────────────────────────────
  app.get(api.reviews.list.path, async (req, res) => {
    const reviews = await storage.getReviews(Number(req.params.bookId));
    res.json(reviews);
  });

  app.post(api.reviews.create.path, requireAuth, async (req: any, res) => {
    try {
      const input = api.reviews.create.input.parse(req.body);
      const review = await storage.createReview({ ...input, userId: req.user.id, bookId: Number(req.params.bookId) });
      res.status(201).json(review);
    } catch (err) {
      console.error("CREATE REVIEW ERROR:", err);
      res.status(500).json({ message: (err as Error).message });
    }
  });

  // ── Cart ───────────────────────────────────────────────────────────
  app.get("/api/cart", requireAuth, async (req: any, res) => {
    try {
      const items = await storage.getCartItems(req.user.id);
      res.json(items);
    } catch (err) {
      console.error("GET CART ERROR:", err);
      res.status(500).json({ message: (err as Error).message });
    }
  });

  app.post("/api/cart/add", requireAuth, async (req: any, res) => {
    try {
      const { bookId } = z.object({ bookId: z.number() }).parse(req.body);
      const existing = await storage.getCartItem(req.user.id, bookId);
      if (existing) return res.status(400).json({ message: "Book already in cart" });
      const inLibrary = await storage.getLibraryItem(req.user.id, bookId);
      if (inLibrary) return res.status(400).json({ message: "You already own this book" });
      const item = await storage.addToCart(req.user.id, bookId);
      res.status(201).json(item);
    } catch (err) {
      console.error("ADD TO CART ERROR:", err);
      res.status(500).json({ message: (err as Error).message });
    }
  });

  app.delete("/api/cart/remove/:bookId", requireAuth, async (req: any, res) => {
    try {
      await storage.removeFromCart(req.user.id, Number(req.params.bookId));
      res.json({ message: "Removed from cart" });
    } catch (err) {
      console.error("REMOVE FROM CART ERROR:", err);
      res.status(500).json({ message: (err as Error).message });
    }
  });

  // ── Checkout / Orders ──────────────────────────────────────────────
  app.post("/api/orders/checkout", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const cartBookItems = await storage.getCartItems(userId);
      if (cartBookItems.length === 0)
        return res.status(400).json({ message: "Cart is empty" });

      const total = cartBookItems.reduce((sum, item) => sum + item.book.price, 0);
      const receiptNumber = `QXR-${Date.now()}-${userId}`;

      const order = await storage.createOrder(
        userId,
        total,
        receiptNumber,
        cartBookItems.map((item) => ({ bookId: item.bookId, price: item.book.price }))
      );

      // Add all books to library
      for (const item of cartBookItems) {
        const alreadyOwned = await storage.getLibraryItem(userId, item.bookId);
        if (!alreadyOwned) {
          await storage.addToLibrary({ userId, bookId: item.bookId, readingProgress: 0, isFinished: false });
        }
      }

      // Clear cart
      await storage.clearCart(userId);

      res.status(201).json(order);
    } catch (err) {
      console.error("CHECKOUT ERROR:", err);
      res.status(500).json({ message: (err as Error).message });
    }
  });

  app.get("/api/orders", requireAuth, async (req: any, res) => {
    try {
      const userOrders = await storage.getOrders(req.user.id);
      res.json(userOrders);
    } catch (err) {
      console.error("GET ORDERS ERROR:", err);
      res.status(500).json({ message: (err as Error).message });
    }
  });

  app.get("/api/orders/:id", requireAuth, async (req: any, res) => {
    try {
      const order = await storage.getOrder(Number(req.params.id), req.user.id);
      if (!order) return res.status(404).json({ message: "Order not found" });
      res.json(order);
    } catch (err) {
      console.error("GET ORDER ERROR:", err);
      res.status(500).json({ message: (err as Error).message });
    }
  });

  seedDatabase();
  return httpServer;
}

async function seedDatabase() {
  const books = await storage.getBooks();
  if (books.length === 0) {
    console.log("Seeding database...");
    const seedBooks = [
      { title: "The Great Gatsby", author: "F. Scott Fitzgerald", description: "A novel set in the Jazz Age about Jay Gatsby's unrequited love.", coverUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg", price: 999, genre: "Classic" },
      { title: "1984", author: "George Orwell", description: "A dystopian cautionary tale about the future.", coverUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c3/1984first.jpg", price: 1299, genre: "Dystopian" },
      { title: "To Kill a Mockingbird", author: "Harper Lee", description: "A novel about racial inequality.", coverUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg", price: 1099, genre: "Fiction" },
      { title: "Pride and Prejudice", author: "Jane Austen", description: "A romantic novel of manners.", coverUrl: "https://upload.wikimedia.org/wikipedia/commons/1/17/PrideAndPrejudiceTitlePage.jpg", price: 899, genre: "Romance" },
      { title: "The Hobbit", author: "J.R.R. Tolkien", description: "A fantasy novel about hobbit Bilbo Baggins.", coverUrl: "https://upload.wikimedia.org/wikipedia/en/4/4a/TheHobbit_FirstEdition.jpg", price: 1499, genre: "Fantasy" },
    ];
    for (const book of seedBooks) await storage.createBook(book);
    console.log("Database seeded!");
  }
}