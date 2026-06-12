import { getAdminPath } from '@/_utils/dotenv'
import { guardApi } from '@/_utils/guard'

interface RouteContext {
  params: Promise<{ admin: string }>
}

export async function GET(request: Request, context: RouteContext) {
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

  return Response.json({
    status: 'online',
    area: 'Restricted Administration Area',
    warning: 'WARNING: Unauthorized access is strictly logged and prosecuted under system terms.',
    timestamp: new Date().toISOString()
  })
}
