import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

export let pool: pg.Pool;
export let db: ReturnType<typeof drizzle<typeof schema>>;

if (!process.env.DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL not set. Running without Postgres (Firebase mode).");

  // Simple mock that returns empty arrays for all queries
  const emptyResult = Promise.resolve([]);
  const chainable: any = new Proxy({}, {
    get: () => chainable,
    apply: () => emptyResult
  });

  // @ts-expect-error - Mock DB for Firebase migration
  db = new Proxy({}, {
    get: (_, prop) => {
      if (prop === 'query') {
        return new Proxy({}, {
          get: () => ({
            findMany: () => emptyResult,
            findFirst: () => Promise.resolve(null)
          })
        });
      }
      return () => chainable;
    }
  });
} else {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle(pool, { schema });
}
