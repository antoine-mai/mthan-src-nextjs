import { getAdminPath } from '@/_utils/dotenv'
import { deleteEnvFileValue, readEnvFileEntries, upsertEnvFileValue } from '@/_utils/env-file'
import { guardApi } from '@/_utils/guard'

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

export async function GET(_request: Request, context: RouteContext) {
  const routeError = await validateAdminRoute(context)
  if (routeError) return routeError

  return Response.json({
    status: 'success',
    env: readEnvFileEntries()
  })
}

export async function POST(request: Request, context: RouteContext) {
  const routeError = await validateAdminRoute(context)
  if (routeError) return routeError

  try {
    const body = await request.json() as { key?: unknown; value?: unknown }

    if (typeof body.key !== 'string' || typeof body.value !== 'string') {
      return Response.json(
        { status: 'error', error: 'Invalid environment payload' },
        { status: 400 }
      )
    }

    const entry = upsertEnvFileValue(body.key, body.value)

    return Response.json({
      status: 'success',
      entry,
      env: readEnvFileEntries()
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update environment'

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
        { status: 'error', error: 'Invalid environment payload' },
        { status: 400 }
      )
    }

    deleteEnvFileValue(body.key)

    return Response.json({
      status: 'success',
      env: readEnvFileEntries()
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete environment value'

    return Response.json(
      { status: 'error', error: message },
      { status: 400 }
    )
  }
}
