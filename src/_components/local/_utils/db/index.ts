import 'server-only'
import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import {
  settingsTable,
  databasesTable,
  storagesTable,
  modulesTable
} from './tables'
import {
  blogOptionsTable,
  blogUserMetaTable,
  blogPostsTable,
  blogPostMetaTable,
  blogTermsTable,
  blogTermTaxonomyTable,
  blogTermRelationshipsTable,
  blogCommentsTable,
  blogCommentMetaTable
} from '@/_modules/blog/_db/tables'

const dbDir = path.join(process.cwd(), '.data')

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const dbPath = path.join(dbDir, 'db.sqlite')
const legacyDbPath = path.join(dbDir, 'admin', 'db.sqlite')

if (!fs.existsSync(dbPath) && fs.existsSync(legacyDbPath)) {
  fs.copyFileSync(legacyDbPath, dbPath)
}

const db = new Database(dbPath)

db.pragma('journal_mode = WAL')

function getTableColumns(tableName: string) {
  return db.prepare(`PRAGMA table_info(${tableName})`).all() as { name: string }[]
}

function hasTable(tableName: string) {
  return db
    .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?")
    .get(tableName) !== undefined
}

function migrateModulesTable() {
  const columns = getTableColumns('modules')
  if (!columns.length) {
    db.exec(modulesTable)
    return
  }

  const columnNames = new Set(columns.map((column) => column.name))
  const isCurrentSchema =
    columnNames.has('path') &&
    !columnNames.has('route') &&
    !columnNames.has('name') &&
    columnNames.has('category') &&
    columnNames.has('config')

  if (isCurrentSchema) {
    return
  }

  db.exec('ALTER TABLE modules RENAME TO modules_legacy')
  db.exec(modulesTable)

  const hasRoute = columnNames.has('route')
  const hasCategory = columnNames.has('category')
  const hasSurfaces = columnNames.has('surfaces')
  const hasConfig = columnNames.has('config')

  db.exec(`
    INSERT INTO modules (id, key, path, category, config, status, created, modified)
    SELECT
      id,
      key,
      ${hasRoute ? "COALESCE(NULLIF(path, ''), route, key)" : "COALESCE(NULLIF(path, ''), key)"},
      ${hasCategory ? "COALESCE(category, '')" : hasSurfaces ? "COALESCE(surfaces, '')" : "''"},
      ${hasConfig ? "COALESCE(config, '')" : "''"},
      COALESCE(status, 'Inactive'),
      created,
      modified
    FROM modules_legacy
  `)

  db.exec('DROP TABLE modules_legacy')
  db.exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_modules_path ON modules(path)')
}

function migrateBlogSchemaWithoutUsers() {
  if (!hasTable('blog_users')) {
    return
  }

  const blogLegacyTables = [
    'blog_usermeta',
    'blog_posts',
    'blog_comments',
    'blog_users'
  ].filter(hasTable)

  for (const tableName of blogLegacyTables) {
    db.exec(`ALTER TABLE ${tableName} RENAME TO ${tableName}_legacy`)
  }

  db.exec(blogUserMetaTable)
  db.exec(blogPostsTable)
  db.exec(blogCommentsTable)

  if (hasTable('blog_usermeta_legacy')) {
    db.exec(`
      INSERT INTO blog_usermeta (umeta_id, user_id, meta_key, meta_value, created, modified)
      SELECT umeta_id, user_id, meta_key, meta_value, created, modified
      FROM blog_usermeta_legacy
    `)
    db.exec('DROP TABLE blog_usermeta_legacy')
  }

  if (hasTable('blog_posts_legacy')) {
    db.exec(`
      INSERT INTO blog_posts (
        id,
        post_author,
        post_date,
        post_date_gmt,
        post_content,
        post_title,
        post_excerpt,
        post_status,
        comment_status,
        ping_status,
        post_password,
        post_name,
        to_ping,
        pinged,
        post_modified,
        post_modified_gmt,
        post_content_filtered,
        post_parent,
        guid,
        menu_order,
        post_mime_type,
        comment_count,
        created,
        modified
      )
      SELECT
        id,
        post_author,
        post_date,
        post_date_gmt,
        post_content,
        post_title,
        post_excerpt,
        post_status,
        comment_status,
        ping_status,
        post_password,
        post_name,
        to_ping,
        pinged,
        post_modified,
        post_modified_gmt,
        post_content_filtered,
        post_parent,
        guid,
        menu_order,
        post_mime_type,
        comment_count,
        created,
        modified
      FROM blog_posts_legacy
    `)
    db.exec('DROP TABLE blog_posts_legacy')
  }

  if (hasTable('blog_comments_legacy')) {
    db.exec(`
      INSERT INTO blog_comments (
        comment_id,
        comment_post_id,
        comment_author,
        comment_author_email,
        comment_author_url,
        comment_author_ip,
        comment_date,
        comment_date_gmt,
        comment_content,
        comment_karma,
        comment_approved,
        comment_agent,
        comment_type,
        comment_parent,
        user_id,
        created,
        modified
      )
      SELECT
        comment_id,
        comment_post_id,
        comment_author,
        comment_author_email,
        comment_author_url,
        comment_author_ip,
        comment_date,
        comment_date_gmt,
        comment_content,
        comment_karma,
        comment_approved,
        comment_agent,
        comment_type,
        comment_parent,
        user_id,
        created,
        modified
      FROM blog_comments_legacy
    `)
    db.exec('DROP TABLE blog_comments_legacy')
  }

  db.exec('DROP TABLE IF EXISTS blog_users_legacy')
}

try {
  db.exec(settingsTable)
  db.prepare('SELECT created, modified FROM settings LIMIT 1').get()
} catch {
  console.log('Migrating settings table to add created/modified columns...')
  db.exec('DROP TABLE IF EXISTS settings')
  db.exec(settingsTable)
}

db.exec(databasesTable)
db.exec(storagesTable)
migrateModulesTable()
db.exec(blogOptionsTable)
if (hasTable('blog_users')) {
  migrateBlogSchemaWithoutUsers()
} else {
  db.exec(blogUserMetaTable)
  db.exec(blogPostsTable)
  db.exec(blogCommentsTable)
}
db.exec(blogPostMetaTable)
db.exec(blogTermsTable)
db.exec(blogTermTaxonomyTable)
db.exec(blogTermRelationshipsTable)
db.exec(blogCommentMetaTable)

db.prepare(
  `
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
`,
).run({
  id: 'default',
  name: 'Default SQLite',
  engine: 'SQLite',
  path: '.data/db.sqlite',
  size: 'System',
  status: 'Online',
  last_backup: 'Fallback',
  locked: 1,
})

db.prepare(
  `
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
`,
).run({
  id: 'default',
  name: 'Default Storage',
  driver: 'Filesystem',
  location: 'public/storage',
  used: 'System',
  files: 'Fallback',
  status: 'Mounted',
  locked: 1,
})

export default db
