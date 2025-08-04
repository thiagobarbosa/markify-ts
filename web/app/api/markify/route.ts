import { NextRequest, NextResponse } from 'next/server'
import assert from 'node:assert'
import { markify } from 'markify-ts'
import { keyHeaders, userAgents } from '@/lib/utils'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  try {
    assert(url, 'A URL is required')

    const userAgentsSeed = Math.floor(Math.random() * userAgents.length)

    const headers = new Headers({
      'User-Agent': userAgents[userAgentsSeed],
      ...keyHeaders
    })

    const result = await markify({
      url,
      fetchOptions: { headers }
    })

    return new NextResponse(JSON.stringify(result), {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
      },
      status: 200
    })
  } catch (error: any) {
    console.error(error.message)
    return new NextResponse(JSON.stringify({ error: error.message }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 500
    })
  }
}
