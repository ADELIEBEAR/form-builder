import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeResponse, responseIssue } from '../src/lib/responseIntegrity.js'
import { handler } from '../netlify/functions/submit-response.mjs'

test('normal answers and field order are preserved exactly', () => {
  const row = { id: 'normal', answers: { 이름: '홍길동', 연락처: '01055512345', _field_order: ['이름', '연락처'] } }
  assert.equal(normalizeResponse(row), row)
})
test('JSON strings display as fields, never character indices; original is not mutated', () => {
  const row = { id: 'old', answers: JSON.stringify({ name: 'TEST_USER', comment: 'pentest' }) }
  const original = row.answers
  const normalized = normalizeResponse(row)
  assert.equal(normalized.answers.name, 'TEST_USER')
  assert.match(normalized.answers._response_issue, /형식 오류/)
  assert.equal(Object.hasOwn(normalized.answers, '0'), false)
  assert.equal(row.answers, original)
})
test('arbitrary strings, arrays and null remain visible as a single raw value', () => {
  for (const value of ['string_not_object', ['a'], null]) {
    const result = normalizeResponse({ answers: value })
    assert.equal(Object.keys(result.answers).filter(k => !k.startsWith('_')).length, 1)
    assert.ok(result.answers._response_issue)
  }
})
test('known test markers are labeled without deleting or hiding records', () => {
  for (const value of ['ALPHA_bc7ec5', 'BRAVO_9820b6', 'UNIQUE_MARKER_0cd3aaf6']) {
    const result = normalizeResponse({ id: 'retained', answers: { '1': value } })
    assert.equal(result.id, 'retained')
    assert.equal(result.answers['1'], value)
    assert.match(result.answers._response_issue, /테스트 의심/)
    assert.ok(responseIssue({ '1': value }))
  }
})
test('malformed and test payloads are rejected before network writes', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = () => { throw new Error('must not insert') }
  try {
    for (const answers of ['bad', ['a'], null, { '1': 'ALPHA_bc7ec5' }]) {
      const result = await handler({ httpMethod: 'POST', headers: {}, body: JSON.stringify({
        formId: 'b17a0ae6-3ebc-4b43-a364-08d5e0f1d773', answers,
      }) })
      assert.equal(result.statusCode, 400)
    }
  } finally { globalThis.fetch = originalFetch }
})
