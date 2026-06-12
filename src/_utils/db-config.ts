import db from '@/_components/admin/_utils/db'

export async function getLoginPathFromDb(): Promise<string> {
  try {
    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get('login_path') as { value: string } | undefined
    return row ? row.value : 'login'
  } catch (error) {
    console.error('Failed to get login path from DB, falling back to default:', error)
    return 'login'
  }
}
