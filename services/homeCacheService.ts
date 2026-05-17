import * as SQLite from "expo-sqlite";

import type {
  Activity,
  ActivitySource,
  Club,
  Interest,
} from "@/services/homeService";

type HomeCachePayload = {
  activities: Activity[];
  clubs: Club[];
  interests: Interest[];
};

const DB_NAME = "kidscape_home_cache.db";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME);
  }

  return dbPromise;
}

async function initHomeCacheDb() {
  const db = await getDb();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS home_cache (
      cacheKey TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL,
      updatedAt INTEGER NOT NULL
    );
  `);
}

function getHomeCacheKey(source: ActivitySource) {
  return `home_${source}`;
}

export async function saveHomeCache(
  source: ActivitySource,
  payload: HomeCachePayload
): Promise<void> {
  await initHomeCacheDb();

  const db = await getDb();
  const cacheKey = getHomeCacheKey(source);

  await db.runAsync(
    `
    INSERT OR REPLACE INTO home_cache (cacheKey, value, updatedAt)
    VALUES (?, ?, ?);
    `,
    [cacheKey, JSON.stringify(payload), Date.now()]
  );
}

export async function loadHomeCache(
  source: ActivitySource
): Promise<HomeCachePayload | null> {
  await initHomeCacheDb();

  const db = await getDb();
  const cacheKey = getHomeCacheKey(source);

  const row = await db.getFirstAsync<{
    value: string;
    updatedAt: number;
  }>(
    `
    SELECT value, updatedAt
    FROM home_cache
    WHERE cacheKey = ?;
    `,
    [cacheKey]
  );

  if (!row) {
    return null;
  }

  try {
    return JSON.parse(row.value) as HomeCachePayload;
  } catch {
    return null;
  }
}