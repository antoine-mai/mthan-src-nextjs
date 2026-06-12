import db from '@/_components/admin/_utils/db'
import { guardInstallApi } from '@/_utils/guard'
import fs from 'fs'
import path from 'path'

export async function GET() {
  const guardError = guardInstallApi()
  if (guardError) return guardError

  try {
    const settings = db.prepare('SELECT * FROM settings').all()
    return Response.json({
      status: 'success',
      settings,
      dbType: 'SQLite',
      dbPath: '.data/admin/db.sqlite'
    })
  } catch (err: any) {
    return Response.json({ status: 'error', error: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const guardError = guardInstallApi()
  if (guardError) return guardError

  try {
    const { action, adminPath, adminUser, adminPass } = await request.json()

    if (action === 'initialize') {
      // Validate configuration inputs (specifically the 3 admin values)
      if (!adminPath || !/^[a-z0-9-]+$/.test(adminPath)) {
        return Response.json({ status: 'error', error: 'Invalid admin path format. Must be lowercase alphanumeric or kebab-case.' }, { status: 400 })
      }
      if (!adminUser || adminUser.trim().length < 3) {
        return Response.json({ status: 'error', error: 'Admin username must be at least 3 characters long.' }, { status: 400 })
      }
      if (!adminPass || adminPass.length < 5) {
        return Response.json({ status: 'error', error: 'Admin password must be at least 5 characters long.' }, { status: 400 })
      }

      // 1. Create the .env configuration file on the filesystem
      const envPath = path.join(process.cwd(), '.env')
      const envContent = `ADMIN_PATH=${adminPath}
ADMIN_USER=${adminUser}
ADMIN_PASS=${adminPass}
DATA_DIR=.data
HOSTNAME=localhost
`
      fs.writeFileSync(envPath, envContent, 'utf8')

      // 2. Initialize the SQLite settings table and seed default login path
      db.exec('DROP TABLE IF EXISTS settings')
      db.exec(`
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT,
          created DATETIME DEFAULT CURRENT_TIMESTAMP,
          modified DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `)
      db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run('login_path', 'login')

      return Response.json({ status: 'success', message: 'Platform setup completed successfully!' })
    }

    return Response.json({ status: 'error', error: 'Unknown action' }, { status: 400 })
  } catch (err: any) {
    return Response.json({ status: 'error', error: err.message }, { status: 500 })
  }
}
