import test from 'node:test'
import assert from 'node:assert/strict'
import { getClientIp, handler } from './submit-response.mjs'

test('Netlify 접속 IP를 우선 사용한다', () => {
  assert.equal(getClientIp({
    'x-nf-client-connection-ip': '203.0.113.42',
    'x-forwarded-for': '198.51.100.10, 10.0.0.1',
  }), '203.0.113.42')
})

test('잘못된 IP는 저장하지 않는다', () => {
  assert.equal(getClientIp({ 'x-forwarded-for': 'not-an-ip' }), null)
})

test('신청 데이터와 서버가 확인한 IP를 Supabase에 전달한다', async () => {
  const previousFetch = globalThis.fetch
  const previousUrl = process.env.SUPABASE_URL
  const previousKey = process.env.SUPABASE_ANON_KEY
  let inserted

  process.env.SUPABASE_URL = 'https://example.supabase.co'
  process.env.SUPABASE_ANON_KEY = 'test-anon-key'
  globalThis.fetch = async (_url, options) => {
    inserted = JSON.parse(options.body)
    return new Response(null, { status: 201 })
  }

  try {
    const result = await handler({
      httpMethod: 'POST',
      headers: { 'x-nf-client-connection-ip': '2001:db8::25' },
      body: JSON.stringify({
        formId: 'b17a0ae6-3ebc-4b43-a364-08d5e0f1d773',
        answers: { 이름: '테스트 신청자', 연락처: '010-0000-0000' },
      }),
    })

    assert.equal(result.statusCode, 201)
    assert.equal(inserted.ip_address, '2001:db8::25')
    assert.equal(inserted.form_id, 'b17a0ae6-3ebc-4b43-a364-08d5e0f1d773')
    assert.deepEqual(inserted.answers, { 이름: '테스트 신청자', 연락처: '010-0000-0000' })
  } finally {
    globalThis.fetch = previousFetch
    if (previousUrl === undefined) delete process.env.SUPABASE_URL
    else process.env.SUPABASE_URL = previousUrl
    if (previousKey === undefined) delete process.env.SUPABASE_ANON_KEY
    else process.env.SUPABASE_ANON_KEY = previousKey
  }
})
