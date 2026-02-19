import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // Books
  app.get(api.books.list.path, async (req, res) => {
    const books = await storage.getBooks();
    res.json(books);
  });

  app.get(api.books.get.path, async (req, res) => {
    const book = await storage.getBook(Number(req.params.id));
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  });

  app.post(api.books.create.path, async (req, res) => {
    try {
      const input = api.books.create.input.parse(req.body);
      const book = await storage.createBook(input);
      res.status(201).json(book);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Library
  app.get(api.library.list.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const items = await storage.getLibraryItems(userId);
    res.json(items);
  });

  app.post(api.library.add.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { bookId } = api.library.add.input.parse(req.body);
      
      // Check if already in library
      const existing = await storage.getLibraryItem(userId, bookId);
      if (existing) {
        return res.status(400).json({ message: "Book already in library" });
      }

      const item = await storage.addToLibrary({ userId, bookId, progress: 0, isFavorite: false });
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Failed to add to library" });
    }
  });

  app.patch(api.library.updateProgress.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const id = Number(req.params.id);
      const { progress } = api.library.updateProgress.input.parse(req.body);

      const updated = await storage.updateLibraryProgress(id, userId, progress);
      if (!updated) {
        return res.status(404).json({ message: "Library item not found" });
      }
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  // Reviews
  app.get(api.reviews.list.path, async (req, res) => {
    const bookId = Number(req.params.bookId);
    const reviews = await storage.getReviews(bookId);
    res.json(reviews);
  });

  app.post(api.reviews.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bookId = Number(req.params.bookId);
      const input = api.reviews.create.input.parse(req.body);

      const review = await storage.createReview({ ...input, userId, bookId });
      res.status(201).json(review);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Seed Data
  seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const books = await storage.getBooks();
  if (books.length === 0) {
    console.log("Seeding database...");
    await storage.createBook({
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      description: "A novel set in the Jazz Age that tells the story of Jay Gatsby's unrequited love for Daisy Buchanan.",
      coverUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg",
      price: 999,
      genre: "Classic",
    });
    await storage.createBook({
      title: "1984",
      author: "George Orwell",
      description: "A dystopian social science fiction novel and cautionary tale about the future.",
      coverUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c3/1984first.jpg",
      price: 1299,
      genre: "Dystopian",
    });
    await storage.createBook({
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      description: "A novel about the serious issues of rape and racial inequality.",
      coverUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg",
      price: 1099,
      genre: "Fiction",
    });
    await storage.createBook({
      title: "Pride and Prejudice",
      author: "Jane Austen",
      description: "A romantic novel of manners.",
      coverUrl: "https://upload.wikimedia.org/wikipedia/commons/1/17/PrideAndPrejudiceTitlePage.jpg",
      price: 899,
      genre: "Romance",
    });
     await storage.createBook({
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      description: "A fantasy novel about the quest of home-loving hobbit Bilbo Baggins.",
      coverUrl: "https://upload.wikimedia.org/wikipedia/en/4/4a/TheHobbit_FirstEdition.jpg",
      price: 1499,
      genre: "Fantasy",
    });
    console.log("Database seeded!");
  }
}
