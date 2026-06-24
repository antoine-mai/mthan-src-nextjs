export const blogOptionsTable = `
  CREATE TABLE IF NOT EXISTS blog_options (
    option_name TEXT PRIMARY KEY,
    option_value TEXT NOT NULL DEFAULT '',
    autoload INTEGER NOT NULL DEFAULT 1,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`

export const blogUserMetaTable = `
  CREATE TABLE IF NOT EXISTS blog_usermeta (
    umeta_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    meta_key TEXT NOT NULL,
    meta_value TEXT NOT NULL DEFAULT '',
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`

export const blogPostsTable = `
  CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_author INTEGER NOT NULL,
    post_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    post_date_gmt DATETIME,
    post_content TEXT NOT NULL DEFAULT '',
    post_title TEXT NOT NULL DEFAULT '',
    post_excerpt TEXT NOT NULL DEFAULT '',
    post_status TEXT NOT NULL DEFAULT 'draft',
    comment_status TEXT NOT NULL DEFAULT 'open',
    ping_status TEXT NOT NULL DEFAULT 'open',
    post_password TEXT NOT NULL DEFAULT '',
    post_name TEXT NOT NULL UNIQUE,
    to_ping TEXT NOT NULL DEFAULT '',
    pinged TEXT NOT NULL DEFAULT '',
    post_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
    post_modified_gmt DATETIME,
    post_content_filtered TEXT NOT NULL DEFAULT '',
    post_parent INTEGER DEFAULT NULL,
    guid TEXT NOT NULL DEFAULT '',
    menu_order INTEGER NOT NULL DEFAULT 0,
    post_mime_type TEXT NOT NULL DEFAULT '',
    comment_count INTEGER NOT NULL DEFAULT 0,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_parent) REFERENCES blog_posts(id) ON DELETE SET NULL
  )
`

export const blogPostMetaTable = `
  CREATE TABLE IF NOT EXISTS blog_postmeta (
    meta_id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    meta_key TEXT NOT NULL,
    meta_value TEXT NOT NULL DEFAULT '',
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE
  )
`

export const blogTermsTable = `
  CREATE TABLE IF NOT EXISTS blog_terms (
    term_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    term_group INTEGER NOT NULL DEFAULT 0,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`

export const blogTermTaxonomyTable = `
  CREATE TABLE IF NOT EXISTS blog_term_taxonomy (
    term_taxonomy_id INTEGER PRIMARY KEY AUTOINCREMENT,
    term_id INTEGER NOT NULL,
    taxonomy TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    parent INTEGER NOT NULL DEFAULT 0,
    count INTEGER NOT NULL DEFAULT 0,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (term_id, taxonomy),
    FOREIGN KEY (term_id) REFERENCES blog_terms(term_id) ON DELETE CASCADE
  )
`

export const blogTermRelationshipsTable = `
  CREATE TABLE IF NOT EXISTS blog_term_relationships (
    object_id INTEGER NOT NULL,
    term_taxonomy_id INTEGER NOT NULL,
    term_order INTEGER NOT NULL DEFAULT 0,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (object_id, term_taxonomy_id),
    FOREIGN KEY (term_taxonomy_id) REFERENCES blog_term_taxonomy(term_taxonomy_id) ON DELETE CASCADE
  )
`

export const blogCommentsTable = `
  CREATE TABLE IF NOT EXISTS blog_comments (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    comment_post_id INTEGER NOT NULL,
    comment_author TEXT NOT NULL DEFAULT '',
    comment_author_email TEXT NOT NULL DEFAULT '',
    comment_author_url TEXT NOT NULL DEFAULT '',
    comment_author_ip TEXT NOT NULL DEFAULT '',
    comment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    comment_date_gmt DATETIME,
    comment_content TEXT NOT NULL DEFAULT '',
    comment_karma INTEGER NOT NULL DEFAULT 0,
    comment_approved TEXT NOT NULL DEFAULT '1',
    comment_agent TEXT NOT NULL DEFAULT '',
    comment_type TEXT NOT NULL DEFAULT '',
    comment_parent INTEGER NOT NULL DEFAULT 0,
    user_id INTEGER NOT NULL DEFAULT 0,
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_post_id) REFERENCES blog_posts(id) ON DELETE CASCADE
  )
`

export const blogCommentMetaTable = `
  CREATE TABLE IF NOT EXISTS blog_commentmeta (
    meta_id INTEGER PRIMARY KEY AUTOINCREMENT,
    comment_id INTEGER NOT NULL,
    meta_key TEXT NOT NULL,
    meta_value TEXT NOT NULL DEFAULT '',
    created DATETIME DEFAULT CURRENT_TIMESTAMP,
    modified DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_id) REFERENCES blog_comments(comment_id) ON DELETE CASCADE
  )
`
