import { guardApi } from '@/_utils/guard'

export async function GET() {
  const guardError = guardApi()
  if (guardError) return guardError

  return Response.json({
    status: 'online',
    message: 'Welcome to the Modular Next.js Application Platform API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      websites: '/api/websites',
      products: '/api/products',
      stats: '/api/stats (Admin only)'
    }
  })
}
