import { NextRequest, NextResponse } from 'next/server'
import { markify } from 'markify-ts'
import assert from 'node:assert'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  assert(url, 'A URL is required to fetch hotel data')
  const result = await markify({
    url
  })

  return new NextResponse(JSON.stringify(result), {
    headers: {
      'Content-Type': 'application/json'
    },
    status: 200
  })
}
