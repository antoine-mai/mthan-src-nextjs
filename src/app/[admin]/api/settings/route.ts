import { getAdminPath } from '@/_utils/dotenv'
import { guardApi } from '@/_utils/guard'
import db from '@/_components/local/_utils/db'

interface RouteContext {
  params: Promise<{ admin: string }>
}

async function validateAdminRoute(context: RouteContext) {
  const guardError = guardApi()
  if (guardError) return guardError

  const { admin } = await context.params
  const adminPath = getAdminPath()

  if (admin !== adminPath) {
    return Response.json(
      { error: 'Not Found' },
      { status: 404 }
    )
  }

  return null
}

export async function GET(request: Request, context: RouteContext) {
  const routeError = await validateAdminRoute(context)
  if (routeError) return routeError

  try {
    const settings = db.prepare('SELECT * FROM settings ORDER BY key ASC').all()
    return Response.json({
      status: 'success',
      settings
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to retrieve settings'
    return Response.json(
      { status: 'error', error: message },
      { status: 500 }
    )
  }
}

export async function POST(request: Request, context: RouteContext) {
  const routeError = await validateAdminRoute(context)
  if (routeError) return routeError

  try {
    const body = await request.json() as { key?: unknown; value?: unknown }

    if (typeof body.key !== 'string' || typeof body.value !== 'string') {
      return Response.json(
        { status: 'error', error: 'Invalid settings payload' },
        { status: 400 }
      )
    }

    const key = body.key.trim()
    const value = body.value.trim()

    if (!key) {
      return Response.json(
        { status: 'error', error: 'Key cannot be empty' },
        { status: 400 }
      )
    }

    const stmt = db.prepare(`
      INSERT INTO settings (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        modified = CURRENT_TIMESTAMP
    `)
    stmt.run(key, value)

    const settings = db.prepare('SELECT * FROM settings ORDER BY key ASC').all()
    return Response.json({
      status: 'success',
      settings
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update setting'
    return Response.json(
      { status: 'error', error: message },
      { status: 400 }
    )
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const routeError = await validateAdminRoute(context)
  if (routeError) return routeError

  try {
    const body = await request.json() as { key?: unknown }

    if (typeof body.key !== 'string') {
      return Response.json(
        { status: 'error', error: 'Invalid settings payload' },
        { status: 400 }
      )
    }

    const key = body.key.trim()

    db.prepare('DELETE FROM settings WHERE key = ?').run(key)

    const settings = db.prepare('SELECT * FROM settings ORDER BY key ASC').all()
    return Response.json({
      status: 'success',
      settings
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete setting'
    return Response.json(
      { status: 'error', error: message },
      { status: 400 }
    )
  }
}
