export const settingsTable = `
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`

export const databasesTable = `
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
`

export const storagesTable = `
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
`

export const modulesTable = `
  CREATE TABLE IF NOT EXISTS modules (
    id TEXT PRIMARY KEY,
    key TEXT NOT NULL,
    path TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL DEFAULT '',
    config TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Mounted',
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`
