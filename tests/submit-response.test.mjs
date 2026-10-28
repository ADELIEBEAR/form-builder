import test from 'node:test'
import assert from 'node:assert/strict'
import { getClientIp, handler } from '../netlify/functions/submit-response.mjs'

test('uses the Netlify connection IP first', () => {
  assert.equal(getClientIp({
    'x-nf-client-connection-ip': '203.0.113.42',
    'x-forwarded-for': '198.51.100.10, 10.0.0.1',
  }), '203.0.113.42')
})

test('does not store an invalid IP address', () => {
  assert.equal(getClientIp({ 'x-forwarded-for': 'not-an-ip' }), null)
})

test('passes the submission and server-observed IP to Supabase', async () => {
  const previousFetch = globalThis.fetch
  const previousUrl = process.env.SUPABASE_URL
  const previousKey = process.env.SUPABASE_ANON_KEY
  const previousToken = process.env.FORM_SUBMIT_TOKEN
  let inserted

  process.env.SUPABASE_URL = 'https://example.supabase.co'
  process.env.SUPABASE_ANON_KEY = 'test-anon-key'
  process.env.FORM_SUBMIT_TOKEN = 'test-server-token'
  globalThis.fetch = async (_url, options) => {
    if (!options.body) return Response.json([{ questions: [{ type: 'short', label: 'name', required: true }, { type: 'phone', label: 'phone', required: true }] }])
    inserted = JSON.parse(options.body)
    assert.equal(options.headers['x-form-submit-token'], 'test-server-token')
    return new Response(null, { status: 201 })
  }

  try {
    const result = await handler({
      httpMethod: 'POST',
      headers: { 'x-nf-client-connection-ip': '2001:db8::25', 'content-type': 'application/json' },
      body: JSON.stringify({
        formId: 'b17a0ae6-3ebc-4b43-a364-08d5e0f1d773',
        answers: { name: 'Test applicant', phone: '010-5551-2345' },
      }),
    })

    assert.equal(result.statusCode, 201)
    assert.equal(inserted.ip_address, '2001:db8::25')
    assert.equal(inserted.form_id, 'b17a0ae6-3ebc-4b43-a364-08d5e0f1d773')
    assert.deepEqual(inserted.answers, { name: 'Test applicant', phone: '010-5551-2345' })
  } finally {
    globalThis.fetch = previousFetch
    if (previousUrl === undefined) delete process.env.SUPABASE_URL
    else process.env.SUPABASE_URL = previousUrl
    if (previousKey === undefined) delete process.env.SUPABASE_ANON_KEY
    else process.env.SUPABASE_ANON_KEY = previousKey
    if (previousToken === undefined) delete process.env.FORM_SUBMIT_TOKEN
    else process.env.FORM_SUBMIT_TOKEN = previousToken
  }
})
