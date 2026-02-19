import { z } from 'zod';
import { insertBookSchema, insertReviewSchema, books, libraryItems, reviews } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  books: {
    list: {
      method: 'GET' as const,
      path: '/api/books' as const,
      responses: {
        200: z.array(z.custom<typeof books.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/books/:id' as const,
      responses: {
        200: z.custom<typeof books.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    // Admin only in real app, but open for now for simplicity/seeding
    create: {
      method: 'POST' as const,
      path: '/api/books' as const,
      input: insertBookSchema,
      responses: {
        201: z.custom<typeof books.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  library: {
    list: {
      method: 'GET' as const,
      path: '/api/library' as const,
      responses: {
        200: z.array(z.custom<typeof libraryItems.$inferSelect & { book: typeof books.$inferSelect }>()),
        401: errorSchemas.unauthorized,
      },
    },
    add: {
      method: 'POST' as const,
      path: '/api/library/add' as const,
      input: z.object({ bookId: z.number() }),
      responses: {
        201: z.custom<typeof libraryItems.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    updateProgress: {
      method: 'PATCH' as const,
      path: '/api/library/:id/progress' as const,
      input: z.object({ progress: z.number().min(0).max(100) }),
      responses: {
        200: z.custom<typeof libraryItems.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.unauthorized,
      },
    },
  },
  reviews: {
    list: {
      method: 'GET' as const,
      path: '/api/books/:bookId/reviews' as const,
      responses: {
        200: z.array(z.custom<typeof reviews.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/books/:bookId/reviews' as const,
      input: z.object({ rating: z.number().min(1).max(5), comment: z.string().optional() }),
      responses: {
        201: z.custom<typeof reviews.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
