import { NextResponse } from 'next/server'
import { workflow } from '@/_utils/x-registry'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (workflow) {
      if (typeof (workflow as any).handleCheckout === 'function') {
        const result = await (workflow as any).handleCheckout(body)
        return NextResponse.json(result)
      }
      if (typeof (workflow as any).execute === 'function') {
        const result = await (workflow as any).execute(body)
        return NextResponse.json(result)
      }
    }

    return NextResponse.json({
      status: 'success',
      message: 'Order placed successfully (Default core workflow)',
      data: body
    })
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
