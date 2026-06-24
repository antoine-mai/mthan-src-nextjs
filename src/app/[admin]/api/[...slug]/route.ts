import { getAdminPath, readEnv } from '@/_utils/dotenv'
import { guardApi } from '@/_utils/guard'
import { getAdminModuleApi } from '@/_modules/registry'
import { listModuleCatalog, setModuleStatus } from '@/_components/local/_utils/db/modules'

async function handleRequest(
  method: string,
  request: Request,
  context: { params: Promise<{ admin: string; slug?: string[] }> }
) {
  const guardError = guardApi()
  if (guardError) return guardError

  const { admin, slug } = await context.params
  const adminPath = getAdminPath()

  // 1. Verify that the requested prefix matches the dynamic admin path from .env
  if (admin !== adminPath) {
    return Response.json(
      { error: 'Not Found' },
      { status: 404 }
    )
  }

  // 2. Resolve sub-route path key (e.g., [] -> '', ['stats'] -> 'stats')
  const route = slug ? slug.join('/') : ''

  // A. Core Admin APIs handled directly
  if (route === 'auth/login') {
    if (method !== 'POST') {
      return Response.json({ error: `Method ${method} not allowed` }, { status: 405 })
    }
    try {
      const { username, password } = await request.json()
      const adminUser = readEnv('ADMIN_USER', 'admin')
      const adminPass = readEnv('ADMIN_PASS', 'admin123')

      if (username === adminUser && password === adminPass) {
        return Response.json({ status: 'success', message: 'Authenticated successfully' })
      } else {
        return Response.json({ status: 'error', error: 'Invalid username or password' }, { status: 401 })
      }
    } catch {
      return Response.json({ status: 'error', error: 'Invalid request body' }, { status: 400 })
    }
  }

  if (route === 'stats') {
    if (method !== 'GET') {
      return Response.json({ error: `Method ${method} not allowed` }, { status: 405 })
    }
    const memoryUsage = process.memoryUsage()
    return Response.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      system: {
        uptime: process.uptime(),
        memory: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
        },
        nodeVersion: process.version,
        platform: process.platform,
      },
    })
  }

  if (route === 'modules') {
    if (method === 'GET') {
      return Response.json({
        status: 'success',
        modules: listModuleCatalog()
      })
    }

    if (method === 'PATCH') {
      try {
        const body = await request.json() as { key?: string; active?: boolean }
        if (!body.key || typeof body.active !== 'boolean') {
          return Response.json({ error: 'Invalid request body' }, { status: 400 })
        }

        const updated = setModuleStatus(body.key, body.active)
        if (!updated) {
          return Response.json({ error: 'Module not found' }, { status: 404 })
        }

        return Response.json({
          status: 'success',
          module: updated
        })
      } catch {
        return Response.json({ error: 'Invalid request body' }, { status: 400 })
      }
    }

    return Response.json({ error: `Method ${method} not allowed` }, { status: 405 })
  }

  // B. Dynamic Module APIs hooked from external modules
  const importFn = getAdminModuleApi(route)
  if (!importFn) {
    return Response.json(
      { error: `Admin API endpoint /${adminPath}/api/${route} not found` },
      { status: 404 }
    )
  }

  try {
    const adminApiModule = await importFn()
    const handler = adminApiModule[method as keyof typeof adminApiModule]

    if (typeof handler === 'function') {
      return await handler(request, context)
    } else {
      return Response.json(
        { error: `Method ${method} not allowed on /${adminPath}/api/${route}` },
        { status: 405 }
      )
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Error in admin API dynamic hook for /${adminPath}/api/${route}:`, error)
    return Response.json(
      { error: 'Internal Server Error', message },
      { status: 500 }
    )
  }
}

export async function GET(request: Request, context: { params: Promise<{ admin: string; slug?: string[] }> }) {
  return handleRequest('GET', request, context)
}

export async function POST(request: Request, context: { params: Promise<{ admin: string; slug?: string[] }> }) {
  return handleRequest('POST', request, context)
}

export async function PUT(request: Request, context: { params: Promise<{ admin: string; slug?: string[] }> }) {
  return handleRequest('PUT', request, context)
}

export async function DELETE(request: Request, context: { params: Promise<{ admin: string; slug?: string[] }> }) {
  return handleRequest('DELETE', request, context)
}

export async function PATCH(request: Request, context: { params: Promise<{ admin: string; slug?: string[] }> }) {
  return handleRequest('PATCH', request, context)
}

export async function HEAD(request: Request, context: { params: Promise<{ admin: string; slug?: string[] }> }) {
  return handleRequest('HEAD', request, context)
}

export async function OPTIONS(request: Request, context: { params: Promise<{ admin: string; slug?: string[] }> }) {
  return handleRequest('OPTIONS', request, context)
}
