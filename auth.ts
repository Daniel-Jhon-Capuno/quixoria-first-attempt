import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import MySQLStore from "express-mysql-session";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

// ----------------------------------------------------------------
// Session store (MySQL via XAMPP)
// ----------------------------------------------------------------
const MySQLSessionStore = MySQLStore(session as any);

const sessionStore = new MySQLSessionStore({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "quixoria",
  clearExpired: true,
  checkExpirationInterval: 900000, // 15 min
  expiration: 86400000,            // 24 hours
});

// ----------------------------------------------------------------
// Passport strategy
// ----------------------------------------------------------------
passport.use(
  new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    async (username, password, done) => {
      try {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.username, username))
          .limit(1);

        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    done(null, user || null);
  } catch (err) {
    done(err, null);
  }
});

// ----------------------------------------------------------------
// Setup function — call this in server/index.ts
// ----------------------------------------------------------------
export function setupAuth(app: Express) {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "change-this-secret-in-production",
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000, // 24 hours
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
}

// ----------------------------------------------------------------
// Auth routes — register these in server/index.ts or server/routes.ts
// ----------------------------------------------------------------
export function registerAuthRoutes(app: Express) {
  // Register
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    const { username, password, email, firstName, lastName } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    try {
      // Check if username already exists
      const [existing] = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);

      if (existing) {
        return res.status(409).json({ message: "Username already taken." });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const [newUser] = await db
        .insert(users)
        .values({
          username,
          password: hashedPassword,
          email: email || null,
          firstName: firstName || null,
          lastName: lastName || null,
        })
        .$returningId();

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, newUser.id))
        .limit(1);

      req.logIn(user, (err) => {
        if (err) return res.status(500).json({ message: "Login after register failed." });
        const { password: _, ...safeUser } = user;
        return res.status(201).json(safeUser);
      });
    } catch (err) {
      console.error("Register error:", err);
      return res.status(500).json({ message: "Internal server error." });
    }
  });

  // Login
  app.post("/api/auth/login", (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: info?.message || "Invalid credentials." });

      req.logIn(user, (err) => {
        if (err) return next(err);
        const { password: _, ...safeUser } = user;
        return res.json(safeUser);
      });
    })(req, res, next);
  });

  // Logout
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.logout(() => {
      res.json({ message: "Logged out successfully." });
    });
  });

  // Get current user
  app.get("/api/auth/me", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated." });
    }
    const { password: _, ...safeUser } = req.user as any;
    return res.json(safeUser);
  });
}

// ----------------------------------------------------------------
// Middleware to protect routes
// ----------------------------------------------------------------
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ message: "Authentication required." });
}
