import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const dbDir = path.join(process.cwd(), '.data', 'admin')

// Ensure the directory exists before initializing SQLite
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const dbPath = path.join(dbDir, 'db.sqlite')
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
} catch (error) {
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

export default db
