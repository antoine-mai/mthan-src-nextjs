import { NextRequest } from 'next/server'
import { guardApi } from '@/_utils/guard'
import { getModuleApi } from '@/_modules/registry'

// Helper to handle any HTTP method dynamically
async function handleRequest(
  method: string,
  request: Request,
  context: { params: Promise<{ slug: string[] }> }
) {
  const guardError = guardApi()
  if (guardError) return guardError

  const { slug } = await context.params
  const route = slug ? slug.join('/') : ''

  const importFn = getModuleApi(route)
  if (!importFn) {
    return Response.json(
      { error: `API endpoint /api/${route} not found` },
      { status: 404 }
    )
  }

  try {
    const module = await importFn()
    const handler = module[method as keyof typeof module]

    if (typeof handler === 'function') {
      return await handler(request, context)
    } else {
      return Response.json(
        { error: `Method ${method} not allowed on /api/${route}` },
        { status: 405 }
      )
    }
  } catch (error: any) {
    console.error(`Error in modular API hook for /api/${route}:`, error)
    return Response.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: Request, context: { params: Promise<{ slug: string[] }> }) {
  return handleRequest('GET', request, context)
}

export async function POST(request: Request, context: { params: Promise<{ slug: string[] }> }) {
  return handleRequest('POST', request, context)
}

export async function PUT(request: Request, context: { params: Promise<{ slug: string[] }> }) {
  return handleRequest('PUT', request, context)
}

export async function DELETE(request: Request, context: { params: Promise<{ slug: string[] }> }) {
  return handleRequest('DELETE', request, context)
}

export async function PATCH(request: Request, context: { params: Promise<{ slug: string[] }> }) {
  return handleRequest('PATCH', request, context)
}

export async function HEAD(request: Request, context: { params: Promise<{ slug: string[] }> }) {
  return handleRequest('HEAD', request, context)
}

export async function OPTIONS(request: Request, context: { params: Promise<{ slug: string[] }> }) {
  return handleRequest('OPTIONS', request, context)
}
