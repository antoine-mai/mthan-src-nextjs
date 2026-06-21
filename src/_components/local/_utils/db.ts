import 'server-only'
import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const dbDir = path.join(process.cwd(), '.data')

// Ensure the directory exists before initializing SQLite
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const dbPath = path.join(dbDir, 'db.sqlite')
const legacyDbPath = path.join(dbDir, 'admin', 'db.sqlite')

if (!fs.existsSync(dbPath) && fs.existsSync(legacyDbPath)) {
  fs.copyFileSync(legacyDbPath, dbPath)
}

const db = new Database(dbPath)

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL')

// Migration logic to ensure existing table gets the new columns
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      created DATETIME DEFAULT CURRENT_TIMESTAMP,
      modified DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  // Test query to see if new columns exist
  db.prepare('SELECT created, modified FROM settings LIMIT 1').get()
} catch {
  console.log('Migrating settings table to add created/modified columns...')
  // Recreate table if columns are missing
  db.exec('DROP TABLE IF EXISTS settings')
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      created DATETIME DEFAULT CURRENT_TIMESTAMP,
      modified DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

// Seed default settings if they don't exist
const insertStmt = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)')
insertStmt.run('login_path', 'login')

db.exec(`
  CREATE TABLE IF NOT EXISTS databases (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    engine TEXT NOT NULL,
    path TEXT NOT NULL,
    size TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Ready',
    last_backup TEXT NOT NULL DEFAULT '',
    locked INTEGER NOT NULL DEFAULT 0,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS storages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    driver TEXT NOT NULL,
    location TEXT NOT NULL,
    used TEXT NOT NULL DEFAULT '',
    files TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Mounted',
    locked INTEGER NOT NULL DEFAULT 0,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

db.prepare(`
  INSERT INTO databases (id, name, engine, path, size, status, last_backup, locked)
  VALUES (@id, @name, @engine, @path, @size, @status, @last_backup, @locked)
  ON CONFLICT(id) DO UPDATE SET
    name = excluded.name,
    engine = excluded.engine,
    path = excluded.path,
    size = excluded.size,
    status = excluded.status,
    last_backup = excluded.last_backup,
    locked = excluded.locked,
    modified = CURRENT_TIMESTAMP
`).run({
  id: 'default',
  name: 'Default SQLite',
  engine: 'SQLite',
  path: '.data/db.sqlite',
  size: 'System',
  status: 'Online',
  last_backup: 'Fallback',
  locked: 1
})

db.prepare(`
  INSERT INTO storages (id, name, driver, location, used, files, status, locked)
  VALUES (@id, @name, @driver, @location, @used, @files, @status, @locked)
  ON CONFLICT(id) DO UPDATE SET
    name = excluded.name,
    driver = excluded.driver,
    location = excluded.location,
    used = excluded.used,
    files = excluded.files,
    status = excluded.status,
    locked = excluded.locked,
    modified = CURRENT_TIMESTAMP
`).run({
  id: 'default',
  name: 'Default Storage',
  driver: 'Filesystem',
  location: 'public/storage',
  used: 'System',
  files: 'Fallback',
  status: 'Mounted',
  locked: 1
})

export default db
